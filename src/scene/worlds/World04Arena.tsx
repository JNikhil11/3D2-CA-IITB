import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { sceneTransientStore } from '../../store/sceneTransientStore';
import { useUIStore } from '../../store/useUIStore';
import { createVolumetricBeamMaterial } from '../shaders/volumetricBeamShader';

export function World04Arena() {
  const gltf = useGLTF('/assets/models/world04-arena.glb');
  const groupRef = useRef<THREE.Group | null>(null);
  const beamsGroupRef = useRef<THREE.Group | null>(null);

  const { setIsMapOpen } = useUIStore();

  const beamMaterial = useMemo(() => createVolumetricBeamMaterial('#1F3A93'), []);

  // Cone geometry for volumetric sky beams
  const beamCone = useMemo(() => {
    const geom = new THREE.CylinderGeometry(0.15, 2.5, 22.0, 16, 1, true);
    geom.translate(0, 11.0, 0);
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
    const p = sceneTransientStore.smoothProgress;
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.visible = p >= 0.60 && p < 0.88;
    }

    if (beamMaterial.uniforms.uTime) {
      beamMaterial.uniforms.uTime.value = time;
    }

    // Oscillate beam angles across the 8 pylons converging towards the Atlas
    if (beamsGroupRef.current) {
      beamsGroupRef.current.children.forEach((beam, idx) => {
        const offset = idx * (Math.PI / 4);
        beam.rotation.x = Math.sin(time * 0.6 + offset) * 0.15 - 0.2;
        beam.rotation.z = Math.cos(time * 0.5 + offset) * 0.15;
      });
    }
  });

  return (
    <group ref={groupRef} name="World04_TechnoholixArena" position={[0, 0, 0]}>
      <primitive object={scene} />

      {/* 8 Volumetric Searchlight Beams surrounding the Atlas */}
      <group ref={beamsGroupRef} position={[0.0, -0.6, 0.0]}>
        {Array.from({ length: 8 }).map((_, i) => {
          const ang = (i / 8) * Math.PI * 2;
          const px = Math.cos(ang) * 8.5;
          const pz = Math.sin(ang) * 8.5;
          return (
            <mesh
              key={i}
              geometry={beamCone}
              material={beamMaterial}
              position={[px, 4.5, pz]}
              rotation={[0, 0, 0]}
            />
          );
        })}
      </group>

      {/* Arena Stage Floodlights */}
      <pointLight position={[0.0, 6.0, 0.0]} color="#1F3A93" intensity={20.0} distance={18} decay={1.8} />

      {/* Interactive Hotspot for Campus Nexus Model */}
      <mesh
        position={[3.2, 0.8, -1.5]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          setIsMapOpen(true);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[3.0, 1.2, 3.0]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}

useGLTF.preload('/assets/models/world04-arena.glb');
