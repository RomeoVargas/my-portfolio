import React, { useEffect, useRef, useState } from "react";
import { createScene, THREE } from "./three-setup.js";
import DemoShell from "./DemoShell.jsx";

const FLEET = [
  { name: "Phantom GT", cls: "Sports", hp: 670, accel: "2.8s", top: "211 mph", price: "$89,900", color: 0x111111 },
  { name: "Apex S", cls: "Sedan", hp: 382, accel: "4.1s", top: "168 mph", price: "$52,500", color: 0x1a1a3a },
  { name: "Storm X", cls: "SUV", hp: 450, accel: "3.9s", top: "155 mph", price: "$74,200", color: 0x2a1a0a },
  { name: "Pulse EV", cls: "Electric", hp: 580, accel: "2.2s", top: "175 mph", price: "$67,800", color: 0x0a2a1a },
];

function buildCar(scene) {
  const group = new THREE.Group();

  const shape = new THREE.Shape();
  shape.moveTo(-2.2, 0.15);
  shape.lineTo(-2.0, 0.18);
  shape.quadraticCurveTo(-1.7, 0.2, -1.5, 0.25);
  shape.lineTo(-1.3, 0.28);
  shape.quadraticCurveTo(-1.1, 0.32, -0.9, 0.45);
  shape.quadraticCurveTo(-0.7, 0.58, -0.5, 0.7);
  shape.lineTo(-0.3, 0.78);
  shape.quadraticCurveTo(-0.1, 0.85, 0.1, 0.92);
  shape.quadraticCurveTo(0.3, 0.98, 0.5, 1.0);
  shape.lineTo(0.7, 1.0);
  shape.quadraticCurveTo(0.9, 0.99, 1.0, 0.95);
  shape.quadraticCurveTo(1.1, 0.9, 1.2, 0.82);
  shape.lineTo(1.35, 0.72);
  shape.quadraticCurveTo(1.5, 0.62, 1.65, 0.55);
  shape.quadraticCurveTo(1.8, 0.48, 1.95, 0.42);
  shape.lineTo(2.1, 0.38);
  shape.quadraticCurveTo(2.2, 0.34, 2.25, 0.3);
  shape.quadraticCurveTo(2.28, 0.25, 2.25, 0.2);
  shape.lineTo(2.2, 0.18);
  shape.quadraticCurveTo(2.1, 0.15, 2.0, 0.15);
  shape.lineTo(-2.2, 0.15);

  const bodyGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 1.8, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3,
  });
  bodyGeo.center();
  bodyGeo.translate(0, 0.15, 0);

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x111111, metalness: 0.95, roughness: 0.05,
    clearcoat: 1.0, clearcoatRoughness: 0.03, reflectivity: 1,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const edges = new THREE.EdgesGeometry(bodyGeo, 15);
  group.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.25 })));

  const wsShape = new THREE.Shape();
  wsShape.moveTo(-0.5, 0.72);
  wsShape.quadraticCurveTo(-0.2, 0.88, 0.1, 0.95);
  wsShape.quadraticCurveTo(0.4, 1.0, 0.7, 1.02);
  wsShape.lineTo(0.7, 1.0);
  wsShape.quadraticCurveTo(0.4, 0.97, 0.1, 0.92);
  wsShape.quadraticCurveTo(-0.2, 0.85, -0.5, 0.7);
  const wsGeo = new THREE.ExtrudeGeometry(wsShape, { depth: 1.6, bevelEnabled: false });
  wsGeo.center();
  wsGeo.translate(0.1, 0.15, 0);
  group.add(new THREE.Mesh(wsGeo, new THREE.MeshPhysicalMaterial({
    color: 0x88ccff, metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.35, transmission: 0.7,
  })));

  const wheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.22, 24);
  const hubGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.24, 16);
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9, metalness: 0.1 });
  const hubMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.2, metalness: 0.9 });
  [[-1.4, 0.34, 0.85], [-1.4, 0.34, -0.85], [1.5, 0.34, 0.85], [1.5, 0.34, -0.85]].forEach(([x, y, z]) => {
    const tire = new THREE.Mesh(wheelGeo, tireMat);
    tire.rotation.x = Math.PI / 2;
    tire.position.set(x, y, z);
    tire.castShadow = true;
    group.add(tire);
    const hub = new THREE.Mesh(hubGeo, hubMat);
    hub.rotation.x = Math.PI / 2;
    hub.position.set(x, y, z);
    group.add(hub);
  });

  const hlGeo = new THREE.SphereGeometry(0.06, 12, 12);
  const hlMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2 });
  [[-2.1, 0.4, 0.55], [-2.1, 0.4, -0.55]].forEach(([x, y, z]) => {
    group.add(Object.assign(new THREE.Mesh(hlGeo, hlMat), { position: new THREE.Vector3(x, y, z) }));
  });
  const tlMat = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff2200, emissiveIntensity: 1.5 });
  [[2.2, 0.35, 0.5], [2.2, 0.35, -0.5]].forEach(([x, y, z]) => {
    group.add(Object.assign(new THREE.Mesh(hlGeo, tlMat), { position: new THREE.Vector3(x, y, z) }));
  });

  scene.add(group);
  return { group, bodyMat };
}

export default function AutoDealership() {
  const canvasRef = useRef(null);
  const bodyMatRef = useRef(null);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { scene, camera, controls, start, dispose } = createScene(canvas, {
      background: 0x050810, bloom: true, bloomStrength: 1.2, bloomRadius: 0.5, bloomThreshold: 0.8,
      autoRotateSpeed: 0.3, fog: 0.015, fov: 40, exposure: 1.0,
    });

    camera.position.set(6, 2.8, 7);
    camera.lookAt(0, 0.6, 0);
    controls.target.set(0, 0.6, 0);
    controls.minPolarAngle = 0.3;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 4;
    controls.maxDistance = 14;

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshStandardMaterial({ color: 0x080808, metalness: 0.85, roughness: 0.25 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Neon grid
    const grid = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60, 60, 60),
      new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.045 }),
    );
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = 0.005;
    scene.add(grid);

    // Lights
    scene.add(new THREE.AmbientLight(0x111122, 0.4));

    const cyan = new THREE.SpotLight(0x00d4ff, 80, 30, Math.PI / 5, 0.5, 1);
    cyan.position.set(-5, 6, 4);
    cyan.castShadow = true;
    cyan.shadow.mapSize.set(1024, 1024);
    scene.add(cyan);
    scene.add(cyan.target);

    const orange = new THREE.SpotLight(0xff6b00, 40, 25, Math.PI / 5, 0.6, 1);
    orange.position.set(5, 5, -4);
    scene.add(orange);
    scene.add(orange.target);

    const top = new THREE.SpotLight(0xffffff, 60, 30, Math.PI / 4, 0.4, 1);
    top.position.set(0, 10, 0);
    top.castShadow = true;
    top.shadow.mapSize.set(1024, 1024);
    scene.add(top);
    scene.add(top.target);

    // Car
    const { bodyMat } = buildCar(scene);
    bodyMatRef.current = bodyMat;

    // Particles
    const pPos = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      const r = 4 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = Math.abs(r * Math.cos(phi)) * 0.6;
      pPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x00d4ff, size: 0.035, transparent: true, opacity: 0.5 }));
    scene.add(particles);

    start((t) => { particles.rotation.y = t * 0.03; });
    return dispose;
  }, []);

  useEffect(() => {
    if (bodyMatRef.current) bodyMatRef.current.color.setHex(FLEET[selected].color);
  }, [selected]);

  return (
    <DemoShell industry="Auto Dealership">
      <style>{`
        .da-page{background:#050810;color:#e8ecf4;font-family:system-ui,-apple-system,sans-serif;min-height:100vh}
        .da-showroom{position:relative;width:100%;height:70vh;min-height:500px;overflow:hidden}
        .da-canvas{display:block;width:100%;height:100%}
        .da-overlay{position:absolute;top:0;left:0;right:0;display:flex;flex-direction:column;align-items:center;padding-top:48px;pointer-events:none;text-align:center}
        .da-title{font-size:clamp(2.5rem,6vw,5rem);font-weight:900;letter-spacing:.15em;margin:0;color:#fff;text-shadow:0 0 40px #00d4ff44,0 0 80px #00d4ff22}
        .da-tagline{font-size:clamp(1rem,2vw,1.5rem);color:#00d4ff;margin-top:8px;letter-spacing:.3em;text-transform:uppercase}
        .da-hint{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);font-size:.875rem;color:#ffffff55;letter-spacing:.1em}
        .da-content{max-width:1200px;margin:0 auto;padding:0 32px}
        .da-slabel{font-size:.875rem;letter-spacing:.12em;color:#00d4ff;text-transform:uppercase;font-weight:600;margin-bottom:12px}
        .da-stitle{font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;letter-spacing:-.02em;margin:0 0 32px}
        .da-fleet{padding:64px 0}
        .da-fleet-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
        .da-car-card{background:#0a0f1a;border:1px solid #1a2035;border-radius:12px;padding:28px;cursor:pointer;transition:transform .25s,border-color .25s,box-shadow .25s}
        .da-car-card:hover,.da-car-card.da-active{transform:translateY(-4px);border-color:#00d4ff;box-shadow:0 8px 32px #00d4ff18}
        .da-car-card.da-active{background:#0c1220}
        .da-car-cls{font-size:.75rem;letter-spacing:.1em;color:#00d4ff;text-transform:uppercase;font-weight:600}
        .da-car-name{font-size:1.375rem;font-weight:700;margin:6px 0 16px}
        .da-car-specs{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px}
        .da-sv{font-size:1.125rem;font-weight:700;color:#fff}
        .da-sl{font-size:.75rem;color:#667;letter-spacing:.05em}
        .da-car-price{font-size:1.5rem;font-weight:800;color:#00d4ff}
        .da-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#1a2035;border-radius:12px;overflow:hidden;margin-bottom:64px}
        .da-stat{background:#0a0f1a;padding:28px 20px;text-align:center}
        .da-stat-num{font-size:2rem;font-weight:900;color:#00d4ff}
        .da-stat-lbl{font-size:.875rem;color:#667;margin-top:4px}
        .da-cta{text-align:center;padding:64px 0 80px}
        .da-cta h2{font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;margin-bottom:32px}
        .da-form{display:flex;gap:12px;max-width:600px;margin:0 auto;flex-wrap:wrap;justify-content:center}
        .da-input{flex:1;min-width:160px;padding:14px 18px;background:#0a0f1a;border:1px solid #1a2035;border-radius:8px;color:#e8ecf4;font-size:1rem;outline:none;transition:border-color .2s;font-family:inherit}
        .da-input:focus{border-color:#00d4ff;box-shadow:0 0 12px #00d4ff22}
        .da-submit{padding:14px 32px;background:#00d4ff;color:#050810;border:none;border-radius:8px;font-size:1rem;font-weight:700;cursor:pointer;letter-spacing:.05em;transition:background .2s,box-shadow .2s}
        .da-submit:hover{background:#33e0ff;box-shadow:0 0 24px #00d4ff44}
        @media(max-width:768px){.da-showroom{height:50vh;min-height:360px}.da-overlay{padding-top:24px}.da-stats{grid-template-columns:repeat(2,1fr)}.da-content{padding:0 20px}}
      `}</style>
      <div className="da-page">
        <div className="da-showroom">
          <canvas ref={canvasRef} className="da-canvas" />
          <div className="da-overlay">
            <h1 className="da-title">VELOCITY MOTORS</h1>
            <p className="da-tagline">Feel the power.</p>
          </div>
          <span className="da-hint">Drag to explore &middot; Scroll to zoom</span>
        </div>
        <div className="da-content">
          <section className="da-fleet">
            <p className="da-slabel">Our Fleet</p>
            <h2 className="da-stitle">Choose your machine.</h2>
            <div className="da-fleet-grid">
              {FLEET.map((car, i) => (
                <div key={car.name} className={`da-car-card${selected === i ? " da-active" : ""}`} onClick={() => setSelected(i)}>
                  <span className="da-car-cls">{car.cls}</span>
                  <h3 className="da-car-name">{car.name}</h3>
                  <div className="da-car-specs">
                    <div><div className="da-sv">{car.hp}</div><div className="da-sl">HP</div></div>
                    <div><div className="da-sv">{car.accel}</div><div className="da-sl">0–60</div></div>
                    <div><div className="da-sv">{car.top}</div><div className="da-sl">TOP SPEED</div></div>
                  </div>
                  <span className="da-car-price">{car.price}</span>
                </div>
              ))}
            </div>
          </section>
          <div className="da-stats">
            {[["200+","Models"],["0%","APR Available"],["5-Star","Certified"],["24/7","Support"]].map(([n,l])=>(
              <div className="da-stat" key={l}><div className="da-stat-num">{n}</div><div className="da-stat-lbl">{l}</div></div>
            ))}
          </div>
          <section className="da-cta">
            <h2>Schedule Your Test Drive</h2>
            <div className="da-form">
              <input className="da-input" placeholder="Your name" aria-label="Name" />
              <input className="da-input" placeholder="Email" type="email" aria-label="Email" />
              <input className="da-input" placeholder="Phone" type="tel" aria-label="Phone" />
              <button className="da-submit">BOOK NOW</button>
            </div>
          </section>
        </div>
      </div>
    </DemoShell>
  );
}
