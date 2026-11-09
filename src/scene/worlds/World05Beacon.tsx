import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useUIStore } from '../../store/useUIStore';

export function World05Beacon() {
  const heroGltf = useGLTF('/assets/models/atlas-hero.glb');
  const beaconGroupRef = useRef<THREE.Group | null>(null);
  const outerRingRef = useRef<THREE.Object3D | null>(null);

  const { setInspectedHotspotId } = useUIStore();

  // Cosmic starfield (1,200 stars)
  const starfield = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 120.0;
      positions[i * 3 + 1] = 10.0 + Math.random() * 60.0;
      positions[i * 3 + 2] = -140.0 - Math.random() * 80.0;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  const heroScene = useMemo(() => {
    const cloned = heroGltf.scene.clone(true);
    cloned.traverse((child) => {
      if (child.name === 'SM_Atlas_MeridianOuter') outerRingRef.current = child;
    });
    return cloned;
  }, [heroGltf]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (beaconGroupRef.current) {
      beaconGroupRef.current.rotation.y = time * 0.08;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = time * 0.12;
    }
  });

  return (
    <group name="World05_DeepSpaceBeacon" position={[0.0, 25.0, -180.0]}>
      {/* Expanded Ascendant Atlas */}
      <group ref={beaconGroupRef} scale={[1.8, 1.8, 1.8]}>
        <primitive object={heroScene} />
      </group>

      {/* Cosmic Starfield */}
      <points geometry={starfield}>
        <pointsMaterial
          size={0.12}
          color="#F4EFE6"
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>

      {/* Radiant Celestial Starlight */}
      <pointLight color="#F4EFE6" intensity={50.0} distance={50} />

      {/* Hotspots */}
      <mesh
        position={[0.0, 0.0, 0.0]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          setInspectedHotspotId('orbital-array');
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[4.0, 12, 12]} />
        <meshBasicMaterial />
      </mesh>

      <mesh
        position={[-3.2, -1.2, 5.0]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          setInspectedHotspotId('ambassador-terminal');
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[2.0, 12, 12]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}
