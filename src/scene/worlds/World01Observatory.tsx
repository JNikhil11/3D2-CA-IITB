import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { sceneTransientStore } from '../../store/sceneTransientStore';

export function World01Observatory() {
  const shellGltf = useGLTF('/assets/models/world01-shell.glb');
  const groupRef = useRef<THREE.Group | null>(null);
  const shellScene = useMemo(() => shellGltf.scene.clone(true), [shellGltf]);

  useFrame(() => {
    const p = sceneTransientStore.smoothProgress;
    if (groupRef.current) {
      groupRef.current.visible = p < 0.28;
    }
  });

  return (
    <group ref={groupRef} name="World01_GrandObservatory" position={[0, 0, 0]}>
      {/* Architectural ocular vault dome & 4 Colossal Celestial Mech Guardians */}
      <primitive object={shellScene} />
    </group>
  );
}

useGLTF.preload('/assets/models/world01-shell.glb');
