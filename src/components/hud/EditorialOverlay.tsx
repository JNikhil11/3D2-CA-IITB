import { useUIStore } from '../../store/useUIStore';
import { WORLDS_DATA } from '../../data/worldsContent';
import { VERIFIED_LINKS } from '../../data/verifiedTechfestLinks';
import { Sparkles, ArrowRight } from 'lucide-react';

export function EditorialOverlay() {
  const {
    activeWorldIndex,
    selectedQuadrant,
    setSelectedQuadrant,
  } = useUIStore();

  const currentWorld = WORLDS_DATA[activeWorldIndex] ?? WORLDS_DATA[0];

  return (
    <div
      className="editorial-overlay"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 'clamp(1.5rem, 4.5vh, 3.5rem)',
        zIndex: 'var(--z-hud-panels)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 clamp(1.2rem, 4vw, 2.5rem)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          maxWidth: '720px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Subtle Ethereal Kicker */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-mono)',
            color: 'var(--color-amber-light)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: '0.4rem',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          }}
        >
          <Sparkles size={12} color="var(--color-amber-light)" />
          <span>{currentWorld.tagline}</span>
        </div>

        {/* Large, Elegant Chapter Heading (Instrument Serif) */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-h1)',
            fontWeight: 400,
            lineHeight: 1.08,
            color: 'var(--color-warm-ivory)',
            letterSpacing: '-0.01em',
            margin: '0 0 0.6rem 0',
            textShadow: '0 4px 24px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)',
          }}
        >
          {currentWorld.title}
        </h1>

        {/* Concise Supporting Copy (~25-40 words) with Balanced Line Lengths */}
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-body)',
            lineHeight: 1.6,
            color: 'rgba(244, 239, 230, 0.88)',
            margin: '0 0 1.0rem 0',
            maxWidth: '640px',
            textShadow: '0 2px 14px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.9)',
          }}
        >
          {currentWorld.editorialQuote}
        </p>

        {/* World III: Interactive Quadrant Translucent Capsule Chips */}
        {activeWorldIndex === 2 && currentWorld.quadrants && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.2rem',
              pointerEvents: 'auto',
            }}
          >
            {currentWorld.quadrants.map((q) => {
              const isSelected = selectedQuadrant === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuadrant(q.id as any)}
                  aria-label={`Select ${q.title} Quadrant`}
                  className="capsule-button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    background: isSelected ? 'rgba(200, 157, 84, 0.35)' : 'rgba(8, 9, 15, 0.45)',
                    border: isSelected
                      ? `1px solid ${q.accentColor}`
                      : '1px solid rgba(200, 157, 84, 0.22)',
                    backdropFilter: 'blur(10px)',
                    color: isSelected ? 'var(--color-warm-ivory)' : 'var(--color-parchment-muted)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-mono)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: q.accentColor,
                    }}
                  />
                  <span>{q.title.split('&')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* World V: Official College Ambassador Registration CTA */}
        {activeWorldIndex === 4 && (
          <div style={{ marginTop: '0.4rem', pointerEvents: 'auto' }}>
            <a
              href={VERIFIED_LINKS.CA_PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className="capsule-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1.4rem',
                borderRadius: '9999px',
                background: 'rgba(242, 169, 59, 0.22)',
                border: '1px solid var(--color-amber-light)',
                backdropFilter: 'blur(10px)',
                color: 'var(--color-warm-ivory)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-mono)',
                letterSpacing: '0.08em',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              <span>REGISTER AS COLLEGE AMBASSADOR</span>
              <ArrowRight size={13} color="var(--color-amber-light)" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
