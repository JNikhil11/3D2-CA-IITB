# THIRD-PARTY SOFTWARE AND ASSET NOTICES

This document details all open-source libraries, procedural assets, fonts, and conceptual reference repositories utilized within **Project 3D2-CA-IITB (The Living Atlas: An Aetherial Renaissance)**.

---

## 1. Verified Software Libraries & Frameworks

| # | Package Name | Verified License | Official Repository / Reference | Permitted Usage & Scope |
| :--- | :--- | :--- | :--- | :--- |
| 01 | **React & React DOM** | MIT License | `github.com/facebook/react` | Core UI component lifecycle and DOM mirror |
| 02 | **TypeScript** | Apache-2.0 | `github.com/microsoft/TypeScript` | Strict static type verification |
| 03 | **Vite** | MIT License | `github.com/vitejs/vite` | ES module dev server & Rollup production bundler |
| 04 | **Three.js** | MIT License | `github.com/mrdoob/three.js` | Core WebGL 3D rendering engine, Catmull-Rom splines, PBR materials |
| 05 | **@react-three/fiber** | MIT License | `github.com/pmndrs/react-three-fiber` | Declarative React reconciler for Three.js render loop |
| 06 | **@react-three/drei** | MIT License | `github.com/pmndrs/drei` | `useGLTF`, `Bvh`, `PerformanceMonitor`, `AdaptiveDpr` helpers |
| 07 | **three-mesh-bvh** | MIT License | `github.com/gkjohnson/three-mesh-bvh` | Sub-millisecond accelerated raycasting for interactive hotspots |
| 08 | **GSAP & ScrollTrigger**| Standard "No Charge" | `gsap.com/docs/v3/Plugins/ScrollTrigger/` | Scrubbed scroll progress mapping |
| 09 | **Lenis** | MIT License | `github.com/darkroomengineering/lenis` | Normalized smooth inertia scrolling synchronized to GSAP ticker |
| 10 | **Zustand** | MIT License | `github.com/pmndrs/zustand` | Transient scene state & discrete UI store |
| 11 | **Zod** | MIT License | `github.com/colinhacks/zod` | Asset manifest and content schema validation |
| 12 | **@gltf-transform/core**| MIT License | `github.com/donmccurdy/glTF-Transform` | Offline CAD model assembly, weld, quantize, and meshopt pipeline |
| 13 | **Meshoptimizer** | MIT License | `github.com/zeux/meshoptimizer` | High-performance vertex/index buffer compression (`EXT_meshopt_compression`) |
| 14 | **Vitest** | MIT License | `github.com/vitest-dev/vitest` | Unit, math, state, and manifest test runner |
| 15 | **Playwright** | Apache-2.0 | `github.com/microsoft/playwright` | Cross-viewport automated E2E and visual verification |
| 16 | **@axe-core/playwright**| MPL-2.0 | `github.com/dequelabs/axe-core-npm` | Automated WCAG 2.2 AA accessibility scanner |

---

## 2. 3D Models & Procedural CAD Geometry

*   **Living Atlas Hero (`atlas-hero.glb`), Grand Observatory Shell (`world01-shell.glb`), Subterranean Engine (`world02-engine.glb`), Engineering Quadrants (`world03-quadrants.glb`), Technoholix Arena (`world04-arena.glb`):**
    *   **Author:** Procedural CAD Script (`scripts/generate-sculpted-atlas.mjs`), Project 3D2-CA-IITB
    *   **License:** MIT License (Zero third-party proprietary meshes copied)
    *   **Architecture:** Custom multi-part beveled geometry, involute gear tooth equations, and PBR metallic-roughness materials.

---

## 3. Environment Maps & Textures

*   **Observatory Zenith Radiance Environment (`observatory-1k.hdr`):**
    *   **Format:** Radiance RGBE 32-bit Run-Length Encoded
    *   **License:** CC0 1.0 Universal (Public Domain)
    *   **Author:** Programmatic Radiance generator (`scripts/generate-sculpted-atlas.mjs`)
    *   **Compressed Size:** 512.0 KB (Completely eliminates historical 6.02 MB bloat).

---

## 4. Typography & Icons

*   **Instrument Serif:** SIL Open Font License 1.1 (`github.com/eldrick/instrument-serif`)
*   **Plus Jakarta Sans:** SIL Open Font License 1.1 (`github.com/tokotype/plus-jakarta-sans`)
*   **IBM Plex Mono:** SIL Open Font License 1.1 (`github.com/ibm/plex`)
*   **Lucide React Icons:** MIT License (`github.com/lucide-icons/lucide`)

---

## 5. Institutional Logos & Visual Identity

*   **Official Techfest Wordmark (`public/assets/brand/techfest-logo.png`):**
    *   Official Techfest IIT Bombay wordmark ("16th - 18th December, 2026") provided for the College Ambassador Web Development assignment.
    *   Property of Techfest, IIT Bombay. Used strictly for institutional attribution and official link routing.
*   **Official IIT Bombay Seal (`public/assets/brand/iitb-crest.png`):**
    *   Official emblem of the Indian Institute of Technology Bombay.
    *   Used strictly for academic and institutional attribution under the College Ambassador assignment mandate.

