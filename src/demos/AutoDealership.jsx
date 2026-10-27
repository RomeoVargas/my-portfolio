import React, { useState, useRef, useEffect } from "react";
import DemoShell from "./DemoShell.jsx";

const fleet = [
  { name: "Phantom GT", cls: "Sports", hp: 670, accel: "2.8s", top: "211 mph", price: "$89,900" },
  { name: "Apex S", cls: "Sedan", hp: 382, accel: "4.1s", top: "168 mph", price: "$52,500" },
  { name: "Storm X", cls: "SUV", hp: 450, accel: "3.9s", top: "155 mph", price: "$74,200" },
  { name: "Pulse EV", cls: "Electric", hp: 580, accel: "2.2s", top: "175 mph", price: "$67,800" },
];

function AnimatedNumber({ value, suffix = "" }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef();
  useEffect(() => {
    let start = 0;
    const end = typeof value === "number" ? value : parseInt(value, 10) || 0;
    const duration = 1200;
    const t0 = performance.now();
    function tick(now) {
      const p = Math.min((now - t0) / duration, 1);
      setDisplay(Math.round(start + (end - start) * p));
      if (p < 1) ref.current = requestAnimationFrame(tick);
    }
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [value]);
  return <>{display}{suffix}</>;
}

function CarSVG() {
  return (
    <svg viewBox="0 0 500 200" className="da-car-svg" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <path d="M60 130 L80 130 L95 90 L150 60 L200 50 L300 50 L360 60 L400 85 L430 100 L440 130 L60 130Z" fill="#1a1e2e" stroke="#00d4ff" strokeWidth="1.5" />
      {/* Roof / windshield */}
      <path d="M150 60 L180 35 L290 30 L340 50 L300 50 L200 50Z" fill="#0f1320" stroke="#00d4ff" strokeWidth="1" />
      {/* Windshield glass */}
      <path d="M155 58 L182 38 L240 33 L200 50Z" fill="#00d4ff" opacity="0.15" />
      {/* Rear window */}
      <path d="M260 33 L290 32 L335 52 L300 50Z" fill="#00d4ff" opacity="0.1" />
      {/* Hood scoop */}
      <path d="M120 80 L170 68 L170 75 L125 85Z" fill="#22283a" stroke="#00d4ff" strokeWidth="0.8" />
      {/* Spoiler */}
      <path d="M370 55 L410 48 L415 52 L375 58Z" fill="#1a1e2e" stroke="#ff6b00" strokeWidth="1" />
      <line x1="380" y1="58" x2="385" y2="65" stroke="#ff6b00" strokeWidth="1" />
      <line x1="405" y1="52" x2="400" y2="65" stroke="#ff6b00" strokeWidth="1" />
      {/* Side intake */}
      <path d="M250 95 L310 90 L310 110 L255 110Z" fill="#0a0e17" stroke="#00d4ff" strokeWidth="0.6" opacity="0.8" />
      {/* Headlight */}
      <path d="M70 110 L85 95 L100 95 L90 115 L70 115Z" fill="#00d4ff" opacity="0.6" />
      <circle cx="82" cy="105" r="4" fill="#fff" opacity="0.8" />
      {/* Taillight */}
      <rect x="425" y="100" width="15" height="12" rx="2" fill="#ff6b00" opacity="0.8" />
      <rect x="428" y="103" width="9" height="6" rx="1" fill="#ff3300" opacity="0.9" />
      {/* Front wheel */}
      <circle cx="135" cy="135" r="30" fill="#111" stroke="#333" strokeWidth="2" />
      <circle cx="135" cy="135" r="22" fill="none" stroke="#444" strokeWidth="3" />
      <circle cx="135" cy="135" r="12" fill="#222" stroke="#00d4ff" strokeWidth="1" />
      <circle cx="135" cy="135" r="5" fill="#00d4ff" opacity="0.4" />
      {/* Rear wheel */}
      <circle cx="380" cy="135" r="30" fill="#111" stroke="#333" strokeWidth="2" />
      <circle cx="380" cy="135" r="22" fill="none" stroke="#444" strokeWidth="3" />
      <circle cx="380" cy="135" r="12" fill="#222" stroke="#00d4ff" strokeWidth="1" />
      <circle cx="380" cy="135" r="5" fill="#00d4ff" opacity="0.4" />
      {/* Wheel spokes (front) */}
      {[0,60,120,180,240,300].map(a => <line key={`f${a}`} x1={135+12*Math.cos(a*Math.PI/180)} y1={135+12*Math.sin(a*Math.PI/180)} x2={135+22*Math.cos(a*Math.PI/180)} y2={135+22*Math.sin(a*Math.PI/180)} stroke="#555" strokeWidth="1.5" />)}
      {/* Wheel spokes (rear) */}
      {[0,60,120,180,240,300].map(a => <line key={`r${a}`} x1={380+12*Math.cos(a*Math.PI/180)} y1={135+12*Math.sin(a*Math.PI/180)} x2={380+22*Math.cos(a*Math.PI/180)} y2={135+22*Math.sin(a*Math.PI/180)} stroke="#555" strokeWidth="1.5" />)}
      {/* Ground line */}
      <line x1="30" y1="165" x2="470" y2="165" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3" />
      {/* Neon underglow */}
      <ellipse cx="250" cy="168" rx="180" ry="8" fill="url(#underglow)" />
      <defs>
        <radialGradient id="underglow">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default function AutoDealership() {
  const [rotation, setRotation] = useState(0);
  const [selected, setSelected] = useState(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const car = fleet[selected];

  const onPointerDown = (e) => {
    dragging.current = true;
    lastX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const delta = e.clientX - lastX.current;
    lastX.current = e.clientX;
    setRotation(r => r + delta * 0.4);
  };
  const onPointerUp = () => { dragging.current = false; };

  const viewerAngle = ((rotation % 360) + 360) % 360;

  return (
    <DemoShell industry="Auto Dealership">
      <style>{`
        .da-page { --cyan: #00d4ff; --orange: #ff6b00; --dark: #0a0e17; --darker: #060a12; background: var(--dark); color: #e8eaf0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; min-height: 100vh; overflow-x: hidden; }
        .da-page *, .da-page *::before, .da-page *::after { box-sizing: border-box; }

        /* Hero */
        .da-hero { position: relative; padding: 80px 32px 60px; text-align: center; overflow: hidden; background: linear-gradient(180deg, #060a12 0%, var(--dark) 100%); }
        .da-hero-title { font-size: clamp(2.5rem, 7vw, 5rem); font-weight: 900; letter-spacing: 0.15em; text-transform: uppercase; margin: 0; background: linear-gradient(180deg, #fff 30%, #00d4ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.1; }
        .da-hero-tag { font-size: 1.25rem; color: #8892a8; margin: 16px 0 32px; letter-spacing: 0.05em; }
        .da-hero-ctas { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .da-btn { padding: 14px 28px; border: none; border-radius: 6px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; }
        .da-btn-primary { background: var(--cyan); color: var(--dark); box-shadow: 0 0 24px #00d4ff44; }
        .da-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 40px #00d4ff66; }
        .da-btn-secondary { background: transparent; color: var(--cyan); border: 1px solid var(--cyan); }
        .da-btn-secondary:hover { background: #00d4ff12; transform: translateY(-2px); }

        /* Speed lines */
        .da-speed-lines { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .da-speed-line { position: absolute; height: 1px; background: linear-gradient(90deg, transparent, var(--cyan), transparent); opacity: 0.15; animation: da-streak var(--dur) linear infinite; animation-delay: var(--delay); left: -30%; width: 60%; }
        @keyframes da-streak { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }

        /* Car Viewer */
        .da-viewer { position: relative; padding: 40px 32px 60px; background: var(--darker); border-top: 1px solid #141a28; border-bottom: 1px solid #141a28; }
        .da-viewer-label { text-align: center; font-size: 1rem; color: #556; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 24px; }
        .da-viewer-stage { position: relative; max-width: 700px; margin: 0 auto; perspective: 1000px; cursor: grab; user-select: none; touch-action: pan-y; }
        .da-viewer-stage:active { cursor: grabbing; }
        .da-car-wrap { transform-style: preserve-3d; transition: transform 0.05s linear; }
        .da-car-svg { width: 100%; height: auto; display: block; filter: drop-shadow(0 0 20px #00d4ff33); }
        .da-floor { position: absolute; bottom: -10px; left: 5%; right: 5%; height: 60px; background: repeating-linear-gradient(90deg, #00d4ff0a 0px, transparent 1px, transparent 40px), repeating-linear-gradient(0deg, #00d4ff08 0px, transparent 1px, transparent 40px); animation: da-floor-scroll 4s linear infinite; border-radius: 50%; opacity: 0.6; }
        @keyframes da-floor-scroll { 0% { background-position: 0 0; } 100% { background-position: 40px 40px; } }
        .da-glow { position: absolute; bottom: -20px; left: 15%; right: 15%; height: 50px; background: radial-gradient(ellipse, var(--cyan) 0%, transparent 70%); filter: blur(18px); opacity: 0.35; pointer-events: none; }
        .da-hud { position: absolute; top: 12px; right: 12px; background: #0a0e17cc; border: 1px solid #00d4ff44; border-radius: 6px; padding: 8px 14px; font-size: 0.875rem; color: var(--cyan); font-variant-numeric: tabular-nums; }
        .da-hud span { color: #556; }

        /* Stats overlay */
        .da-viewer-stats { display: flex; justify-content: center; gap: 40px; margin-top: 32px; flex-wrap: wrap; }
        .da-stat { text-align: center; }
        .da-stat-value { font-size: 2rem; font-weight: 800; color: var(--cyan); line-height: 1.2; }
        .da-stat-label { font-size: 0.8125rem; color: #667; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }

        /* Fleet */
        .da-fleet { padding: 60px 32px; max-width: 1100px; margin: 0 auto; }
        .da-fleet-title { font-size: 1.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
        .da-fleet-sub { color: #667; margin-bottom: 32px; }
        .da-fleet-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
        .da-card { background: #0d1220; border: 1px solid #1a2030; border-radius: 10px; padding: 24px; cursor: pointer; transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; }
        .da-card:hover, .da-card.da-active { border-color: var(--cyan); transform: translateY(-4px); box-shadow: 0 8px 30px #00d4ff18; }
        .da-card.da-active { border-color: var(--orange); box-shadow: 0 8px 30px #ff6b0018; }
        .da-card-class { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--cyan); margin-bottom: 8px; }
        .da-card.da-active .da-card-class { color: var(--orange); }
        .da-card-name { font-size: 1.25rem; font-weight: 800; margin-bottom: 16px; }
        .da-card-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8125rem; color: #8892a8; margin-bottom: 16px; }
        .da-card-specs strong { color: #e8eaf0; font-weight: 600; display: block; }
        .da-card-price { font-size: 1.5rem; font-weight: 800; color: var(--cyan); }
        .da-card.da-active .da-card-price { color: var(--orange); }

        /* Stats bar */
        .da-stats-bar { display: grid; grid-template-columns: repeat(4, 1fr); background: #060a12; border-top: 1px solid #141a28; border-bottom: 1px solid #141a28; }
        .da-stats-item { padding: 28px 16px; text-align: center; border-right: 1px solid #141a28; }
        .da-stats-item:last-child { border-right: none; }
        .da-stats-num { font-size: 1.5rem; font-weight: 800; color: var(--cyan); }
        .da-stats-text { font-size: 0.8125rem; color: #667; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 4px; }

        /* CTA */
        .da-cta { padding: 64px 32px; max-width: 600px; margin: 0 auto; text-align: center; }
        .da-cta-title { font-size: 1.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 8px; }
        .da-cta-sub { color: #667; margin-bottom: 32px; }
        .da-form { display: grid; gap: 14px; }
        .da-input { background: #0d1220; border: 1px solid #1a2030; border-radius: 6px; padding: 14px 16px; color: #e8eaf0; font-size: 1rem; font-family: inherit; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .da-input:focus { border-color: var(--cyan); box-shadow: 0 0 12px #00d4ff33; }
        .da-input::placeholder { color: #445; }
        .da-submit { background: var(--cyan); color: var(--dark); border: none; border-radius: 6px; padding: 16px; font-size: 1rem; font-weight: 700; cursor: pointer; box-shadow: 0 0 24px #00d4ff33; transition: box-shadow 0.2s, transform 0.15s; }
        .da-submit:hover { box-shadow: 0 0 40px #00d4ff55; transform: translateY(-2px); }

        .da-footer { text-align: center; padding: 24px; color: #334; font-size: 0.875rem; border-top: 1px solid #141a28; }

        @media (max-width: 700px) {
          .da-hero { padding: 48px 20px 40px; }
          .da-viewer { padding: 28px 16px 40px; }
          .da-fleet { padding: 40px 20px; }
          .da-fleet-grid { grid-template-columns: 1fr; }
          .da-stats-bar { grid-template-columns: repeat(2, 1fr); }
          .da-stats-item:nth-child(2) { border-right: none; }
          .da-viewer-stats { gap: 20px; }
          .da-cta { padding: 40px 20px; }
        }
      `}</style>
      <div className="da-page">
        {/* Hero */}
        <section className="da-hero">
          <div className="da-speed-lines">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="da-speed-line" style={{ top: `${12 + i * 11}%`, "--dur": `${2 + i * 0.7}s`, "--delay": `${i * 0.3}s` }} />
            ))}
          </div>
          <h1 className="da-hero-title">Velocity Motors</h1>
          <p className="da-hero-tag">Feel the power.</p>
          <div className="da-hero-ctas">
            <button className="da-btn da-btn-primary" onClick={() => document.querySelector(".da-fleet")?.scrollIntoView({ behavior: "smooth" })}>Explore Our Fleet</button>
            <button className="da-btn da-btn-secondary" onClick={() => document.querySelector(".da-cta")?.scrollIntoView({ behavior: "smooth" })}>Book Test Drive</button>
          </div>
        </section>

        {/* Car Viewer */}
        <section className="da-viewer">
          <p className="da-viewer-label">↔ Drag to rotate</p>
          <div className="da-viewer-stage" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
            <div className="da-car-wrap" style={{ transform: `rotateY(${rotation}deg)` }}>
              <CarSVG />
            </div>
            <div className="da-floor" />
            <div className="da-glow" />
            <div className="da-hud"><span>ANGLE </span>{Math.round(viewerAngle)}°</div>
          </div>
          <div className="da-viewer-stats">
            <div className="da-stat">
              <div className="da-stat-value"><AnimatedNumber value={car.hp} /> <span style={{ fontSize: "0.875rem", color: "#667" }}>HP</span></div>
              <div className="da-stat-label">Horsepower</div>
            </div>
            <div className="da-stat">
              <div className="da-stat-value">{car.accel}</div>
              <div className="da-stat-label">0–60 mph</div>
            </div>
            <div className="da-stat">
              <div className="da-stat-value">{car.top}</div>
              <div className="da-stat-label">Top Speed</div>
            </div>
          </div>
        </section>

        {/* Fleet */}
        <section className="da-fleet">
          <h2 className="da-fleet-title">Our Fleet</h2>
          <p className="da-fleet-sub">Select a vehicle to see its specs in the viewer above.</p>
          <div className="da-fleet-grid">
            {fleet.map((c, i) => (
              <div key={c.name} className={`da-card${selected === i ? " da-active" : ""}`} onClick={() => { setSelected(i); document.querySelector(".da-viewer")?.scrollIntoView({ behavior: "smooth" }); }}>
                <div className="da-card-class">{c.cls}</div>
                <div className="da-card-name">{c.name}</div>
                <div className="da-card-specs">
                  <div><strong>{c.hp} HP</strong>Power</div>
                  <div><strong>{c.accel}</strong>0–60</div>
                  <div><strong>{c.top}</strong>Top Speed</div>
                  <div><strong>{c.price}</strong>Starting</div>
                </div>
                <div className="da-card-price">{c.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Bar */}
        <div className="da-stats-bar">
          {[["200+", "Models"], ["0%", "APR Available"], ["5-Star", "Certified"], ["24/7", "Support"]].map(([num, text]) => (
            <div key={text} className="da-stats-item">
              <div className="da-stats-num">{num}</div>
              <div className="da-stats-text">{text}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <section className="da-cta">
          <h2 className="da-cta-title">Schedule Your Test Drive</h2>
          <p className="da-cta-sub">Experience the thrill firsthand.</p>
          <form className="da-form" onSubmit={e => { e.preventDefault(); alert("Demo only — this form doesn't submit."); }}>
            <input className="da-input" type="text" placeholder="Your name" required />
            <input className="da-input" type="email" placeholder="Email address" required />
            <input className="da-input" type="tel" placeholder="Phone number" />
            <button className="da-submit" type="submit">Book Now</button>
          </form>
        </section>

        <footer className="da-footer">Velocity Motors — Demo Website</footer>
      </div>
    </DemoShell>
  );
}
