import { create } from 'zustand';

export type QuadrantId = 'robotics' | 'aerospace' | 'cognitive' | 'sustainability';

export interface UIState {
  activeWorldIndex: number;
  selectedQuadrant: QuadrantId;
  inspectedHotspotId: string | null;
  isMapOpen: boolean;
  isHotspotDrawerOpen: boolean;
  gpuTier: 1 | 2 | 3;
  reducedMotion: boolean;
  isAudioMuted: boolean;
  isLoaded: boolean;
  loadingProgress: number; // 0..100
  loadingStatusMessage: string;
  hasWebGLFailed: boolean;

  // Actions
  setActiveWorldIndex: (index: number) => void;
  setSelectedQuadrant: (quadrant: QuadrantId) => void;
  setInspectedHotspotId: (id: string | null) => void;
  setIsMapOpen: (open: boolean) => void;
  setIsHotspotDrawerOpen: (open: boolean) => void;
  setGpuTier: (tier: 1 | 2 | 3) => void;
  setReducedMotion: (enabled: boolean) => void;
  toggleAudio: () => void;
  setLoaded: (loaded: boolean) => void;
  setLoadingProgress: (progress: number, message?: string) => void;
  setWebGLFailed: (failed: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeWorldIndex: 0,
  selectedQuadrant: 'robotics',
  inspectedHotspotId: null,
  isMapOpen: false,
  isHotspotDrawerOpen: false,
  gpuTier: 2,
  reducedMotion: false,
  isAudioMuted: true,
  isLoaded: false,
  loadingProgress: 0,
  loadingStatusMessage: 'Calibrating Astronomical Coordinates...',
  hasWebGLFailed: false,

  setActiveWorldIndex: (index) => set({ activeWorldIndex: Math.max(0, Math.min(4, index)) }),
  setSelectedQuadrant: (quadrant) => set({ selectedQuadrant: quadrant }),
  setInspectedHotspotId: (id) =>
    set({
      inspectedHotspotId: id,
      isHotspotDrawerOpen: id !== null,
    }),
  setIsMapOpen: (open) => set({ isMapOpen: open }),
  setIsHotspotDrawerOpen: (open) => set({ isHotspotDrawerOpen: open }),
  setGpuTier: (tier) => set({ gpuTier: tier }),
  setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
  toggleAudio: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  setLoadingProgress: (progress, message) =>
    set((state) => ({
      loadingProgress: Math.max(0, Math.min(100, progress)),
      loadingStatusMessage: message ?? state.loadingStatusMessage,
    })),
  setWebGLFailed: (failed) => set({ hasWebGLFailed: failed }),
}));

