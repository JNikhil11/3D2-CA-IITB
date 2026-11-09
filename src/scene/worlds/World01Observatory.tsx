import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { sceneTransientStore } from '../../store/sceneTransientStore';
import { useUIStore } from '../../store/useUIStore';
import { createAetherCoreMaterial } from '../shaders/aetherCoreShader';

export function World01Observatory() {
  const heroGltf = useGLTF('/assets/models/atlas-hero.glb');
  const shellGltf = useGLTF('/assets/models/world01-shell.glb');

  const outerRingRef = useRef<THREE.Object3D | null>(null);
  const eclipticRingRef = useRef<THREE.Object3D | null>(null);
  const retePlateRef = useRef<THREE.Object3D | null>(null);
  const gearClusterRef = useRef<THREE.Object3D | null>(null);
  const aetherCoreRef = useRef<THREE.Mesh | null>(null);

  const aetherMaterial = useMemo(() => createAetherCoreMaterial(), []);
  const { setInspectedHotspotId } = useUIStore();

  // Dust particles motes
  const dustParticles = useMemo(() => {
    const count = 350;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 14.0;
      positions[i * 3 + 1] = Math.random() * 9.0;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14.0;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  // Clone scene nodes and locate named mechanical parts
  const heroScene = useMemo(() => {
    const cloned = heroGltf.scene.clone(true);
    cloned.traverse((child) => {
      if (child.name === 'SM_Atlas_MeridianOuter') outerRingRef.current = child;
      if (child.name === 'SM_Atlas_RingEcliptic') eclipticRingRef.current = child;
      if (child.name === 'SM_Atlas_RetePlate') retePlateRef.current = child;
      if (child.name === 'SM_Atlas_GearCluster') gearClusterRef.current = child;
      if (child.name === 'SM_Atlas_AetherCore') {
        const mesh = child as THREE.Mesh;
        mesh.material = aetherMaterial;
        aetherCoreRef.current = mesh;
      }
    });
    return cloned;
  }, [heroGltf, aetherMaterial]);

  const shellScene = useMemo(() => shellGltf.scene.clone(true), [shellGltf]);

  useEffect(() => {
    return () => {
      aetherMaterial.dispose();
      dustParticles.dispose();
    };
  }, [aetherMaterial, dustParticles]);

  useFrame((state) => {
    const p = sceneTransientStore.smoothProgress;
    const time = state.clock.getElapsedTime();

    // Rotate mechanical rings coupled to progress and subtle idle drift
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y = p * Math.PI * 4.0 + time * 0.04;
    }
    if (eclipticRingRef.current) {
      eclipticRingRef.current.rotation.z = p * Math.PI * -5.0 - time * 0.06;
    }
    if (retePlateRef.current) {
      retePlateRef.current.rotation.z = p * Math.PI * 6.5 + time * 0.08;
    }
    if (gearClusterRef.current) {
      gearClusterRef.current.rotation.y = p * Math.PI * 8.0 + time * 0.12;
    }

    if (aetherMaterial.uniforms.uTime) {
      aetherMaterial.uniforms.uTime.value = time;
    }

    // Keep core floating harmonically
    if (aetherCoreRef.current) {
      aetherCoreRef.current.rotation.x = time * 0.4;
      aetherCoreRef.current.rotation.y = time * 0.6;
    }
  });

  return (
    <group name="World01_GrandObservatory" position={[0, 0, 0]}>
      {/* Architectural shell */}
      <primitive object={shellScene} />

      {/* Living Atlas Hero */}
      <primitive object={heroScene} />

      {/* Dust motes catching amber zenith light */}
      <points geometry={dustParticles}>
        <pointsMaterial
          size={0.06}
          color="#F2A93B"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Interactive Raycast Hotspot Proxies (Low-poly invisible hit targets) */}
      <mesh
        position={[0.0, 2.2, 0.0]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          setInspectedHotspotId('meridian-rings');
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.55, 12, 12]} />
        <meshBasicMaterial />
      </mesh>

      <mesh
        position={[0.0, 1.5, 0.0]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          setInspectedHotspotId('aether-core');
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.65, 12, 12]} />
        <meshBasicMaterial />
      </mesh>

      <mesh
        position={[-1.2, 1.8, 0.6]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          setInspectedHotspotId('astrolabe-rete');
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}

useGLTF.preload('/assets/models/atlas-hero.glb');
useGLTF.preload('/assets/models/world01-shell.glb');
