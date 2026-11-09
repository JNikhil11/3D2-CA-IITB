import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  cameraPosCurve,
  cameraTargetCurve,
  getFovAtProgress,
  cameraPosWaypoints,
  cameraTargetWaypoints,
} from '../../src/scene/paths/cameraSplines';

describe('Camera Spline Math & Progress Evaluation', () => {
  it('contains expected number of control waypoints', () => {
    expect(cameraPosWaypoints.length).toBe(7);
    expect(cameraTargetWaypoints.length).toBe(7);
  });

  it('evaluates smooth continuous positions without NaN across [0, 1]', () => {
    const _pos = new THREE.Vector3();
    const _target = new THREE.Vector3();

    for (let i = 0; i <= 100; i++) {
      const p = i / 100;
      cameraPosCurve.getPointAt(p, _pos);
      cameraTargetCurve.getPointAt(p, _target);

      expect(Number.isNaN(_pos.x)).toBe(false);
      expect(Number.isNaN(_pos.y)).toBe(false);
      expect(Number.isNaN(_pos.z)).toBe(false);

      expect(Number.isNaN(_target.x)).toBe(false);
      expect(Number.isNaN(_target.y)).toBe(false);
      expect(Number.isNaN(_target.z)).toBe(false);
    }
  });

  it('starts at World 01 intro position and ends at World 05 beacon', () => {
    const startPos = new THREE.Vector3();
    const endPos = new THREE.Vector3();

    cameraPosCurve.getPointAt(0.0, startPos);
    cameraPosCurve.getPointAt(1.0, endPos);

    expect(startPos.distanceTo(cameraPosWaypoints[0])).toBeLessThan(0.01);
    expect(endPos.distanceTo(cameraPosWaypoints[cameraPosWaypoints.length - 1])).toBeLessThan(0.01);
  });

  it('calculates FOV correctly for landscape and portrait aspect ratios', () => {
    const fov0 = getFovAtProgress(0.0, false);
    const fov1 = getFovAtProgress(1.0, false);
    const fovPortrait = getFovAtProgress(0.0, true);

    expect(fov0).toBeCloseTo(42, 1);
    expect(fov1).toBeCloseTo(40, 1);
    expect(fovPortrait).toBeGreaterThan(fov0);
  });
});

