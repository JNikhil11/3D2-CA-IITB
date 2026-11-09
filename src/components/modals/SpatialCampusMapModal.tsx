import { useState } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { CAMPUS_LANDMARKS } from '../../data/worldsContent';
import { VERIFIED_LINKS, INSTITUTIONAL_DISCLOSURE } from '../../data/verifiedTechfestLinks';
import { X, ExternalLink, Compass } from 'lucide-react';

export function SpatialCampusMapModal() {
  const { isMapOpen, setIsMapOpen } = useUIStore();
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string>(CAMPUS_LANDMARKS[0].id);

  if (!isMapOpen) return null;

  const activeLandmark = CAMPUS_LANDMARKS.find((l) => l.id === selectedLandmarkId) ?? CAMPUS_LANDMARKS[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Spatial Campus Orientation Map"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-modals)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(8, 9, 15, 0.88)',
        backdropFilter: 'blur(16px)',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 'min(880px, 95vw)',
          maxHeight: '90vh',
          background: 'var(--surface-vellum)',
          border: '1px solid var(--color-antique-brass)',
          clipPath: 'var(--clip-chamfer-panel)',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem',
          color: 'var(--color-warm-ivory)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.85)',
          overflowY: 'auto',
        }}
      >
        {/* Top Modal Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(200, 157, 84, 0.25)',
            paddingBottom: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Compass size={22} color="var(--color-amber-light)" />
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-mono)',
                  color: 'var(--color-amber-light)',
                  letterSpacing: '0.12em',
                }}
              >
                SPATIAL ORIENTATION MAP // POWAI, MUMBAI
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-h2)',
                  fontWeight: 400,
                  margin: '0.2rem 0 0 0',
                }}
              >
                IIT Bombay Conceptual Festival Nexus
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsMapOpen(false)}
            aria-label="Close Map"
            style={{
              background: 'transparent',
              border: '1px solid rgba(200, 157, 84, 0.3)',
              color: 'var(--color-warm-ivory)',
              padding: '0.4rem',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Columns: Landmark List & Blueprint Detail */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          {/* Landmark Selector */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-parchment-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '0.6rem',
              }}
            >
              FESTIVAL ZONES & LANDMARKS:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {CAMPUS_LANDMARKS.map((landmark) => {
                const isSelected = selectedLandmarkId === landmark.id;
                return (
                  <button
                    key={landmark.id}
                    onClick={() => setSelectedLandmarkId(landmark.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: isSelected ? 'rgba(200, 157, 84, 0.22)' : 'rgba(22, 20, 38, 0.55)',
                      border: isSelected
                        ? '1px solid var(--color-amber-light)'
                        : '1px solid rgba(200, 157, 84, 0.2)',
                      borderRadius: '2px',
                      color: isSelected ? 'var(--color-amber-light)' : 'var(--color-warm-ivory)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-mono)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{landmark.name}</div>
                      <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{landmark.code}</div>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-parchment-muted)' }}>
                      {landmark.coordinates}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Landmark Blueprint Card */}
          <div
            style={{
              padding: '1.25rem',
              background: 'rgba(14, 15, 24, 0.75)',
              border: '1px solid rgba(200, 157, 84, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-mono)',
                  color: 'var(--color-antique-brass)',
                  marginBottom: '0.4rem',
                }}
              >
                {activeLandmark.code} // {activeLandmark.coordinates}
              </div>
              <h4
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-h2)',
                  fontWeight: 400,
                  margin: '0 0 0.75rem 0',
                }}
              >
                {activeLandmark.name}
              </h4>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-body)',
                  lineHeight: 1.6,
                  color: 'var(--color-parchment-muted)',
                  margin: 0,
                }}
              >
                {activeLandmark.description}
              </p>
            </div>

            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-parchment-muted)', marginBottom: '0.5rem' }}>
                OFFICIAL FESTIVAL DIRECTORY:
              </div>
              <a
                href={VERIFIED_LINKS.OFFICIAL_PORTAL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: 'var(--color-amber-light)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-mono)',
                  textDecoration: 'none',
                }}
              >
                <span>Explore Official Techfest Schedule on techfest.org</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--color-parchment-muted)',
            lineHeight: 1.5,
            paddingTop: '1rem',
            borderTop: '1px solid rgba(200, 157, 84, 0.2)',
          }}
        >
          {INSTITUTIONAL_DISCLOSURE.statement}
        </div>
      </div>
    </div>
  );
}
