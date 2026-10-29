import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const STATIONS = [
  { id: "services", name: "The Guild", label: "SERVICES", pos: [-18, 0, -10], wallColor: 0xC4A882, roofColor: 0x8B4C3B, height: 7, width: 6, depth: 6 },
  { id: "projects", name: "The Workshop", label: "MY WORK", pos: [8, 0, -16], wallColor: 0xD4B896, roofColor: 0x6B5B4C, height: 8, width: 5.5, depth: 5.5 },
  { id: "about", name: "The Tavern", label: "ABOUT ME", pos: [20, 0, 2], wallColor: 0xBDA27A, roofColor: 0x7C5A3B, height: 6, width: 5, depth: 5 },
  { id: "contact", name: "Falcon Post", label: "CONTACT", pos: [-10, 0, 14], wallColor: 0xC8B898, roofColor: 0x5C4A3A, height: 9, width: 4.5, depth: 4.5 },
  { id: "demos", name: "The Portal", label: "DEMOS", pos: [2, 0, -24], wallColor: 0xA89CC8, roofColor: 0x6B4C8A, height: 7, width: 5, depth: 5 },
];
const STAR_POS = [[-6, -4], [12, 6], [16, 12], [-3, 10], [-22, 4]];
const INTERACT_DIST = 7;
const COLLECT_DIST = 2.5;
const ISLAND_RADIUS = 38;
const SPAWN = [0, 8];

function terrainHeight(x, z) {
  const dist = Math.sqrt(x * x + z * z);
  if (dist > ISLAND_RADIUS + 2) return -5;
  const edge = Math.max(0, 1 - dist / ISLAND_RADIUS);
  const e = edge * edge * (3 - 2 * edge);
  let h = Math.sin(x * 0.08) * Math.cos(z * 0.06) * 3 + Math.sin(x * 0.15 + 1.3) * Math.sin(z * 0.18 + 0.7) * 1.5
    + Math.cos(x * 0.3 + z * 0.2) * 0.7 + Math.sin(x * 0.5 - z * 0.4 + 2.1) * 0.3;
  for (const s of STATIONS) {
    const bd = Math.hypot(x - s.pos[0], z - s.pos[2]);
    if (bd < 7) { const t = Math.max(0, (bd - 2) / 5); h *= t * t * (3 - 2 * t); }
  }
  for (const s of STATIONS) {
    const dx = s.pos[0] - SPAWN[0], dz = s.pos[2] - SPAWN[1], len2 = dx * dx + dz * dz;
    if (len2 > 0) {
      const t = Math.max(0, Math.min(1, ((x - SPAWN[0]) * dx + (z - SPAWN[1]) * dz) / len2));
      const pd = Math.hypot(x - (SPAWN[0] + dx * t), z - (SPAWN[1] + dz * t));
      if (pd < 1.8) h *= pd / 1.8;
    }
  }
  const sd = Math.hypot(x - SPAWN[0], z - SPAWN[1]);
  if (sd < 4) h *= sd / 4;
  return h * e;
}

function isOnPath(x, z) {
  for (const s of STATIONS) {
    const dx = s.pos[0] - SPAWN[0], dz = s.pos[2] - SPAWN[1], len2 = dx * dx + dz * dz;
    if (len2 > 0) {
      const t = Math.max(0, Math.min(1, ((x - SPAWN[0]) * dx + (z - SPAWN[1]) * dz) / len2));
      if (Math.hypot(x - (SPAWN[0] + dx * t), z - (SPAWN[1] + dz * t)) < 1.8) return true;
    }
  }
  return Math.hypot(x - SPAWN[0], z - SPAWN[1]) < 4;
}

const TREES = [];
for (let i = 0; i < 70; i++) {
  const a = i * 2.399963, r = 5 + (i * 0.55) % 28;
  const x = Math.cos(a) * r, z = Math.sin(a) * r;
  if (Math.sqrt(x * x + z * z) < ISLAND_RADIUS - 3 &&
    STATIONS.every(s => Math.hypot(x - s.pos[0], z - s.pos[2]) > 8) &&
    Math.hypot(x - SPAWN[0], z - SPAWN[1]) > 5 && !isOnPath(x, z))
    TREES.push([x, z, i % 5 === 0]);
}

const loader = new THREE.TextureLoader();
function loadMatcap(name) {
  const tex = loader.load(`/matcaps/${name}.png`);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function Game3D({ onOpen, onCollect, active, motion, gameRef }) {
  const canvasRef = useRef(null);
  const [nearest, setNearest] = useState(null);
  const [collected, setCollected] = useState([]);
  const activeRef = useRef(active); activeRef.current = active;
  const onOpenRef = useRef(onOpen); onOpenRef.current = onOpen;
  const onCollectRef = useRef(onCollect); onCollectRef.current = onCollect;
  const collectedRef = useRef([]);
  const keysRef = useRef(new Set());
  const labelsRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const shell = gameRef.current;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const px = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: false });
    renderer.setPixelRatio(px);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xC5DDF0, 0.004);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.5, 400);

    // Matcap textures — baked lighting, no scene lights needed
    const mcGreen = loadMatcap("green");
    const mcBrown = loadMatcap("brown");
    const mcBeige = loadMatcap("beige");
    const mcStone = loadMatcap("stone");
    const mcSkin = loadMatcap("skin");
    const mcTeal = loadMatcap("teal");
    const mcPurple = loadMatcap("purple");
    const mcPink = loadMatcap("pink");
    const mcDark = loadMatcap("dark");
    const mcRoof = loadMatcap("roof");
    const mcGold = loadMatcap("gold");

    // Matcap materials
    const greenMat = new THREE.MeshMatcapMaterial({ matcap: mcGreen });
    const greenMat2 = new THREE.MeshMatcapMaterial({ matcap: mcGreen, color: 0xCCFFCC });
    const greenMat3 = new THREE.MeshMatcapMaterial({ matcap: mcGreen, color: 0xAADDAA });
    const brownMat = new THREE.MeshMatcapMaterial({ matcap: mcBrown });
    const beigeMat = new THREE.MeshMatcapMaterial({ matcap: mcBeige });
    const stoneMat = new THREE.MeshMatcapMaterial({ matcap: mcStone });
    const skinMat = new THREE.MeshMatcapMaterial({ matcap: mcSkin });
    const tealMat = new THREE.MeshMatcapMaterial({ matcap: mcTeal });
    const purpleMat = new THREE.MeshMatcapMaterial({ matcap: mcPurple });
    const pinkMat = new THREE.MeshMatcapMaterial({ matcap: mcPink });
    const darkMat = new THREE.MeshMatcapMaterial({ matcap: mcDark });
    const roofMat = new THREE.MeshMatcapMaterial({ matcap: mcRoof, color: 0xDDBB99 });
    const goldMat = new THREE.MeshMatcapMaterial({ matcap: mcGold });
    const woodMat = new THREE.MeshMatcapMaterial({ matcap: mcBrown, color: 0xCCAA88 });
    const beamMat = new THREE.MeshMatcapMaterial({ matcap: mcBrown, color: 0x886644 });
    const glowMat = new THREE.MeshMatcapMaterial({ matcap: mcGold, color: 0xFFEECC });

    // Fallback sky gradient (shown until HDRI loads)
    const skyGeo = new THREE.SphereGeometry(180, 32, 16);
    const skyCol = new Float32Array(skyGeo.attributes.position.count * 3);
    for (let i = 0; i < skyGeo.attributes.position.count; i++) {
      const y = skyGeo.attributes.position.getY(i);
      const t = Math.max(0, Math.min(1, y / 180));
      skyCol[i * 3] = 0.75 - t * 0.40;
      skyCol[i * 3 + 1] = 0.88 - t * 0.33;
      skyCol[i * 3 + 2] = 1.0 - t * 0.08;
    }
    skyGeo.setAttribute("color", new THREE.BufferAttribute(skyCol, 3));
    const skyMesh = new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide }));
    scene.add(skyMesh);

    // HDRI — background only, no environment reflections needed for matcap
    let hdriTex = null;
    new RGBELoader().load("/hdri/meadow_2_1k.hdr", tex => {
      tex.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = tex;
      skyMesh.visible = false;
      hdriTex = tex;
    });

    // Terrain
    const tGeo = new THREE.PlaneGeometry(100, 100, 200, 200);
    tGeo.rotateX(-Math.PI / 2);
    const tPos = tGeo.attributes.position;
    const tCol = new Float32Array(tPos.count * 3);
    for (let i = 0; i < tPos.count; i++) {
      const x = tPos.getX(i), z = tPos.getZ(i), h = terrainHeight(x, z);
      tPos.setY(i, h);
      const d = Math.sqrt(x * x + z * z);
      let r, g, b;
      if (d > ISLAND_RADIUS) { r = 0.12; g = 0.30; b = 0.50; }
      else if (isOnPath(x, z)) { r = 0.50; g = 0.42; b = 0.32; }
      else {
        const n1 = Math.sin(x * 1.7 + z * 2.3) * .5 + .5;
        const hb = Math.max(0, Math.min(1, (h + 1) / 5));
        r = 0.25 + hb * .10 + n1 * .04; g = 0.55 + hb * .18 + n1 * .06; b = 0.20 + hb * .04;
        const ef = Math.max(0, 1 - (ISLAND_RADIUS - d) / 5);
        if (ef > 0) { r += (.72 - r) * ef; g += (.65 - g) * ef; b += (.50 - b) * ef; }
      }
      tCol[i * 3] = r; tCol[i * 3 + 1] = g; tCol[i * 3 + 2] = b;
    }
    tGeo.setAttribute("color", new THREE.BufferAttribute(tCol, 3));
    tGeo.computeVertexNormals();
    const terrain = new THREE.Mesh(tGeo, new THREE.MeshLambertMaterial({ vertexColors: true }));
    scene.add(terrain);

    // Water
    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(300, 300),
      new THREE.MeshMatcapMaterial({ matcap: mcTeal, color: 0x66CCDD, transparent: true, opacity: 0.85 })
    );
    water.rotation.x = -Math.PI / 2; water.position.y = -3;
    scene.add(water);

    // Buildings — stored for label projection
    const buildingData = STATIONS.map(s => {
      const g = new THREE.Group();
      const h = s.height, w = s.width, dp = s.depth;

      // Foundation
      const found = new THREE.Mesh(new THREE.BoxGeometry(w + 0.8, 0.4, dp + 0.8), stoneMat);
      found.position.y = 0.2; g.add(found);

      // Walls
      const walls = new THREE.Mesh(new THREE.BoxGeometry(w, h, dp), beigeMat);
      walls.position.y = h / 2 + 0.4; g.add(walls);

      // Roof
      const roofR = Math.max(w, dp) * 0.85;
      const roof = new THREE.Mesh(new THREE.ConeGeometry(roofR, 3.5, 4), roofMat);
      roof.position.y = h + 2.15; roof.rotation.y = Math.PI / 4; g.add(roof);

      // Chimney
      const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 0.5), stoneMat);
      chimney.position.set(w * 0.25, h + 2.5, -dp * 0.2); g.add(chimney);

      // Door
      const door = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.15), woodMat);
      door.position.set(0, 1.5, dp / 2 + 0.08); g.add(door);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.15, 0.2), beamMat);
      frame.position.set(0, 2.65, dp / 2 + 0.1); g.add(frame);

      // Steps
      for (let st = 0; st < 3; st++) {
        const step = new THREE.Mesh(new THREE.BoxGeometry(1.5 + st * 0.2, 0.12, 0.25), stoneMat);
        step.position.set(0, 0.06 + st * 0.12, dp / 2 + 0.3 + st * 0.2); g.add(step);
      }

      // Timber beams
      const hBeam = new THREE.BoxGeometry(w + 0.1, 0.1, 0.1);
      const vBeam = new THREE.BoxGeometry(0.1, h * 0.35, 0.1);
      [h * 0.35 + 0.4, h * 0.65 + 0.4].forEach(by => {
        const bm = new THREE.Mesh(hBeam, beamMat);
        bm.position.set(0, by, dp / 2 + 0.06); g.add(bm);
        const bmB = new THREE.Mesh(hBeam, beamMat);
        bmB.position.set(0, by, -dp / 2 - 0.06); g.add(bmB);
      });
      [-w * 0.3, 0, w * 0.3].forEach(bx => {
        const bm = new THREE.Mesh(vBeam, beamMat);
        bm.position.set(bx, h * 0.5 + 0.4, dp / 2 + 0.06); g.add(bm);
      });

      // Windows
      const wGeo = new THREE.BoxGeometry(0.6, 0.5, 0.08);
      [[-1, h * 0.5 + 0.4, dp / 2 + 0.05], [1, h * 0.5 + 0.4, dp / 2 + 0.05],
       [w / 2 + 0.04, h * 0.5 + 0.4, -0.5], [-w / 2 - 0.04, h * 0.5 + 0.4, 0]].forEach(([x, y, z]) => {
        const win = new THREE.Mesh(wGeo, glowMat);
        win.position.set(x, y, z);
        if (Math.abs(x) > w / 2) win.rotation.y = Math.PI / 2;
        g.add(win);
      });

      // Lantern
      const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 8), goldMat);
      lantern.position.set(w / 2 + 0.6, h * 0.4, dp / 2); g.add(lantern);

      // Beacon
      const beacon = new THREE.Mesh(new THREE.OctahedronGeometry(0.35), purpleMat);
      beacon.position.y = h + 5; g.add(beacon);

      const angle = Math.atan2(SPAWN[0] - s.pos[0], SPAWN[1] - s.pos[2]);
      g.rotation.y = angle;
      g.position.set(s.pos[0], terrainHeight(s.pos[0], s.pos[2]), s.pos[2]);
      scene.add(g);

      return { ...s, group: g, beacon, lantern, labelY: h + 3.5 };
    });

    // Character
    const charGroup = new THREE.Group();
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 12), skinMat);
    head.position.y = 1.6; charGroup.add(head);
    for (let i = 0; i < 7; i++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 6), darkMat);
      const a = (i / 7) * Math.PI * 2;
      spike.position.set(Math.cos(a) * 0.22, 1.82 + Math.random() * 0.08, Math.sin(a) * 0.18 - 0.03);
      spike.rotation.set(Math.sin(a) * 0.3, 0, Math.cos(a) * 0.4);
      charGroup.add(spike);
    }
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.5, 8, 12), purpleMat);
    torso.position.y = 1.1; charGroup.add(torso);
    const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.5, 6, 10), purpleMat);
    leftArm.position.set(-0.4, 1.15, 0); charGroup.add(leftArm);
    const rightArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.5, 6, 10), purpleMat);
    rightArm.position.set(0.4, 1.15, 0); charGroup.add(rightArm);
    const leftLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.5, 6, 10), new THREE.MeshMatcapMaterial({ matcap: mcPurple, color: 0x664488 }));
    leftLeg.position.set(-0.14, 0.5, 0); charGroup.add(leftLeg);
    const rightLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.5, 6, 10), new THREE.MeshMatcapMaterial({ matcap: mcPurple, color: 0x664488 }));
    rightLeg.position.set(0.14, 0.5, 0); charGroup.add(rightLeg);
    [[-0.14, 0.12, 0.05], [0.14, 0.12, 0.05]].forEach(([bx, by, bz]) => {
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.3), darkMat);
      boot.position.set(bx, by, bz); charGroup.add(boot);
    });
    const cape = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.8, 1, 3),
      new THREE.MeshMatcapMaterial({ matcap: mcPurple, color: 0xCCAAFF, side: THREE.DoubleSide }));
    cape.position.set(0, 1.1, -0.3); charGroup.add(cape);
    charGroup.position.set(SPAWN[0], terrainHeight(SPAWN[0], SPAWN[1]), SPAWN[1]);
    scene.add(charGroup);

    // Stars
    const starMeshes = STAR_POS.map(([sx, sz]) => {
      const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.45), goldMat);
      m.position.set(sx, terrainHeight(sx, sz) + 2, sz);
      scene.add(m); return m;
    });

    // Trees
    TREES.forEach(([tx, tz, isPink], i) => {
      const th = terrainHeight(tx, tz);
      const sc = isPink ? (0.6 + Math.sin(i * 5.1) * 0.25) : (0.7 + Math.sin(i * 3.7) * 0.3);
      const treeG = new THREE.Group();
      treeG.position.set(tx, th, tz);
      treeG.rotation.y = i * 2.399963;

      const trH = 2.8 * sc;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08 * sc, 0.22 * sc, trH, 6), brownMat);
      trunk.position.y = trH / 2;
      treeG.add(trunk);

      for (let r = 0; r < 3; r++) {
        const ra = (r / 3) * Math.PI * 2 + i * 0.7;
        const root = new THREE.Mesh(new THREE.CylinderGeometry(0.02 * sc, 0.08 * sc, 0.6 * sc, 4), brownMat);
        root.position.set(Math.cos(ra) * 0.18 * sc, 0.15 * sc, Math.sin(ra) * 0.18 * sc);
        root.rotation.set(Math.sin(ra) * 0.5, 0, Math.cos(ra) * 0.5);
        treeG.add(root);
      }

      if (isPink) {
        const centers = [[0, trH + 0.8 * sc, 0], [-0.5 * sc, trH + 0.3 * sc, 0.3 * sc], [0.4 * sc, trH + 0.4 * sc, -0.3 * sc], [0, trH + 1.3 * sc, 0.2 * sc]];
        centers.forEach(([cx, cy, cz], j) => {
          const r2 = (0.7 + j * 0.15) * sc;
          const leaf = new THREE.Mesh(new THREE.SphereGeometry(r2, 8, 6), pinkMat);
          leaf.position.set(cx, cy, cz);
          leaf.scale.y = 0.7;
          treeG.add(leaf);
        });
      } else {
        const variant = i % 3;
        const mat = [greenMat, greenMat2, greenMat3][variant];
        if (variant === 0) {
          [[0, trH + 0.6 * sc, 0, 1.3], [-0.3 * sc, trH + 0.3 * sc, 0.2 * sc, 0.9], [0.25 * sc, trH + 1.0 * sc, -0.15 * sc, 0.8]].forEach(([lx, ly, lz, lr]) => {
            const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(lr * sc, 1), mat);
            leaf.position.set(lx, ly, lz); treeG.add(leaf);
          });
        } else if (variant === 1) {
          for (let l = 0; l < 3; l++) {
            const ly = trH + l * 0.7 * sc;
            const lr = (1.5 - l * 0.35) * sc;
            const cone = new THREE.Mesh(new THREE.ConeGeometry(lr, 1.2 * sc, 7), mat);
            cone.position.y = ly; treeG.add(cone);
          }
        } else {
          const leaf = new THREE.Mesh(new THREE.SphereGeometry(1.6 * sc, 10, 7), mat);
          leaf.position.y = trH + 0.5 * sc;
          leaf.scale.set(1, 0.6, 1);
          treeG.add(leaf);
          const leaf2 = new THREE.Mesh(new THREE.SphereGeometry(1.0 * sc, 8, 6), mat);
          leaf2.position.set(0.5 * sc, trH + 1.0 * sc, 0.3 * sc);
          leaf2.scale.set(1, 0.55, 0.9);
          treeG.add(leaf2);
        }
      }
      scene.add(treeG);
    });

    // Rocks
    const rockGeo = new THREE.DodecahedronGeometry(1, 0);
    for (let i = 0; i < 50; i++) {
      const a = i * 3.83 + 1.7, r = 4 + (i * 0.82) % 30;
      const rx = Math.cos(a) * r, rz = Math.sin(a) * r;
      if (Math.sqrt(rx * rx + rz * rz) >= ISLAND_RADIUS - 2) continue;
      if (STATIONS.some(s => Math.hypot(rx - s.pos[0], rz - s.pos[2]) < 5)) continue;
      if (isOnPath(rx, rz)) continue;
      const rock = new THREE.Mesh(rockGeo, stoneMat);
      const rh = terrainHeight(rx, rz);
      const sc = 0.15 + Math.sin(i * 7.1) * 0.12;
      rock.position.set(rx, rh - 0.05, rz);
      rock.scale.set(sc * (0.8 + Math.random() * 0.4), sc * (0.5 + Math.random() * 0.5), sc * (0.8 + Math.random() * 0.4));
      rock.rotation.set(Math.random() * 0.3, Math.random() * Math.PI, Math.random() * 0.3);
      scene.add(rock);
    }

    // Bushes
    const bushGeo = new THREE.IcosahedronGeometry(0.5, 1);
    for (let i = 0; i < 35; i++) {
      const a = i * 5.17 + 0.3, r = 3 + (i * 1.1) % 28;
      const bx = Math.cos(a) * r, bz = Math.sin(a) * r;
      if (Math.sqrt(bx * bx + bz * bz) >= ISLAND_RADIUS - 3) continue;
      if (STATIONS.some(s => Math.hypot(bx - s.pos[0], bz - s.pos[2]) < 6)) continue;
      if (isOnPath(bx, bz)) continue;
      const bg = new THREE.Group();
      const sc = 0.4 + Math.sin(i * 4.3) * 0.25;
      const mat = i % 2 === 0 ? greenMat : greenMat3;
      for (let j = 0; j < 2 + (i % 2); j++) {
        const bush = new THREE.Mesh(bushGeo, mat);
        bush.position.set(j * 0.3 * sc, 0.2 * sc, (j - 1) * 0.2 * sc);
        bush.scale.set(sc * (0.8 + j * 0.2), sc * 0.6, sc * (0.9 + j * 0.1));
        bg.add(bush);
      }
      bg.position.set(bx, terrainHeight(bx, bz), bz);
      bg.rotation.y = i * 1.3;
      scene.add(bg);
    }

    // Flowers
    const flowerStemGeo = new THREE.CylinderGeometry(0.01, 0.015, 0.25, 4);
    const flowerHeadGeo = new THREE.SphereGeometry(0.04, 6, 4);
    for (let i = 0; i < 80; i++) {
      const a = i * 1.618 * Math.PI * 2, r2 = 3 + (i * 0.47) % 30;
      const fx = Math.cos(a) * r2, fz = Math.sin(a) * r2;
      if (Math.sqrt(fx * fx + fz * fz) >= ISLAND_RADIUS - 3) continue;
      if (STATIONS.some(s => Math.hypot(fx - s.pos[0], fz - s.pos[2]) < 5)) continue;
      if (isOnPath(fx, fz)) continue;
      const stem = new THREE.Mesh(flowerStemGeo, greenMat);
      const fh = terrainHeight(fx, fz);
      stem.position.set(fx, fh + 0.125, fz);
      scene.add(stem);
      const headMats = [pinkMat, goldMat, new THREE.MeshMatcapMaterial({ matcap: mcSkin, color: 0xFFFFFF }), purpleMat, goldMat];
      const fHead = new THREE.Mesh(flowerHeadGeo, headMats[i % headMats.length]);
      fHead.position.set(fx, fh + 0.27, fz);
      scene.add(fHead);
    }

    // Props near buildings
    const barrelGeo = new THREE.CylinderGeometry(0.35, 0.32, 0.8, 10);
    const crateGeo = new THREE.BoxGeometry(0.6, 0.5, 0.6);
    const lampPostGeo = new THREE.CylinderGeometry(0.04, 0.06, 2.5, 6);
    const lampGlassGeo = new THREE.SphereGeometry(0.15, 8, 6);
    const signGeo = new THREE.BoxGeometry(0.8, 0.5, 0.06);
    const signPostGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 4);

    STATIONS.forEach((s) => {
      const bx = s.pos[0], bz = s.pos[2], bh = terrainHeight(bx, bz);
      const angle = Math.atan2(SPAWN[0] - bx, SPAWN[1] - bz);

      for (let j = 0; j < 3; j++) {
        const ba = angle + (j - 1) * 0.8 + Math.PI * 0.8;
        const dist = 4 + j * 0.4;
        if (j < 2) {
          const b = new THREE.Mesh(barrelGeo, brownMat);
          b.position.set(bx + Math.sin(ba) * dist, bh + 0.4, bz + Math.cos(ba) * dist);
          b.rotation.set(j === 1 ? 0.3 : 0, j * 1.2, 0);
          scene.add(b);
        } else {
          const c = new THREE.Mesh(crateGeo, woodMat);
          c.position.set(bx + Math.sin(ba) * dist, bh + 0.25, bz + Math.cos(ba) * dist);
          c.rotation.y = j * 0.7;
          scene.add(c);
        }
      }

      const la = angle + 0.5;
      const lx = bx + Math.sin(la) * 5, lz = bz + Math.cos(la) * 5;
      const lh = terrainHeight(lx, lz);
      const post = new THREE.Mesh(lampPostGeo, darkMat);
      post.position.set(lx, lh + 1.25, lz); scene.add(post);
      const glass = new THREE.Mesh(lampGlassGeo, goldMat);
      glass.position.set(lx, lh + 2.6, lz); scene.add(glass);

      const sa = angle - 0.4;
      const sx = bx + Math.sin(sa) * 5.5, sz = bz + Math.cos(sa) * 5.5;
      const sh = terrainHeight(sx, sz);
      const sp = new THREE.Mesh(signPostGeo, brownMat);
      sp.position.set(sx, sh + 0.75, sz); scene.add(sp);
      const sign = new THREE.Mesh(signGeo, beigeMat);
      sign.position.set(sx, sh + 1.7, sz);
      sign.rotation.y = angle; scene.add(sign);
    });

    // Spawn well
    const wellBase = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.2, 0.6, 12), stoneMat);
    wellBase.position.set(SPAWN[0], terrainHeight(SPAWN[0], SPAWN[1]) + 0.3, SPAWN[1]);
    scene.add(wellBase);
    const wellWater = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.05, 12), tealMat);
    wellWater.position.set(SPAWN[0], terrainHeight(SPAWN[0], SPAWN[1]) + 0.55, SPAWN[1]);
    scene.add(wellWater);
    for (let i = 0; i < 4; i++) {
      const pa = (i / 4) * Math.PI * 2;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.5, 6), brownMat);
      pillar.position.set(SPAWN[0] + Math.cos(pa) * 0.9, terrainHeight(SPAWN[0], SPAWN[1]) + 1.35, SPAWN[1] + Math.sin(pa) * 0.9);
      scene.add(pillar);
    }
    const wellRoof = new THREE.Mesh(new THREE.ConeGeometry(1.3, 0.8, 4), roofMat);
    wellRoof.position.set(SPAWN[0], terrainHeight(SPAWN[0], SPAWN[1]) + 2.3, SPAWN[1]);
    wellRoof.rotation.y = Math.PI / 4; scene.add(wellRoof);

    // Cherry blossom petals
    const petalN = 300;
    const petalGeo = new THREE.BufferGeometry();
    const petalPos = new Float32Array(petalN * 3), petalVel = new Float32Array(petalN * 3);
    for (let i = 0; i < petalN; i++) {
      petalPos[i * 3] = (Math.random() - .5) * 80; petalPos[i * 3 + 1] = Math.random() * 20; petalPos[i * 3 + 2] = (Math.random() - .5) * 80;
      petalVel[i * 3] = (Math.random() - .5) * .3; petalVel[i * 3 + 1] = -.2 - Math.random() * .3; petalVel[i * 3 + 2] = (Math.random() - .5) * .3;
    }
    petalGeo.setAttribute("position", new THREE.BufferAttribute(petalPos, 3));
    const petals = new THREE.Points(petalGeo, new THREE.PointsMaterial({ color: 0xFFB7C5, size: 0.15, transparent: true, opacity: 0.7 }));
    scene.add(petals);

    // Fireflies
    const ffN = 50, ffGeo = new THREE.BufferGeometry(), ffPos = new Float32Array(ffN * 3);
    for (let i = 0; i < ffN; i++) {
      const fa = Math.random() * Math.PI * 2, fr = Math.random() * ISLAND_RADIUS * .8;
      ffPos[i * 3] = Math.cos(fa) * fr; ffPos[i * 3 + 1] = 1 + Math.random() * 4; ffPos[i * 3 + 2] = Math.sin(fa) * fr;
    }
    ffGeo.setAttribute("position", new THREE.BufferAttribute(ffPos, 3));
    const ffMat = new THREE.PointsMaterial({ color: 0xFFFF88, size: 0.12, transparent: true, opacity: 0.8 });
    scene.add(new THREE.Points(ffGeo, ffMat));

    // Lighting for terrain/water (matcap materials ignore lights)
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const sun = new THREE.DirectionalLight(0xFFF4D6, 0.8);
    sun.position.set(25, 35, 20);
    scene.add(sun);

    // State
    const char = { x: SPAWN[0], z: SPAWN[1], rot: Math.PI, moving: false, walkTime: 0, vy: 0, yOff: 0, grounded: true };
    let camYaw = 0, camPitch = 0.6, camDist = 12;
    let dragging = false, lastMX = 0, lastMY = 0;
    const keys = keysRef.current;
    let stateNearest = null;
    let firstMove = false;

    // Input
    function onKeyDown(e) {
      if (!activeRef.current) return;
      const k = e.key.toLowerCase();
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "shift", " "].includes(k)) {
        e.preventDefault(); keys.add(k);
      }
      if (k === "e" && !e.repeat && stateNearest) {
        e.preventDefault(); keys.clear(); onOpenRef.current(stateNearest.id);
      }
    }
    function onKeyUp(e) { keys.delete(e.key.toLowerCase()); }
    function onBlur() { keys.clear(); }
    function onPtrDown(e) {
      dragging = true; lastMX = e.clientX; lastMY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
      shell?.focus({ preventScroll: true });
    }
    function onPtrMove(e) {
      if (!dragging) return;
      camYaw -= (e.clientX - lastMX) * 0.005;
      camPitch = Math.max(0.15, Math.min(1.3, camPitch + (e.clientY - lastMY) * 0.005));
      lastMX = e.clientX; lastMY = e.clientY;
    }
    function onPtrUp(e) { dragging = false; canvas.releasePointerCapture(e.pointerId); }
    function onWhl(e) { camDist = Math.max(5, Math.min(25, camDist + e.deltaY * 0.015)); }
    function onCtx(e) { e.preventDefault(); }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    canvas.addEventListener("pointerdown", onPtrDown);
    canvas.addEventListener("pointermove", onPtrMove);
    canvas.addEventListener("pointerup", onPtrUp);
    canvas.addEventListener("pointercancel", onPtrUp);
    canvas.addEventListener("wheel", onWhl, { passive: true });
    canvas.addEventListener("contextmenu", onCtx);

    let musicRetried = false;
    function retryMusic() {
      if (musicRetried) return;
      musicRetried = true;
      const track = document.querySelector('audio[data-audio="music"]');
      if (track && track.paused) { track.volume = 0.25; void track.play().catch(() => {}); }
    }
    canvas.addEventListener("pointerdown", retryMusic, { once: true });

    const _fwd = new THREE.Vector3(), _rt = new THREE.Vector3(), _mv = new THREE.Vector3();
    const _cp = new THREE.Vector3(), _cl = new THREE.Vector3();
    const _projVec = new THREE.Vector3();

    let frame, lastT = 0;
    function tick(time) {
      const dt = lastT ? Math.min((time - lastT) / 1000, 0.05) : 0;
      lastT = time;

      if (activeRef.current && dt > 0) {
        const fwd = keys.has("w") || keys.has("arrowup");
        const bwd = keys.has("s") || keys.has("arrowdown");
        const lft = keys.has("a") || keys.has("arrowleft");
        const rgt = keys.has("d") || keys.has("arrowright");
        const run = keys.has("shift");

        _fwd.set(-Math.sin(camYaw), 0, -Math.cos(camYaw));
        _rt.set(-_fwd.z, 0, _fwd.x);
        _mv.set(0, 0, 0);
        if (fwd) _mv.add(_fwd); if (bwd) _mv.sub(_fwd);
        if (rgt) _mv.add(_rt); if (lft) _mv.sub(_rt);

        const isMoving = _mv.lengthSq() > 0.001;
        if (isMoving) {
          _mv.normalize();
          const spd = run ? 12 : 7;
          let nx = char.x + _mv.x * spd * dt, nz = char.z + _mv.z * spd * dt;
          const d2 = Math.sqrt(nx * nx + nz * nz);
          if (d2 > ISLAND_RADIUS - 1) {
            const a2 = Math.atan2(nx, nz);
            nx = Math.sin(a2) * (ISLAND_RADIUS - 1); nz = Math.cos(a2) * (ISLAND_RADIUS - 1);
          }
          for (const s of STATIONS) {
            const bd = Math.hypot(nx - s.pos[0], nz - s.pos[2]);
            if (bd < 3.5) {
              const ba = Math.atan2(nx - s.pos[0], nz - s.pos[2]);
              nx = s.pos[0] + Math.sin(ba) * 3.5; nz = s.pos[2] + Math.cos(ba) * 3.5;
            }
          }
          char.x = nx; char.z = nz;
          const tgt = Math.atan2(_mv.x, _mv.z);
          let diff = tgt - char.rot;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          char.rot += diff * Math.min(dt * 12, 1);
          if (!firstMove) firstMove = true;
        }
        char.moving = isMoving;
        char.walkTime = isMoving ? char.walkTime + dt * (run ? 14 : 10) : 0;

        // Jump
        if (keys.has(" ") && char.grounded) { char.vy = 8; char.grounded = false; }
        char.vy -= 22 * dt;
        char.yOff += char.vy * dt;
        if (char.yOff <= 0) { char.yOff = 0; char.vy = 0; char.grounded = true; }

        const cy = terrainHeight(char.x, char.z);
        charGroup.position.set(char.x, cy + char.yOff, char.z);
        charGroup.rotation.y = char.rot;
        if (!char.grounded) {
          leftLeg.rotation.x = -0.4; rightLeg.rotation.x = -0.4;
          leftArm.rotation.x = -0.8; rightArm.rotation.x = -0.8;
          cape.rotation.x = 0.4;
        } else if (char.moving) {
          const t = char.walkTime;
          leftArm.rotation.x = Math.sin(t) * .6; rightArm.rotation.x = -Math.sin(t) * .6;
          leftLeg.rotation.x = -Math.sin(t) * .7; rightLeg.rotation.x = Math.sin(t) * .7;
          charGroup.position.y += Math.abs(Math.sin(t * 2)) * .06;
          cape.rotation.x = Math.sin(t * .5) * .2 + .15;
        } else {
          leftArm.rotation.x *= .85; rightArm.rotation.x *= .85;
          leftLeg.rotation.x *= .85; rightLeg.rotation.x *= .85;
          cape.rotation.x *= .9;
          torso.scale.y = 1 + Math.sin(time * .003) * .015;
        }

        let found = null;
        for (const s of STATIONS)
          if (Math.hypot(char.x - s.pos[0], char.z - s.pos[2]) < INTERACT_DIST) { found = s; break; }
        if (found?.id !== stateNearest?.id) { stateNearest = found; setNearest(found); }

        starMeshes.forEach((m, i) => {
          if (!m.visible) return;
          if (Math.hypot(char.x - m.position.x, char.z - m.position.z) < COLLECT_DIST) {
            m.visible = false;
            collectedRef.current = [...collectedRef.current, i];
            setCollected([...collectedRef.current]);
            onCollectRef.current();
          }
        });
      }

      // Camera
      const lookY = terrainHeight(char.x, char.z) + char.yOff + 1.3;
      _cp.set(
        char.x + Math.sin(camYaw) * camDist * Math.cos(camPitch),
        lookY + Math.sin(camPitch) * camDist,
        char.z + Math.cos(camYaw) * camDist * Math.cos(camPitch)
      );
      camera.position.lerp(_cp, dt > 0 ? Math.min(dt * 6, 1) : 1);
      _cl.set(char.x, lookY, char.z);
      camera.lookAt(_cl);

      skyMesh.position.copy(camera.position);

      // Animate
      starMeshes.forEach((m, i) => {
        if (!m.visible) return;
        m.rotation.y = time * .002 + i;
        m.position.y = terrainHeight(STAR_POS[i][0], STAR_POS[i][1]) + 2 + Math.sin(time * .003 + i * 2) * .3;
      });
      buildingData.forEach((b, i) => {
        b.beacon.rotation.y = time * .001;
      });

      const pp = petals.geometry.attributes.position;
      for (let i = 0; i < petalN; i++) {
        let px2 = pp.getX(i) + petalVel[i * 3] * dt;
        let py = pp.getY(i) + petalVel[i * 3 + 1] * dt;
        let pz = pp.getZ(i) + petalVel[i * 3 + 2] * dt;
        px2 += Math.sin(time * .001 + i) * .008;
        pz += Math.cos(time * .001 + i * .7) * .008;
        if (py < 0) { py = 15 + Math.random() * 5; px2 = (Math.random() - .5) * 80; pz = (Math.random() - .5) * 80; }
        pp.setXYZ(i, px2, py, pz);
      }
      pp.needsUpdate = true;

      const fp = ffGeo.attributes.position;
      for (let i = 0; i < ffN; i++) fp.setY(i, fp.getY(i) + Math.sin(time * .002 + i * 3.14) * .003);
      fp.needsUpdate = true;
      ffMat.opacity = .5 + Math.sin(time * .002) * .3;

      water.position.y = -3 + Math.sin(time * .001) * .15;

      renderer.render(scene, camera);

      // Project building labels to screen space (clamped to viewport)
      const lc = labelsRef.current;
      if (lc) {
        const cw = canvas.clientWidth, ch = canvas.clientHeight;
        buildingData.forEach((b, i) => {
          const el = lc.children[i];
          if (!el) return;
          _projVec.set(b.pos[0], terrainHeight(b.pos[0], b.pos[2]) + b.labelY, b.pos[2]);
          _projVec.project(camera);
          const behind = _projVec.z > 1;
          const dist = Math.hypot(char.x - b.pos[0], char.z - b.pos[2]);
          const vis = !behind && dist < 50;
          el.style.display = vis ? "" : "none";
          if (vis) {
            let sx = (1 + _projVec.x) * cw / 2;
            let sy = (1 - _projVec.y) * ch / 2;
            sx = Math.max(60, Math.min(cw - 60, sx));
            sy = Math.max(130, Math.min(ch - 30, sy));
            const scale = Math.max(0.6, Math.min(1.2, 15 / Math.max(dist, 5)));
            el.style.transform = `translate(-50%,-100%) translate(${sx}px,${sy}px) scale(${scale})`;
            el.style.opacity = dist < 40 ? "1" : String(Math.max(0, 1 - (dist - 40) / 10));
          }
        });
        const spawnEl = lc.children[buildingData.length];
        if (spawnEl) {
          if (firstMove) {
            spawnEl.style.display = "none";
          } else {
            _projVec.set(SPAWN[0], terrainHeight(SPAWN[0], SPAWN[1]) + 4, SPAWN[1]);
            _projVec.project(camera);
            const sx = Math.max(60, Math.min(cw - 60, (1 + _projVec.x) * cw / 2));
            const sy = Math.max(130, Math.min(ch - 30, (1 - _projVec.y) * ch / 2));
            spawnEl.style.transform = `translate(-50%,-100%) translate(${sx}px,${sy}px)`;
          }
        }
      }

      frame = requestAnimationFrame(tick);
    }

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame); ro.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      canvas.removeEventListener("pointerdown", onPtrDown);
      canvas.removeEventListener("pointermove", onPtrMove);
      canvas.removeEventListener("pointerup", onPtrUp);
      canvas.removeEventListener("pointercancel", onPtrUp);
      canvas.removeEventListener("wheel", onWhl);
      canvas.removeEventListener("contextmenu", onCtx);
      canvas.removeEventListener("pointerdown", retryMusic);
      renderer.dispose(); hdriTex?.dispose();
      scene.traverse(o => {
        o.geometry?.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
      });
    };
  }, []);

  function padDown(key) { return e => { e.preventDefault(); keysRef.current.add(key); }; }
  function padUp(key) { return () => keysRef.current.delete(key); }

  return (
    <div className="game3d-shell" ref={gameRef} tabIndex="0" onBlur={() => keysRef.current.clear()}>
      <canvas ref={canvasRef} className="game3d-canvas" />
      {/* Screen-space labels — always readable regardless of camera angle */}
      <div className="game3d-labels" ref={labelsRef}>
        {STATIONS.map(s => (
          <div key={s.id} className="building-label">
            <div className="bl-name">{s.name}</div>
            <div className="bl-type">{s.label}</div>
          </div>
        ))}
        <div className="spawn-instruction">
          Walk towards the buildings and press <kbd>E</kbd> to explore
        </div>
      </div>
      <div className="game3d-hud">
        <span className="game3d-stars" title="Collect the five stars around the island">
          ✦ <b>{collected.length}</b> / 5
        </span>
      </div>
      {nearest && (
        <button className="game3d-interact" onClick={() => { keysRef.current.clear(); onOpen(nearest.id); }}>
          <kbd>E</kbd> Enter {nearest.name}
        </button>
      )}
      <div className="game3d-bottom">
        <span className="game3d-hint">
          {collected.length === 5
            ? "✦ All stars found. Explorer status: legendary."
            : "WASD to walk · Space to jump · Drag to look · E to interact · Shift to run"}
        </span>
      </div>
      <div className="game3d-dpad" aria-label="Touch controls">
        {[["↑", "w", "Walk forward"], ["←", "a", "Walk left"], ["↓", "s", "Walk back"], ["→", "d", "Walk right"]].map(([l, k, a]) => (
          <button key={k} aria-label={a} onPointerDown={padDown(k)} onPointerUp={padUp(k)}
            onPointerCancel={padUp(k)} onPointerLeave={padUp(k)}>{l}</button>
        ))}
        <button aria-label="Sprint" className="game3d-boost" onPointerDown={padDown("shift")}
          onPointerUp={padUp("shift")} onPointerCancel={padUp("shift")} onPointerLeave={padUp("shift")}>⚡</button>
      </div>
    </div>
  );
}
