import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../../src/store/useUIStore';

describe('UI Zustand Store State Transitions', () => {
  beforeEach(() => {
    useUIStore.setState({
      activeWorldIndex: 0,
      selectedQuadrant: 'robotics',
      inspectedHotspotId: null,
      isMapOpen: false,
      isHotspotDrawerOpen: false,
      reducedMotion: false,
      isAudioMuted: true,
      hasWebGLFailed: false,
    });
  });

  it('clamps activeWorldIndex between 0 and 4', () => {
    const { setActiveWorldIndex } = useUIStore.getState();

    setActiveWorldIndex(2);
    expect(useUIStore.getState().activeWorldIndex).toBe(2);

    setActiveWorldIndex(99);
    expect(useUIStore.getState().activeWorldIndex).toBe(4);

    setActiveWorldIndex(-5);
    expect(useUIStore.getState().activeWorldIndex).toBe(0);
  });

  it('sets and clears inspectedHotspotId while opening/closing drawer', () => {
    const { setInspectedHotspotId } = useUIStore.getState();

    setInspectedHotspotId('meridian-rings');
    expect(useUIStore.getState().inspectedHotspotId).toBe('meridian-rings');
    expect(useUIStore.getState().isHotspotDrawerOpen).toBe(true);

    setInspectedHotspotId(null);
    expect(useUIStore.getState().inspectedHotspotId).toBeNull();
    expect(useUIStore.getState().isHotspotDrawerOpen).toBe(false);
  });

  it('toggles audio mute and reduced motion cleanly', () => {
    const { toggleAudio, setReducedMotion } = useUIStore.getState();

    expect(useUIStore.getState().isAudioMuted).toBe(true);
    toggleAudio();
    expect(useUIStore.getState().isAudioMuted).toBe(false);

    setReducedMotion(true);
    expect(useUIStore.getState().reducedMotion).toBe(true);
  });
});

