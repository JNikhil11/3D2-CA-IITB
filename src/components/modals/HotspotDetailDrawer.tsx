import { useUIStore } from '../../store/useUIStore';
import { WORLDS_DATA } from '../../data/worldsContent';
import { VERIFIED_LINKS } from '../../data/verifiedTechfestLinks';
import { X, ExternalLink, ArrowLeft } from 'lucide-react';

export function HotspotDetailDrawer() {
  const { inspectedHotspotId, setInspectedHotspotId } = useUIStore();

  if (!inspectedHotspotId) return null;

  const hotspot = WORLDS_DATA.flatMap((w) => w.hotspots).find((h) => h.id === inspectedHotspotId);
  if (!hotspot) return null;

  return (
    <aside
      aria-label="Hotspot Detail Drawer"
      style={{
        position: 'fixed',
        top: 'calc(var(--hud-top-height) + 1rem)',
        right: '1.5rem',
        bottom: 'calc(var(--hud-bottom-height) + 1rem)',
        width: 'min(380px, 90vw)',
        zIndex: 'var(--z-hud-floating)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.75rem',
        background: 'var(--surface-vellum)',
        border: 'var(--border-vellum-active)',
        clipPath: 'var(--clip-chamfer-panel)',
        backdropFilter: 'blur(16px)',
        color: 'var(--color-warm-ivory)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
        overflowY: 'auto',
      }}
    >
      {/* Header with Close */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-mono)',
              color: 'var(--color-amber-light)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            SPECIFICATION DOSSIER
          </span>
          <button
            onClick={() => setInspectedHotspotId(null)}
            aria-label="Close Specification Drawer"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-parchment-muted)',
              cursor: 'pointer',
              padding: '0.2rem',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-h2)',
            fontWeight: 400,
            margin: '0 0 0.25rem 0',
          }}
        >
          {hotspot.title}
        </h3>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-mono)',
            color: 'var(--color-antique-brass)',
            marginBottom: '1rem',
          }}
        >
          {hotspot.subtitle}
        </div>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-body)',
            lineHeight: 1.6,
            color: 'var(--color-parchment-muted)',
            marginBottom: '1.5rem',
          }}
        >
          {hotspot.description}
        </p>

        {/* Technical Specifications Table */}
        {hotspot.technicalSpec && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-parchment-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderBottom: '1px solid rgba(200, 157, 84, 0.25)',
                paddingBottom: '0.4rem',
                marginBottom: '0.6rem',
              }}
            >
              MECHANICAL & OPTICAL TELEMETRY:
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
              <tbody>
                {Object.entries(hotspot.technicalSpec).map(([key, val]) => (
                  <tr key={key} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '0.4rem 0', color: 'var(--color-parchment-muted)' }}>{key}</td>
                    <td style={{ padding: '0.4rem 0', textAlign: 'right', color: 'var(--color-warm-ivory)' }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
        <button
          onClick={() => setInspectedHotspotId(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.65rem',
            background: 'rgba(22, 20, 38, 0.85)',
            border: '1px solid var(--color-antique-brass)',
            color: 'var(--color-warm-ivory)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-mono)',
            letterSpacing: '0.08em',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={14} />
          <span>RETURN TO ORBIT</span>
        </button>

        <a
          href={VERIFIED_LINKS.CA_PORTAL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.65rem',
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
          <span>OFFICIAL CA PORTAL</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </aside>
  );
}
