import { useUIStore } from '../../store/useUIStore';
import { VERIFIED_LINKS } from '../../data/verifiedTechfestLinks';
import { Map, Eye, Volume2, VolumeX, ArrowUpRight } from 'lucide-react';

export function TopHeader() {
  const {
    isMapOpen,
    setIsMapOpen,
    reducedMotion,
    setReducedMotion,
    isAudioMuted,
    toggleAudio,
  } = useUIStore();

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--hud-top-height)',
        zIndex: 'var(--z-hud-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(1rem, 3vw, 2.5rem)',
        background: 'linear-gradient(180deg, rgba(8, 9, 15, 0.75) 0%, rgba(8, 9, 15, 0) 100%)',
        pointerEvents: 'none',
      }}
    >
      {/* Left: Official Brand Logos & Sigils */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', pointerEvents: 'auto' }}>
        <a
          href={VERIFIED_LINKS.IIT_BOMBAY_OFFICIAL}
          target="_blank"
          rel="noopener noreferrer"
          title="Indian Institute of Technology Bombay"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <img
            src="/assets/brand/iitb-crest.png"
            alt="IIT Bombay Official Crest"
            style={{
              height: '38px',
              width: 'auto',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.7))',
            }}
          />
        </a>

        <div style={{ width: '1px', height: '24px', background: 'rgba(200, 157, 84, 0.25)' }} />

        <a
          href={VERIFIED_LINKS.OFFICIAL_PORTAL}
          target="_blank"
          rel="noopener noreferrer"
          title="Techfest Official Portal"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <img
            src="/assets/brand/techfest-logo.png"
            alt="Techfest 16th - 18th December, 2026"
            style={{
              height: '24px',
              width: 'auto',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.7))',
            }}
          />
        </a>
      </div>

      {/* Right: Minimal Translucent Capsule Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', pointerEvents: 'auto' }}>
        {/* MAP Capsule */}
        <button
          onClick={() => setIsMapOpen(!isMapOpen)}
          aria-label="Toggle Spatial Campus Map"
          title="Spatial Campus Map"
          className="capsule-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 1.0rem',
            borderRadius: '9999px',
            background: isMapOpen ? 'rgba(200, 157, 84, 0.28)' : 'rgba(8, 9, 15, 0.38)',
            border: '1px solid rgba(200, 157, 84, 0.28)',
            backdropFilter: 'blur(10px)',
            color: 'var(--color-warm-ivory)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-mono)',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
        >
          <Map size={13} color="var(--color-antique-brass)" />
          <span>MAP</span>
        </button>

        {/* MOTION Capsule */}
        <button
          onClick={() => setReducedMotion(!reducedMotion)}
          aria-label="Toggle Motion Mode"
          title={reducedMotion ? 'Reduced Motion Active' : 'Dynamic Camera Splines Active'}
          className="capsule-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 1.0rem',
            borderRadius: '9999px',
            background: reducedMotion ? 'rgba(200, 157, 84, 0.28)' : 'rgba(8, 9, 15, 0.38)',
            border: '1px solid rgba(200, 157, 84, 0.25)',
            backdropFilter: 'blur(10px)',
            color: 'var(--color-warm-ivory)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-mono)',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
        >
          <Eye size={13} color={reducedMotion ? 'var(--color-amber-light)' : 'var(--color-parchment-muted)'} />
          <span>{reducedMotion ? 'CALM' : 'MOTION'}</span>
        </button>

        {/* Audio Capsule */}
        <button
          onClick={toggleAudio}
          aria-label={isAudioMuted ? 'Unmute Atmosphere' : 'Mute Atmosphere'}
          title="Atmospheric Sound"
          className="capsule-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            padding: 0,
            borderRadius: '9999px',
            background: 'rgba(8, 9, 15, 0.38)',
            border: '1px solid rgba(200, 157, 84, 0.25)',
            backdropFilter: 'blur(10px)',
            color: 'var(--color-warm-ivory)',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
        >
          {isAudioMuted ? (
            <VolumeX size={14} color="var(--color-parchment-muted)" />
          ) : (
            <Volume2 size={14} color="var(--color-amber-light)" />
          )}
        </button>

        {/* TECHFEST.ORG Capsule */}
        <a
          href={VERIFIED_LINKS.OFFICIAL_PORTAL}
          target="_blank"
          rel="noopener noreferrer"
          title="Official Techfest Portal"
          className="capsule-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 1.05rem',
            borderRadius: '9999px',
            background: 'rgba(8, 9, 15, 0.45)',
            border: '1px solid rgba(242, 169, 59, 0.45)',
            backdropFilter: 'blur(10px)',
            color: 'var(--color-warm-ivory)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-mono)',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
        >
          <span>TECHFEST.ORG</span>
          <ArrowUpRight size={13} color="var(--color-amber-light)" />
        </a>
      </div>
    </header>
  );
}
