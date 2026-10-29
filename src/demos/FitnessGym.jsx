import { createScene, THREE } from "./three-setup.js";
import React, { useEffect, useRef, useState } from "react";
import DemoShell from "./DemoShell.jsx";

function EnergyScene() {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { scene, camera, controls, start, dispose } = createScene(canvas, {
      bloom: true,
      bloomStrength: 2.0,
      bloomRadius: 0.8,
      bloomThreshold: 0.4,
      background: 0x050505,
      fog: 0.04,
      autoRotateSpeed: 1.0,
      fov: 50,
    });
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 0, 0);
    if (controls) {
      controls.maxPolarAngle = Math.PI / 2;
      controls.minPolarAngle = 0.3;
    }

    scene.add(new THREE.AmbientLight(0x110000, 0.1));
    const redLight = new THREE.PointLight(0xff2222, 50, 15);
    scene.add(redLight);
    const amberLight = new THREE.PointLight(0xffaa00, 20, 12);
    amberLight.position.set(2, 1, -1);
    scene.add(amberLight);

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xff2222, transparent: true, opacity: 0.3 }),
    );
    scene.add(core);

    const ringCount = 2000;
    const ringGeo = new THREE.BufferGeometry();
    const ringPos = new Float32Array(ringCount * 3);
    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      const tubeAngle = Math.random() * Math.PI * 2;
      const R = 2, r = 0.5;
      ringPos[i * 3] = (R + r * Math.cos(tubeAngle)) * Math.cos(angle);
      ringPos[i * 3 + 1] = r * Math.sin(tubeAngle);
      ringPos[i * 3 + 2] = (R + r * Math.cos(tubeAngle)) * Math.sin(angle);
    }
    ringGeo.setAttribute("position", new THREE.BufferAttribute(ringPos, 3));
    const ring = new THREE.Points(ringGeo, new THREE.PointsMaterial({ size: 0.04, color: 0xff4444, transparent: true, opacity: 0.8 }));
    scene.add(ring);

    const outerCount = 3000;
    const outerGeo = new THREE.BufferGeometry();
    const outerPos = new Float32Array(outerCount * 3);
    const outerCol = new Float32Array(outerCount * 3);
    const cRed = new THREE.Color(0xff3333);
    const cAmber = new THREE.Color(0xffaa00);
    for (let i = 0; i < outerCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 6;
      outerPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      outerPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      outerPos[i * 3 + 2] = radius * Math.cos(phi);
      const c = Math.random() > 0.5 ? cRed : cAmber;
      outerCol[i * 3] = c.r;
      outerCol[i * 3 + 1] = c.g;
      outerCol[i * 3 + 2] = c.b;
    }
    outerGeo.setAttribute("position", new THREE.BufferAttribute(outerPos, 3));
    outerGeo.setAttribute("color", new THREE.BufferAttribute(outerCol, 3));
    const outer = new THREE.Points(outerGeo, new THREE.PointsMaterial({ size: 0.025, vertexColors: true, transparent: true, opacity: 0.7 }));
    scene.add(outer);

    const beamGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, 10, 4),
        new THREE.MeshBasicMaterial({ color: 0xff4444, transparent: true, opacity: 0.4 }),
      );
      beam.rotation.z = (i / 6) * Math.PI;
      beam.rotation.x = ((i % 3) / 3) * Math.PI * 0.5;
      beamGroup.add(beam);
    }
    scene.add(beamGroup);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    scene.add(floor);

    start((t) => {
      const pulse = 1.0 + 0.3 * Math.sin(t * 2);
      core.scale.setScalar(pulse);
      redLight.intensity = 40 + 20 * Math.sin(t * 2);
      ring.rotation.y = t * 0.3;
      outer.rotation.y = t * 0.05;
      outer.rotation.x = t * 0.02;
      beamGroup.rotation.y = t * 0.1;
      beamGroup.rotation.x = t * 0.07;
      beamGroup.children.forEach((b) => {
        b.material.opacity = 0.2 + 0.2 * Math.sin(t * 3 + b.rotation.z);
      });
    });

    return dispose;
  }, []);
  return <canvas ref={canvasRef} className="dg-canvas" />;
}

function CountUp({ end, suffix = "", label }) {
  const ref = useRef();
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const num = parseInt(end, 10);
          if (isNaN(num)) { setVal(end); return; }
          const duration = 1500;
          const startTime = performance.now();
          const step = (now) => {
            const p = Math.min((now - startTime) / duration, 1);
            setVal(Math.round(p * num));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);
  return (
    <div className="dg-stat" ref={ref}>
      <span className="dg-stat-num">{typeof val === "number" ? val : end}{suffix}</span>
      <span className="dg-stat-label">{label}</span>
    </div>
  );
}

const SCHEDULE = {
  Mon: { "6AM": "HIIT", "8AM": "Yoga", "12PM": "Spin", "5PM": "Strength", "7PM": "Boxing" },
  Tue: { "6AM": "CrossFit", "10AM": "Yoga", "5PM": "HIIT", "7PM": "Strength" },
  Wed: { "6AM": "Spin", "8AM": "Boxing", "12PM": "HIIT", "5PM": "CrossFit", "7PM": "Yoga" },
  Thu: { "6AM": "Strength", "10AM": "Spin", "5PM": "Boxing", "7PM": "HIIT" },
  Fri: { "6AM": "Yoga", "8AM": "CrossFit", "12PM": "Strength", "5PM": "Spin", "7PM": "HIIT" },
};
const TIMES = ["6AM", "8AM", "10AM", "12PM", "5PM", "7PM"];
const DAYS = Object.keys(SCHEDULE);
const TRAINERS = { HIIT: "Alex R.", Yoga: "Maya C.", Spin: "Jordan T.", Strength: "Dre J.", Boxing: "Dre J.", CrossFit: "Alex R." };
const CLASS_COLORS = { HIIT: "#ef4444", Yoga: "#a78bfa", Spin: "#f59e0b", Strength: "#ef4444", Boxing: "#fb923c", CrossFit: "#f97316" };

const TIERS = [
  { name: "Basic", price: 29, features: ["Gym floor access", "Locker room", "2 classes / week", "Basic app access"] },
  { name: "Pro", price: 59, popular: true, features: ["Unlimited classes", "Personal app + tracking", "Nutrition guide", "Guest passes (2/mo)"] },
  { name: "Elite", price: 99, features: ["Everything in Pro", "4 PT sessions / month", "Recovery suite", "Priority booking"] },
];

const TRAINER_DATA = [
  { name: "Alex Rivera", role: "HIIT & Strength", quote: "Pain is temporary. Results are permanent." },
  { name: "Maya Chen", role: "Yoga & Recovery", quote: "Strength begins where comfort ends." },
  { name: "Dre Jackson", role: "Boxing & CrossFit", quote: "Every rep is a vote for who you want to become." },
];

export default function FitnessGym() {
  const [booked, setBooked] = useState({});
  const toggleBook = (day, time) => {
    const key = `${day}-${time}`;
    setBooked((b) => ({ ...b, [key]: !b[key] }));
  };

  return (
    <DemoShell industry="Fitness & Gym">
      <style>{`
        .dg-page { background: #0a0a0a; color: #f0f0f0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; min-height: 100vh; }
        .dg-hero { position: relative; height: 70vh; min-height: 500px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .dg-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
        .dg-hero-overlay { position: relative; z-index: 2; text-align: center; pointer-events: none; }
        .dg-hero-title { font-size: clamp(3rem, 10vw, 7rem); font-weight: 900; letter-spacing: -0.04em; text-transform: uppercase; line-height: 0.9; color: #fff; text-shadow: 0 0 40px #ef444488, 0 0 80px #ef444444; }
        .dg-hero-sub { font-size: clamp(1rem, 2.5vw, 1.5rem); text-transform: uppercase; letter-spacing: 0.3em; color: #ef4444; margin-top: 16px; text-shadow: 0 0 20px #ef444466; }
        .dg-hero-cta { display: flex; gap: 16px; justify-content: center; margin-top: 32px; pointer-events: auto; }
        .dg-btn { padding: 14px 28px; border: none; border-radius: 6px; font-size: 1rem; font-weight: 700; cursor: pointer; text-transform: uppercase; letter-spacing: 0.05em; transition: transform 0.2s, box-shadow 0.2s; }
        .dg-btn-primary { background: #ef4444; color: #fff; box-shadow: 0 0 20px #ef444466; }
        .dg-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 30px #ef444488; }
        .dg-btn-outline { background: transparent; color: #ef4444; border: 1px solid #ef4444; }
        .dg-btn-outline:hover { background: #ef444418; transform: translateY(-2px); }
        .dg-section { max-width: 1200px; margin: 0 auto; padding: 64px 24px; }
        .dg-section-title { font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 800; text-transform: uppercase; letter-spacing: -0.02em; text-align: center; margin-bottom: 12px; }
        .dg-section-sub { text-align: center; color: #888; font-size: 1.1rem; margin-bottom: 48px; }
        .dg-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; max-width: 900px; margin: 0 auto; padding: 64px 24px; border-top: 1px solid #1a1a1a; border-bottom: 1px solid #1a1a1a; }
        .dg-stat { text-align: center; padding: 24px 16px; background: #111; border-radius: 12px; border-bottom: 3px solid #ef444444; transition: border-color 0.3s; }
        .dg-stat:hover { border-color: #ef4444; }
        .dg-stat-num { display: block; font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; color: #ef4444; }
        .dg-stat-label { display: block; margin-top: 8px; font-size: 0.9rem; color: #888; text-transform: uppercase; letter-spacing: 0.08em; }
        .dg-schedule { overflow-x: auto; }
        .dg-schedule table { width: 100%; border-collapse: collapse; min-width: 600px; }
        .dg-schedule th { padding: 12px; font-size: 0.85rem; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #1a1a1a; }
        .dg-schedule td { padding: 8px; text-align: center; border-bottom: 1px solid #111; }
        .dg-class { padding: 10px 8px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 700; transition: transform 0.2s, box-shadow 0.2s; position: relative; border: 1px solid transparent; }
        .dg-class:hover { transform: scale(1.05); z-index: 2; }
        .dg-class-booked { border-color: #ef4444; }
        .dg-class-booked::after { content: "✓"; position: absolute; top: 2px; right: 6px; font-size: 0.7rem; color: #22c55e; }
        .dg-class-trainer { display: block; font-size: 0.7rem; font-weight: 400; color: #aaa; margin-top: 2px; }
        .dg-tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; align-items: start; }
        .dg-tier { background: #111; border: 1px solid #222; border-radius: 16px; padding: 32px 24px; text-align: center; transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s; }
        .dg-tier:hover { transform: translateY(-6px); border-color: #ef444488; box-shadow: 0 8px 30px #ef444422; }
        .dg-tier-pop { border-color: #ef4444; transform: scale(1.03); position: relative; }
        .dg-tier-pop:hover { transform: scale(1.03) translateY(-6px); }
        .dg-tier-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #ef4444; color: #fff; font-size: 0.75rem; font-weight: 700; padding: 4px 14px; border-radius: 20px; letter-spacing: 0.05em; text-transform: uppercase; }
        .dg-tier h3 { font-size: 1.4rem; font-weight: 800; text-transform: uppercase; }
        .dg-tier-price { font-size: 3rem; font-weight: 900; color: #ef4444; margin: 16px 0; }
        .dg-tier-price span { font-size: 1rem; color: #666; font-weight: 400; }
        .dg-tier ul { list-style: none; padding: 0; margin: 24px 0; text-align: left; }
        .dg-tier li { padding: 8px 0; border-bottom: 1px solid #1a1a1a; color: #bbb; font-size: 0.95rem; }
        .dg-tier li::before { content: "✓ "; color: #ef4444; font-weight: 700; }
        .dg-trainers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .dg-trainer { background: #111; border: 1px solid #1a1a1a; border-radius: 16px; padding: 32px 24px; text-align: center; transition: border-color 0.3s; }
        .dg-trainer:hover { border-color: #ef444488; }
        .dg-trainer-avatar { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #ef4444, #f59e0b); display: grid; place-items: center; margin: 0 auto 16px; font-size: 1.5rem; font-weight: 900; color: #fff; }
        .dg-trainer h4 { font-size: 1.1rem; font-weight: 700; }
        .dg-trainer-role { color: #ef4444; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin: 4px 0 12px; }
        .dg-trainer-quote { color: #888; font-style: italic; font-size: 0.95rem; }
        .dg-cta-section { text-align: center; padding: 80px 24px; background: linear-gradient(180deg, #0a0a0a, #110808); border-top: 1px solid #1a1a1a; }
        .dg-cta-section h2 { font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; text-transform: uppercase; margin-bottom: 16px; }
        .dg-cta-section p { color: #888; font-size: 1.1rem; margin-bottom: 32px; }
        .dg-footer { text-align: center; padding: 24px; font-size: 0.85rem; color: #444; border-top: 1px solid #111; }
        @media (max-width: 768px) {
          .dg-stats { grid-template-columns: repeat(2, 1fr); }
          .dg-tiers { grid-template-columns: 1fr; max-width: 400px; margin-inline: auto; }
          .dg-tier-pop { transform: none; }
          .dg-tier-pop:hover { transform: translateY(-6px); }
          .dg-trainers { grid-template-columns: 1fr; max-width: 400px; margin-inline: auto; }
          .dg-hero-cta { flex-direction: column; align-items: center; }
          .dg-hero { min-height: 400px; }
        }
      `}</style>
      <div className="dg-page">
        <div className="dg-hero">
          <EnergyScene />
          <div className="dg-hero-overlay">
            <h1 className="dg-hero-title">Iron Pulse</h1>
            <p className="dg-hero-sub">Your strongest chapter starts now</p>
            <div className="dg-hero-cta">
              <button className="dg-btn dg-btn-primary">Start Your Trial</button>
              <button className="dg-btn dg-btn-outline">View Classes</button>
            </div>
          </div>
        </div>

        <div className="dg-stats">
          <CountUp end="50" suffix="+" label="Classes / Week" />
          <CountUp end="15" suffix="" label="Expert Trainers" />
          <CountUp end="24" suffix="/7" label="Open Access" />
          <CountUp end="5000" suffix="+" label="Active Members" />
        </div>

        <section className="dg-section">
          <h2 className="dg-section-title">Class Schedule</h2>
          <p className="dg-section-sub">Tap a class to book your spot</p>
          <div className="dg-schedule">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  {DAYS.map((d) => <th key={d}>{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {TIMES.map((time) => (
                  <tr key={time}>
                    <td style={{ color: "#666", fontSize: "0.85rem", fontWeight: 700 }}>{time}</td>
                    {DAYS.map((day) => {
                      const cls = SCHEDULE[day][time];
                      const key = `${day}-${time}`;
                      return (
                        <td key={key}>
                          {cls ? (
                            <div
                              className={`dg-class${booked[key] ? " dg-class-booked" : ""}`}
                              style={{ background: (CLASS_COLORS[cls] || "#333") + "22", color: CLASS_COLORS[cls] || "#fff" }}
                              onClick={() => toggleBook(day, time)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => { if (e.key === "Enter") toggleBook(day, time); }}
                            >
                              {cls}
                              <span className="dg-class-trainer">{TRAINERS[cls]}</span>
                            </div>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dg-section">
          <h2 className="dg-section-title">Membership</h2>
          <p className="dg-section-sub">Choose the plan that fits your goals</p>
          <div className="dg-tiers">
            {TIERS.map((tier) => (
              <div key={tier.name} className={`dg-tier${tier.popular ? " dg-tier-pop" : ""}`}>
                {tier.popular && <span className="dg-tier-badge">Most Popular</span>}
                <h3>{tier.name}</h3>
                <div className="dg-tier-price">${tier.price}<span>/mo</span></div>
                <ul>{tier.features.map((f) => <li key={f}>{f}</li>)}</ul>
                <button className="dg-btn dg-btn-primary" style={{ width: "100%" }}>Get Started</button>
              </div>
            ))}
          </div>
        </section>

        <section className="dg-section">
          <h2 className="dg-section-title">Our Trainers</h2>
          <p className="dg-section-sub">World-class coaches behind every class</p>
          <div className="dg-trainers">
            {TRAINER_DATA.map((t) => (
              <div key={t.name} className="dg-trainer">
                <div className="dg-trainer-avatar">{t.name.split(" ").map((n) => n[0]).join("")}</div>
                <h4>{t.name}</h4>
                <div className="dg-trainer-role">{t.role}</div>
                <p className="dg-trainer-quote">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </section>

        <div className="dg-cta-section">
          <h2>Your first class is free.</h2>
          <p>No commitment. No credit card. Just show up.</p>
          <button className="dg-btn dg-btn-primary" style={{ fontSize: "1.1rem", padding: "16px 40px" }}>Claim Your Free Trial</button>
        </div>

        <div className="dg-footer">© 2026 Iron Pulse Fitness. This is a demo website.</div>
      </div>
    </DemoShell>
  );
}
