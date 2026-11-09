import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { sceneTransientStore } from '../../store/sceneTransientStore';
import { useUIStore } from '../../store/useUIStore';
import { cameraTargetCurve } from '../paths/cameraSplines';

const _targetVec = new THREE.Vector3();

const fogColors = [
  new THREE.Color('#141320'), // W-01: Dusk violet
  new THREE.Color('#14121A'), // W-02: Charcoal bronze
  new THREE.Color('#0D111A'), // W-03: Deep indigo
  new THREE.Color('#0F1426'), // W-04: Ultramarine
  new THREE.Color('#080A12'), // W-05: Cosmic void
];

const fogDensities = [0.010, 0.014, 0.009, 0.012, 0.004];

export function LightingRig() {
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const dirTargetRef = useRef<THREE.Object3D | null>(null);
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

    // Move key light and its target to continuously illuminate the active focal region
    if (dirLightRef.current && dirTargetRef.current) {
      cameraTargetCurve.getPointAt(p, _targetVec);
      dirTargetRef.current.position.copy(_targetVec);
      dirTargetRef.current.updateMatrixWorld();
      dirLightRef.current.target = dirTargetRef.current;
      dirLightRef.current.position.set(_targetVec.x + 4.5, _targetVec.y + 7.5, _targetVec.z + 5.0);
    }
  });

  return (
    <>
      <fogExp2 attach="fog" args={['#141320', 0.010]} />
      {/* Target object for directional light */}
      <object3D ref={dirTargetRef} position={[0, 1.2, 0]} />

      {/* Universal warm ambient fill ensuring zero pitch-black geometry */}
      <ambientLight intensity={0.70} color="#FAF6EE" />

      {/* Hemisphere light for rich zenith-to-nadir contrast */}
      <hemisphereLight args={['#FAF6EE', '#1A1820', 0.55]} />

      {/* Key Directional Sunlight casting crisp shadows onto the Atlas */}
      <directionalLight
        ref={dirLightRef}
        position={[4.5, 8.5, 5.0]}
        intensity={2.2}
        color="#FBF7EE"
        castShadow={gpuTier >= 2}
        shadow-mapSize-width={gpuTier === 3 ? 2048 : 1024}
        shadow-mapSize-height={gpuTier === 3 ? 2048 : 1024}
        shadow-camera-near={0.5}
        shadow-camera-far={35}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0004}
      />

      {/* Cyan/Sapphire Rim light for metallic edge separation */}
      <directionalLight
        position={[-5.0, 4.0, -6.0]}
        intensity={0.85}
        color="#6D8EB0"
      />
    </>
  );
}
