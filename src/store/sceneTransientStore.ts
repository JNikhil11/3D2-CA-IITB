/**
 * High-Frequency Transient Scene Store
 * Mutable plain object read and mutated exclusively inside the R3F useFrame render loop
 * NEVER causes React component re-renders on scroll or pointer movement.
 */
export interface SceneTransientStore {
  rawProgress: number;          // [0..1] directly from GSAP ScrollTrigger
  targetProgress: number;       // [0..1]
  smoothProgress: number;       // [0..1] frame-rate-independently damped
  scrollVelocity: number;       // Current scroll speed
  pointer: { x: number; y: number }; // Normalized device coordinates [-1..1]
  isInspectingHotspot: boolean; // When true, camera decouples from spline to inspect
  activeHotspotId: string | null;
  hotspotScreenCoords: Record<string, { x: number; y: number; visible: boolean }>;
}

export const sceneTransientStore: SceneTransientStore = {
  rawProgress: 0,
  targetProgress: 0,
  smoothProgress: 0,
  scrollVelocity: 0,
  pointer: { x: 0, y: 0 },
  isInspectingHotspot: false,
  activeHotspotId: null,
  hotspotScreenCoords: {},
};

