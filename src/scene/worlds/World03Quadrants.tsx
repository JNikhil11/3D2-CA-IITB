import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { sceneTransientStore } from '../../store/sceneTransientStore';
import { useUIStore } from '../../store/useUIStore';

export function World03Quadrants() {
  const gltf = useGLTF('/assets/models/world03-quadrants.glb');
  const groupRef = useRef<THREE.Group | null>(null);
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
    const p = sceneTransientStore.smoothProgress;
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.visible = p >= 0.35 && p < 0.68;
    }

    // Kinematic motion for each quadrant model
    if (roboRef.current) {
      roboRef.current.rotation.y = Math.sin(time * 0.9) * 0.35;
    }
    if (aeroRef.current) {
      aeroRef.current.position.y = 0.8 + Math.sin(time * 1.2) * 0.12;
      aeroRef.current.rotation.z = Math.sin(time * 0.7) * 0.08;
    }
    if (aiRef.current) {
      aiRef.current.rotation.y = time * 0.3;
      aiRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
    }
    if (greenRef.current) {
      greenRef.current.rotation.y = time * 2.8; // Fast helical turbine rotation
    }
  });

  return (
    <group ref={groupRef} name="World03_EngineeringQuadrants" position={[0, 0, 0]}>
      {/* 3D Quadrants Model */}
      <primitive object={scene} />

      {/* Radiant Ethereal Energy Beams connecting Atlas Core to Quadrants */}
      {[
        { target: [-3.6, 0.4, 0.8], color: '#C89D54' },
        { target: [-1.2, 0.9, -3.2], color: '#F2A93B' },
        { target: [3.6, 0.4, 0.8], color: '#60A5FA' },
        { target: [1.2, 0.9, -3.2], color: '#34D399' },
      ].map((beam, i) => (
        <line key={i}>
          <bufferGeometry
            attributes={{
              position: new THREE.Float32BufferAttribute(
                [0, 1.2, 0, beam.target[0], beam.target[1], beam.target[2]],
                3
              ),
            }}
          />
          <lineBasicMaterial color={beam.color} transparent opacity={0.45} />
        </line>
      ))}

      {/* Quadrant Spotlights reacting to selection with rich illumination */}
      <pointLight
        position={[-3.6, 2.2, 0.8]}
        color="#C89D54"
        intensity={selectedQuadrant === 'robotics' ? 35.0 : 18.0}
        distance={12}
        decay={1.8}
      />
      <pointLight
        position={[-1.2, 2.5, -3.2]}
        color="#F2A93B"
        intensity={selectedQuadrant === 'aerospace' ? 35.0 : 18.0}
        distance={12}
        decay={1.8}
      />
      <pointLight
        position={[3.6, 2.2, 0.8]}
        color="#3B82F6"
        intensity={selectedQuadrant === 'cognitive' ? 40.0 : 20.0}
        distance={12}
        decay={1.8}
      />
      <pointLight
        position={[1.2, 2.5, -3.2]}
        color="#10B981"
        intensity={selectedQuadrant === 'sustainability' ? 35.0 : 18.0}
        distance={12}
        decay={1.8}
      />

      {/* Central rotunda warm floodlight */}
      <pointLight position={[0.0, 3.0, 0.0]} color="#FAF6EE" intensity={15.0} distance={15} decay={2.0} />

      {/* Hotspot proxies for the 4 quadrants */}
      <mesh
        position={[-3.6, 0.8, 0.8]}
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
        <sphereGeometry args={[1.2, 12, 12]} />
        <meshBasicMaterial />
      </mesh>

      <mesh
        position={[-1.2, 1.2, -3.2]}
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
        <sphereGeometry args={[1.4, 12, 12]} />
        <meshBasicMaterial />
      </mesh>

      <mesh
        position={[3.6, 0.8, 0.8]}
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
        <sphereGeometry args={[1.2, 12, 12]} />
        <meshBasicMaterial />
      </mesh>

      <mesh
        position={[1.2, 1.2, -3.2]}
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
        <sphereGeometry args={[1.2, 12, 12]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}

useGLTF.preload('/assets/models/world03-quadrants.glb');
