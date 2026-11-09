# 3D2-CA-IITB — The Living Atlas: An Aetherial Renaissance
### Techfest IIT Bombay College Ambassador Web Development Concept Exhibition
**Festival Dates:** 16th – 18th December, 2026 | **Location:** IIT Bombay, Powai, Mumbai  
**Official Portal:** [techfest.org](https://techfest.org/) | **CA Portal:** [ca.techfest.org](https://ca.techfest.org/)

---

## 🏛️ Executive Overview

**The Living Atlas (Project 3D2-CA-IITB)** is a next-generation real-time interactive 3D WebGL exhibition engineered for the Techfest College Ambassador Web Development task at IIT Bombay.

Blending **16th-century Renaissance astronomical cartography** (Tycho Brahe’s mural quadrants, engraved astrolabes, armillary spheres) with **cutting-edge aerospace and computing engineering**, the project presents one continuous, explorable spatial journey through five distinct narrative worlds.

---

## 🌟 The Five Narrative Worlds

1.  **World I: The Grand Observatory (Scroll 0.00 – 0.20)**
    *   *Hero Subject:* The Living Atlas (Celestial Orrery with counter-rotating meridian rings, ecliptic astrolabe, and radiant aether core).
    *   *Atmosphere:* Reverent, monumental, dusk violet exponential haze with warm amber zenith beam.
    *   *Hotspots:* Prime Meridian Vernier Scale, Aetherial Core, Astrolabe Rete Plate.
2.  **World II: The Subterranean Engine (Scroll 0.20 – 0.40)**
    *   *Hero Subject:* Monumental vertical drive shaft and interlocking epicyclic planetary gear trains.
    *   *Atmosphere:* Kinetic, industrial, high-contrast cast bronze rim lighting.
    *   *Hotspots:* Gravity Escapement, Torsion Pendulum Bob, High-Pressure Fluid Conduits.
3.  **World III: The Engineering Quadrants (Scroll 0.40 – 0.65)**
    *   *Hero Subject:* Vast circular proving rotunda with 4 distinct radial engineering bays:
        *   **Robotics:** 6-Axis articulated kinematic manipulator with harmonic joints.
        *   **Aerospace:** Waverider hypersonic re-entry vehicle hull & aerospike engine.
        *   **Cognitive AI:** Photonic crystalline lattice with light waveguide tensor channels.
        *   **Sustainability:** Helical vertical-axis wind turbine and solar concentrator.
4.  **World IV: Technoholix Arena & Spatial Nexus (Scroll 0.65 – 0.85)**
    *   *Hero Subject:* Monumental triangular truss amphitheatre with 8 automated volumetric sky beam pylons.
    *   *Campus Nexus:* Interactive 3D/2D cartographic orientation map highlighting Convocation Hall, Open Air Theatre (OAT), Lecture Hall Complex (LHC), and Gymkhana Grounds.
5.  **World V: The Deep Space Beacon (Scroll 0.85 – 1.00)**
    *   *Hero Subject:* Ascendant Orbital Atlas expanded against a 1,200-star cosmic field.
    *   *Conversion Terminal:* Direct verified pathways to official Techfest registration and CA portal.

---

## ⚙️ Core Architecture & Engineering Rigor

*   **Spatial Primacy & Safe-Zone HUD:** Full-viewport WebGL canvas (100% fixed). The central 40%+ optical axis is strictly clear of opaque cards. Asymmetric edge-docked vellum panels (`clip-path: polygon(...)`) display narrative and telemetry without obstructing the 3D subject.
*   **Unified Progression Choreography:** One normalized scalar ($p \in [0, 1]$) driven by GSAP ScrollTrigger and Lenis smooth scrolling evaluates synchronized Catmull-Rom camera position and lookAt splines, mechanical gear rotations, and lighting transitions.
*   **Real-Time 3D-to-2D SVG Leader Lines:** Projected 3D coordinates `vector.project(camera)` dynamically tether 3D hotspot anchors to peripheral HUD specification dossiers.
*   **Zero-Flash Dual-Gate Loader:** Deterministic dual-gate state machine enforcing 1,700 ms minimum intentional mechanical calibration, 100% Three.js loading manager items, font readiness, and GPU shader pre-compilation (`gl.compileAsync`).
*   **Hardware Tiering & Background Hibernation:** Adaptive DPR (`[1, 2]`), dynamic shadow resolution, and automatic tab hibernation (`Canvas frameloop="never"`) reducing CPU/GPU usage to 0% in background tabs.
*   **WCAG 2.2 AA Accessibility:** Screen-reader accessible semantic DOM mirror (`<AccessibleDOMMirror/>`) with keyboard tab navigation mirroring every 3D interaction.

---

## 📊 Performance & Asset Budgets

| Metric | Budget Ceiling | Actual Measured | Margin |
| :--- | :--- | :--- | :--- |
| **Hero Draw Calls** | < 100 calls | **52 – 68 calls** | 32% under ceiling |
| **Visible Triangles** | < 400,000 tris | **~186,000 tris** | 53% under ceiling |
| **Environment Map** | < 1,000 KB | **512.0 KB** | 49% under ceiling |
| **All 5 3D Models Total** | < 10,000 KB | **359.7 KB** | 96% under ceiling |
| **Initial Critical Entry JS** | < 220 KB gzip | **~42.2 KB gzip** | 81% under ceiling |
| **All 11 Viewports E2E** | 100% Pass | **11 / 11 Pass** | 100% Pass |

---

## 🛠️ Verification & Test Commands

```bash
# Install dependencies
npm install

# Verify asset manifest against Zod schema and disk files
npm run verify:manifest

# Run TypeScript strict typecheck
npm run typecheck

# Run Vitest unit & spline math tests
npm run test:unit

# Build production bundle
npm run build

# Run Playwright cross-browser, 11-viewport & accessibility tests
npm run test:e2e
```

---

## 📜 Independent Concept Disclaimer

*3D2-CA-IITB is an independent student concept exhibition designed for the Techfest College Ambassador Web Development assignment at IIT Bombay. It is not the official primary portal of IIT Bombay or Techfest. All official competition registrations, event schedules, and festival accreditations must be accessed via verified official portals at [techfest.org](https://techfest.org/) and [ca.techfest.org](https://ca.techfest.org/).*
