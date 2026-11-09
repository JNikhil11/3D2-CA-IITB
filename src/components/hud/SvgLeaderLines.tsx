import { useEffect, useState } from 'react';
import { sceneTransientStore } from '../../store/sceneTransientStore';
import { useUIStore } from '../../store/useUIStore';
import { WORLDS_DATA } from '../../data/worldsContent';

export function SvgLeaderLines() {
  const { activeWorldIndex, inspectedHotspotId, setInspectedHotspotId } = useUIStore();
  const [coords, setCoords] = useState<Record<string, { x: number; y: number; visible: boolean }>>({});

  useEffect(() => {
    let animId: number;
    const tick = () => {
      setCoords({ ...sceneTransientStore.hotspotScreenCoords });
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const currentWorld = WORLDS_DATA[activeWorldIndex] ?? WORLDS_DATA[0];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-svg-lines)',
        pointerEvents: 'none',
      }}
    >
      <svg
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {currentWorld.hotspots.map((h) => {
          const c = coords[h.id];
          if (!c || !c.visible) return null;

          const isInspected = inspectedHotspotId === h.id;
          const x = c.x;
          const y = c.y;

          // Compute elbow path: 45 deg diagonal, then horizontal line
          const elbowX = x + 36;
          const elbowY = y - 36;
          const endX = x + 120;
          const endY = elbowY;

          return (
            <g key={h.id} style={{ opacity: isInspected ? 1.0 : 0.85 }}>
              {/* Leader Polyline */}
              <polyline
                points={`${x},${y} ${elbowX},${elbowY} ${endX},${endY}`}
                fill="none"
                stroke={isInspected ? 'var(--color-amber-light)' : 'var(--color-antique-brass)'}
                strokeWidth={isInspected ? '1.8' : '1.2'}
                strokeDasharray={isInspected ? 'none' : '4,2'}
                filter="url(#glow)"
              />

              {/* Anchor Reticle Circle */}
              <circle
                cx={x}
                cy={y}
                r={isInspected ? 6 : 4}
                fill={isInspected ? 'var(--color-amber-light)' : 'var(--color-antique-brass)'}
              />
              <circle
                cx={x}
                cy={y}
                r={isInspected ? 14 : 9}
                fill="none"
                stroke={isInspected ? 'var(--color-amber-light)' : 'rgba(200, 157, 84, 0.4)'}
                strokeWidth="1"
              />

              {/* Callout End Tag */}
              <circle cx={endX} cy={endY} r="3" fill="var(--color-warm-ivory)" />
            </g>
          );
        })}
      </svg>

      {/* Interactive Floating Hotspot Marker Pills */}
      {currentWorld.hotspots.map((h) => {
        const c = coords[h.id];
        if (!c || !c.visible) return null;

        const isInspected = inspectedHotspotId === h.id;
        const x = c.x;
        const y = c.y;

        return (
          <button
            key={h.id}
            onClick={() => setInspectedHotspotId(isInspected ? null : h.id)}
            style={{
              position: 'absolute',
              left: `${x + 125}px`,
              top: `${y - 48}px`,
              transform: 'translateY(-50%)',
              pointerEvents: 'auto',
              background: isInspected ? 'rgba(242, 169, 59, 0.25)' : 'rgba(14, 15, 24, 0.85)',
              border: isInspected
                ? '1px solid var(--color-amber-light)'
                : '1px solid rgba(200, 157, 84, 0.4)',
              borderRadius: '2px',
              padding: '0.25rem 0.5rem',
              color: isInspected ? 'var(--color-amber-light)' : 'var(--color-warm-ivory)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              transition: 'all 0.2s ease',
            }}
          >
            {h.title}
          </button>
        );
      })}
    </div>
  );
}
