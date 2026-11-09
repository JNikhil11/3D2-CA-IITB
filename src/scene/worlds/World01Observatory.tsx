import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

export function World01Observatory() {
  const shellGltf = useGLTF('/assets/models/world01-shell.glb');
  const shellScene = useMemo(() => shellGltf.scene.clone(true), [shellGltf]);

  return (
    <group name="World01_GrandObservatory" position={[0, 0, 0]}>
      {/* Architectural ocular vault dome */}
      <primitive object={shellScene} />
    </group>
  );
}

useGLTF.preload('/assets/models/world01-shell.glb');
