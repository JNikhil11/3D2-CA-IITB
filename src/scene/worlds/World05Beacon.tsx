import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { sceneTransientStore } from '../../store/sceneTransientStore';
import { useUIStore } from '../../store/useUIStore';
import { createVolumetricBeamMaterial } from '../shaders/volumetricBeamShader';

export function World05Beacon() {
  const groupRef = useRef<THREE.Group | null>(null);
  const beaconMeshRef = useRef<THREE.Mesh | null>(null);
  const { setInspectedHotspotId } = useUIStore();

  const beaconMaterial = useMemo(() => createVolumetricBeamMaterial('#F2A93B'), []);

  // Cosmic starfield (1,500 stars centered around the Atlas)
  const starfield = useMemo(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 18.0 + Math.random() * 45.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      positions[i * 3 + 0] = radius * Math.cos(phi) * Math.sin(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi) * Math.cos(theta);
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  // Vertical cylinder beacon geometry
  const beaconGeometry = useMemo(() => {
    const geom = new THREE.CylinderGeometry(0.3, 2.2, 30.0, 32, 1, true);
    geom.translate(0, 15.0, 0);
    return geom;
  }, []);

  useEffect(() => {
    return () => {
      beaconMaterial.dispose();
      starfield.dispose();
      beaconGeometry.dispose();
    };
  }, [beaconMaterial, starfield, beaconGeometry]);

  useFrame((state) => {
    const p = sceneTransientStore.smoothProgress;
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.visible = p >= 0.80;
    }

    if (beaconMaterial.uniforms.uTime) {
      beaconMaterial.uniforms.uTime.value = time;
    }
    if (beaconMeshRef.current) {
      beaconMeshRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <group ref={groupRef} name="World05_DeepSpaceBeacon" position={[0.0, 0.0, 0.0]}>
      {/* Cosmic Starfield surrounding the Atlas */}
      <points geometry={starfield}>
        <pointsMaterial
          size={0.10}
          color="#FAF6EE"
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>

      {/* Ascendant Celestial Beacon shooting from the Atlas Core into Deep Space */}
      <mesh
        ref={beaconMeshRef}
        geometry={beaconGeometry}
        material={beaconMaterial}
        position={[0.0, 1.2, 0.0]}
      />

      {/* Zenith Beacon Light Source */}
      <pointLight position={[0.0, 10.0, 0.0]} color="#F2A93B" intensity={30.0} distance={35} decay={1.5} />

      {/* Interactive Raycast Hotspot */}
      <mesh
        position={[0.0, 3.5, 0.0]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          setInspectedHotspotId('ascendant-core');
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <cylinderGeometry args={[1.5, 1.5, 8.0, 16]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}
