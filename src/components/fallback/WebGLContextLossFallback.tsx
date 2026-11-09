import { WORLDS_DATA } from '../../data/worldsContent';
import { VERIFIED_LINKS, INSTITUTIONAL_DISCLOSURE } from '../../data/verifiedTechfestLinks';
import { RotateCcw, ExternalLink, AlertTriangle } from 'lucide-react';

export function WebGLContextLossFallback() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--color-deep-ink)',
        color: 'var(--color-warm-ivory)',
        padding: '3rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ maxWidth: '840px', width: '100%' }}>
        {/* Status Banner */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.6rem 1.2rem',
            background: 'rgba(201, 59, 43, 0.15)',
            border: '1px solid var(--color-vermilion)',
            color: 'var(--color-vermilion)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-mono)',
            marginBottom: '2rem',
          }}
        >
          <AlertTriangle size={16} />
          <span>HARDWARE GRAPHICS FALLBACK ACTIVE // WEBGL PAUSED</span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-hero)',
            fontWeight: 400,
            lineHeight: 1.0,
            margin: '0 0 1rem 0',
          }}
        >
          The Living Atlas
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-mono)',
            color: 'var(--color-parchment-muted)',
            marginBottom: '2rem',
          }}
        >
          EDITORIAL BLUEPRINT EXHIBITION // TECHFEST IIT BOMBAY
        </p>

        <button
          onClick={handleReload}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            background: 'var(--color-antique-brass)',
            color: 'var(--color-deep-ink)',
            border: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-mono)',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '3rem',
          }}
        >
          <RotateCcw size={15} />
          <span>ATTEMPT HARDWARE GRAPHICS RELOAD</span>
        </button>

        {/* Narrative Chapters in Blueprint Format */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {WORLDS_DATA.map((w) => (
            <section
              key={w.id}
              style={{
                padding: '2rem',
                background: 'var(--surface-vellum)',
                border: '1px solid var(--color-aged-bronze)',
                clipPath: 'var(--clip-chamfer-panel)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--color-amber-light)',
                  marginBottom: '0.5rem',
                }}
              >
                CANTO {w.romanNumeral} // {w.heroFocus}
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-h1)',
                  margin: '0 0 0.8rem 0',
                }}
              >
                {w.title}
              </h2>
              <blockquote
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: 'var(--text-h3)',
                  color: 'var(--color-antique-brass)',
                  borderLeft: '2px solid var(--color-antique-brass)',
                  paddingLeft: '0.8rem',
                  margin: '0 0 1rem 0',
                }}
              >
                “{w.editorialQuote}”
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
                {w.narrativeBody}
              </p>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-parchment-muted)', marginBottom: '0.5rem' }}>
                  TELEMETRY NODES:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {w.hotspots.map((h) => (
                    <span
                      key={h.id}
                      style={{
                        padding: '0.35rem 0.65rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(200, 157, 84, 0.3)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'var(--color-warm-ivory)',
                      }}
                    >
                      {h.title}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Outbound Portals */}
        <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a
            href={VERIFIED_LINKS.OFFICIAL_PORTAL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--color-antique-brass)',
              color: 'var(--color-deep-ink)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-mono)',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>OFFICIAL TECHFEST PORTAL</span>
            <ExternalLink size={15} />
          </a>

          <a
            href={VERIFIED_LINKS.CA_PORTAL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: '1px solid var(--color-antique-brass)',
              color: 'var(--color-warm-ivory)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-mono)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>COLLEGE AMBASSADOR PROGRAMME</span>
            <ExternalLink size={15} />
          </a>
        </div>

        <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(200, 157, 84, 0.2)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-parchment-muted)' }}>
          {INSTITUTIONAL_DISCLOSURE.statement}
        </footer>
      </div>
    </main>
  );
}
