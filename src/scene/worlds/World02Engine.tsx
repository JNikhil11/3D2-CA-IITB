import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { sceneTransientStore } from '../../store/sceneTransientStore';
import { useUIStore } from '../../store/useUIStore';

export function World02Engine() {
  const gltf = useGLTF('/assets/models/world02-engine.glb');
  const gearTrainRef = useRef<THREE.Object3D | null>(null);
  const escapementRef = useRef<THREE.Object3D | null>(null);
  const pendulumRef = useRef<THREE.Object3D | null>(null);

  const { setInspectedHotspotId } = useUIStore();

  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    cloned.traverse((child) => {
      if (child.name === 'SM_Engine_GearTrain') gearTrainRef.current = child;
      if (child.name === 'SM_Engine_Escapement') escapementRef.current = child;
      if (child.name === 'SM_Engine_TorsionPendulum') pendulumRef.current = child;
    });
    return cloned;
  }, [gltf]);

  useFrame((state) => {
    const p = sceneTransientStore.smoothProgress;
    const time = state.clock.getElapsedTime();

    // Rotate massive bevel gears proportional to progress
    if (gearTrainRef.current) {
      gearTrainRef.current.rotation.y = p * Math.PI * 12.0;
    }

    // Escapement deadbeat tick oscillation
    if (escapementRef.current) {
      escapementRef.current.rotation.x = p * Math.PI * 8.0 + Math.sin(time * 12.0) * 0.08;
    }

    // Torsion pendulum 60s period harmonic harmonic twist
    if (pendulumRef.current) {
      pendulumRef.current.rotation.y = Math.sin(time * (Math.PI / 3.0)) * 0.85;
    }
  });

  return (
    <group name="World02_SubterraneanEngine">
      <primitive object={scene} />

      {/* Hotspot proxies */}
      <mesh
        position={[0.0, -26.5, -14.2]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          setInspectedHotspotId('escapement-drive');
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshBasicMaterial />
      </mesh>

      <mesh
        position={[-1.8, -28.0, -15.5]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          setInspectedHotspotId('torsion-pendulum');
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.7, 12, 12]} />
        <meshBasicMaterial />
      </mesh>

      <mesh
        position={[1.6, -29.2, -16.0]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          setInspectedHotspotId('power-conduit');
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.7, 12, 12]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}

useGLTF.preload('/assets/models/world02-engine.glb');
