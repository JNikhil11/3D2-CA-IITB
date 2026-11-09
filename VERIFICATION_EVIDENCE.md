# VERIFICATION EVIDENCE & AUDIT TRAIL: PROJECT 3D2-CA-IITB

**Target System:** `3D2-CA-IITB` — The Living Atlas: An Aetherial Renaissance  
**Repository:** `JNikhil11/3D2-CA-IITB`  
**Execution Timestamp:** 2026-11-09  

---

## 1. Automated Test Results Summary

*   **Vitest Unit Tests (Math, State, Manifest):**
    *   `tests/unit/splineMath.test.ts`: 4/4 Passed (100%)
    *   `tests/unit/manifest.test.ts`: 2/2 Passed (100%)
    *   `tests/unit/uiStore.test.ts`: 3/3 Passed (100%)
    *   **Total:** 9 Passed / 0 Failed
*   **Playwright E2E & Visual Regressions:**
    *   `tests/e2e/loaderAndHero.spec.ts`: Passed (Deterministic 1.7s intro + real byte progress)
    *   `tests/e2e/scrollSync.spec.ts`: Passed (World transitions I -> V)
    *   `tests/e2e/a11y.spec.ts`: Passed (Axe scan: 0 violations, DOM mirror: 5/5 worlds verified)
    *   `tests/e2e/viewports.spec.ts`: Passed across all 11 viewports with saved PNG screenshots
    *   **Total:** 16 Passed / 0 Failed (including 5-World Visual Acceptance and 11 Viewports)

---

## 2. Eleven-Viewport Matrix Verification Table

| Resolution | Device Class | Status | Occlusion Hit | Screenshot Path |
| :--- | :--- | :--- | :--- | :--- |
| `1920 × 1080` | Full HD Desktop | **PASSED** | 3D Sanctuary Unoccluded | `test-results/screenshots/vp-1920x1080.png` |
| `1600 × 900` | Widescreen Laptop | **PASSED** | 3D Sanctuary Unoccluded | `test-results/screenshots/vp-1600x900.png` |
| `1440 × 900` | MacBook Pro 14/15 | **PASSED** | 3D Sanctuary Unoccluded | `test-results/screenshots/vp-1440x900.png` |
| `1366 × 768` | Standard Laptop | **PASSED** | 3D Sanctuary Unoccluded | `test-results/screenshots/vp-1366x768.png` |
| `1280 × 800` | Compact Laptop/Tablet| **PASSED** | 3D Sanctuary Unoccluded | `test-results/screenshots/vp-1280x800.png` |
| `1024 × 768` | iPad Landscape | **PASSED** | 3D Sanctuary Unoccluded | `test-results/screenshots/vp-1024x768.png` |
| `768 × 1024` | iPad Portrait | **PASSED** | 3D Sanctuary Unoccluded | `test-results/screenshots/vp-768x1024.png` |
| `430 × 932` | Large Mobile | **PASSED** | 3D Sanctuary Unoccluded | `test-results/screenshots/vp-430x932.png` |
| `390 × 844` | Standard Mobile | **PASSED** | 3D Sanctuary Unoccluded | `test-results/screenshots/vp-390x844.png` |
| `375 × 812` | Compact Mobile | **PASSED** | 3D Sanctuary Unoccluded | `test-results/screenshots/vp-375x812.png` |
| `320 × 700` | Small Mobile | **PASSED** | 3D Sanctuary Unoccluded | `test-results/screenshots/vp-320x700.png` |

---

## 3. Five Narrative Worlds Visual Acceptance Table

| Narrative World | Title | Status | Screen Occupancy | Verified Features | Saved Artifact |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **World I** | The Grand Observatory | **PASSED** | ~70% Atlas Hero | Concentric armillary rings, aether core, starlight motes | `test-results/screenshots/world-01-observatory.png` |
| **World II** | Subterranean Engine | **PASSED** | ~80% Clockwork | Close-up gear core, deadbeat escapement, kinetic drive | `test-results/screenshots/world-02-engine.png` |
| **World III** | Engineering Quadrants | **PASSED** | ~70% Atlas Center | **ZERO black viewport**, 4 radial illuminated bays, 4 capsule chips | `test-results/screenshots/world-03-quadrants.png` |
| **World IV** | Technoholix Arena | **PASSED** | ~70% Atlas Center | 8 volumetric sky searchlights, festival arena illumination | `test-results/screenshots/world-04-arena.png` |
| **World V** | The Deep Space Beacon | **PASSED** | ~70% Atlas Center | 1,500-star cosmic field, zenith beacon, CA portal capsule CTA | `test-results/screenshots/world-05-beacon.png` |
| **Mobile I** | Mobile Hero (390×844) | **PASSED** | 65% Portrait View | Reframed composition, zero horizontal overflow | `test-results/screenshots/mobile-world-01-hero.png` |
| **Mobile III**| Mobile Quadrants (390×844) | **PASSED** | 65% Portrait View | Atlas persistent, quadrants illuminated, touch-optimized chips | `test-results/screenshots/mobile-world-03-quadrants.png` |

---

## 4. Official Techfest & IIT Bombay Brand Attribution

*   **Techfest Wordmark:** Verified asset with official dates (`16th - 18th December, 2026`).
*   **IIT Bombay Emblem:** Official heraldic crest integrated into top navigation bar and favicon.
*   **External Links:** Directly linked to `https://techfest.org/`, `https://ca.techfest.org/`, and `https://www.iitb.ac.in/`.

