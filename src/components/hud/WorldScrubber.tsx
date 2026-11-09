import { useEffect, useState } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { WORLDS_DATA } from '../../data/worldsContent';
import { sceneTransientStore } from '../../store/sceneTransientStore';

const WORLD_TARGET_PROGRESS = [0.0, 0.25, 0.50, 0.75, 1.0];

export function WorldScrubber() {
  const { activeWorldIndex, setActiveWorldIndex } = useUIStore();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let animId: number;
    const updateProgress = () => {
      setScrollProgress(sceneTransientStore.smoothProgress);
      animId = requestAnimationFrame(updateProgress);
    };
    animId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleJumpToWorld = (idx: number) => {
    setActiveWorldIndex(idx);
    const targetProgress = WORLD_TARGET_PROGRESS[idx] ?? 0;
    sceneTransientStore.targetProgress = targetProgress;

    // Trigger smooth window scroll
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0) {
      window.scrollTo({
        top: targetProgress * maxScroll,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav
      aria-label="Narrative Worlds Scrubber"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--hud-bottom-height)',
        zIndex: 'var(--z-hud-base)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 1.5rem',
        background: 'linear-gradient(0deg, rgba(8, 9, 15, 0.95) 0%, rgba(8, 9, 15, 0) 100%)',
        borderTop: '1px solid rgba(200, 157, 84, 0.18)',
        backdropFilter: 'blur(8px)',
        pointerEvents: 'auto',
      }}
    >
      {/* Global Progress Track */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '2px',
          background: 'rgba(200, 157, 84, 0.15)',
          marginBottom: '0.75rem',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${(scrollProgress * 100).toFixed(1)}%`,
            background: 'var(--color-amber-light)',
            boxShadow: '0 0 8px var(--color-amber-light)',
          }}
        />
      </div>

      {/* Chapter Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        {WORLDS_DATA.map((world, idx) => {
          const isActive = activeWorldIndex === idx;
          return (
            <button
              key={world.id}
              onClick={() => handleJumpToWorld(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.65rem',
                background: isActive ? 'rgba(200, 157, 84, 0.20)' : 'transparent',
                border: isActive
                  ? '1px solid var(--color-antique-brass)'
                  : '1px solid transparent',
                borderRadius: '2px',
                color: isActive ? 'var(--color-amber-light)' : 'var(--color-parchment-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-mono)',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ opacity: isActive ? 1.0 : 0.6 }}>0{idx + 1}</span>
              <span className="scrubber-label">{world.title.replace('The ', '')}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
