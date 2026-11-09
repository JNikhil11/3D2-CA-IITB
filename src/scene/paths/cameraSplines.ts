import * as THREE from 'three';

// Waypoints for camera eye positions across 5 narrative worlds
export const cameraPosWaypoints: THREE.Vector3[] = [
  new THREE.Vector3(0.0, 2.5, 14.0),       // p = 0.00: W-01 Intro (Living Atlas)
  new THREE.Vector3(3.8, 2.2, 6.5),        // p = 0.12: W-01 Close-up inspection
  new THREE.Vector3(0.0, -14.0, -6.0),     // p = 0.25: W-02 Shaft vertical descent
  new THREE.Vector3(-2.5, -27.5, -10.5),   // p = 0.38: W-02 Gear core & escapement
  new THREE.Vector3(0.0, -42.0, -45.0),    // p = 0.52: W-03 Quadrants hub overview
  new THREE.Vector3(0.0, -26.0, -102.0),   // p = 0.75: W-04 Technoholix arena sweep
  new THREE.Vector3(0.0, 26.0, -162.0),    // p = 1.00: W-05 Deep space beacon zenith
];

// Waypoints for camera lookAt focal targets
export const cameraTargetWaypoints: THREE.Vector3[] = [
  new THREE.Vector3(0.0, 1.5, 0.0),        // p = 0.00: Core of Living Atlas
  new THREE.Vector3(0.0, 1.8, 0.0),        // p = 0.12: Ecliptic ring focus
  new THREE.Vector3(0.0, -24.0, -12.0),    // p = 0.25: Down the drive shaft
  new THREE.Vector3(0.0, -28.0, -15.0),    // p = 0.38: Planetary gear center
  new THREE.Vector3(0.0, -45.0, -60.0),    // p = 0.52: Rotunda center
  new THREE.Vector3(0.0, -30.0, -120.0),   // p = 0.75: Mainstage & sky pylons
  new THREE.Vector3(0.0, 25.0, -180.0),    // p = 1.00: Ascendant orbital atlas
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
    baseFov = 42 - p * 33.3; // 42 -> 38
  } else if (p < 0.4) {
    const t = (p - 0.2) / 0.2;
    baseFov = 38 + t * 7; // 38 -> 45
  } else if (p < 0.65) {
    const t = (p - 0.4) / 0.25;
    baseFov = 45 + t * 3; // 45 -> 48
  } else if (p < 0.85) {
    const t = (p - 0.65) / 0.2;
    baseFov = 48 + t * 4; // 48 -> 52
  } else {
    const t = (p - 0.85) / 0.15;
    baseFov = 52 - t * 12; // 52 -> 40
  }

  // Portrait compensation: broaden FOV to prevent vertical cropping of Atlas
  return isPortrait ? baseFov * 1.35 : baseFov;
}

