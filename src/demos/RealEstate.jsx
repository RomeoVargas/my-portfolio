import { createScene, THREE } from "./three-setup.js";
import React, { useEffect, useRef, useState } from "react";
import DemoShell from "./DemoShell.jsx";

function CityScene() {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = createScene(canvas, {
      bloom: true,
      bloomStrength: 0.8,
      bloomRadius: 0.3,
      bloomThreshold: 0.7,
      orbit: true,
      autoRotate: true,
      autoRotateSpeed: 0.2,
      background: 0x040810,
      fog: 0.02,
      fov: 50,
      exposure: 1.0,
    });
    const { scene, camera, controls, start, dispose } = ctx;

    camera.position.set(12, 8, 15);
    camera.lookAt(0, 3, 0);
    controls.target.set(0, 3, 0);
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minPolarAngle = 0.3;

    // ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshStandardMaterial({ color: 0x080a0f, metalness: 0.4, roughness: 0.6 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // roads
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x101318, roughness: 0.8 });
    for (const offset of [-6, 0, 6]) {
      const h = new THREE.Mesh(new THREE.PlaneGeometry(60, 1.2), roadMat);
      h.rotation.x = -Math.PI / 2;
      h.position.set(0, 0.005, offset);
      scene.add(h);
      const v = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 60), roadMat);
      v.rotation.x = -Math.PI / 2;
      v.position.set(offset, 0.005, 0);
      scene.add(v);
    }

    // seeded random
    let seed = 42;
    const rand = () => { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646; };

    const windowColors = [0xffdd88, 0xfff4cc, 0xffaa44, 0xffe8a0];

    // buildings
    const buildingGroup = new THREE.Group();
    for (let i = 0; i < 55; i++) {
      const w = 0.5 + rand() * 1.5;
      const d = 0.5 + rand() * 1.5;
      const bh = 1 + rand() * 11;
      const bx = (rand() - 0.5) * 28;
      const bz = (rand() - 0.5) * 28;
      if ([-6, 0, 6].some((r) => Math.abs(bx - r) < 1.2 || Math.abs(bz - r) < 1.2)) continue;

      const shade = 0x0a0f1a + Math.floor(rand() * 0x0a0f16);
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, bh, d),
        new THREE.MeshStandardMaterial({ color: shade, roughness: 0.7, metalness: 0.3 }),
      );
      mesh.position.set(bx, bh / 2, bz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      buildingGroup.add(mesh);

      // windows on each face
      const faces = [
        { axis: "x", dir: 1, rot: [0, Math.PI / 2, 0] },
        { axis: "x", dir: -1, rot: [0, -Math.PI / 2, 0] },
        { axis: "z", dir: 1, rot: [0, 0, 0] },
        { axis: "z", dir: -1, rot: [0, Math.PI, 0] },
      ];
      const winGeo = new THREE.PlaneGeometry(0.08, 0.06);
      const floorH = 0.35;
      const floors = Math.floor(bh / floorH);
      for (const face of faces) {
        const faceW = face.axis === "x" ? d : w;
        const cols = Math.max(1, Math.floor(faceW / 0.18));
        for (let fl = 1; fl < floors; fl++) {
          for (let c = 0; c < cols; c++) {
            if (rand() > 0.3) continue;
            const winMat = new THREE.MeshBasicMaterial({ color: windowColors[Math.floor(rand() * windowColors.length)] });
            const win = new THREE.Mesh(winGeo, winMat);
            const fy = fl * floorH - bh / 2 + 0.1;
            const fx = (c - (cols - 1) / 2) * 0.18;
            if (face.axis === "x") {
              win.position.set(bx + face.dir * (w / 2 + 0.003), fy + bh / 2, bz + fx);
            } else {
              win.position.set(bx + fx, fy + bh / 2, bz + face.dir * (d / 2 + 0.003));
            }
            win.rotation.set(...face.rot);
            buildingGroup.add(win);
          }
        }
      }
    }
    scene.add(buildingGroup);

    // featured building
    const featH = 8;
    const feat = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, featH, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x1a2a4a, roughness: 0.5, metalness: 0.4 }),
    );
    feat.position.set(0, featH / 2, -3);
    feat.castShadow = true;
    scene.add(feat);
    const fwinGeo = new THREE.PlaneGeometry(0.1, 0.08);
    for (let fl = 0; fl < 18; fl++) {
      for (let c = 0; c < 8; c++) {
        if (rand() > 0.5) continue;
        const mat = new THREE.MeshBasicMaterial({ color: 0x88ccff });
        const side = c < 4 ? 1 : -1;
        const col = c % 4;
        const win = new THREE.Mesh(fwinGeo, mat);
        win.position.set((col - 1.5) * 0.25, 0.5 + fl * 0.4, -3 + side * 1.103);
        if (side === -1) win.rotation.y = Math.PI;
        scene.add(win);
      }
    }
    const featSpot = new THREE.SpotLight(0x3b82f6, 30, 20, Math.PI / 6, 0.5);
    featSpot.position.set(3, 12, 0);
    featSpot.target = feat;
    scene.add(featSpot);

    // lighting
    scene.add(new THREE.AmbientLight(0x0a1020, 0.3));
    const moon = new THREE.DirectionalLight(0x4466aa, 0.5);
    moon.position.set(10, 15, 5);
    scene.add(moon);
    for (const pos of [[3, 0.5, 0], [-3, 0.5, 0], [0, 0.5, 3], [0, 0.5, -8]]) {
      scene.add(Object.assign(new THREE.PointLight(0xffaa55, 5, 4), { position: new THREE.Vector3(...pos) }));
    }

    // stars
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = rand() * Math.PI * 0.45;
      const r = 40 + rand() * 30;
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.cos(phi);
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.06 })));

    start(() => {});
    return dispose;
  }, []);
  return <canvas ref={canvasRef} className="dre-canvas" />;
}

const PROPERTIES = [
  { name: "Modern Hillside Villa", addr: "742 Oak Crest Dr", price: 875000, beds: 4, baths: 3, sqft: 3200, type: "House", grad: "135deg, #1a3050, #0c1a30" },
  { name: "Downtown Loft", addr: "88 Market St #12", price: 425000, beds: 2, baths: 2, sqft: 1100, type: "Condo", grad: "135deg, #2a1a30, #150c20" },
  { name: "Lakeside Retreat", addr: "15 Clearwater Ln", price: 1250000, beds: 5, baths: 4, sqft: 4800, type: "House", grad: "135deg, #0c2030, #081520" },
  { name: "Urban Studio", addr: "200 Central Ave #4B", price: 289000, beds: 1, baths: 1, sqft: 650, type: "Apartment", grad: "135deg, #1a2040, #0c1020" },
  { name: "Family Farmhouse", addr: "3001 Country Rd", price: 545000, beds: 4, baths: 2, sqft: 2400, type: "House", grad: "135deg, #1a2a20, #0c1a10" },
  { name: "Coastal Penthouse", addr: "1 Ocean Blvd #PH", price: 2100000, beds: 3, baths: 3, sqft: 2800, type: "Condo", grad: "135deg, #102040, #081030" },
];
const RANGES = [["Any",0,Infinity],["Under $400k",0,400000],["$400k–$700k",400000,700000],["$700k–$1.2M",700000,1200000],["$1.2M+",1200000,Infinity]];
function fmt(n){return n.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0})}

function PropertyCard({p}){
  const ref=useRef();
  const [tilt,setTilt]=useState({rx:0,ry:0});
  return(
    <article ref={ref} className="dre-prop"
      onPointerMove={e=>{const r=ref.current.getBoundingClientRect();setTilt({rx:((e.clientY-r.top)/r.height-0.5)*-8,ry:((e.clientX-r.left)/r.width-0.5)*8})}}
      onPointerLeave={()=>setTilt({rx:0,ry:0})}
      style={{transform:`perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`}}>
      <div className="dre-prop-img" style={{background:`linear-gradient(${p.grad})`}}><span className="dre-badge">For Sale</span></div>
      <div className="dre-prop-body">
        <h3>{p.name}</h3>
        <p className="dre-addr">{p.addr}</p>
        <span className="dre-price">{fmt(p.price)}</span>
        <div className="dre-specs"><span>{p.beds} Bed</span><span>{p.baths} Bath</span><span>{p.sqft.toLocaleString()} sqft</span></div>
      </div>
    </article>
  );
}

function MortgageCalc(){
  const [price,setPrice]=useState(500000);
  const [down,setDown]=useState(20);
  const [rate,setRate]=useState(6.5);
  const [term,setTerm]=useState(30);
  const loan=price*(1-down/100);
  const mr=rate/100/12;
  const n=term*12;
  const monthly=mr>0?loan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loan/n;
  const tax=price*0.012/12;
  return(
    <section className="dre-calc">
      <h2>Mortgage Calculator</h2>
      <div className="dre-calc-grid">
        <div className="dre-calc-inputs">
          <label>Home Price: <strong>{fmt(price)}</strong><input type="range" min={100000} max={3000000} step={10000} value={price} onChange={e=>setPrice(+e.target.value)}/></label>
          <label>Down Payment: <strong>{down}%</strong><input type="range" min={0} max={50} value={down} onChange={e=>setDown(+e.target.value)}/></label>
          <label>Interest Rate: <strong>{rate}%</strong><input type="range" min={2} max={12} step={0.1} value={rate} onChange={e=>setRate(+e.target.value)}/></label>
          <div className="dre-term"><span>Loan Term:</span>{[15,30].map(t=><button key={t} className={term===t?"active":""} onClick={()=>setTerm(t)}>{t} yr</button>)}</div>
        </div>
        <div className="dre-calc-result">
          <span className="dre-calc-label">Estimated Monthly Payment</span>
          <span className="dre-calc-amount">{fmt(Math.round(monthly+tax))}</span>
          <div className="dre-calc-breakdown">
            <span>Principal & Interest: {fmt(Math.round(monthly))}</span>
            <span>Est. Property Tax: {fmt(Math.round(tax))}</span>
            <span>Loan Amount: {fmt(Math.round(loan))}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const HOODS=[
  {name:"Riverside Heights",desc:"Tree-lined streets and top-rated schools. A neighborhood built for families.",avg:"$620,000"},
  {name:"Downtown Core",desc:"Walk to everything. Restaurants, nightlife, and culture at your doorstep.",avg:"$480,000"},
  {name:"Coastal Drive",desc:"Ocean views and luxury living along the waterfront.",avg:"$1,400,000"},
];

export default function RealEstate(){
  const [typeFilter,setTypeFilter]=useState("Any");
  const [rangeIdx,setRangeIdx]=useState(0);
  const filtered=PROPERTIES.filter(p=>(typeFilter==="Any"||p.type===typeFilter)&&p.price>=RANGES[rangeIdx][1]&&p.price<RANGES[rangeIdx][2]);
  return(
    <DemoShell industry="Real Estate">
      <style>{`
        .dre-page{--bg:#0c1222;--surface:#141e30;--text:#e8ecf4;--muted:#8899b0;--blue:#3b82f6;--green:#10b981;--border:#1e2d44;font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
        .dre-hero{position:relative;height:65vh;min-height:420px;overflow:hidden}
        .dre-canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
        .dre-hero-overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;z-index:2;background:linear-gradient(transparent 40%,var(--bg));padding:24px}
        .dre-hero-overlay h1{font-size:clamp(2.5rem,6vw,4.5rem);font-weight:800;letter-spacing:.12em;margin:0;text-transform:uppercase;text-shadow:0 0 40px #3b82f644}
        .dre-hero-overlay p{font-size:1.25rem;color:var(--muted);margin:12px 0 28px}
        .dre-hero-btn{background:var(--blue);color:#fff;border:none;padding:14px 32px;border-radius:8px;font-size:1rem;font-weight:700;cursor:pointer;transition:background .2s}
        .dre-hero-btn:hover{background:#2563eb}
        .dre-content{max-width:1200px;margin:0 auto;padding:0 24px 64px}
        .dre-filters{display:flex;gap:10px;flex-wrap:wrap;padding:40px 0 24px;align-items:center}
        .dre-filters label{font-size:.9rem;color:var(--muted);margin-right:4px}
        .dre-filters select{background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:6px;padding:8px 12px;font-size:.9rem}
        .dre-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px}
        .dre-prop{border:1px solid var(--border);border-radius:12px;overflow:hidden;background:var(--surface);transition:transform .15s,box-shadow .15s;will-change:transform}
        .dre-prop:hover{box-shadow:0 12px 40px #3b82f622}
        .dre-prop-img{height:160px;position:relative;display:flex;align-items:flex-start;justify-content:flex-end;padding:12px}
        .dre-badge{background:var(--green);color:#fff;font-size:.75rem;font-weight:700;padding:4px 10px;border-radius:4px;letter-spacing:.04em;text-transform:uppercase}
        .dre-prop-body{padding:20px}
        .dre-prop-body h3{font-size:1.2rem;font-weight:700;margin:0 0 4px}
        .dre-addr{color:var(--muted);font-size:.9rem;margin:0 0 12px}
        .dre-price{font-size:1.5rem;font-weight:800;color:var(--green)}
        .dre-specs{display:flex;gap:16px;margin-top:12px;font-size:.85rem;color:var(--muted)}
        .dre-empty{grid-column:1/-1;text-align:center;padding:48px;color:var(--muted)}
        .dre-calc{padding:48px 0;border-top:1px solid var(--border);margin-top:48px}
        .dre-calc h2{font-size:1.75rem;font-weight:700;margin:0 0 28px}
        .dre-calc-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start}
        .dre-calc-inputs{display:flex;flex-direction:column;gap:20px}
        .dre-calc-inputs label{display:flex;flex-direction:column;gap:8px;font-size:.9rem;color:var(--muted)}
        .dre-calc-inputs strong{color:var(--text);font-size:1rem}
        .dre-calc-inputs input[type=range]{width:100%;accent-color:var(--blue)}
        .dre-term{display:flex;gap:10px;align-items:center;font-size:.9rem;color:var(--muted)}
        .dre-term button{background:var(--surface);border:1px solid var(--border);color:var(--text);padding:8px 20px;border-radius:6px;cursor:pointer;font-size:.9rem}
        .dre-term button.active{background:var(--blue);border-color:var(--blue);color:#fff}
        .dre-calc-result{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:32px;text-align:center}
        .dre-calc-label{font-size:.9rem;color:var(--muted);display:block;margin-bottom:8px}
        .dre-calc-amount{font-size:3rem;font-weight:800;color:var(--green);display:block;margin-bottom:20px}
        .dre-calc-breakdown{display:flex;flex-direction:column;gap:6px;font-size:.85rem;color:var(--muted);text-align:left}
        .dre-hoods{padding:48px 0;border-top:1px solid var(--border)}
        .dre-hoods h2{font-size:1.75rem;font-weight:700;margin:0 0 24px}
        .dre-hoods-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .dre-hood{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:24px}
        .dre-hood h3{font-size:1.1rem;margin:0 0 8px}
        .dre-hood p{color:var(--muted);font-size:.9rem;margin:0 0 16px;line-height:1.6}
        .dre-hood-avg{font-size:.8rem;color:var(--muted)}.dre-hood-avg strong{color:var(--blue);font-size:1rem}
        .dre-cta{text-align:center;padding:64px 0;border-top:1px solid var(--border)}
        .dre-cta h2{font-size:1.75rem;margin:0 0 12px}
        .dre-cta p{color:var(--muted);margin:0 0 24px}
        @media(max-width:768px){.dre-grid{grid-template-columns:1fr}.dre-calc-grid{grid-template-columns:1fr}.dre-hoods-grid{grid-template-columns:1fr}.dre-hero{height:55vh;min-height:340px}}
      `}</style>
      <div className="dre-page">
        <div className="dre-hero">
          <CityScene />
          <div className="dre-hero-overlay">
            <h1>Horizon Realty</h1>
            <p>Find your next horizon.</p>
            <button className="dre-hero-btn" onClick={()=>document.querySelector(".dre-filters")?.scrollIntoView({behavior:"smooth"})}>Explore Properties</button>
          </div>
        </div>
        <div className="dre-content">
          <div className="dre-filters">
            <label>Type:</label>
            <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
              {["Any","House","Condo","Apartment","Townhouse"].map(t=><option key={t}>{t}</option>)}
            </select>
            <label>Price:</label>
            <select value={rangeIdx} onChange={e=>setRangeIdx(+e.target.value)}>
              {RANGES.map(([l],i)=><option key={i} value={i}>{l}</option>)}
            </select>
          </div>
          <div className="dre-grid">
            {filtered.length?filtered.map(p=><PropertyCard key={p.name} p={p}/>):<div className="dre-empty">No properties match your filters.</div>}
          </div>
          <MortgageCalc/>
          <section className="dre-hoods">
            <h2>Featured Neighborhoods</h2>
            <div className="dre-hoods-grid">{HOODS.map(h=>(
              <article key={h.name} className="dre-hood"><h3>{h.name}</h3><p>{h.desc}</p><span className="dre-hood-avg">AVG PRICE <strong>{h.avg}</strong></span></article>
            ))}</div>
          </section>
          <section className="dre-cta">
            <h2>Ready to find your home?</h2>
            <p>Our agents are standing by to help you schedule a viewing.</p>
            <button className="dre-hero-btn">Schedule a Viewing</button>
          </section>
        </div>
      </div>
    </DemoShell>
  );
}
