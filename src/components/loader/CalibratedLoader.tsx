import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useUIStore } from '../../store/useUIStore';

export function CalibratedLoader() {
  const { isLoaded, setLoaded, loadingProgress, setLoadingProgress, loadingStatusMessage } = useUIStore();
  const [showSlowConnectionOption, setShowSlowConnectionOption] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const startTime = Date.now();
    const MIN_CALIBRATION_MS = 1700;

    // Track real Three.js Loading Manager items if any
    const manager = THREE.DefaultLoadingManager;
    let realLoaded = 0;
    let realTotal = 1;

    manager.onProgress = (_url, loaded, total) => {
      realLoaded = loaded;
      realTotal = Math.max(1, total);
    };

    // Incremental progress ticker up to MIN_CALIBRATION_MS
    const interval = setInterval(() => {
      if (isCancelled) return;
      const elapsed = Date.now() - startTime;
      const timeRatio = Math.min(1.0, elapsed / MIN_CALIBRATION_MS);

      // Blend elapsed time with real asset ratio
      const assetRatio = realLoaded / realTotal;
      const blendedRatio = Math.max(timeRatio * 0.85, assetRatio * 0.85);
      const currentVal = Math.min(95, Math.floor(blendedRatio * 100));

      setLoadingProgress(
        currentVal,
        currentVal < 40
          ? 'Calibrating Astronomical Vernier Scale...'
          : currentVal < 75
          ? 'Assembling Epicyclic Planetary Gearing...'
          : 'Refracting Aetherial Optical Core...'
      );

      // Once 1,700ms has elapsed, check font and shader readiness and finalize
      if (elapsed >= MIN_CALIBRATION_MS) {
        clearInterval(interval);
        const finish = () => {
          if (isCancelled) return;
          setLoadingProgress(100, 'Living Atlas Fully Calibrated.');
          setTimeout(() => {
            if (!isCancelled) setLoaded(true);
          }, 300);
        };

        if (document.fonts) {
          document.fonts.ready.then(finish).catch(finish);
        } else {
          finish();
        }
      }
    }, 50);

    // 10s slow connection fallback
    const slowTimer = setTimeout(() => {
      if (!isCancelled) setShowSlowConnectionOption(true);
    }, 10000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
      clearTimeout(slowTimer);
    };
  }, [setLoaded, setLoadingProgress]);

  if (isLoaded) return null;

  return (
    <aside
      aria-label="Application Loading"
      data-testid="experience-loader"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-loader)',
        background: 'var(--color-deep-ink)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        color: 'var(--color-warm-ivory)',
        userSelect: 'none',
      }}
    >
      {/* Decorative astrolabe calibration reticle */}
      <div
        style={{
          position: 'relative',
          width: '120px',
          height: '120px',
          marginBottom: '2.5rem',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: '1.5px solid var(--color-antique-brass)',
            borderRadius: '50%',
            opacity: 0.35,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '14px',
            border: '1.5px dashed var(--color-amber-light)',
            borderRadius: '50%',
            animation: 'spin 12s linear infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '32px',
            border: '1px solid var(--color-warm-ivory)',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            animation: 'spinReverse 8s linear infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '8px',
            height: '8px',
            transform: 'translate(-50%, -50%)',
            background: 'var(--color-amber-light)',
            borderRadius: '50%',
            boxShadow: '0 0 16px var(--color-amber-light)',
          }}
        />
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-h2)',
          fontWeight: 400,
          letterSpacing: '0.04em',
          margin: '0 0 0.5rem 0',
          textAlign: 'center',
        }}
      >
        THE LIVING ATLAS
      </h1>

      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-mono)',
          color: 'var(--color-parchment-muted)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          margin: '0 0 2rem 0',
        }}
      >
        TECHFEST IIT BOMBAY // AETHERIAL RENAISSANCE
      </p>

      {/* Progress Bar Container */}
      <div
        style={{
          width: 'min(360px, 85vw)',
          height: '4px',
          background: 'rgba(200, 157, 84, 0.15)',
          borderRadius: '2px',
          overflow: 'hidden',
          marginBottom: '1rem',
          position: 'relative',
        }}
      >
        <div
          data-testid="loader-progress-bar"
          style={{
            height: '100%',
            width: `${loadingProgress}%`,
            background: 'linear-gradient(90deg, var(--color-antique-brass), var(--color-amber-light))',
            transition: 'width 0.15s ease-out',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: 'min(360px, 85vw)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-mono)',
          color: 'var(--color-parchment-muted)',
        }}
      >
        <span>{loadingStatusMessage}</span>
        <span style={{ color: 'var(--color-amber-light)', fontWeight: 600 }}>
          {loadingProgress}%
        </span>
      </div>

      {showSlowConnectionOption && (
        <button
          onClick={() => setLoaded(true)}
          style={{
            marginTop: '2.5rem',
            padding: '0.6rem 1.4rem',
            background: 'rgba(22, 20, 38, 0.85)',
            border: '1px solid var(--color-antique-brass)',
            color: 'var(--color-warm-ivory)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-mono)',
            letterSpacing: '0.08em',
            cursor: 'pointer',
          }}
        >
          ENTER LIGHTWEIGHT BLUEPRINT MODE
        </button>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spinReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      `}</style>
    </aside>
  );
}
