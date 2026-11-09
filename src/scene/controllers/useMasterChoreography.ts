import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneTransientStore } from '../../store/sceneTransientStore';
import { useUIStore } from '../../store/useUIStore';
import { cameraPosCurve, cameraTargetCurve, getFovAtProgress } from '../paths/cameraSplines';
import { WORLDS_DATA } from '../../data/worldsContent';

const _pos = new THREE.Vector3();
const _target = new THREE.Vector3();
const _hotspotPos = new THREE.Vector3();
const _projVec = new THREE.Vector3();

export function useMasterChoreography() {
  const { inspectedHotspotId, setActiveWorldIndex, activeWorldIndex, reducedMotion } = useUIStore();

  // Find inspected hotspot config if any
  const inspectedHotspot = WORLDS_DATA.flatMap((w) => w.hotspots).find(
    (h) => h.id === inspectedHotspotId
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);

    // Frame-rate-independent damping
    sceneTransientStore.smoothProgress = THREE.MathUtils.damp(
      sceneTransientStore.smoothProgress,
      sceneTransientStore.targetProgress,
      reducedMotion ? 12.0 : 6.0,
      dt
    );

    const p = sceneTransientStore.smoothProgress;
    const isPortrait = state.size.width < state.size.height;

    // Update active world index based on normalized scroll progress
    let newWorldIndex = 0;
    if (p >= 0.85) newWorldIndex = 4;
    else if (p >= 0.65) newWorldIndex = 3;
    else if (p >= 0.40) newWorldIndex = 2;
    else if (p >= 0.20) newWorldIndex = 1;
    else newWorldIndex = 0;

    if (newWorldIndex !== activeWorldIndex) {
      setActiveWorldIndex(newWorldIndex);
    }

    // Dynamic FOV calculation
    const camera = state.camera as THREE.PerspectiveCamera;
    const targetFov = getFovAtProgress(p, isPortrait);
    if (Math.abs(camera.fov - targetFov) > 0.1) {
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
    }

    // Camera positioning
    if (inspectedHotspot) {
      sceneTransientStore.isInspectingHotspot = true;
      _pos.set(
        inspectedHotspot.inspectionOffset[0],
        inspectedHotspot.inspectionOffset[1],
        inspectedHotspot.inspectionOffset[2]
      );
      _target.set(
        inspectedHotspot.lookAtOffset[0],
        inspectedHotspot.lookAtOffset[1],
        inspectedHotspot.lookAtOffset[2]
      );
      camera.position.lerp(_pos, dt * 4.0);
      camera.lookAt(_target);
    } else {
      sceneTransientStore.isInspectingHotspot = false;
      cameraPosCurve.getPointAt(p, _pos);
      cameraTargetCurve.getPointAt(p, _target);

      // Subtle pointer parallax when reduced motion is disabled
      if (!reducedMotion) {
        _pos.x += sceneTransientStore.pointer.x * 0.45;
        _pos.y += sceneTransientStore.pointer.y * 0.30;
      }

      // Portrait compensation: lower target slightly to leave upper 70% clear
      if (isPortrait) {
        _pos.y -= 0.8;
        _pos.z += 1.8;
      }

      camera.position.copy(_pos);
      camera.lookAt(_target);
    }

    // Project visible hotspot coordinates to 2D screen space
    const activeWorld = WORLDS_DATA[newWorldIndex];
    if (activeWorld) {
      for (const h of activeWorld.hotspots) {
        _hotspotPos.set(h.position[0], h.position[1], h.position[2]);
        _projVec.copy(_hotspotPos).project(camera);

        const isBehind = _projVec.z > 1.0;
        const screenX = (_projVec.x * 0.5 + 0.5) * state.size.width;
        const screenY = (-(_projVec.y * 0.5) + 0.5) * state.size.height;

        sceneTransientStore.hotspotScreenCoords[h.id] = {
          x: screenX,
          y: screenY,
          visible: !isBehind,
        };
      }
    }
  });
}

