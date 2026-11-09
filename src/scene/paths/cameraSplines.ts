import * as THREE from 'three';

// Waypoints for camera eye positions navigating around and through the Living Atlas
export const cameraPosWaypoints: THREE.Vector3[] = [
  new THREE.Vector3(0.0, 1.5, 8.8),       // p = 0.00: W-01 Sanctuary Overview (Living Atlas fills ~70%)
  new THREE.Vector3(2.2, 1.8, 7.4),       // p = 0.12: W-01 Meridian Arc inspection
  new THREE.Vector3(1.8, 0.4, 4.8),       // p = 0.25: W-02 Clockwork approach
  new THREE.Vector3(1.2, 0.2, 3.8),       // p = 0.38: W-02 Gear Core & Escapement close-up
  new THREE.Vector3(-3.4, 2.2, 7.2),      // p = 0.52: W-03 Engineering Quadrants (Atlas center + 4 bays)
  new THREE.Vector3(0.0, -0.6, 6.5),      // p = 0.75: W-04 Technoholix Arena (Heroic low-angle sweep)
  new THREE.Vector3(0.0, 3.8, 8.2),       // p = 1.00: W-05 Deep Space Beacon (Celestial Zenith)
];

// Waypoints for camera lookAt focal targets (always centered on the Living Atlas structure)
export const cameraTargetWaypoints: THREE.Vector3[] = [
  new THREE.Vector3(0.0, 1.2, 0.0),       // p = 0.00: Core of Living Atlas
  new THREE.Vector3(0.0, 1.3, 0.0),       // p = 0.12: Outer gimbal rings
  new THREE.Vector3(0.0, 0.4, 0.0),       // p = 0.25: Shaft entry
  new THREE.Vector3(0.0, 0.1, 0.0),       // p = 0.38: Planetary gear cluster
  new THREE.Vector3(0.0, 0.8, 0.0),       // p = 0.52: Atlas core and rotunda platform
  new THREE.Vector3(0.0, 1.5, 0.0),       // p = 0.75: Crown meridian arc
  new THREE.Vector3(0.0, 1.2, 0.0),       // p = 1.00: Ascendant celestial beacon
];

// Centripetal Catmull-Rom splines eliminate overshoot and self-intersection
export const cameraPosCurve = new THREE.CatmullRomCurve3(
  cameraPosWaypoints,
  false,
  'centripetal',
  0.5
);

export const cameraTargetCurve = new THREE.CatmullRomCurve3(
  cameraTargetWaypoints,
  false,
  'centripetal',
  0.5
);

export function getFovAtProgress(progress: number, isPortrait: boolean): number {
  const p = Math.max(0, Math.min(1, progress));
  let baseFov = 42;

  if (p < 0.2) {
    baseFov = 42 - p * 20.0; // 42 -> 38
  } else if (p < 0.4) {
    const t = (p - 0.2) / 0.2;
    baseFov = 38 + t * 4; // 38 -> 42
  } else if (p < 0.65) {
    const t = (p - 0.4) / 0.25;
    baseFov = 42 + t * 4; // 42 -> 46
  } else if (p < 0.85) {
    const t = (p - 0.65) / 0.2;
    baseFov = 46 - t * 4; // 46 -> 42
  } else {
    const t = (p - 0.85) / 0.15;
    baseFov = 42 - t * 2; // 42 -> 40
  }

  // Portrait compensation: broaden FOV to prevent vertical cropping of Atlas
  return isPortrait ? baseFov * 1.35 : baseFov;
}
