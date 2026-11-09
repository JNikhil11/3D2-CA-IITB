import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useUIStore } from '../../store/useUIStore';
import { createVolumetricBeamMaterial } from '../shaders/volumetricBeamShader';

export function World04Arena() {
  const gltf = useGLTF('/assets/models/world04-arena.glb');
  const beamsGroupRef = useRef<THREE.Group | null>(null);

  const { setIsMapOpen, setInspectedHotspotId } = useUIStore();

  const beamMaterial = useMemo(() => createVolumetricBeamMaterial('#1F3A93'), []);

  // Cone geometry for volumetric sky beams
  const beamCone = useMemo(() => {
    const geom = new THREE.CylinderGeometry(0.2, 4.0, 35.0, 16, 1, true);
    geom.translate(0, 17.5, 0);
    return geom;
  }, []);

  const scene = useMemo(() => gltf.scene.clone(true), [gltf]);

  useEffect(() => {
    return () => {
      beamMaterial.dispose();
      beamCone.dispose();
    };
  }, [beamMaterial, beamCone]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (beamMaterial.uniforms.uTime) {
      beamMaterial.uniforms.uTime.value = time;
    }

    // Oscillate beam angles across the 8 pylons
    if (beamsGroupRef.current) {
      beamsGroupRef.current.children.forEach((beam, idx) => {
        const offset = idx * (Math.PI / 4);
        beam.rotation.x = Math.sin(time * 0.5 + offset) * 0.18;
        beam.rotation.z = Math.cos(time * 0.4 + offset) * 0.18;
      });
    }
  });

  return (
    <group name="World04_TechnoholixArena">
      <primitive object={scene} />

      {/* 8 Volumetric Searchlight Beams */}
      <group ref={beamsGroupRef} position={[0.0, -30.0, -120.0]}>
        {Array.from({ length: 8 }).map((_, i) => {
          const ang = (i / 8) * Math.PI * 2;
          const px = Math.cos(ang) * 12.0;
          const pz = Math.sin(ang) * 12.0;
          return (
            <mesh
              key={i}
              geometry={beamCone}
              material={beamMaterial}
              position={[px, 6.2, pz]}
            />
          );
        })}
      </group>

      {/* Stage spotlight */}
      <spotLight
        position={[0, -10, -115]}
        target-position={[0, -30, -125]}
        color="#1F3A93"
        intensity={60}
        angle={0.65}
        penumbra={0.8}
      />

      {/* Hotspots */}
      <mesh
        position={[0.0, -30.0, -125.0]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          setInspectedHotspotId('arena-stage');
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[2.5, 12, 12]} />
        <meshBasicMaterial />
      </mesh>

      <mesh
        position={[-5.0, -27.0, -115.0]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          setInspectedHotspotId('light-pylons');
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[1.5, 12, 12]} />
        <meshBasicMaterial />
      </mesh>

      <mesh
        position={[4.8, -28.5, -116.0]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          setIsMapOpen(true);
          setInspectedHotspotId('campus-nexus');
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[1.8, 12, 12]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}

useGLTF.preload('/assets/models/world04-arena.glb');
