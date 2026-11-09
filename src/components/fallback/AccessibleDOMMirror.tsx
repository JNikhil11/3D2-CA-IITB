import { WORLDS_DATA } from '../../data/worldsContent';
import { useUIStore } from '../../store/useUIStore';
import { VERIFIED_LINKS, INSTITUTIONAL_DISCLOSURE } from '../../data/verifiedTechfestLinks';

export function AccessibleDOMMirror() {
  const { setActiveWorldIndex, setInspectedHotspotId } = useUIStore();

  return (
    <main id="accessible-main-content" className="sr-only" aria-label="Screen Reader Exhibition Mirror">
        <h1>The Living Atlas: Aetherial Renaissance — Techfest IIT Bombay</h1>
        <p>{INSTITUTIONAL_DISCLOSURE.statement}</p>
        <p>Location: {INSTITUTIONAL_DISCLOSURE.location}</p>
        <p>Official Dates: {INSTITUTIONAL_DISCLOSURE.officialDates}</p>

        <nav aria-label="Exhibition Chapters">
          <ul>
            {WORLDS_DATA.map((world, idx) => (
              <li key={world.id}>
                <button
                  onClick={() => setActiveWorldIndex(idx)}
                  aria-label={`Jump to World ${world.romanNumeral}: ${world.title}`}
                >
                  World {world.romanNumeral}: {world.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {WORLDS_DATA.map((world, idx) => (
          <section key={world.id} aria-labelledby={`world-heading-${world.id}`}>
            <h2 id={`world-heading-${world.id}`}>
              World {world.romanNumeral}: {world.title} ({world.tagline})
            </h2>
            <blockquote>{world.editorialQuote}</blockquote>
            <p>{world.narrativeBody}</p>

            <h3>Interactive Hotspots in {world.title}</h3>
            <ul>
              {world.hotspots.map((hotspot) => (
                <li key={hotspot.id}>
                  <h4>{hotspot.title} ({hotspot.subtitle})</h4>
                  <p>{hotspot.description}</p>
                  <button
                    onClick={() => {
                      setActiveWorldIndex(idx);
                      setInspectedHotspotId(hotspot.id);
                    }}
                    aria-label={`Inspect ${hotspot.title} 3D model`}
                  >
                    {hotspot.actionLabel}: {hotspot.title}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <footer>
          <p>{INSTITUTIONAL_DISCLOSURE.statement}</p>
          <a href={VERIFIED_LINKS.OFFICIAL_PORTAL}>Techfest Official Portal</a>
          <a href={VERIFIED_LINKS.CA_PORTAL}>College Ambassador Portal</a>
          <a href={VERIFIED_LINKS.CA_WEB_DEV_TASK}>Web Development Task</a>
        </footer>
    </main>
  );
}
