import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { sceneTransientStore } from '../../store/sceneTransientStore';
import { useUIStore } from '../../store/useUIStore';

const fogColors = [
  new THREE.Color('#161426'), // W-01: Dusk violet
  new THREE.Color('#121018'), // W-02: Charcoal bronze
  new THREE.Color('#08090F'), // W-03: Deep ink
  new THREE.Color('#10152D'), // W-04: Ultramarine
  new THREE.Color('#040508'), // W-05: Cosmic void
];

const fogDensities = [0.015, 0.022, 0.012, 0.016, 0.003];

export function LightingRig() {
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const { gpuTier } = useUIStore();

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const p = sceneTransientStore.smoothProgress;

    // Interpolate fog color and density across the 5 worlds
    let seg = 0;
    let t = 0;
    if (p < 0.2) {
      seg = 0;
      t = p / 0.2;
    } else if (p < 0.4) {
      seg = 1;
      t = (p - 0.2) / 0.2;
    } else if (p < 0.65) {
      seg = 2;
      t = (p - 0.4) / 0.25;
    } else if (p < 0.85) {
      seg = 3;
      t = (p - 0.65) / 0.2;
    } else {
      seg = 4;
      t = (p - 0.85) / 0.15;
    }

    const nextSeg = Math.min(4, seg + 1);
    const currentColor = fogColors[seg];
    const nextColor = fogColors[nextSeg];

    if (state.scene.fog && state.scene.fog instanceof THREE.FogExp2) {
      state.scene.fog.color.lerpColors(currentColor, nextColor, t);
      const targetDensity = fogDensities[seg] * (1 - t) + fogDensities[nextSeg] * t;
      state.scene.fog.density = THREE.MathUtils.damp(state.scene.fog.density, targetDensity, 4.0, dt);
    }

    // Move key light to follow camera focus
    if (dirLightRef.current) {
      dirLightRef.current.position.set(state.camera.position.x + 5.0, state.camera.position.y + 8.0, state.camera.position.z + 5.0);
    }
  });

  return (
    <>
      <fogExp2 attach="fog" args={['#161426', 0.015]} />
      <ambientLight intensity={0.45} />
      <directionalLight
        ref={dirLightRef}
        position={[6, 12, 8]}
        intensity={1.8}
        color="#F4EFE6"
        castShadow={gpuTier >= 2}
        shadow-mapSize-width={gpuTier === 3 ? 2048 : 1024}
        shadow-mapSize-height={gpuTier === 3 ? 2048 : 1024}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
      />
    </>
  );
}
