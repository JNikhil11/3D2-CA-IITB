import { useEffect, useState, useCallback, Suspense, Component, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bvh, PerformanceMonitor, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import { useUIStore } from '../store/useUIStore';
import { LightingRig } from './controllers/LightingRig';
import { useMasterChoreography } from './controllers/useMasterChoreography';
import { World01Observatory } from './worlds/World01Observatory';
import { World02Engine } from './worlds/World02Engine';
import { World03Quadrants } from './worlds/World03Quadrants';
import { World04Arena } from './worlds/World04Arena';
import { World05Beacon } from './worlds/World05Beacon';
import { WebGLContextLossFallback } from '../components/fallback/WebGLContextLossFallback';

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class CanvasErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('Canvas error boundary caught error:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function SceneContent() {
  useMasterChoreography();

  return (
    <Bvh firstHitOnly>
      <LightingRig />
      <World01Observatory />
      <World02Engine />
      <World03Quadrants />
      <World04Arena />
      <World05Beacon />
    </Bvh>
  );
}

export function ExperienceCanvas() {
  const { hasWebGLFailed, setWebGLFailed, setGpuTier } = useUIStore();
  const [frameloop, setFrameloop] = useState<'always' | 'never'>('always');

  // Background tab hibernation: Pause frameloop when tab is hidden to save 100% GPU
  useEffect(() => {
    const handleVisibilityChange = () => {
      setFrameloop(document.hidden ? 'never' : 'always');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleCreated = useCallback(
    ({ gl, scene, camera }: { gl: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.Camera }) => {
      // Warm up shaders
      if (typeof gl.compileAsync === 'function') {
        gl.compileAsync(scene, camera).catch(() => {});
      }

      // Attach context lost handlers
      const canvasEl = gl.domElement;
      const handleContextLost = (e: Event) => {
        e.preventDefault();
        console.warn('WebGL context lost.');
        setWebGLFailed(true);
      };
      const handleContextRestored = () => {
        console.info('WebGL context restored.');
        setWebGLFailed(false);
      };

      canvasEl.addEventListener('webglcontextlost', handleContextLost, false);
      canvasEl.addEventListener('webglcontextrestored', handleContextRestored, false);
    },
    [setWebGLFailed]
  );

  if (hasWebGLFailed) {
    return <WebGLContextLossFallback />;
  }

  return (
    <CanvasErrorBoundary fallback={<WebGLContextLossFallback />}>
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 'var(--z-canvas)',
          background: 'var(--color-deep-ink)',
          overflow: 'hidden',
        }}
      >
        <Canvas
          shadows
          frameloop={frameloop}
          dpr={[1, 2]}
          camera={{ position: [0.0, 2.5, 14.0], fov: 42, near: 0.1, far: 350 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
          }}
          onCreated={handleCreated}
        >
          <PerformanceMonitor
            onIncline={() => setGpuTier(3)}
            onDecline={() => setGpuTier(1)}
            flipflops={3}
            onFallback={() => setGpuTier(1)}
          >
            <AdaptiveDpr pixelated />
            <Suspense fallback={null}>
              <SceneContent />
            </Suspense>
          </PerformanceMonitor>
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}

