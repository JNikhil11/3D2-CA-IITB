import { useUIStore } from '../../store/useUIStore';
import { WORLDS_DATA } from '../../data/worldsContent';
import { VERIFIED_LINKS } from '../../data/verifiedTechfestLinks';
import { Map, Eye, Volume2, VolumeX, ExternalLink } from 'lucide-react';

export function TopHeader() {
  const {
    activeWorldIndex,
    isMapOpen,
    setIsMapOpen,
    reducedMotion,
    setReducedMotion,
    isAudioMuted,
    toggleAudio,
  } = useUIStore();

  const currentWorld = WORLDS_DATA[activeWorldIndex] ?? WORLDS_DATA[0];

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
        padding: '0 1.5rem',
        background: 'linear-gradient(180deg, rgba(8, 9, 15, 0.92) 0%, rgba(8, 9, 15, 0) 100%)',
        borderBottom: '1px solid rgba(200, 157, 84, 0.18)',
        backdropFilter: 'blur(8px)',
        pointerEvents: 'auto',
      }}
    >
      {/* Left: Official Brand Logos & Sigils */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
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
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
            }}
          />
        </a>

        <div style={{ width: '1px', height: '26px', background: 'rgba(200, 157, 84, 0.3)' }} />

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
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
            }}
          />
        </a>
      </div>

      {/* Center: Active World Telemetry */}
      <div
        className="hud-center-telemetry"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-mono)',
          color: 'var(--color-parchment-muted)',
          letterSpacing: '0.12em',
        }}
      >
        <span
          style={{
            color: 'var(--color-amber-light)',
            fontWeight: 600,
            padding: '2px 8px',
            border: '1px solid rgba(242, 169, 59, 0.4)',
            borderRadius: '2px',
          }}
        >
          WORLD {currentWorld.romanNumeral} / V
        </span>
        <span style={{ color: 'var(--color-warm-ivory)', textTransform: 'uppercase' }}>
          {currentWorld.title}
        </span>
      </div>

      {/* Right: Controls & Outbound Portals */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <button
          onClick={() => setIsMapOpen(!isMapOpen)}
          aria-label="Toggle Spatial Campus Map"
          title="Spatial Campus Map"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.8rem',
            background: isMapOpen ? 'rgba(200, 157, 84, 0.25)' : 'rgba(22, 20, 38, 0.65)',
            border: '1px solid var(--color-antique-brass)',
            color: 'var(--color-warm-ivory)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-mono)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <Map size={14} color="var(--color-antique-brass)" />
          <span className="hud-button-label">MAP</span>
        </button>

        <button
          onClick={() => setReducedMotion(!reducedMotion)}
          aria-label="Toggle Motion Mode"
          title={reducedMotion ? 'Reduced Motion Active' : 'Dynamic Camera Splines Active'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.8rem',
            background: reducedMotion ? 'rgba(200, 157, 84, 0.25)' : 'rgba(22, 20, 38, 0.65)',
            border: '1px solid var(--color-aged-bronze)',
            color: 'var(--color-warm-ivory)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-mono)',
            cursor: 'pointer',
          }}
        >
          <Eye size={14} color={reducedMotion ? 'var(--color-amber-light)' : 'var(--color-parchment-muted)'} />
          <span className="hud-button-label">{reducedMotion ? 'CALM' : 'MOTION'}</span>
        </button>

        <button
          onClick={toggleAudio}
          aria-label={isAudioMuted ? 'Unmute Atmosphere' : 'Mute Atmosphere'}
          title="Atmospheric Sound"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.45rem 0.6rem',
            background: 'rgba(22, 20, 38, 0.65)',
            border: '1px solid var(--color-aged-bronze)',
            color: 'var(--color-warm-ivory)',
            cursor: 'pointer',
          }}
        >
          {isAudioMuted ? (
            <VolumeX size={14} color="var(--color-parchment-muted)" />
          ) : (
            <Volume2 size={14} color="var(--color-amber-light)" />
          )}
        </button>

        <a
          href={VERIFIED_LINKS.OFFICIAL_PORTAL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.45rem 0.85rem',
            background: 'var(--color-antique-brass)',
            border: '1px solid var(--color-amber-light)',
            color: 'var(--color-deep-ink)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-mono)',
            fontWeight: 600,
            textDecoration: 'none',
            letterSpacing: '0.06em',
            cursor: 'pointer',
          }}
        >
          <span>TECHFEST.ORG</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </header>
  );
}
