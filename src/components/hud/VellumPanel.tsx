import { useUIStore } from '../../store/useUIStore';
import { WORLDS_DATA } from '../../data/worldsContent';
import { Sparkles, ChevronRight } from 'lucide-react';

export function VellumPanel() {
  const {
    activeWorldIndex,
    selectedQuadrant,
    setSelectedQuadrant,
    setInspectedHotspotId,
  } = useUIStore();

  const currentWorld = WORLDS_DATA[activeWorldIndex] ?? WORLDS_DATA[0];

  return (
    <aside
      aria-label="Editorial Narrative & World Telemetry"
      className="hud-vellum-panel"
      style={{
        position: 'fixed',
        left: '2rem',
        top: 'calc(var(--hud-top-height) + 1.5rem)',
        bottom: 'calc(var(--hud-bottom-height) + 1.5rem)',
        width: 'min(420px, var(--hud-left-max-width))',
        zIndex: 'var(--z-hud-panels)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.75rem',
        background: 'var(--surface-vellum)',
        border: 'var(--border-vellum)',
        clipPath: 'var(--clip-chamfer-panel)',
        backdropFilter: 'blur(12px)',
        color: 'var(--color-warm-ivory)',
        pointerEvents: 'auto',
        overflowY: 'auto',
      }}
    >
      {/* Top Registration Crosshairs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.4, marginBottom: '0.5rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>+ 19.1334° N</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>72.9133° E +</span>
      </div>

      {/* Main Narrative Content */}
      <div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-mono)',
            color: 'var(--color-amber-light)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '0.4rem',
          }}
        >
          <Sparkles size={13} />
          <span>CANTO {currentWorld.romanNumeral} // {currentWorld.tagline}</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-h1)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.015em',
            margin: '0 0 1rem 0',
            color: 'var(--color-warm-ivory)',
          }}
        >
          {currentWorld.title}
        </h2>

        <blockquote
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'var(--text-h3)',
            lineHeight: 1.3,
            color: 'var(--color-antique-brass)',
            margin: '0 0 1.25rem 0',
            paddingLeft: '0.75rem',
            borderLeft: '2px solid var(--color-antique-brass)',
          }}
        >
          “{currentWorld.editorialQuote}”
        </blockquote>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-body)',
            lineHeight: 1.6,
            color: 'var(--color-parchment-muted)',
            margin: '0 0 1.5rem 0',
          }}
        >
          {currentWorld.narrativeBody}
        </p>

        {/* World 03: Four Quadrants Interactive Selector */}
        {currentWorld.quadrants && (
          <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-mono)',
                color: 'var(--color-antique-brass)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '0.6rem',
              }}
            >
              ENGINEERING QUADRANTS:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              {currentWorld.quadrants.map((quad) => {
                const isSelected = selectedQuadrant === quad.id;
                return (
                  <button
                    key={quad.id}
                    onClick={() => {
                      setSelectedQuadrant(quad.id);
                      if (quad.id === 'robotics') setInspectedHotspotId('robotics-arm');
                      if (quad.id === 'aerospace') setInspectedHotspotId('aerospace-vehicle');
                      if (quad.id === 'cognitive') setInspectedHotspotId('cognitive-lattice');
                      if (quad.id === 'sustainability') setInspectedHotspotId('sustainability-turbine');
                    }}
                    style={{
                      padding: '0.5rem 0.6rem',
                      background: isSelected ? 'rgba(200, 157, 84, 0.25)' : 'rgba(16, 17, 26, 0.7)',
                      border: isSelected
                        ? '1px solid var(--color-amber-light)'
                        : '1px solid rgba(200, 157, 84, 0.25)',
                      borderRadius: '2px',
                      color: isSelected ? 'var(--color-amber-light)' : 'var(--color-parchment-muted)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-mono)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{quad.title.split(' ')[0]}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{quad.keyMetrics[0]?.value}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Hotspots Quick Action List */}
      <div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-mono)',
            color: 'var(--color-parchment-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}
        >
          INTERACTIVE TELEMETRY NODES:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {currentWorld.hotspots.map((h) => (
            <button
              key={h.id}
              onClick={() => setInspectedHotspotId(h.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.75rem',
                background: 'rgba(22, 20, 38, 0.55)',
                border: '1px solid rgba(200, 157, 84, 0.25)',
                color: 'var(--color-warm-ivory)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-mono)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{h.title}</span>
              <ChevronRight size={14} color="var(--color-antique-brass)" />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
