import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sceneTransientStore } from './store/sceneTransientStore';
import { useUIStore } from './store/useUIStore';
import { CalibratedLoader } from './components/loader/CalibratedLoader';
import { ExperienceCanvas } from './scene/ExperienceCanvas';
import { TopHeader } from './components/hud/TopHeader';
import { EditorialOverlay } from './components/hud/EditorialOverlay';
import { SvgLeaderLines } from './components/hud/SvgLeaderLines';
import { HotspotDetailDrawer } from './components/modals/HotspotDetailDrawer';
import { SpatialCampusMapModal } from './components/modals/SpatialCampusMapModal';
import { AccessibleDOMMirror } from './components/fallback/AccessibleDOMMirror';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const { isLoaded, reducedMotion } = useUIStore();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Setup Lenis smooth scroll synced with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: reducedMotion ? 0.3 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !reducedMotion,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerHandler = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerHandler);
    gsap.ticker.lagSmoothing(0);

    // GSAP ScrollTrigger scrub
    const trigger = ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: reducedMotion ? false : 0.6,
      onUpdate: (self) => {
        sceneTransientStore.rawProgress = self.progress;
        sceneTransientStore.targetProgress = self.progress;
        sceneTransientStore.scrollVelocity = self.getVelocity();
      },
    });

    return () => {
      trigger.kill();
      gsap.ticker.remove(tickerHandler);
      lenis.destroy();
    };
  }, [reducedMotion]);

  // Pointer movement tracking for damped camera parallax
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      sceneTransientStore.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneTransientStore.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '500vh', // 5 Narrative worlds
        background: 'var(--color-deep-ink)',
      }}
    >
      {/* Deterministic Initial Gate Loader */}
      <CalibratedLoader />

      {/* When loaded, attach data-testid for Playwright automated verification */}
      {isLoaded && <div data-testid="experience-ready" style={{ display: 'none' }} />}

      {/* Fixed Full-Viewport 3D WebGL Canvas */}
      <ExperienceCanvas />

      {/* Clean Immersive Overlay Layer */}
      {isLoaded && (
        <>
          <TopHeader />
          <EditorialOverlay />
          <SvgLeaderLines />
          <HotspotDetailDrawer />
          <SpatialCampusMapModal />
        </>
      )}

      {/* Semantic Screen-Reader DOM Mirror (WCAG 2.2 AA) */}
      <AccessibleDOMMirror />
    </div>
  );
}

export default App;
