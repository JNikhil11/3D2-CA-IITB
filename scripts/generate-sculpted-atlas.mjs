import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Document, NodeIO } from '@gltf-transform/core';

const MODELS_DIR = path.resolve('public/assets/models');
const TEXTURES_DIR = path.resolve('public/assets/textures');

if (!fs.existsSync(MODELS_DIR)) fs.mkdirSync(MODELS_DIR, { recursive: true });
if (!fs.existsSync(TEXTURES_DIR)) fs.mkdirSync(TEXTURES_DIR, { recursive: true });

function safeMergeGeometries(geometries) {
  if (!geometries || geometries.length === 0) return null;
  if (geometries.length === 1) {
    const single = geometries[0].clone();
    if (!single.index) {
      const count = single.attributes.position.count;
      const indices = count > 65535 ? new Uint32Array(count) : new Uint16Array(count);
      for (let i = 0; i < count; i++) indices[i] = i;
      single.setIndex(new THREE.BufferAttribute(indices, 1));
    }
    if (!single.attributes.normal) single.computeVertexNormals();
    if (!single.attributes.uv) {
      const count = single.attributes.position.count;
      single.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(count * 2), 2));
    }
    return single;
  }

  const normalized = geometries.map(g => {
    const geom = g.clone();
    if (!geom.index) {
      const count = geom.attributes.position.count;
      const indices = count > 65535 ? new Uint32Array(count) : new Uint16Array(count);
      for (let i = 0; i < count; i++) indices[i] = i;
      geom.setIndex(new THREE.BufferAttribute(indices, 1));
    }
    if (!geom.attributes.normal) geom.computeVertexNormals();
    if (!geom.attributes.uv) {
      const count = geom.attributes.position.count;
      geom.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(count * 2), 2));
    }
    for (const key of Object.keys(geom.attributes)) {
      if (key !== 'position' && key !== 'normal' && key !== 'uv') {
        geom.deleteAttribute(key);
      }
    }
    return geom;
  });

  const merged = BufferGeometryUtils.mergeGeometries(normalized, false);
  if (!merged) {
    throw new Error('safeMergeGeometries failed to merge geometries');
  }
  merged.computeVertexNormals();
  return merged;
}

function addMeshNode(doc, buffer, scene, geometry, material, nodeName, translation = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
  if (!geometry.attributes.normal) geometry.computeVertexNormals();
  if (!geometry.attributes.uv) {
    const count = geometry.attributes.position.count;
    const uvs = new Float32Array(count * 2);
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  }
  if (!geometry.index) {
    const count = geometry.attributes.position.count;
    const indices = count > 65535 ? new Uint32Array(count) : new Uint16Array(count);
    for (let i = 0; i < count; i++) indices[i] = i;
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  }

  const posAccessor = doc.createAccessor()
    .setType('VEC3')
    .setArray(new Float32Array(geometry.attributes.position.array))
    .setBuffer(buffer);
  const normAccessor = doc.createAccessor()
    .setType('VEC3')
    .setArray(new Float32Array(geometry.attributes.normal.array))
    .setBuffer(buffer);
  const uvAccessor = doc.createAccessor()
    .setType('VEC2')
    .setArray(new Float32Array(geometry.attributes.uv.array))
    .setBuffer(buffer);
  const indexAccessor = doc.createAccessor()
    .setType('SCALAR')
    .setArray(geometry.index.count > 65535 ? new Uint32Array(geometry.index.array) : new Uint16Array(geometry.index.array))
    .setBuffer(buffer);

  const prim = doc.createPrimitive()
    .setAttribute('POSITION', posAccessor)
    .setAttribute('NORMAL', normAccessor)
    .setAttribute('TEXCOORD_0', uvAccessor)
    .setIndices(indexAccessor)
    .setMaterial(material);

  const mesh = doc.createMesh(nodeName).addPrimitive(prim);
  const node = doc.createNode(nodeName)
    .setMesh(mesh)
    .setTranslation(translation)
    .setRotation(rotation)
    .setScale(scale);
  scene.addChild(node);
  return node;
}

function createInvoluteGear(teethCount, radius, thickness, innerRadius) {
  const geoms = [];
  const rim = new THREE.CylinderGeometry(radius, radius, thickness, Math.max(16, teethCount * 2));
  geoms.push(rim);

  const toothWidth = (Math.PI * 2 * radius) / (teethCount * 2.2);
  for (let i = 0; i < teethCount; i++) {
    const angle = (i / teethCount) * Math.PI * 2;
    const tooth = new THREE.BoxGeometry(toothWidth, thickness * 0.95, radius * 0.25);
    tooth.translate(0, 0, radius + radius * 0.08);
    tooth.rotateY(angle);
    geoms.push(tooth);
  }

  const hub = new THREE.CylinderGeometry(innerRadius * 1.5, innerRadius * 1.5, thickness * 1.15, 24);
  geoms.push(hub);

  for (let s = 0; s < 6; s++) {
    const spoke = new THREE.BoxGeometry(radius * 0.12, thickness * 0.6, radius);
    spoke.rotateY((s / 6) * Math.PI * 2);
    geoms.push(spoke);
  }

  return safeMergeGeometries(geoms);
}

// -------------------------------------------------------------
// 1. GENERATE ATLAS-HERO.GLB
// -------------------------------------------------------------
async function generateAtlasHero() {
  console.log('Generating atlas-hero.glb...');
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene('LivingAtlasScene');

  const matStone = doc.createMaterial('MAT_AlabasterMarble_PBR')
    .setBaseColorFactor([0.84, 0.82, 0.76, 1.0])
    .setMetallicFactor(0.12)
    .setRoughnessFactor(0.65);

  const matFigureBronze = doc.createMaterial('MAT_ScholarBronze_PBR')
    .setBaseColorFactor([0.64, 0.50, 0.32, 1.0])
    .setMetallicFactor(0.88)
    .setRoughnessFactor(0.32);

  const matBronze = doc.createMaterial('MAT_AgedBronze_PBR')
    .setBaseColorFactor([0.55, 0.39, 0.22, 1.0])
    .setMetallicFactor(0.88)
    .setRoughnessFactor(0.38);

  const matBrass = doc.createMaterial('MAT_AntiqueBrass_PBR')
    .setBaseColorFactor([0.78, 0.61, 0.33, 1.0])
    .setMetallicFactor(0.92)
    .setRoughnessFactor(0.26);

  const matGold = doc.createMaterial('MAT_BrushedGold_PBR')
    .setBaseColorFactor([0.88, 0.72, 0.38, 1.0])
    .setMetallicFactor(0.95)
    .setRoughnessFactor(0.20);

  const matSteel = doc.createMaterial('MAT_SteelAndBrass_PBR')
    .setBaseColorFactor([0.72, 0.68, 0.60, 1.0])
    .setMetallicFactor(0.90)
    .setRoughnessFactor(0.30);

  const matCore = doc.createMaterial('MAT_OpticalCore')
    .setBaseColorFactor([0.98, 0.92, 0.75, 1.0])
    .setEmissiveFactor([0.95, 0.66, 0.23])
    .setMetallicFactor(0.1)
    .setRoughnessFactor(0.15);

  // 1. Classical Altar Dais & Fluted Pedestal (Concept Art Sanctum Altar)
  const plinthGeoms = [];
  const daisStep1 = new THREE.CylinderGeometry(2.3, 2.6, 0.22, 24);
  daisStep1.translate(0, -0.58, 0);
  plinthGeoms.push(daisStep1);

  const daisStep2 = new THREE.CylinderGeometry(1.8, 2.1, 0.20, 24);
  daisStep2.translate(0, -0.37, 0);
  plinthGeoms.push(daisStep2);

  const daisStep3 = new THREE.CylinderGeometry(1.3, 1.6, 0.18, 24);
  daisStep3.translate(0, -0.18, 0);
  plinthGeoms.push(daisStep3);

  const altarBase = new THREE.CylinderGeometry(0.85, 1.1, 0.14, 24);
  altarBase.translate(0, -0.02, 0);
  plinthGeoms.push(altarBase);

  const flutedColumn = new THREE.CylinderGeometry(0.65, 0.70, 0.40, 20);
  flutedColumn.translate(0, 0.25, 0);
  plinthGeoms.push(flutedColumn);

  const capital = new THREE.CylinderGeometry(0.85, 0.65, 0.12, 20);
  capital.translate(0, 0.51, 0);
  plinthGeoms.push(capital);

  const azimuthRing = new THREE.TorusGeometry(0.85, 0.04, 8, 36);
  azimuthRing.rotateX(Math.PI / 2);
  azimuthRing.translate(0, 0.54, 0);
  plinthGeoms.push(azimuthRing);

  for (let i = 0; i < 36; i++) {
    const tick = new THREE.BoxGeometry(0.025, 0.02, 0.12);
    tick.translate(0, 0.55, 0.85);
    tick.rotateY((i / 36) * Math.PI * 2);
    plinthGeoms.push(tick);
  }

  const mergedPlinth = safeMergeGeometries(plinthGeoms);
  addMeshNode(doc, buffer, scene, mergedPlinth, matStone, 'SM_Atlas_Plinth_01');

  // 2. Sculpted Classical Renaissance Scholar / Atlas Figure (Concept Art Monument)
  const figureGeoms = [];
  // Classical flowing drapery & robes
  const robes = new THREE.CylinderGeometry(0.24, 0.38, 0.55, 12);
  robes.translate(0, 0.85, 0);
  figureGeoms.push(robes);

  const belt = new THREE.CylinderGeometry(0.25, 0.25, 0.08, 12);
  belt.translate(0, 1.12, 0);
  figureGeoms.push(belt);

  // Torso & chest mantle
  const torso = new THREE.BoxGeometry(0.38, 0.38, 0.26);
  torso.translate(0, 1.31, 0);
  figureGeoms.push(torso);

  const cloak = new THREE.BoxGeometry(0.22, 0.35, 0.28);
  cloak.translate(-0.14, 1.35, 0.02);
  figureGeoms.push(cloak);

  // Left arm holding astrolabe disk at hip
  const leftArmUpper = new THREE.CylinderGeometry(0.06, 0.07, 0.28, 8);
  leftArmUpper.rotateZ(0.3);
  leftArmUpper.translate(-0.22, 1.28, 0);
  figureGeoms.push(leftArmUpper);

  const leftArmLower = new THREE.CylinderGeometry(0.05, 0.06, 0.25, 8);
  leftArmLower.rotateZ(-0.25);
  leftArmLower.translate(-0.18, 1.11, 0.05);
  figureGeoms.push(leftArmLower);

  const astrolabeDisk = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 12);
  astrolabeDisk.rotateY(0.4);
  astrolabeDisk.translate(-0.12, 1.08, 0.12);
  figureGeoms.push(astrolabeDisk);

  // Right arm raised upward reaching toward the heavens
  const rightArmUpper = new THREE.CylinderGeometry(0.06, 0.07, 0.32, 8);
  rightArmUpper.rotateZ(-0.6);
  rightArmUpper.translate(0.24, 1.45, 0);
  figureGeoms.push(rightArmUpper);

  const rightArmLower = new THREE.CylinderGeometry(0.05, 0.06, 0.32, 8);
  rightArmLower.rotateZ(-0.3);
  rightArmLower.translate(0.36, 1.68, 0.05);
  figureGeoms.push(rightArmLower);

  // Slender golden astronomer's pointer staff reaching into the Armillary Core
  const sightingStaff = new THREE.CylinderGeometry(0.015, 0.020, 0.65, 8);
  sightingStaff.rotateZ(-0.15);
  sightingStaff.translate(0.38, 1.95, 0.08);
  figureGeoms.push(sightingStaff);

  // Sculpted head gazing upward toward celestial sphere
  const head = new THREE.SphereGeometry(0.13, 12, 12);
  head.scale(1.0, 1.15, 1.05);
  head.rotateX(-0.25);
  head.translate(0.02, 1.63, 0.02);
  figureGeoms.push(head);

  const wreath = new THREE.TorusGeometry(0.12, 0.025, 8, 16);
  wreath.rotateX(-0.2);
  wreath.translate(0.02, 1.67, 0.02);
  figureGeoms.push(wreath);

  const mergedFigure = safeMergeGeometries(figureGeoms);
  addMeshNode(doc, buffer, scene, mergedFigure, matFigureBronze, 'SM_Atlas_ScholarFigure');

  // Meridian Outer Cradle
  const meridianGeoms = [];
  const outerRing = new THREE.TorusGeometry(3.6, 0.12, 24, 72);
  outerRing.rotateY(Math.PI / 2);
  meridianGeoms.push(outerRing);
  for (let a = 0; a < 72; a++) {
    const mark = new THREE.BoxGeometry(0.16, 0.04, 0.03);
    mark.translate(0, Math.sin((a / 72) * Math.PI * 2) * 3.6, Math.cos((a / 72) * Math.PI * 2) * 3.6);
    meridianGeoms.push(mark);
  }
  const spireBase = new THREE.CylinderGeometry(0.18, 0.28, 0.6, 16);
  spireBase.translate(0, 3.9, 0);
  meridianGeoms.push(spireBase);
  const spireTip = new THREE.ConeGeometry(0.12, 0.8, 16);
  spireTip.translate(0, 4.5, 0);
  meridianGeoms.push(spireTip);
  const mergedMeridian = safeMergeGeometries(meridianGeoms);
  addMeshNode(doc, buffer, scene, mergedMeridian, matBronze, 'SM_Atlas_MeridianOuter', [0, 1.5, 0]);

  // Ecliptic Astrolabe Ring (Tilted 23.5 deg)
  const eclipticGeoms = [];
  const eclRing = new THREE.TorusGeometry(2.9, 0.10, 20, 64);
  eclipticGeoms.push(eclRing);
  for (let z = 0; z < 12; z++) {
    const boss = new THREE.SphereGeometry(0.12, 12, 12);
    boss.translate(Math.cos((z / 12) * Math.PI * 2) * 2.9, Math.sin((z / 12) * Math.PI * 2) * 2.9, 0);
    eclipticGeoms.push(boss);
  }
  const mergedEcliptic = safeMergeGeometries(eclipticGeoms);
  mergedEcliptic.rotateX(0.409);
  addMeshNode(doc, buffer, scene, mergedEcliptic, matBrass, 'SM_Atlas_RingEcliptic', [0, 1.5, 0]);

  // Astrolabe Rete Plate
  const reteGeoms = [];
  const reteRim = new THREE.TorusGeometry(2.3, 0.08, 16, 48);
  reteGeoms.push(reteRim);
  const barH = new THREE.BoxGeometry(4.4, 0.05, 0.03);
  const barV = new THREE.BoxGeometry(0.05, 4.4, 0.03);
  reteGeoms.push(barH, barV);
  for (let p = 0; p < 24; p++) {
    const angle = (p / 24) * Math.PI * 2;
    const r = 1.2 + (p % 4) * 0.25;
    const pointer = new THREE.ConeGeometry(0.06, 0.35, 8);
    pointer.rotateZ(angle - Math.PI / 2);
    pointer.translate(Math.cos(angle) * r, Math.sin(angle) * r, 0.02);
    reteGeoms.push(pointer);
  }
  const mergedRete = safeMergeGeometries(reteGeoms);
  addMeshNode(doc, buffer, scene, mergedRete, matGold, 'SM_Atlas_RetePlate', [0, 1.5, 0]);

  // Gear Cluster
  const gearGeoms = [];
  const sunGear = createInvoluteGear(24, 0.75, 0.15, 0.2);
  gearGeoms.push(sunGear);
  for (let g = 0; g < 4; g++) {
    const planet = createInvoluteGear(16, 0.45, 0.12, 0.15);
    const ang = (g / 4) * Math.PI * 2;
    planet.translate(Math.cos(ang) * 1.3, 0, Math.sin(ang) * 1.3);
    gearGeoms.push(planet);
  }
  const ringGear = new THREE.TorusGeometry(1.85, 0.09, 16, 48);
  ringGear.rotateX(Math.PI / 2);
  gearGeoms.push(ringGear);
  const mergedGears = safeMergeGeometries(gearGeoms);
  addMeshNode(doc, buffer, scene, mergedGears, matSteel, 'SM_Atlas_GearCluster', [0, 1.5, 0]);

  // Aether Core
  const coreGeoms = [];
  const polyCore = new THREE.IcosahedronGeometry(0.55, 2);
  coreGeoms.push(polyCore);
  const cageRing1 = new THREE.TorusGeometry(0.75, 0.03, 12, 32);
  const cageRing2 = new THREE.TorusGeometry(0.75, 0.03, 12, 32);
  cageRing2.rotateX(Math.PI / 2);
  const cageRing3 = new THREE.TorusGeometry(0.75, 0.03, 12, 32);
  cageRing3.rotateY(Math.PI / 2);
  coreGeoms.push(cageRing1, cageRing2, cageRing3);
  const mergedCore = safeMergeGeometries(coreGeoms);
  addMeshNode(doc, buffer, scene, mergedCore, matCore, 'SM_Atlas_AetherCore', [0, 1.5, 0]);

  const io = new NodeIO();
  const glb = await io.writeBinary(doc);
  const outPath = path.join(MODELS_DIR, 'atlas-hero.glb');
  fs.writeFileSync(outPath, Buffer.from(glb));
  console.log(`atlas-hero.glb created (${glb.byteLength} bytes)`);
}

// -------------------------------------------------------------
// 2. GENERATE WORLD01-SHELL.GLB
// -------------------------------------------------------------
async function generateWorld01Shell() {
  console.log('Generating world01-shell.glb...');
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene('ObservatoryShellScene');

  const matArch = doc.createMaterial('MAT_ObsidianArch_PBR')
    .setBaseColorFactor([0.12, 0.13, 0.18, 1.0])
    .setMetallicFactor(0.3)
    .setRoughnessFactor(0.75);

  const matGuardianArmor = doc.createMaterial('MAT_GuardianArmor_PBR')
    .setBaseColorFactor([0.22, 0.24, 0.28, 1.0])
    .setMetallicFactor(0.88)
    .setRoughnessFactor(0.35);

  const matGuardianCore = doc.createMaterial('MAT_GuardianCyanCore_PBR')
    .setBaseColorFactor([0.05, 0.85, 0.95, 1.0])
    .setEmissiveFactor([0.15, 0.95, 1.0])
    .setMetallicFactor(0.1)
    .setRoughnessFactor(0.15);

  const shellGeoms = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const col = new THREE.CylinderGeometry(0.4, 0.6, 9.0, 12);
    col.translate(Math.cos(angle) * 7.5, 4.5, Math.sin(angle) * 7.5);
    shellGeoms.push(col);

    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(Math.cos(angle) * 7.5, 9.0, Math.sin(angle) * 7.5),
      new THREE.Vector3(Math.cos(angle) * 5.0, 12.0, Math.sin(angle) * 5.0),
      new THREE.Vector3(Math.cos(angle) * 2.2, 13.5, Math.sin(angle) * 2.2)
    );
    const tube = new THREE.TubeGeometry(curve, 16, 0.28, 8, false);
    shellGeoms.push(tube);
  }

  const oculusRing = new THREE.TorusGeometry(2.2, 0.35, 16, 32);
  oculusRing.rotateX(Math.PI / 2);
  oculusRing.translate(0, 13.5, 0);
  shellGeoms.push(oculusRing);

  const floor = new THREE.CylinderGeometry(8.5, 9.0, 0.5, 32);
  floor.translate(0, -0.25, 0);
  shellGeoms.push(floor);

  const floorInlay = new THREE.TorusGeometry(6.0, 0.12, 8, 48);
  floorInlay.rotateX(Math.PI / 2);
  floorInlay.translate(0, 0.02, 0);
  shellGeoms.push(floorInlay);

  const merged = safeMergeGeometries(shellGeoms);
  addMeshNode(doc, buffer, scene, merged, matArch, 'SM_Observatory_Shell');

  // Helper to transform guardian primitives
  function transformGeom(geom, x, z, rotY) {
    if (rotY !== 0) geom.rotateY(rotY);
    geom.translate(x, 0, z);
    return geom;
  }

  // 4 Colossal Celestial Mech Guardians flanking the sanctuary (Concept Art Sentinels)
  function addMechGuardian(armorGeoms, coreGeoms, posX, posZ, rotY, scale = 1.0) {
    for (const side of [-0.32, 0.32]) {
      const boot = new THREE.BoxGeometry(0.30 * scale, 0.28 * scale, 0.52 * scale);
      boot.translate(side * scale, 0.14 * scale, 0.1 * scale);
      armorGeoms.push(transformGeom(boot, posX, posZ, rotY));

      const shin = new THREE.CylinderGeometry(0.16 * scale, 0.20 * scale, 0.9 * scale, 8);
      shin.translate(side * scale, 0.68 * scale, 0);
      armorGeoms.push(transformGeom(shin, posX, posZ, rotY));

      const knee = new THREE.BoxGeometry(0.22 * scale, 0.22 * scale, 0.22 * scale);
      knee.translate(side * scale, 1.15 * scale, 0.12 * scale);
      armorGeoms.push(transformGeom(knee, posX, posZ, rotY));

      const thigh = new THREE.CylinderGeometry(0.20 * scale, 0.18 * scale, 0.8 * scale, 8);
      thigh.translate(side * scale, 1.6 * scale, 0);
      armorGeoms.push(transformGeom(thigh, posX, posZ, rotY));
    }

    const belt = new THREE.BoxGeometry(0.92 * scale, 0.28 * scale, 0.52 * scale);
    belt.translate(0, 2.05 * scale, 0);
    armorGeoms.push(transformGeom(belt, posX, posZ, rotY));

    const tasset = new THREE.BoxGeometry(0.32 * scale, 0.42 * scale, 0.08 * scale);
    tasset.translate(0, 1.82 * scale, 0.28 * scale);
    armorGeoms.push(transformGeom(tasset, posX, posZ, rotY));

    const chestLower = new THREE.BoxGeometry(0.85 * scale, 0.48 * scale, 0.58 * scale);
    chestLower.translate(0, 2.45 * scale, 0);
    armorGeoms.push(transformGeom(chestLower, posX, posZ, rotY));

    const chestUpper = new THREE.BoxGeometry(1.20 * scale, 0.62 * scale, 0.72 * scale);
    chestUpper.translate(0, 2.95 * scale, 0.04 * scale);
    armorGeoms.push(transformGeom(chestUpper, posX, posZ, rotY));

    const gorget = new THREE.CylinderGeometry(0.32 * scale, 0.42 * scale, 0.22 * scale, 8);
    gorget.translate(0, 3.32 * scale, 0.02 * scale);
    armorGeoms.push(transformGeom(gorget, posX, posZ, rotY));

    for (const side of [-1, 1]) {
      const pauldron = new THREE.SphereGeometry(0.36 * scale, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.7);
      pauldron.scale(1.1, 0.85, 1.0);
      pauldron.translate(side * 0.78 * scale, 3.12 * scale, 0);
      armorGeoms.push(transformGeom(pauldron, posX, posZ, rotY));

      const armUpper = new THREE.CylinderGeometry(0.15 * scale, 0.14 * scale, 0.68 * scale, 8);
      armUpper.translate(side * 0.78 * scale, 2.58 * scale, 0);
      armorGeoms.push(transformGeom(armUpper, posX, posZ, rotY));

      const armLower = new THREE.BoxGeometry(0.24 * scale, 0.72 * scale, 0.26 * scale);
      armLower.translate(side * 0.78 * scale, 1.9 * scale, 0.06 * scale);
      armorGeoms.push(transformGeom(armLower, posX, posZ, rotY));
    }

    const helm = new THREE.BoxGeometry(0.40 * scale, 0.48 * scale, 0.46 * scale);
    helm.translate(0, 3.62 * scale, 0.06 * scale);
    armorGeoms.push(transformGeom(helm, posX, posZ, rotY));

    const crest = new THREE.BoxGeometry(0.08 * scale, 0.28 * scale, 0.48 * scale);
    crest.translate(0, 3.92 * scale, 0.04 * scale);
    armorGeoms.push(transformGeom(crest, posX, posZ, rotY));

    // Glowing Cyan Visor & Chest Core
    const visor = new THREE.BoxGeometry(0.30 * scale, 0.09 * scale, 0.08 * scale);
    visor.translate(0, 3.62 * scale, 0.31 * scale);
    coreGeoms.push(transformGeom(visor, posX, posZ, rotY));

    const reactor = new THREE.CylinderGeometry(0.13 * scale, 0.13 * scale, 0.08 * scale, 12);
    reactor.rotateX(Math.PI / 2);
    reactor.translate(0, 2.95 * scale, 0.41 * scale);
    coreGeoms.push(transformGeom(reactor, posX, posZ, rotY));
  }

  const guardianArmorGeoms = [];
  const guardianCoreGeoms = [];

  // 1. Left Foreground Guardian
  addMechGuardian(guardianArmorGeoms, guardianCoreGeoms, -5.8, 1.4, 0.52, 1.15);
  // 2. Left Background Guardian
  addMechGuardian(guardianArmorGeoms, guardianCoreGeoms, -4.5, -3.2, 0.85, 1.05);
  // 3. Right Foreground Guardian
  addMechGuardian(guardianArmorGeoms, guardianCoreGeoms, 5.8, 1.4, -0.52, 1.15);
  // 4. Right Background Guardian
  addMechGuardian(guardianArmorGeoms, guardianCoreGeoms, 4.5, -3.2, -0.85, 1.05);

  const mergedGuardianArmor = safeMergeGeometries(guardianArmorGeoms);
  addMeshNode(doc, buffer, scene, mergedGuardianArmor, matGuardianArmor, 'SM_Guardian_Armors');

  const mergedGuardianCore = safeMergeGeometries(guardianCoreGeoms);
  addMeshNode(doc, buffer, scene, mergedGuardianCore, matGuardianCore, 'SM_Guardian_Cores');

  const io = new NodeIO();
  const glb = await io.writeBinary(doc);
  const outPath = path.join(MODELS_DIR, 'world01-shell.glb');
  fs.writeFileSync(outPath, Buffer.from(glb));
  console.log(`world01-shell.glb created (${glb.byteLength} bytes)`);
}

// -------------------------------------------------------------
// 3. GENERATE WORLD02-ENGINE.GLB
// -------------------------------------------------------------
async function generateWorld02Engine() {
  console.log('Generating world02-engine.glb...');
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene('EngineVaultScene');

  const matSteel = doc.createMaterial('MAT_IndustrialSteel')
    .setBaseColorFactor([0.35, 0.38, 0.42, 1.0])
    .setMetallicFactor(0.92)
    .setRoughnessFactor(0.35);

  const matBronze = doc.createMaterial('MAT_CastBronze')
    .setBaseColorFactor([0.62, 0.45, 0.25, 1.0])
    .setMetallicFactor(0.85)
    .setRoughnessFactor(0.40);

  const shaftGeoms = [];
  const shaft = new THREE.CylinderGeometry(0.35, 0.35, 8.0, 24);
  shaft.translate(0, -4.0, 0);
  shaftGeoms.push(shaft);
  for (let f = 0; f < 3; f++) {
    const flange = new THREE.CylinderGeometry(0.65, 0.65, 0.25, 24);
    flange.translate(0, -1.5 - f * 2.0, 0);
    shaftGeoms.push(flange);
  }
  const mergedShaft = safeMergeGeometries(shaftGeoms);
  addMeshNode(doc, buffer, scene, mergedShaft, matSteel, 'SM_Engine_DriveShaft', [0, 0, 0]);

  const gearGeoms = [];
  const bigGear1 = createInvoluteGear(36, 2.2, 0.28, 0.45);
  bigGear1.translate(0, -1.2, 0);
  gearGeoms.push(bigGear1);
  const bigGear2 = createInvoluteGear(28, 1.6, 0.24, 0.4);
  bigGear2.translate(0, -1.8, 0);
  gearGeoms.push(bigGear2);
  const bevelPinion = createInvoluteGear(18, 0.9, 0.3, 0.25);
  bevelPinion.rotateX(Math.PI / 2);
  bevelPinion.translate(1.8, -1.2, 0);
  gearGeoms.push(bevelPinion);
  const mergedGears = safeMergeGeometries(gearGeoms);
  addMeshNode(doc, buffer, scene, mergedGears, matBronze, 'SM_Engine_GearTrain', [0, 0, 0]);

  const escGeoms = [];
  const escWheel = createInvoluteGear(30, 1.2, 0.12, 0.25);
  escWheel.rotateX(Math.PI / 2);
  escWheel.translate(0, -0.6, 0.8);
  escGeoms.push(escWheel);
  const anchorBar = new THREE.BoxGeometry(0.10, 1.6, 0.12);
  anchorBar.translate(0, -0.6, 1.3);
  escGeoms.push(anchorBar);
  const pallet1 = new THREE.BoxGeometry(0.20, 0.10, 0.12);
  pallet1.translate(-0.3, -0.3, 1.25);
  const pallet2 = new THREE.BoxGeometry(0.20, 0.10, 0.12);
  pallet2.translate(0.3, -0.9, 1.25);
  escGeoms.push(pallet1, pallet2);
  const mergedEsc = safeMergeGeometries(escGeoms);
  addMeshNode(doc, buffer, scene, mergedEsc, matSteel, 'SM_Engine_Escapement', [0, 0, 0]);

  const pendGeoms = [];
  const ribbon = new THREE.BoxGeometry(0.03, 2.4, 0.01);
  ribbon.translate(0, -1.0, 0);
  pendGeoms.push(ribbon);
  for (let b = 0; b < 4; b++) {
    const lobe = new THREE.CylinderGeometry(0.20, 0.20, 0.3, 16);
    const a = (b / 4) * Math.PI * 2;
    lobe.translate(Math.cos(a) * 0.55, -2.2, Math.sin(a) * 0.55);
    pendGeoms.push(lobe);
  }
  const mergedPend = safeMergeGeometries(pendGeoms);
  addMeshNode(doc, buffer, scene, mergedPend, matBronze, 'SM_Engine_TorsionPendulum', [-1.4, 0, 0]);

  const pipeGeoms = [];
  for (let p = 0; p < 3; p++) {
    const pipe = new THREE.CylinderGeometry(0.10, 0.10, 5.0, 16);
    pipe.translate(1.0 + p * 0.35, -2.5, -0.5 - p * 0.2);
    pipeGeoms.push(pipe);
  }
  const mergedPipes = safeMergeGeometries(pipeGeoms);
  addMeshNode(doc, buffer, scene, mergedPipes, matBronze, 'SM_Engine_HydraulicPipes', [1.2, 0, 0]);

  const io = new NodeIO();
  const glb = await io.writeBinary(doc);
  const outPath = path.join(MODELS_DIR, 'world02-engine.glb');
  fs.writeFileSync(outPath, Buffer.from(glb));
  console.log(`world02-engine.glb created (${glb.byteLength} bytes)`);
}

// -------------------------------------------------------------
// 4. GENERATE WORLD03-QUADRANTS.GLB
// -------------------------------------------------------------
async function generateWorld03Quadrants() {
  console.log('Generating world03-quadrants.glb...');
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene('QuadrantsHubScene');

  const matFloor = doc.createMaterial('MAT_RotundaFloor')
    .setBaseColorFactor([0.42, 0.38, 0.32, 1.0])
    .setMetallicFactor(0.4)
    .setRoughnessFactor(0.45);

  const matRobo = doc.createMaterial('MAT_RoboticsAlloy')
    .setBaseColorFactor([0.88, 0.72, 0.42, 1.0])
    .setMetallicFactor(0.9)
    .setRoughnessFactor(0.25);

  const matAero = doc.createMaterial('MAT_AerospaceComposite')
    .setBaseColorFactor([0.90, 0.90, 0.94, 1.0])
    .setMetallicFactor(0.85)
    .setRoughnessFactor(0.20);

  const matAI = doc.createMaterial('MAT_PhotonicCrystal')
    .setBaseColorFactor([0.35, 0.55, 0.95, 1.0])
    .setEmissiveFactor([0.25, 0.45, 0.90])
    .setRoughnessFactor(0.15);

  const matGreen = doc.createMaterial('MAT_SustainableAlloy')
    .setBaseColorFactor([0.45, 0.75, 0.55, 1.0])
    .setMetallicFactor(0.8)
    .setRoughnessFactor(0.35);

  const rotundaGeoms = [];
  const rotundaBase = new THREE.CylinderGeometry(8.5, 9.0, 0.5, 32);
  rotundaGeoms.push(rotundaBase);
  for (let w = 0; w < 4; w++) {
    const arm = new THREE.BoxGeometry(2.0, 0.35, 6.0);
    arm.rotateY((w / 4) * Math.PI * 2);
    rotundaGeoms.push(arm);
  }
  const mergedRotunda = safeMergeGeometries(rotundaGeoms);
  addMeshNode(doc, buffer, scene, mergedRotunda, matFloor, 'SM_Quad_Rotunda', [0, -0.3, 0]);

  // Robotics Arm
  const roboGeoms = [];
  const rBase = new THREE.CylinderGeometry(0.5, 0.65, 0.4, 16);
  roboGeoms.push(rBase);
  const joint1 = new THREE.SphereGeometry(0.38, 16, 16);
  joint1.translate(0, 0.5, 0);
  roboGeoms.push(joint1);
  const link1 = new THREE.CylinderGeometry(0.22, 0.28, 1.5, 16);
  link1.rotateZ(0.35);
  link1.translate(0.3, 1.1, 0);
  roboGeoms.push(link1);
  const joint2 = new THREE.SphereGeometry(0.32, 16, 16);
  joint2.translate(0.65, 1.8, 0);
  roboGeoms.push(joint2);
  const link2 = new THREE.CylinderGeometry(0.18, 0.22, 1.2, 16);
  link2.rotateZ(-0.55);
  link2.translate(1.1, 2.3, 0);
  roboGeoms.push(link2);
  const gBase = new THREE.BoxGeometry(0.25, 0.16, 0.32);
  gBase.translate(1.6, 2.6, 0);
  const finger1 = new THREE.BoxGeometry(0.06, 0.28, 0.06);
  finger1.translate(1.7, 2.8, 0.1);
  const finger2 = new THREE.BoxGeometry(0.06, 0.28, 0.06);
  finger2.translate(1.7, 2.8, -0.1);
  roboGeoms.push(gBase, finger1, finger2);
  const mergedRobo = safeMergeGeometries(roboGeoms);
  addMeshNode(doc, buffer, scene, mergedRobo, matRobo, 'SM_Quad_Robotics', [-3.6, 0.1, 0.8]);

  // Aerospace Waverider
  const aeroGeoms = [];
  const cone = new THREE.ConeGeometry(1.6, 3.6, 4);
  cone.rotateX(Math.PI / 2);
  cone.scale(1.0, 0.2, 1.0);
  aeroGeoms.push(cone);
  const fin1 = new THREE.BoxGeometry(0.06, 0.7, 0.7);
  fin1.rotateZ(0.25);
  fin1.translate(0.9, 0.35, 0.9);
  const fin2 = new THREE.BoxGeometry(0.06, 0.7, 0.7);
  fin2.rotateZ(-0.25);
  fin2.translate(-0.9, 0.35, 0.9);
  aeroGeoms.push(fin1, fin2);
  const engine = new THREE.CylinderGeometry(0.24, 0.32, 0.65, 16);
  engine.rotateX(Math.PI / 2);
  engine.translate(0, 0, 1.4);
  aeroGeoms.push(engine);
  const mergedAero = safeMergeGeometries(aeroGeoms);
  addMeshNode(doc, buffer, scene, mergedAero, matAero, 'SM_Quad_Aerospace', [-1.2, 0.8, -3.2]);

  // Cognitive Computing Photonic Lattice
  const aiGeoms = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = 0; y <= 2; y++) {
      for (let z = -1; z <= 1; z++) {
        const nodeSph = new THREE.SphereGeometry(0.12, 12, 12);
        nodeSph.translate(x * 0.7, y * 0.7, z * 0.7);
        aiGeoms.push(nodeSph);
      }
    }
  }
  for (let i = -1; i <= 1; i++) {
    const rodX = new THREE.CylinderGeometry(0.025, 0.025, 1.4, 8);
    rodX.rotateZ(Math.PI / 2);
    rodX.translate(0, 0.7, i * 0.7);
    const rodZ = new THREE.CylinderGeometry(0.025, 0.025, 1.4, 8);
    rodZ.rotateX(Math.PI / 2);
    rodZ.translate(i * 0.7, 0.7, 0);
    aiGeoms.push(rodX, rodZ);
  }
  const mergedAI = safeMergeGeometries(aiGeoms);
  addMeshNode(doc, buffer, scene, mergedAI, matAI, 'SM_Quad_Cognitive', [3.6, 0.1, 0.8]);

  // Sustainability Helical Turbine
  const greenGeoms = [];
  const mast = new THREE.CylinderGeometry(0.10, 0.12, 3.2, 16);
  mast.translate(0, 1.6, 0);
  greenGeoms.push(mast);
  for (let b = 0; b < 2; b++) {
    const bladeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(b * Math.PI) * 0.7, 0.3, Math.sin(b * Math.PI) * 0.7),
      new THREE.Vector3(Math.cos(b * Math.PI + 1.6) * 0.7, 1.6, Math.sin(b * Math.PI + 1.6) * 0.7),
      new THREE.Vector3(Math.cos(b * Math.PI + 3.2) * 0.7, 2.9, Math.sin(b * Math.PI + 3.2) * 0.7),
    ]);
    const bladeTube = new THREE.TubeGeometry(bladeCurve, 24, 0.10, 8, false);
    greenGeoms.push(bladeTube);
  }
  const solarBase = new THREE.CylinderGeometry(1.2, 1.4, 0.25, 16);
  solarBase.translate(0, 0.12, 0);
  greenGeoms.push(solarBase);
  const mergedGreen = safeMergeGeometries(greenGeoms);
  addMeshNode(doc, buffer, scene, mergedGreen, matGreen, 'SM_Quad_Sustainability', [1.2, 0.8, -3.2]);

  const io = new NodeIO();
  const glb = await io.writeBinary(doc);
  const outPath = path.join(MODELS_DIR, 'world03-quadrants.glb');
  fs.writeFileSync(outPath, Buffer.from(glb));
  console.log(`world03-quadrants.glb created (${glb.byteLength} bytes)`);
}

// -------------------------------------------------------------
// 5. GENERATE WORLD04-ARENA.GLB
// -------------------------------------------------------------
async function generateWorld04Arena() {
  console.log('Generating world04-arena.glb...');
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene('TechnoholixArenaScene');

  const matTruss = doc.createMaterial('MAT_TrussStructure')
    .setBaseColorFactor([0.30, 0.34, 0.42, 1.0])
    .setMetallicFactor(0.9)
    .setRoughnessFactor(0.35);

  const matDeck = doc.createMaterial('MAT_StageDeck')
    .setBaseColorFactor([0.12, 0.14, 0.20, 1.0])
    .setRoughnessFactor(0.8);

  const matPylon = doc.createMaterial('MAT_SearchlightPylon')
    .setBaseColorFactor([0.65, 0.65, 0.70, 1.0])
    .setMetallicFactor(0.95)
    .setRoughnessFactor(0.25);

  const matNexus = doc.createMaterial('MAT_CampusModel')
    .setBaseColorFactor([0.75, 0.68, 0.52, 1.0])
    .setMetallicFactor(0.6)
    .setRoughnessFactor(0.4);

  const stageGeoms = [];
  const deck = new THREE.CylinderGeometry(8.0, 8.5, 0.6, 32);
  deck.translate(0, 0.3, 0);
  stageGeoms.push(deck);

  for (let s = 0; s < 3; s++) {
    const angle = (s / 3) * Math.PI * 2;
    const leg = new THREE.CylinderGeometry(0.25, 0.35, 7.0, 12);
    leg.translate(Math.cos(angle) * 6.5, 3.8, Math.sin(angle) * 6.5);
    stageGeoms.push(leg);
  }
  const topRing = new THREE.TorusGeometry(6.5, 0.30, 12, 24);
  topRing.rotateX(Math.PI / 2);
  topRing.translate(0, 7.2, 0);
  stageGeoms.push(topRing);
  const mergedStage = safeMergeGeometries(stageGeoms);
  addMeshNode(doc, buffer, scene, mergedStage, matTruss, 'SM_Arena_MainStage', [0.0, -0.6, 0.0]);

  const pylonGeoms = [];
  for (let p = 0; p < 8; p++) {
    const ang = (p / 8) * Math.PI * 2;
    const px = Math.cos(ang) * 8.5;
    const pz = Math.sin(ang) * 8.5;
    const tower = new THREE.CylinderGeometry(0.18, 0.28, 5.0, 8);
    tower.translate(px, 2.5, pz);
    pylonGeoms.push(tower);
    const head = new THREE.SphereGeometry(0.35, 12, 12);
    head.translate(px, 5.2, pz);
    pylonGeoms.push(head);
  }
  const mergedPylons = safeMergeGeometries(pylonGeoms);
  addMeshNode(doc, buffer, scene, mergedPylons, matPylon, 'SM_Arena_LightPylons', [0.0, -0.6, 0.0]);

  const nexusGeoms = [];
  const table = new THREE.BoxGeometry(3.0, 0.3, 3.0);
  nexusGeoms.push(table);
  const convoBase = new THREE.BoxGeometry(0.7, 0.3, 0.5);
  convoBase.translate(-0.7, 0.3, -0.5);
  const convoDome = new THREE.SphereGeometry(0.2, 12, 12);
  convoDome.translate(-0.7, 0.5, -0.5);
  nexusGeoms.push(convoBase, convoDome);
  const oatTier = new THREE.TorusGeometry(0.35, 0.1, 8, 16, Math.PI);
  oatTier.rotateX(Math.PI / 2);
  oatTier.translate(0.7, 0.25, 0.6);
  nexusGeoms.push(oatTier);
  const lhc = new THREE.BoxGeometry(0.6, 0.45, 0.6);
  lhc.translate(0.7, 0.4, -0.5);
  nexusGeoms.push(lhc);
  const mergedNexus = safeMergeGeometries(nexusGeoms);
  addMeshNode(doc, buffer, scene, mergedNexus, matNexus, 'SM_Arena_CampusNexus', [3.2, 0.4, -1.5]);

  const io = new NodeIO();
  const glb = await io.writeBinary(doc);
  const outPath = path.join(MODELS_DIR, 'world04-arena.glb');
  fs.writeFileSync(outPath, Buffer.from(glb));
  console.log(`world04-arena.glb created (${glb.byteLength} bytes)`);
}

// -------------------------------------------------------------
// 6. GENERATE OBSERVATORY-1K.HDR (Radiance RGBE Format)
// -------------------------------------------------------------
function generateObservatoryHdr() {
  console.log('Generating observatory-1k.hdr...');
  const width = 512;
  const height = 256;
  const header = `#?RADIANCE\nFORMAT=32-bit_rle_rgbe\n\n-Y ${height} +X ${width}\n`;
  const headerBuf = Buffer.from(header, 'ascii');
  const pixelBuf = Buffer.alloc(width * height * 4);

  let ptr = 0;
  for (let y = 0; y < height; y++) {
    const v = y / (height - 1);
    for (let x = 0; x < width; x++) {
      const u = x / (width - 1);
      let r, g, b;
      if (v < 0.5) {
        const t = v * 2.0;
        r = 0.95 * (1 - t) + 0.15 * t;
        g = 0.66 * (1 - t) + 0.12 * t;
        b = 0.35 * (1 - t) + 0.28 * t;
        const distFromCenter = Math.sqrt((u - 0.5) ** 2 + v ** 2);
        if (distFromCenter < 0.2) {
          const spot = 1.0 - distFromCenter / 0.2;
          r += spot * 1.5;
          g += spot * 1.2;
          b += spot * 0.8;
        }
      } else {
        const t = (v - 0.5) * 2.0;
        r = 0.15 * (1 - t) + 0.05 * t;
        g = 0.12 * (1 - t) + 0.05 * t;
        b = 0.28 * (1 - t) + 0.08 * t;
      }

      const maxVal = Math.max(r, g, b);
      if (maxVal < 1e-32) {
        pixelBuf[ptr++] = 0;
        pixelBuf[ptr++] = 0;
        pixelBuf[ptr++] = 0;
        pixelBuf[ptr++] = 0;
      } else {
        const exponent = Math.ceil(Math.log2(maxVal));
        const factor = Math.pow(2, -exponent) * 256.0;
        pixelBuf[ptr++] = Math.min(255, Math.floor(r * factor));
        pixelBuf[ptr++] = Math.min(255, Math.floor(g * factor));
        pixelBuf[ptr++] = Math.min(255, Math.floor(b * factor));
        pixelBuf[ptr++] = Math.min(255, exponent + 128);
      }
    }
  }

  const outPath = path.join(TEXTURES_DIR, 'observatory-1k.hdr');
  fs.writeFileSync(outPath, Buffer.concat([headerBuf, pixelBuf]));
  console.log(`observatory-1k.hdr created (${headerBuf.length + pixelBuf.length} bytes)`);
}

async function main() {
  await generateAtlasHero();
  await generateWorld01Shell();
  await generateWorld02Engine();
  await generateWorld03Quadrants();
  await generateWorld04Arena();
  generateObservatoryHdr();
  console.log('All 3D assets generated successfully!');
}

main().catch(err => {
  console.error('Asset generation failed:', err);
  process.exit(1);
});
