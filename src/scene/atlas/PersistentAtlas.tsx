import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { sceneTransientStore } from '../../store/sceneTransientStore';
import { useUIStore } from '../../store/useUIStore';
import { createAetherCoreMaterial } from '../shaders/aetherCoreShader';

export function PersistentAtlas() {
  const heroGltf = useGLTF('/assets/models/atlas-hero.glb');
  const atlasGroupRef = useRef<THREE.Group | null>(null);
  const outerRingRef = useRef<THREE.Object3D | null>(null);
  const eclipticRingRef = useRef<THREE.Object3D | null>(null);
  const retePlateRef = useRef<THREE.Object3D | null>(null);
  const gearClusterRef = useRef<THREE.Object3D | null>(null);
  const aetherCoreRef = useRef<THREE.Mesh | null>(null);
  const celestialRingsGroupRef = useRef<THREE.Group | null>(null);

  const aetherMaterial = useMemo(() => createAetherCoreMaterial(), []);
  const { setInspectedHotspotId } = useUIStore();
  const { size, gl } = useThree();
  const isPortrait = size.width < size.height;

  // Manual drag rotation state with inertia
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragRotationRef = useRef({ x: 0, y: 0 });
  const dragVelocityRef = useRef({ x: 0, y: 0 });

  // Floating amber dust motes catching celestial light
  const dustParticles = useMemo(() => {
    const count = 450;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 1.2 + Math.random() * 4.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      positions[i * 3 + 0] = radius * Math.cos(phi) * Math.sin(theta);
      positions[i * 3 + 1] = 1.2 + radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi) * Math.cos(theta);
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

  // Clean up materials and geometries on unmount
  useEffect(() => {
    return () => {
      aetherMaterial.dispose();
      dustParticles.dispose();
    };
  }, [aetherMaterial, dustParticles]);

  // Setup direct drag listeners on canvas for interactive Atlas rotation
  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      // Only drag with primary mouse button or touch
      if (e.button !== 0) return;
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      dragStartRef.current = { x: e.clientX, y: e.clientY };

      const factor = 0.006;
      dragVelocityRef.current.x = dx * factor;
      dragVelocityRef.current.y = dy * factor;
      dragRotationRef.current.y += dx * factor;
      dragRotationRef.current.x += dy * factor;
      dragRotationRef.current.x = Math.max(-0.6, Math.min(0.6, dragRotationRef.current.x));
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const p = sceneTransientStore.smoothProgress;
    const time = state.clock.getElapsedTime();

    // Damped drag inertia decay
    if (!isDraggingRef.current) {
      dragRotationRef.current.y += dragVelocityRef.current.x;
      dragRotationRef.current.x += dragVelocityRef.current.y;
      dragVelocityRef.current.x *= 0.92;
      dragVelocityRef.current.y *= 0.92;

      // Gently damp manual pitch back towards authored zero tilt
      dragRotationRef.current.x = THREE.MathUtils.damp(dragRotationRef.current.x, 0, 1.5, dt);
    }

    // Atlas master orientation: combines scroll choreo + manual drag + subtle idle precession
    if (atlasGroupRef.current) {
      const scrollBaseAngle = p * Math.PI * 2.5;
      atlasGroupRef.current.rotation.y = scrollBaseAngle + dragRotationRef.current.y;
      atlasGroupRef.current.rotation.x = dragRotationRef.current.x;
    }

    // Concentric mechanical rings kinematics
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y = p * Math.PI * 3.0 + time * 0.04;
    }
    if (eclipticRingRef.current) {
      eclipticRingRef.current.rotation.z = p * Math.PI * -4.0 - time * 0.06;
    }
    if (retePlateRef.current) {
      retePlateRef.current.rotation.z = p * Math.PI * 5.0 + time * 0.08;
    }
    if (gearClusterRef.current) {
      gearClusterRef.current.rotation.y = p * Math.PI * 7.0 + time * 0.12;
    }

    // Celestial concentric rings rotation
    if (celestialRingsGroupRef.current) {
      celestialRingsGroupRef.current.rotation.y = -time * 0.03 - p * Math.PI * 1.5;
      celestialRingsGroupRef.current.rotation.z = Math.sin(time * 0.2) * 0.05;
    }

    // Aether Core shader animation
    if (aetherMaterial.uniforms.uTime) {
      aetherMaterial.uniforms.uTime.value = time;
    }
    if (aetherCoreRef.current) {
      aetherCoreRef.current.rotation.x = time * 0.35;
      aetherCoreRef.current.rotation.y = time * 0.55;
    }
  });

  // Calculate dominant Atlas scale to occupy ~70% of the screen
  const atlasScale = isPortrait ? 1.05 : 1.35;

  return (
    <group
      ref={atlasGroupRef}
      name="The_Living_Atlas_Persistent_Anchor"
      position={[0.0, 1.2, 0.0]}
      scale={[atlasScale, atlasScale, atlasScale]}
    >
      {/* CAD Living Atlas 3D Model */}
      <primitive object={heroScene} />

      {/* Internal radiant golden light emanating from the Aetherial Core */}
      <pointLight position={[0.0, 0.3, 0.0]} color="#F2A93B" intensity={18.0} distance={22} decay={1.8} />

      {/* Concept-art inspired concentric orbital armillary rings & planetary nodes */}
      <group ref={celestialRingsGroupRef} position={[0.0, 0.3, 0.0]}>
        {/* Outer concentric celestial rings with warm golden luminescence */}
        <mesh rotation={[Math.PI / 2.3, 0.2, 0]}>
          <ringGeometry args={[3.2, 3.25, 64]} />
          <meshBasicMaterial color="#F2A93B" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2.6, -0.3, 0.4]}>
          <ringGeometry args={[3.8, 3.84, 64]} />
          <meshBasicMaterial color="#C89D54" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[Math.PI / 3.2, 0.5, -0.2]}>
          <ringGeometry args={[4.4, 4.43, 64]} />
          <meshBasicMaterial color="#FAF6EE" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>

        {/* Orbiting Planetary Nodes & Radiant Beams connecting to Core */}
        {[
          { pos: [3.2, 0.6, 0.0], r: 0.16, color: '#F2A93B' },
          { pos: [-2.6, 1.2, 1.8], r: 0.14, color: '#C89D54' },
          { pos: [1.8, -0.8, -3.0], r: 0.15, color: '#FAF6EE' },
          { pos: [-3.4, -0.5, -1.6], r: 0.13, color: '#F2A93B' },
        ].map((node, i) => (
          <group key={i}>
            {/* Glowing planetary sphere */}
            <mesh position={node.pos as [number, number, number]}>
              <sphereGeometry args={[node.r, 16, 16]} />
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={1.5}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
            {/* Radiant laser beam line connecting core to node */}
            <line>
              <bufferGeometry
                attributes={{
                  position: new THREE.Float32BufferAttribute(
                    [0, 0, 0, node.pos[0], node.pos[1], node.pos[2]],
                    3
                  ),
                }}
              />
              <lineBasicMaterial color={node.color} transparent opacity={0.35} />
            </line>
          </group>
        ))}
      </group>

      {/* Ambient Celestial Dust Motes */}
      <points geometry={dustParticles}>
        <pointsMaterial
          size={0.065}
          color="#F2A93B"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Interactive Raycast Hotspots on the Atlas */}
      <mesh
        position={[0.0, 0.8, 0.0]}
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
        <sphereGeometry args={[2.5, 12, 12]} />
        <meshBasicMaterial />
      </mesh>

      <mesh
        position={[0.0, 0.3, 0.0]}
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
        <sphereGeometry args={[1.2, 12, 12]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}

useGLTF.preload('/assets/models/atlas-hero.glb');
