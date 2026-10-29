import { createScene, THREE } from "./three-setup.js";
import React, { useEffect, useRef, useState } from "react";
import DemoShell from "./DemoShell.jsx";

const MENU = {
  Starters: [
    { name: "Truffle Burrata", price: 18, desc: "Creamy burrata with black truffle shavings, heirloom tomatoes, and aged balsamic.", note: "Our burrata is flown in from Puglia twice a week." },
    { name: "Seared Scallops", price: 24, desc: "Pan-seared diver scallops with cauliflower purée and brown butter.", note: "Dry-seared for a perfect golden crust — no oil." },
    { name: "Wild Mushroom Soup", price: 14, desc: "Velvety blend of porcini, chanterelle, and shiitake with truffle oil.", note: "A recipe passed down from our founding chef." },
    { name: "Wagyu Tartare", price: 28, desc: "Hand-cut A5 wagyu with quail egg, capers, and house-made brioche.", note: "Served at table temperature for maximum flavor." },
  ],
  Mains: [
    { name: "Dry-Aged Ribeye", price: 62, desc: "45-day dry-aged prime ribeye with bone marrow butter and roasted garlic.", note: "Aged in our on-site dry-aging room." },
    { name: "Pan-Seared Halibut", price: 48, desc: "Wild halibut with saffron beurre blanc, fennel, and citrus.", note: "Sustainably sourced from the North Atlantic." },
    { name: "Braised Short Rib", price: 54, desc: "72-hour braised short rib with red wine reduction and celery root.", note: "Low and slow — the only way we know." },
    { name: "Forest Risotto", price: 38, desc: "Carnaroli rice with wild mushrooms, aged parmesan, and white truffle.", note: "Stirred to order. Worth the wait." },
  ],
  Desserts: [
    { name: "Crème Brûlée", price: 16, desc: "Classic Tahitian vanilla bean custard with caramelized sugar.", note: "Torched tableside for the perfect crack." },
    { name: "Dark Chocolate Fondant", price: 18, desc: "Warm Valrhona chocolate cake with a molten center and salted caramel.", note: "Twelve minutes to perfection — we ask for your patience." },
    { name: "Seasonal Fruit Tart", price: 15, desc: "Buttery pâte sucrée with pastry cream and market fruits.", note: "Changes with the seasons. Always a surprise." },
    { name: "Cheese Selection", price: 22, desc: "Curated artisan cheeses with honeycomb, fig jam, and walnut bread.", note: "Five cheeses, sourced from small producers." },
  ],
  Drinks: [
    { name: "Old Fashioned", price: 18, desc: "Woodford Reserve, Demerara sugar, Angostura bitters, orange zest.", note: "Stirred 40 times. No more, no less." },
    { name: "Signature Negroni", price: 20, desc: "Barrel-aged gin, Campari, sweet vermouth, grapefruit twist.", note: "Our house barrel-aged blend — three weeks minimum." },
    { name: "Wine Flight", price: 32, desc: "Three curated pours selected by our sommelier.", note: "Ask your server for tonight's selection." },
    { name: "Espresso Martini", price: 19, desc: "Vodka, fresh espresso, coffee liqueur, vanilla.", note: "Made with beans roasted in-house that morning." },
  ],
};
const TABS = Object.keys(MENU);

function ThreeHero() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { scene, camera, controls, start, dispose } = createScene(canvas, {
      bloom: true, bloomStrength: 1.8, bloomRadius: 0.6, bloomThreshold: 0.6,
      orbit: true, autoRotate: true, autoRotateSpeed: 0.3,
      background: 0x0a0705, fog: 0.08, fov: 40, exposure: 1.0,
    });

    camera.position.set(2.5, 2, 3);
    camera.lookAt(0, 0.8, 0);
    controls.target.set(0, 0.8, 0);
    controls.minDistance = 2;
    controls.maxDistance = 6;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.minPolarAngle = 0.3;

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0x0a0705, roughness: 0.8 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const table = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 0.08, 32),
      new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.4, metalness: 0.1 })
    );
    table.position.y = 0.7;
    table.castShadow = true;
    table.receiveShadow = true;
    scene.add(table);

    for (let a = 0; a < 4; a++) {
      const angle = (a / 4) * Math.PI * 2;
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.66, 8),
        new THREE.MeshStandardMaterial({ color: 0x1e1208, roughness: 0.5 })
      );
      leg.position.set(Math.cos(angle) * 1.1, 0.33, Math.sin(angle) * 1.1);
      leg.castShadow = true;
      scene.add(leg);
    }

    function makeGlass(x, z) {
      const pts = [
        new THREE.Vector2(0.0, 0.0),
        new THREE.Vector2(0.12, 0.0),
        new THREE.Vector2(0.12, 0.01),
        new THREE.Vector2(0.02, 0.02),
        new THREE.Vector2(0.02, 0.16),
        new THREE.Vector2(0.04, 0.18),
        new THREE.Vector2(0.10, 0.24),
        new THREE.Vector2(0.11, 0.30),
        new THREE.Vector2(0.10, 0.36),
        new THREE.Vector2(0.07, 0.40),
        new THREE.Vector2(0.065, 0.41),
        new THREE.Vector2(0.07, 0.42),
      ];
      const glass = new THREE.Mesh(
        new THREE.LatheGeometry(pts, 24),
        new THREE.MeshPhysicalMaterial({
          color: 0xffeedd, transmission: 0.92, roughness: 0.0, metalness: 0.0,
          ior: 1.5, thickness: 0.5, transparent: true, opacity: 0.6, side: THREE.DoubleSide,
        })
      );
      glass.position.set(x, 0.74, z);
      glass.castShadow = true;
      scene.add(glass);
    }
    makeGlass(-0.5, -0.3);
    makeGlass(0.5, 0.2);

    function makePlate(x, z) {
      const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 0.015, 24),
        new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 0.2, metalness: 0.05 })
      );
      plate.position.set(x, 0.75, z);
      plate.castShadow = true;
      scene.add(plate);
    }
    makePlate(-0.5, 0.3);
    makePlate(0.5, -0.3);

    const candle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.2, 12),
      new THREE.MeshStandardMaterial({ color: 0xf5e6c8, roughness: 0.6 })
    );
    candle.position.set(0, 0.84, 0);
    scene.add(candle);

    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(0.018, 0.07, 8),
      new THREE.MeshBasicMaterial({ color: 0xffaa33 })
    );
    flame.position.set(0, 0.97, 0);
    scene.add(flame);

    const candleLight = new THREE.PointLight(0xffaa33, 15, 5);
    candleLight.position.set(0, 0.97, 0);
    candleLight.castShadow = true;
    candleLight.shadow.mapSize.set(512, 512);
    scene.add(candleLight);

    scene.add(new THREE.AmbientLight(0x1a0f08, 0.2));

    const spot = new THREE.SpotLight(0xffd4a0, 20, 8, Math.PI / 5, 0.5);
    spot.position.set(0, 4, 0);
    spot.target.position.set(0, 0.7, 0);
    spot.castShadow = true;
    spot.shadow.mapSize.set(1024, 1024);
    scene.add(spot);
    scene.add(spot.target);

    const EMBER_COUNT = 200;
    const emberGeo = new THREE.BufferGeometry();
    const emberPos = new Float32Array(EMBER_COUNT * 3);
    const emberVel = new Float32Array(EMBER_COUNT);
    for (let i = 0; i < EMBER_COUNT; i++) {
      emberPos[i * 3] = (Math.random() - 0.5) * 4;
      emberPos[i * 3 + 1] = Math.random() * 3 + 0.5;
      emberPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      emberVel[i] = 0.1 + Math.random() * 0.15;
    }
    emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPos, 3));
    const embers = new THREE.Points(emberGeo, new THREE.PointsMaterial({
      color: 0xff8833, size: 0.02, transparent: true, opacity: 0.7, sizeAttenuation: true,
    }));
    scene.add(embers);

    start((t) => {
      candleLight.intensity = 15 + Math.sin(t * 8) * 3 + Math.sin(t * 13) * 2 + (Math.random() - 0.5) * 2;
      flame.scale.y = 1 + Math.sin(t * 10) * 0.15;
      flame.scale.x = 1 + Math.sin(t * 7) * 0.08;

      const pos = emberGeo.attributes.position.array;
      for (let i = 0; i < EMBER_COUNT; i++) {
        pos[i * 3 + 1] += emberVel[i] * 0.01;
        pos[i * 3] += Math.sin(t + i) * 0.0005;
        pos[i * 3 + 2] += Math.cos(t + i * 0.7) * 0.0005;
        if (pos[i * 3 + 1] > 4) {
          pos[i * 3 + 1] = 0.5;
          pos[i * 3] = (Math.random() - 0.5) * 4;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
        }
      }
      emberGeo.attributes.position.needsUpdate = true;
    });

    return dispose;
  }, []);

  return (
    <div className="dr-hero">
      <canvas ref={canvasRef} className="dr-canvas" />
      <div className="dr-hero-overlay">
        <h1>EMBER &amp; OAK</h1>
        <p>Where flavor meets fire.</p>
        <div className="dr-hero-cta">
          <a href="#dr-menu" className="dr-btn">View Our Menu</a>
          <a href="#dr-reserve" className="dr-btn dr-btn-outline">Reserve a Table</a>
        </div>
      </div>
    </div>
  );
}

export default function Restaurant() {
  const [tab, setTab] = useState("Starters");
  const [expanded, setExpanded] = useState(null);
  const [form, setForm] = useState({ name: "", date: "", time: "7:00 PM", party: "2" });

  return (
    <DemoShell industry="Restaurant">
      <style>{`
        .dr-page { background: #0f0906; color: #f5e6d3; font-family: "DM Sans", Arial, sans-serif; min-height: 100vh; }
        .dr-page h1, .dr-page h2, .dr-page h3 { font-family: Georgia, "Times New Roman", serif; }
        .dr-hero { position: relative; width: 100%; height: 65vh; min-height: 400px; overflow: hidden; }
        .dr-canvas { width: 100%; height: 100%; display: block; }
        .dr-hero-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; pointer-events: none; background: radial-gradient(ellipse at center, transparent 30%, #0a070588 80%); }
        .dr-hero-overlay h1 { font-size: clamp(2.5rem, 7vw, 5rem); letter-spacing: 0.2em; color: #f5e6d3; margin: 0; text-shadow: 0 0 40px #e8843c66, 0 0 80px #e8843c33; font-weight: 400; }
        .dr-hero-overlay > p { font-size: clamp(1rem, 2.5vw, 1.5rem); color: #d4a853; margin-top: 12px; font-style: italic; font-family: Georgia, serif; text-shadow: 0 0 20px #d4a85344; }
        .dr-hero-cta { display: flex; gap: 16px; margin-top: 28px; pointer-events: auto; }
        .dr-btn { padding: 14px 28px; border-radius: 4px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.25s; background: #e8843c; color: #0f0906; border: 1px solid #e8843c; text-decoration: none; }
        .dr-btn:hover { background: #f0a060; border-color: #f0a060; transform: translateY(-2px); }
        .dr-btn-outline { background: transparent; color: #f5e6d3; border-color: #d4a85388; }
        .dr-btn-outline:hover { background: #d4a85322; border-color: #d4a853; color: #d4a853; }
        .dr-section { max-width: 1100px; margin: 0 auto; padding: 64px 32px; }
        .dr-section-title { text-align: center; margin-bottom: 40px; }
        .dr-section-title h2 { font-size: clamp(1.5rem, 3vw, 2.25rem); color: #f5e6d3; font-weight: 400; letter-spacing: 0.05em; }
        .dr-section-title p { color: #b8a08a; margin-top: 8px; font-size: 1.125rem; }
        .dr-divider { width: 60px; height: 1px; background: #d4a853; margin: 16px auto 0; }
        .dr-tabs { display: flex; justify-content: center; gap: 8px; margin-bottom: 32px; flex-wrap: wrap; }
        .dr-tab { padding: 10px 24px; border: 1px solid #3a2a1a; border-radius: 4px; background: transparent; color: #b8a08a; font-size: 1rem; cursor: pointer; transition: all 0.2s; font-family: Georgia, serif; }
        .dr-tab:hover { border-color: #e8843c; color: #f5e6d3; }
        .dr-tab.active { background: #e8843c22; border-color: #e8843c; color: #e8843c; }
        .dr-dishes { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
        .dr-dish { background: #1a1008; border: 1px solid #2a1e12; border-radius: 8px; padding: 24px; cursor: pointer; transition: all 0.25s; }
        .dr-dish:hover { border-color: #e8843c55; transform: translateY(-3px); box-shadow: 0 8px 30px #e8843c15; }
        .dr-dish-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
        .dr-dish h3 { font-size: 1.125rem; color: #f5e6d3; margin: 0; font-weight: 400; }
        .dr-dish-price { color: #d4a853; font-size: 1.125rem; font-weight: 600; white-space: nowrap; }
        .dr-dish p { color: #998876; margin-top: 8px; font-size: 1rem; line-height: 1.6; }
        .dr-dish-note { margin-top: 12px; padding-top: 12px; border-top: 1px solid #2a1e12; color: #d4a853; font-size: 0.9375rem; font-style: italic; font-family: Georgia, serif; }
        .dr-special { background: linear-gradient(135deg, #1a1008, #241810); border: 1px solid #3a2a1a; border-radius: 12px; padding: 40px; text-align: center; margin-top: 48px; }
        .dr-special-badge { display: inline-block; font-size: 0.875rem; letter-spacing: 0.12em; color: #d4a853; border: 1px solid #d4a85344; padding: 4px 16px; border-radius: 4px; margin-bottom: 20px; }
        .dr-special h3 { font-size: 1.5rem; color: #f5e6d3; font-weight: 400; margin-bottom: 16px; }
        .dr-special p { color: #b8a08a; max-width: 600px; margin: 0 auto; line-height: 1.8; }
        .dr-special-price { display: block; color: #d4a853; font-size: 1.375rem; font-weight: 600; margin-top: 16px; }
        .dr-ambiance { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .dr-ambiance-card { background: #1a1008; border: 1px solid #2a1e12; border-radius: 8px; padding: 32px; text-align: center; transition: all 0.25s; }
        .dr-ambiance-card:hover { border-color: #d4a85355; transform: translateY(-3px); }
        .dr-ambiance-icon { font-size: 2rem; margin-bottom: 16px; display: block; }
        .dr-ambiance-card h3 { font-size: 1.125rem; color: #f5e6d3; margin-bottom: 8px; font-weight: 400; }
        .dr-ambiance-card p { color: #998876; font-size: 1rem; line-height: 1.6; }
        .dr-reserve { background: #1a1008; border: 1px solid #2a1e12; border-radius: 12px; padding: 40px; max-width: 600px; margin: 0 auto; }
        .dr-reserve-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .dr-field { display: flex; flex-direction: column; gap: 6px; }
        .dr-field.full { grid-column: 1 / -1; }
        .dr-field label { font-size: 0.875rem; color: #b8a08a; letter-spacing: 0.05em; }
        .dr-field input, .dr-field select { background: #0f0906; border: 1px solid #3a2a1a; border-radius: 4px; padding: 12px; color: #f5e6d3; font-size: 1rem; font-family: inherit; outline: none; transition: border-color 0.2s; }
        .dr-field input:focus, .dr-field select:focus { border-color: #d4a853; }
        .dr-field select { cursor: pointer; }
        .dr-submit { margin-top: 20px; width: 100%; padding: 16px; background: #e8843c; color: #0f0906; border: none; border-radius: 4px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .dr-submit:hover { background: #f0a060; }
        .dr-footer { text-align: center; padding: 32px; color: #665544; font-size: 0.875rem; border-top: 1px solid #1a1008; }
        @media (max-width: 600px) {
          .dr-section { padding: 40px 20px; }
          .dr-hero { height: 55vh; min-height: 350px; }
          .dr-reserve-grid { grid-template-columns: 1fr; }
          .dr-dishes { grid-template-columns: 1fr; }
          .dr-special { padding: 28px 20px; }
        }
      `}</style>
      <div className="dr-page">
        <ThreeHero />
        <section className="dr-section" id="dr-menu">
          <div className="dr-section-title">
            <h2>Our Menu</h2>
            <p>Seasonally inspired, thoughtfully crafted</p>
            <div className="dr-divider" />
          </div>
          <div className="dr-tabs">
            {TABS.map(t => (
              <button key={t} className={`dr-tab${tab === t ? " active" : ""}`} onClick={() => { setTab(t); setExpanded(null); }}>{t}</button>
            ))}
          </div>
          <div className="dr-dishes">
            {MENU[tab].map((d, i) => (
              <div key={d.name} className="dr-dish" onClick={() => setExpanded(expanded === i ? null : i)}>
                <div className="dr-dish-head">
                  <h3>{d.name}</h3>
                  <span className="dr-dish-price">${d.price}</span>
                </div>
                <p>{d.desc}</p>
                {expanded === i && <div className="dr-dish-note">{d.note}</div>}
              </div>
            ))}
          </div>
          <div className="dr-special">
            <span className="dr-special-badge">TONIGHT'S SPECIAL</span>
            <h3>Herb-Crusted Rack of Lamb</h3>
            <p>With roasted garlic jus, seasonal vegetables, and truffle potato purée. A celebration of simplicity and craft.</p>
            <span className="dr-special-price">$72</span>
          </div>
        </section>
        <section className="dr-section">
          <div className="dr-section-title">
            <h2>The Experience</h2>
            <p>More than a meal — an evening to remember</p>
            <div className="dr-divider" />
          </div>
          <div className="dr-ambiance">
            <div className="dr-ambiance-card">
              <span className="dr-ambiance-icon">🕯</span>
              <h3>Private Dining</h3>
              <p>An intimate room for celebrations and gatherings of up to twelve, with a dedicated menu and sommelier.</p>
            </div>
            <div className="dr-ambiance-card">
              <span className="dr-ambiance-icon">🍷</span>
              <h3>Wine Cellar</h3>
              <p>Over 400 labels curated by our sommelier. Old World and New World, with a focus on small producers.</p>
            </div>
            <div className="dr-ambiance-card">
              <span className="dr-ambiance-icon">🌿</span>
              <h3>Garden Terrace</h3>
              <p>Dine under the stars on our candlelit terrace, surrounded by herbs we grow and use in the kitchen.</p>
            </div>
          </div>
        </section>
        <section className="dr-section" id="dr-reserve">
          <div className="dr-section-title">
            <h2>Reserve Your Table</h2>
            <p>We look forward to welcoming you</p>
            <div className="dr-divider" />
          </div>
          <div className="dr-reserve">
            <div className="dr-reserve-grid">
              <div className="dr-field full">
                <label>NAME</label>
                <input type="text" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="dr-field">
                <label>DATE</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="dr-field">
                <label>TIME</label>
                <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}>
                  {["6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM","9:30 PM","10:00 PM"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="dr-field">
                <label>PARTY SIZE</label>
                <select value={form.party} onChange={e => setForm({ ...form, party: e.target.value })}>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>)}
                </select>
              </div>
              <div className="dr-field">
                <label>OCCASION</label>
                <select><option>Dinner</option><option>Birthday</option><option>Anniversary</option><option>Business</option><option>Other</option></select>
              </div>
            </div>
            <button className="dr-submit" type="button">Confirm Reservation</button>
          </div>
        </section>
        <footer className="dr-footer">EMBER &amp; OAK — Fine dining, reimagined.</footer>
      </div>
    </DemoShell>
  );
}
