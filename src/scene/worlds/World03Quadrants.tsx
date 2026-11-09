import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useUIStore } from '../../store/useUIStore';

export function World03Quadrants() {
  const gltf = useGLTF('/assets/models/world03-quadrants.glb');
  const roboRef = useRef<THREE.Object3D | null>(null);
  const aeroRef = useRef<THREE.Object3D | null>(null);
  const aiRef = useRef<THREE.Object3D | null>(null);
  const greenRef = useRef<THREE.Object3D | null>(null);

  const { selectedQuadrant, setSelectedQuadrant, setInspectedHotspotId } = useUIStore();

  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    cloned.traverse((child) => {
      if (child.name === 'SM_Quad_Robotics') roboRef.current = child;
      if (child.name === 'SM_Quad_Aerospace') aeroRef.current = child;
      if (child.name === 'SM_Quad_Cognitive') aiRef.current = child;
      if (child.name === 'SM_Quad_Sustainability') greenRef.current = child;
    });
    return cloned;
  }, [gltf]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Subtle kinematic motion for each quadrant model
    if (roboRef.current) {
      roboRef.current.rotation.y = Math.sin(time * 0.8) * 0.35;
    }
    if (aeroRef.current) {
      aeroRef.current.position.y = -43.5 + Math.sin(time * 1.2) * 0.15;
      aeroRef.current.rotation.z = Math.sin(time * 0.6) * 0.08;
    }
    if (aiRef.current) {
      aiRef.current.rotation.y = time * 0.25;
    }
    if (greenRef.current) {
      greenRef.current.rotation.y = time * 2.5; // Turbine spinning
    }
  });

  return (
    <group name="World03_EngineeringQuadrants">
      <primitive object={scene} />

      {/* Quadrant Spotlights reacting to selection */}
      <pointLight
        position={[-5.5, -42.0, -58.0]}
        color="#C89D54"
        intensity={selectedQuadrant === 'robotics' ? 45.0 : 12.0}
        distance={15}
      />
      <pointLight
        position={[0.0, -40.0, -65.0]}
        color="#F2A93B"
        intensity={selectedQuadrant === 'aerospace' ? 45.0 : 12.0}
        distance={15}
      />
      <pointLight
        position={[5.5, -42.0, -58.0]}
        color="#1F3A93"
        intensity={selectedQuadrant === 'cognitive' ? 45.0 : 12.0}
        distance={15}
      />
      <pointLight
        position={[0.0, -42.0, -53.0]}
        color="#5B7A66"
        intensity={selectedQuadrant === 'sustainability' ? 45.0 : 12.0}
        distance={15}
      />

      {/* Hotspot proxies for the 4 quadrants */}
      <mesh
        position={[-4.5, -45.0, -58.0]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedQuadrant('robotics');
          setInspectedHotspotId('robotics-arm');
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
        position={[0.0, -43.5, -63.5]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedQuadrant('aerospace');
          setInspectedHotspotId('aerospace-vehicle');
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

      <mesh
        position={[4.5, -45.0, -58.0]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedQuadrant('cognitive');
          setInspectedHotspotId('cognitive-lattice');
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
        position={[0.0, -46.5, -55.0]}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedQuadrant('sustainability');
          setInspectedHotspotId('sustainability-turbine');
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
    </group>
  );
}

useGLTF.preload('/assets/models/world03-quadrants.glb');
