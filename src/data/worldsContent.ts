import { WorldContent } from './schema';
import { VERIFIED_LINKS } from './verifiedTechfestLinks';

export const WORLDS_DATA: WorldContent[] = [
  {
    id: 'world-01',
    index: 0,
    title: 'The Grand Observatory',
    romanNumeral: 'I',
    tagline: 'Celestial Orrery & The Living Atlas',
    editorialQuote:
      'Where 16th-century astronomical cartography converges with modern orbital telemetry.',
    narrativeBody:
      'Standing beneath the ribbed ocular vault of the Grand Observatory, the Living Atlas anchors the exhibition. Hand-engraved bronze meridian arcs, counter-rotating astrolabe retes, and a radiant crystalline aether core calibrate Techfest’s enduring scientific legacy at IIT Bombay.',
    scrollRange: [0.0, 0.2],
    heroFocus: 'The Living Atlas (Celestial Orrery)',
    atmosphericTone: 'Reverent, monumental, illuminated by amber zenith starlight.',
    lightingColor: '#F2A93B',
    fogDensity: 0.015,
    hotspots: [
      {
        id: 'meridian-rings',
        title: 'Prime Meridian Arc',
        subtitle: 'Hand-Forged Vernier Scale',
        description:
          'Nested brushed-brass gimbal rings calibrated with astronomical degree etchings. Rotates along the celestial north-south axis to track orbital precession.',
        position: [0.0, 2.2, 0.0],
        inspectionOffset: [2.8, 2.2, 4.5],
        lookAtOffset: [0.0, 2.0, 0.0],
        technicalSpec: {
          Material: 'Anodized Antique Brass (Cu-Zn 85/15)',
          Precision: '0.05 Arc-Minutes Vernier Scale',
          Diameter: '3.60 Meters Outer Gimbal',
          Mass: '840 kg Balanced Counterweight',
        },
        actionLabel: 'Inspect Meridian Arc',
      },
      {
        id: 'aether-core',
        title: 'Aetherial Core',
        subtitle: 'Faceted Refractive Energy Lattice',
        description:
          'A polyhedral optical matrix pulsing with warm amber radiation. Custom Fresnel reflection shaders capture grazing light shafts from the observatory dome.',
        position: [0.0, 1.5, 0.0],
        inspectionOffset: [0.0, 1.5, 2.8],
        lookAtOffset: [0.0, 1.5, 0.0],
        technicalSpec: {
          Geometry: 'Truncated Icosidodecahedron',
          Luminance: '4,200 Lumens Peak Core Emission',
          Optics: 'High-Dispersive Flint Glass Index (n=1.62)',
          Phase: 'Harmonic Dual-Axis Oscillation',
        },
        actionLabel: 'Inspect Aether Core',
      },
      {
        id: 'astrolabe-rete',
        title: 'Astrolabe Rete Plate',
        subtitle: 'Constellation Pointers & Horizon Ring',
        description:
          'Perforated filigree plate tilted at 23.5 degrees ecliptic inclination. Pointers align precisely with prime navigational stars.',
        position: [-1.2, 1.8, 0.6],
        inspectionOffset: [-1.8, 2.2, 3.2],
        lookAtOffset: [-1.0, 1.8, 0.4],
        technicalSpec: {
          Inclination: '23.44° Celestial Ecliptic',
          Perforations: '96 Laser-Etched Star Flame Pointers',
          RotationRate: '1:1 Sidereal Day Scrub Ratio',
          Alloy: 'Phosphor Bronze with Patina Glaze',
        },
        actionLabel: 'Inspect Astrolabe Rete',
      },
    ],
  },
  {
    id: 'world-02',
    index: 1,
    title: 'Subterranean Engine',
    romanNumeral: 'II',
    tagline: 'Epicyclic Clockwork & Kinetic Drive',
    editorialQuote:
      'The quiet mechanical foundation propelling half a century of engineering ingenuity.',
    narrativeBody:
      'Descending twenty-eight meters through the octagonal floor iris reveals the mechanical drive chamber. Massive involute gear trains, torsion pendulums, and stepped planetary clusters mesh in mechanical harmony to rotate the monumental observatory above.',
    scrollRange: [0.2, 0.4],
    heroFocus: 'Internal Clockwork & Planetary Gear Vault',
    atmosphericTone: 'Kinetic, industrial, rimmed with deep bronze shadows and metallic warmth.',
    lightingColor: '#C89D54',
    fogDensity: 0.022,
    hotspots: [
      {
        id: 'escapement-drive',
        title: 'Gravity Escapement',
        subtitle: 'Deadbeat Anchor & Foliot Wheel',
        description:
          'High-torque escapement wheel regulated by dual counter-oscillating pallets, transforming continuous gravitational descent into calibrated impulse beats.',
        position: [0.0, -26.5, -14.2],
        inspectionOffset: [2.2, -26.0, -11.5],
        lookAtOffset: [0.0, -26.5, -14.2],
        technicalSpec: {
          GearRatio: '144:1 Epicyclic Compound Reduction',
          Escapement: 'Graham Deadbeat with Ruby Pallets',
          PitchDiameter: '1,800 mm Hardened Carbon Steel',
          Torque: '12,500 N·m Mechanical Output',
        },
        actionLabel: 'Inspect Escapement',
      },
      {
        id: 'torsion-pendulum',
        title: 'Torsion Pendulum',
        subtitle: 'Suspension Ribbon & Torsion Sphere',
        description:
          'Elgiloy torsion spring supporting a four-lobed cylindrical compensator, oscillating once every sixty seconds to regulate the entire exhibition rhythm.',
        position: [-1.8, -28.0, -15.5],
        inspectionOffset: [-1.8, -27.5, -12.5],
        lookAtOffset: [-1.8, -28.0, -15.5],
        technicalSpec: {
          Period: '60.00 Seconds Harmonic Cycle',
          Suspension: 'Thermo-Compensated Beryllium Ribbon',
          MassBob: '420 kg Symmetrical Quadrant Bob',
          Damping: 'Eddy Current Magnetic Brake',
        },
        actionLabel: 'Inspect Pendulum',
      },
      {
        id: 'power-conduit',
        title: 'Hydrostatic Power Conduit',
        subtitle: 'High-Pressure Energy Distribution',
        description:
          'Flanged bronze fluid conduits directing hydrostatic pressure to vertical hydraulic jacks that lift and position the outer observatory shell.',
        position: [1.6, -29.2, -16.0],
        inspectionOffset: [2.4, -28.5, -13.0],
        lookAtOffset: [1.6, -29.2, -16.0],
        technicalSpec: {
          Pressure: '350 Bar Hydraulic Working Fluid',
          Alloy: 'Centrifugally Cast Marine Bronze',
          Manifold: 'Quad-Port Balanced Manifold',
          SafetyFactor: '4.5x Burst Overpressure Limit',
        },
        actionLabel: 'Inspect Conduit',
      },
    ],
  },
  {
    id: 'world-03',
    index: 2,
    title: 'Engineering Quadrants',
    romanNumeral: 'III',
    tagline: 'Four Pillars of Technological Mastery',
    editorialQuote:
      'Where theory meets silicon, kinetic mechanics, and planetary responsibility.',
    narrativeBody:
      'A vast subterranean rotunda opens into four dedicated engineering proving bays. Each quadrant showcases a critical discipline shaping modern innovation at Techfest IIT Bombay: Robotics, Aerospace, Cognitive AI, and Sustainable Planetary Systems.',
    scrollRange: [0.4, 0.65],
    heroFocus: 'Four Radial Engineering Sanctuaries',
    atmosphericTone: 'Analytical, crisp deep-ink darkness with quadrant-coded telemetry.',
    lightingColor: '#5B7A66',
    fogDensity: 0.012,
    hotspots: [
      {
        id: 'robotics-arm',
        title: 'Kinematic Robotics Cell',
        subtitle: '6-Axis Articulated Manipulator',
        description:
          'Harmonic-drive robotic limb engineered for sub-millimeter dexterity in harsh aerospace assembly and hazardous cleanroom environments.',
        position: [-4.5, -45.0, -58.0],
        inspectionOffset: [-3.0, -44.2, -54.0],
        lookAtOffset: [-4.5, -45.0, -58.0],
        technicalSpec: {
          Payload: '25 kg Continuous Dynamic Reach',
          Repeatability: '±0.02 mm Positional Accuracy',
          Actuation: 'Dual-Encoder Brushless Servo Gearing',
          OfficialCategory: 'Robotics & Autonomous Systems',
        },
        actionLabel: 'Inspect Robotics Cell',
      },
      {
        id: 'aerospace-vehicle',
        title: 'Aerospace Re-entry Nacelle',
        subtitle: 'Waverider Hypersonic Configuration',
        description:
          'Variable-sweep lifting body optimized for orbital atmospheric glide, featuring silicon-carbide thermal tiles and aerospike thrust vectoring.',
        position: [0.0, -43.5, -63.5],
        inspectionOffset: [0.0, -43.0, -59.0],
        lookAtOffset: [0.0, -43.5, -63.5],
        technicalSpec: {
          SpeedRegime: 'Mach 8.5 Atmospheric Insertion',
          HeatShield: 'Ceramic Matrix Carbon Composite',
          Span: '5.40 Meters Delta Wingspan',
          OfficialCategory: 'Aerospace & Propulsion',
        },
        actionLabel: 'Inspect Aerospace Bay',
      },
      {
        id: 'cognitive-lattice',
        title: 'Cognitive Neuromorphic Lattice',
        subtitle: 'Photonic Optical Computing Matrix',
        description:
          'Interconnected crystalline light waveguides executing tensor matrix multiplications at the speed of light with near-zero thermal dissipation.',
        position: [4.5, -45.0, -58.0],
        inspectionOffset: [3.0, -44.2, -54.0],
        lookAtOffset: [4.5, -45.0, -58.0],
        technicalSpec: {
          Bandwidth: '100 Terabits/sec Optical Interconnect',
          Architecture: 'Photonic Tensor Processor Array',
          Latency: '0.4 Nanoseconds per Matrix Layer',
          OfficialCategory: 'AI & Computational Sciences',
        },
        actionLabel: 'Inspect Cognitive Core',
      },
      {
        id: 'sustainability-turbine',
        title: 'Helical Green Energy Harvest',
        subtitle: 'Vertical-Axis Omnidirectional Turbine',
        description:
          'Aerodynamic helical wind turbine paired with parabolic bifacial solar concentrators for carbon-negative decentralized urban power generation.',
        position: [0.0, -46.5, -55.0],
        inspectionOffset: [0.0, -45.5, -51.0],
        lookAtOffset: [0.0, -46.5, -55.0],
        technicalSpec: {
          Efficiency: '48.2% Betz Limit Proximity',
          CutInSpeed: '1.2 m/s Gentle Breeze Generation',
          Structure: 'Bio-Derived Recycled Flax Composite',
          OfficialCategory: 'Sustainability & Clean Energy',
        },
        actionLabel: 'Inspect Sustainable Energy',
      },
    ],
    quadrants: [
      {
        id: 'robotics',
        title: 'Robotics & Automation',
        subtitle: 'Kinematic Precision & Inverse Kinematics',
        shortDescription:
          'RoboWars, Autonomous Drone Racing, and robotic dexterous manipulation.',
        detailedDescription:
          'From high-speed battle arena combatants to collaborative industrial kinematic arms, the robotics track embodies IIT Bombay’s spirit of raw mechanical execution and automated machine control.',
        focusArea: 'Mechatronics, Computer Vision, Real-Time Embedded Control',
        officialCategoryUrl: VERIFIED_LINKS.TECHFEST_COMPETITIONS,
        keyMetrics: [
          { label: 'Dexterity', value: '6-DoF Sub-mm' },
          { label: 'Control Frequency', value: '1.0 kHz' },
          { label: 'Arena Velocity', value: '45 km/h' },
        ],
        accentColor: '#C89D54',
      },
      {
        id: 'aerospace',
        title: 'Aerospace & Propulsion',
        subtitle: 'Orbital Insertion & Hypersonic Aerodynamics',
        shortDescription:
          'Boeing National Aeromodelling, rocketry payloads, and atmospheric reentry.',
        detailedDescription:
          'Exploring aerospace frontiers from atmospheric RC airframes to space exploration sounding payloads, testing students against real aerodynamic and thermal limits.',
        focusArea: 'Computational Fluid Dynamics, Propulsion, Composite Structures',
        officialCategoryUrl: VERIFIED_LINKS.TECHFEST_COMPETITIONS,
        keyMetrics: [
          { label: 'Glide Ratio', value: '18.4 : 1' },
          { label: 'Max Dynamic Q', value: '65 kPa' },
          { label: 'Thrust-to-Weight', value: '2.8 : 1' },
        ],
        accentColor: '#F2A93B',
      },
      {
        id: 'cognitive',
        title: 'Cognitive Computing & AI',
        subtitle: 'Photonic Neuromorphic Intelligence',
        shortDescription:
          'Deep learning architectures, algorithmic hackathons, and agentic intelligence.',
        detailedDescription:
          'Unleashing transformer models, synthetic intelligence, and high-performance algorithms to solve complex data challenges, bioinformatics, and decentralized protocols.',
        focusArea: 'Machine Learning, Neural Optimization, Autonomous Agents',
        officialCategoryUrl: VERIFIED_LINKS.TECHFEST_COMPETITIONS,
        keyMetrics: [
          { label: 'Throughput', value: '120 TFLOPS' },
          { label: 'Inference', value: '< 2.4 ms' },
          { label: 'Parameter Scale', value: '70 Billion' },
        ],
        accentColor: '#1F3A93',
      },
      {
        id: 'sustainability',
        title: 'Sustainable Engineering',
        subtitle: 'Planetary Stewardship & Clean Energy',
        shortDescription:
          'Green hydrogen, carbon capture, grid-scale storage, and circular lifecycle design.',
        detailedDescription:
          'Engineering regenerative planetary solutions to address climate change, decentralized renewable power generation, and clean mobility architectures.',
        focusArea: 'Renewable Power, Carbon Sequestration, Circular Lifecycle Materials',
        officialCategoryUrl: VERIFIED_LINKS.TECHFEST_INITIATIVES,
        keyMetrics: [
          { label: 'Carbon Avoidance', value: '94.2%' },
          { label: 'Energy Payback', value: '< 8 Months' },
          { label: 'Recyclability', value: '98.5%' },
        ],
        accentColor: '#5B7A66',
      },
    ],
  },
  {
    id: 'world-04',
    index: 3,
    title: 'Technoholix Arena & Spatial Nexus',
    romanNumeral: 'IV',
    tagline: 'Electrifying Night Spectacle & Festival Nexus',
    editorialQuote:
      'When the sun sets behind the Powai hills, science transforms into sensory celebration.',
    narrativeBody:
      'Emerging from the deep rotunda into the monumental open-air Technoholix Arena. Sweeping volumetric light pylons pierce the night sky, celebrating the fusion of pyrotechnics, EDM, robotic performance, and world-class laser choreography at IIT Bombay.',
    scrollRange: [0.65, 0.85],
    heroFocus: 'Kinetic Exhibition Amphitheatre & Volumetric Light Array',
    atmosphericTone: 'Electric, celebratory, steeped in ultramarine glow and dynamic illumination.',
    lightingColor: '#1F3A93',
    fogDensity: 0.016,
    hotspots: [
      {
        id: 'arena-stage',
        title: 'Technoholix Mainstage',
        subtitle: 'Kinetic Truss & Projection Mapping',
        description:
          'Monumental triangular truss structure equipped with laser projection rigs and multi-tier acoustic arrays hosting international headline acts.',
        position: [0.0, -30.0, -125.0],
        inspectionOffset: [0.0, -28.5, -118.0],
        lookAtOffset: [0.0, -30.0, -125.0],
        technicalSpec: {
          Span: '48.0 Meters Clear Truss Width',
          AudioOutput: '150,000 Watts Line Array Audio',
          Projection: '8K Quad-Laser Mapping Units',
          Capacity: '15,000+ Synchronized Spectators',
        },
        actionLabel: 'Inspect Stage Rig',
      },
      {
        id: 'light-pylons',
        title: 'Volumetric Sky Pylons',
        subtitle: 'Automated Xenon Searchlight Beam Array',
        description:
          'Eight computer-synchronized motorized beam pylons sweeping the troposphere in geometric choreographies that trace celestial constellations.',
        position: [-5.0, -27.0, -115.0],
        inspectionOffset: [-3.8, -26.0, -110.0],
        lookAtOffset: [-5.0, -27.0, -115.0],
        technicalSpec: {
          Lamps: '7,000W Xenon Short-Arc Emitters',
          BeamDivergence: '0.8° Razor-Tight Parallel Column',
          ElevationRange: '-10° to +95° Dual Harmonic Servo',
          BeamColor: 'Ultramarine 450nm Monochromatic Glow',
        },
        actionLabel: 'Inspect Sky Pylons',
      },
      {
        id: 'campus-nexus',
        title: 'Spatial Campus Nexus',
        subtitle: 'Interactive Architectural Orientation',
        description:
          'Explore key conceptual landmarks across the IIT Bombay campus: Open Air Theatre (OAT), Convocation Hall, Lecture Hall Complex, and Student Gymkhana.',
        position: [4.8, -28.5, -116.0],
        inspectionOffset: [3.5, -27.2, -111.0],
        lookAtOffset: [4.8, -28.5, -116.0],
        technicalSpec: {
          Location: 'Powai, Mumbai (19.1334° N, 72.9133° E)',
          Landmarks: 'OAT, Convocation Hall, LHC, Gymkhana',
          Scale: 'Cartographic 3D Conceptual Model',
          Feature: 'One-Click Interactive Campus Map Modal',
        },
        actionLabel: 'Open Spatial Campus Map',
      },
    ],
  },
  {
    id: 'world-05',
    index: 4,
    title: 'The Deep Space Beacon',
    romanNumeral: 'V',
    tagline: 'Orbital Ascension & Ambassador Gateway',
    editorialQuote:
      'The journey does not conclude in Powai—it echoes into the cosmos.',
    narrativeBody:
      'Ascending beyond the atmosphere, the Living Atlas expands into its final orbital configuration against the cosmic starfield. The beacon is lit: discover official registration pathways, represent your college as a Techfest Ambassador, and lead the technological vanguard.',
    scrollRange: [0.85, 1.0],
    heroFocus: 'Ascendant Orbital Atlas in Celestial Alignment',
    atmosphericTone: 'Transcendent, cosmic starlight, infinite depth, pure clarity.',
    lightingColor: '#F4EFE6',
    fogDensity: 0.003,
    hotspots: [
      {
        id: 'orbital-array',
        title: 'Ascendant Orbital Atlas',
        subtitle: 'Fully Deployed Gimbal Constellation',
        description:
          'The Living Atlas fully unfolded in microgravity, meridian rings rotating along harmonic prime ratios to transmit the scientific beacon.',
        position: [0.0, 25.0, -180.0],
        inspectionOffset: [0.0, 25.5, -172.0],
        lookAtOffset: [0.0, 25.0, -180.0],
        technicalSpec: {
          OrbitalRegime: 'Geostationary Beacon Alignment',
          Configuration: 'Full Hexagonal Deployment',
          PowerOutput: '25 kW Radioisotope Core Telemetry',
          Transmitter: 'Deep-Space S-Band Planetary Transceiver',
        },
        actionLabel: 'Inspect Orbital Array',
      },
      {
        id: 'ambassador-terminal',
        title: 'Ambassador Gateway',
        subtitle: 'Official College Ambassador Portal',
        description:
          'Step up as the official voice of Techfest at your institution. Connect directly with the CA portal to register and lead workshops and delegations.',
        position: [-3.2, 23.8, -175.0],
        inspectionOffset: [-2.0, 24.2, -168.0],
        lookAtOffset: [-3.2, 23.8, -175.0],
        technicalSpec: {
          OfficialLink: VERIFIED_LINKS.CA_PORTAL,
          TaskCategory: 'Web Development & Campus Representation',
          Eligibility: 'All Enrolled College & University Students',
          Accreditation: 'Official Techfest IIT Bombay Certificate',
        },
        actionLabel: 'Open CA Portal',
      },
    ],
  },
];

export const CAMPUS_LANDMARKS = [
  {
    id: 'convocation-hall',
    name: 'Convocation Hall',
    code: 'CONVO-01',
    description:
      'The historic grand auditorium hosting Techfest Keynote Lectures by Nobel Laureates, scientists, and world innovators.',
    coordinates: '19.1318° N, 72.9152° E',
  },
  {
    id: 'open-air-theatre',
    name: 'Open Air Theatre (OAT)',
    code: 'OAT-ARENA',
    description:
      'The iconic open amphitheatre hosting Technoholix night shows, international EDM artists, and laser spectacles.',
    coordinates: '19.1332° N, 72.9138° E',
  },
  {
    id: 'lecture-hall-complex',
    name: 'Lecture Hall Complex (LHC)',
    code: 'LHC-HALLS',
    description:
      'Modern tiered lecture halls hosting premier national workshops in AI, quantum computing, ethical hacking, and robotics.',
    coordinates: '19.1325° N, 72.9160° E',
  },
  {
    id: 'gymkhana-grounds',
    name: 'Gymkhana Grounds',
    code: 'GYM-FIELD',
    description:
      'Vast outdoor grounds accommodating international RoboWars arenas, full-throttle drone racing grids, and outdoor tech exhibits.',
    coordinates: '19.1340° N, 72.9125° E',
  },
  {
    id: 'hostel-quadrangles',
    name: 'Hostel Accommodation Preview',
    code: 'HOSTEL-INFRA',
    description:
      'Residential housing blocks accommodating thousands of visiting student participants from across India and over 25 nations.',
    coordinates: '19.1355° N, 72.9140° E',
  },
];

