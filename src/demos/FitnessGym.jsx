import React, { useState, useEffect, useRef } from "react";
import DemoShell from "./DemoShell.jsx";

const SCHEDULE = [
  { time: "6AM", day: 0, name: "HIIT", trainer: "Alex Rivera", type: "hiit" },
  { time: "6AM", day: 2, name: "Spin", trainer: "Maya Chen", type: "spin" },
  { time: "6AM", day: 4, name: "CrossFit", trainer: "Dre Jackson", type: "crossfit" },
  { time: "8AM", day: 1, name: "Yoga", trainer: "Maya Chen", type: "yoga" },
  { time: "8AM", day: 3, name: "Strength", trainer: "Alex Rivera", type: "strength" },
  { time: "10AM", day: 0, name: "Boxing", trainer: "Dre Jackson", type: "boxing" },
  { time: "10AM", day: 2, name: "Yoga", trainer: "Maya Chen", type: "yoga" },
  { time: "10AM", day: 4, name: "HIIT", trainer: "Alex Rivera", type: "hiit" },
  { time: "12PM", day: 1, name: "Spin", trainer: "Maya Chen", type: "spin" },
  { time: "12PM", day: 3, name: "CrossFit", trainer: "Dre Jackson", type: "crossfit" },
  { time: "5PM", day: 0, name: "Strength", trainer: "Alex Rivera", type: "strength" },
  { time: "5PM", day: 1, name: "Boxing", trainer: "Dre Jackson", type: "boxing" },
  { time: "5PM", day: 2, name: "HIIT", trainer: "Alex Rivera", type: "hiit" },
  { time: "5PM", day: 3, name: "Yoga", trainer: "Maya Chen", type: "yoga" },
  { time: "5PM", day: 4, name: "Strength", trainer: "Dre Jackson", type: "strength" },
  { time: "7PM", day: 0, name: "CrossFit", trainer: "Dre Jackson", type: "crossfit" },
  { time: "7PM", day: 2, name: "Boxing", trainer: "Dre Jackson", type: "boxing" },
  { time: "7PM", day: 4, name: "Spin", trainer: "Maya Chen", type: "spin" },
];
const TIMES = ["6AM", "8AM", "10AM", "12PM", "5PM", "7PM"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const STATS = [
  { value: 50, suffix: "+", label: "Classes per Week" },
  { value: 15, suffix: "", label: "Expert Trainers" },
  { value: 24, suffix: "/7", label: "Open Access" },
  { value: 5000, suffix: "+", label: "Active Members" },
];
const TRAINERS = [
  { name: "Alex Rivera", initials: "AR", specialty: "HIIT & Strength", quote: "Pain is temporary. Results are forever." },
  { name: "Maya Chen", initials: "MC", specialty: "Yoga & Recovery", quote: "Strength begins where comfort ends." },
  { name: "Dre Jackson", initials: "DJ", specialty: "Boxing & CrossFit", quote: "Every rep is a vote for who you want to become." },
];

function useCountUp(target, active, duration = 1500) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    let frame;
    const tick = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.round(progress * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);
  return val;
}

function StatBox({ stat, active }) {
  const count = useCountUp(stat.value, active);
  return (
    <div className="dg-stat-box">
      <span className="dg-stat-num">{count}{stat.suffix}</span>
      <span className="dg-stat-label">{stat.label}</span>
    </div>
  );
}

export default function FitnessGym() {
  const [booked, setBooked] = useState(new Set());
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function toggleBook(key) {
    setBooked(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  return (
    <DemoShell industry="Fitness & Gym">
      <style>{`
        .dg-page { --red: #ef4444; --amber: #f59e0b; --dark: #0a0a0a; --dark2: #111; --dark3: #1a1a1a; --white: #f5f5f5; --muted: #999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--dark); color: var(--white); min-height: 100vh; }
        .dg-page *, .dg-page *::before, .dg-page *::after { box-sizing: border-box; }

        /* Hero */
        .dg-hero { position: relative; min-height: 90vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 80px 24px 60px; overflow: hidden; background: radial-gradient(ellipse at 50% 80%, #1a0505 0%, var(--dark) 70%); }
        .dg-hero::before { content: ""; position: absolute; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 59px, #ffffff06 59px, #ffffff06 60px); pointer-events: none; }
        .dg-hero-title { font-size: clamp(4rem, 14vw, 10rem); font-weight: 900; letter-spacing: -0.04em; line-height: 0.9; text-transform: uppercase; background: linear-gradient(180deg, #fff 40%, var(--red) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; position: relative; z-index: 1; }
        .dg-hero-tag { font-size: clamp(1rem, 2.5vw, 1.5rem); color: var(--muted); margin-top: 20px; letter-spacing: 0.05em; text-transform: uppercase; font-weight: 500; position: relative; z-index: 1; }
        .dg-hero-ctas { display: flex; gap: 16px; margin-top: 40px; position: relative; z-index: 1; flex-wrap: wrap; justify-content: center; }
        .dg-btn-primary { background: var(--red); color: #fff; border: none; padding: 16px 32px; font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; border-radius: 4px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
        .dg-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px #ef444466; }
        .dg-btn-outline { background: none; color: var(--white); border: 1px solid #444; padding: 16px 32px; font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; border-radius: 4px; cursor: pointer; transition: border-color 0.2s; }
        .dg-btn-outline:hover { border-color: var(--red); color: var(--red); }
        .dg-pulse-wrap { position: absolute; bottom: 60px; left: 0; right: 0; height: 60px; overflow: hidden; opacity: 0.4; }
        .dg-pulse-line { stroke: var(--red); stroke-width: 2; fill: none; stroke-dasharray: 8 4 2 4 30 4 2 4; animation: dg-dash 3s linear infinite; filter: drop-shadow(0 0 6px var(--red)); }
        @keyframes dg-dash { to { stroke-dashoffset: -200; } }

        /* Stats */
        .dg-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 1100px; margin: 0 auto; padding: 80px 24px; }
        .dg-stat-box { text-align: center; padding: 32px 16px; background: var(--dark2); border: 1px solid #222; border-radius: 8px; border-bottom: 3px solid var(--red); box-shadow: 0 4px 20px #ef444411; }
        .dg-stat-num { display: block; font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; color: var(--red); letter-spacing: -0.03em; }
        .dg-stat-label { display: block; margin-top: 8px; font-size: 1rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }

        /* Schedule */
        .dg-schedule { max-width: 1100px; margin: 0 auto; padding: 0 24px 80px; }
        .dg-section-title { font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; text-align: center; margin-bottom: 12px; }
        .dg-section-sub { text-align: center; color: var(--muted); margin-bottom: 40px; font-size: 1.125rem; }
        .dg-grid { display: grid; grid-template-columns: 70px repeat(5, 1fr); gap: 4px; }
        .dg-grid-header { background: var(--dark3); color: var(--amber); font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.06em; padding: 12px 8px; text-align: center; border-radius: 4px; }
        .dg-grid-time { background: var(--dark2); color: var(--muted); font-weight: 600; font-size: 0.875rem; padding: 12px 8px; text-align: center; display: flex; align-items: center; justify-content: center; border-radius: 4px; }
        .dg-grid-cell { min-height: 56px; background: var(--dark2); border-radius: 4px; display: flex; align-items: center; justify-content: center; position: relative; }
        .dg-class-btn { width: 100%; height: 100%; min-height: 56px; border: 1px solid transparent; border-radius: 4px; cursor: pointer; font-weight: 700; font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--white); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s; position: relative; background: var(--cell-bg, var(--dark2)); }
        .dg-class-btn:hover { border-color: var(--red); box-shadow: 0 0 16px #ef444433; transform: scale(1.04); z-index: 2; }
        .dg-class-btn:hover .dg-class-trainer { opacity: 1; transform: translateX(-50%) translateY(0); }
        .dg-class-btn.dg-booked { border-color: var(--amber); }
        .dg-class-btn.dg-booked::after { content: "✓"; position: absolute; top: 4px; right: 6px; font-size: 0.75rem; color: var(--amber); }
        .dg-class-trainer { position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%) translateY(4px); background: var(--dark3); border: 1px solid #333; padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 400; color: var(--muted); white-space: nowrap; opacity: 0; transition: opacity 0.2s, transform 0.2s; pointer-events: none; z-index: 10; }
        .dg-type-hiit { --cell-bg: #1a1010; }
        .dg-type-yoga { --cell-bg: #0f1a14; }
        .dg-type-spin { --cell-bg: #101018; }
        .dg-type-strength { --cell-bg: #1a150a; }
        .dg-type-boxing { --cell-bg: #1a0a0f; }
        .dg-type-crossfit { --cell-bg: #15100a; }

        /* Membership */
        .dg-membership { max-width: 1100px; margin: 0 auto; padding: 0 24px 80px; }
        .dg-tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: start; }
        .dg-tier { background: var(--dark2); border: 1px solid #222; border-radius: 10px; padding: 36px 28px; text-align: center; transition: transform 0.25s, box-shadow 0.25s; }
        .dg-tier:hover { transform: translateY(-6px); box-shadow: 0 12px 40px #00000066; }
        .dg-tier.dg-popular { border-color: var(--red); transform: scale(1.04); position: relative; box-shadow: 0 0 30px #ef444422; }
        .dg-tier.dg-popular:hover { transform: scale(1.04) translateY(-6px); }
        .dg-popular-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--red); color: #fff; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 4px 16px; border-radius: 20px; }
        .dg-tier-name { font-size: 1.25rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
        .dg-tier-price { font-size: 3rem; font-weight: 900; color: var(--white); margin: 16px 0 4px; }
        .dg-tier-price span { font-size: 1rem; font-weight: 400; color: var(--muted); }
        .dg-tier-features { list-style: none; padding: 0; margin: 24px 0; text-align: left; }
        .dg-tier-features li { padding: 8px 0; border-bottom: 1px solid #1a1a1a; color: var(--muted); font-size: 0.9375rem; }
        .dg-tier-features li::before { content: "→ "; color: var(--red); font-weight: 700; }
        .dg-tier .dg-btn-primary { width: 100%; margin-top: 8px; }
        .dg-tier.dg-popular .dg-btn-primary { box-shadow: 0 4px 20px #ef444444; }

        /* Trainers */
        .dg-trainers { max-width: 1100px; margin: 0 auto; padding: 0 24px 80px; }
        .dg-trainer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .dg-trainer-card { background: var(--dark2); border: 1px solid #222; border-radius: 10px; padding: 32px 24px; text-align: center; }
        .dg-trainer-avatar { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, var(--red), var(--amber)); display: inline-flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 900; color: #fff; letter-spacing: -0.02em; margin-bottom: 16px; }
        .dg-trainer-name { font-size: 1.125rem; font-weight: 700; text-transform: uppercase; }
        .dg-trainer-spec { font-size: 0.875rem; color: var(--red); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 4px; font-weight: 600; }
        .dg-trainer-quote { font-style: italic; color: var(--muted); margin-top: 16px; font-size: 0.9375rem; line-height: 1.6; }

        /* Final CTA */
        .dg-final-cta { text-align: center; padding: 80px 24px; border-top: 1px solid #1a1a1a; background: radial-gradient(ellipse at 50% 100%, #1a0505 0%, var(--dark) 70%); }
        .dg-final-cta h2 { font-size: clamp(1.75rem, 4vw, 3rem); font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; }
        .dg-final-cta p { color: var(--muted); margin: 16px 0 32px; font-size: 1.125rem; }
        .dg-final-cta .dg-btn-primary { font-size: 1.125rem; padding: 18px 40px; box-shadow: 0 0 40px #ef444433; }

        @media (max-width: 800px) {
          .dg-stats { grid-template-columns: repeat(2, 1fr); }
          .dg-tiers { grid-template-columns: 1fr; max-width: 400px; margin-inline: auto; }
          .dg-tier.dg-popular { transform: none; }
          .dg-tier.dg-popular:hover { transform: translateY(-6px); }
          .dg-trainer-grid { grid-template-columns: 1fr; max-width: 400px; margin-inline: auto; }
          .dg-grid { grid-template-columns: 50px repeat(5, 1fr); font-size: 0.75rem; }
          .dg-class-btn { font-size: 0.6875rem; min-height: 48px; }
          .dg-grid-header, .dg-grid-time { font-size: 0.75rem; padding: 8px 4px; }
        }
        @media (max-width: 500px) {
          .dg-stats { grid-template-columns: 1fr 1fr; gap: 12px; }
          .dg-hero { min-height: 70vh; padding: 60px 16px 40px; }
        }
      `}</style>
      <div className="dg-page">
        <section className="dg-hero">
          <h1 className="dg-hero-title">Iron Pulse</h1>
          <p className="dg-hero-tag">Your strongest chapter starts now.</p>
          <div className="dg-hero-ctas">
            <button className="dg-btn-primary">Start Your Trial</button>
            <button className="dg-btn-outline" onClick={() => document.querySelector(".dg-schedule")?.scrollIntoView({ behavior: "smooth" })}>View Classes</button>
          </div>
          <div className="dg-pulse-wrap">
            <svg width="100%" height="60" preserveAspectRatio="none" viewBox="0 0 400 60">
              <polyline className="dg-pulse-line" points="0,30 80,30 90,30 95,10 100,50 105,20 110,40 115,30 130,30 160,30 170,30 175,10 180,50 185,20 190,40 195,30 210,30 240,30 250,30 255,10 260,50 265,20 270,40 275,30 290,30 320,30 330,30 335,10 340,50 345,20 350,40 355,30 400,30" />
            </svg>
          </div>
        </section>

        <section className="dg-stats" ref={statsRef}>
          {STATS.map(s => <StatBox key={s.label} stat={s} active={statsVisible} />)}
        </section>

        <section className="dg-schedule">
          <h2 className="dg-section-title">Class Schedule</h2>
          <p className="dg-section-sub">Tap a class to book your spot</p>
          <div className="dg-grid">
            <div className="dg-grid-header" />
            {DAYS.map(d => <div key={d} className="dg-grid-header">{d}</div>)}
            {TIMES.map(time => (
              <React.Fragment key={time}>
                <div className="dg-grid-time">{time}</div>
                {DAYS.map((_, dayIdx) => {
                  const cls = SCHEDULE.find(s => s.time === time && s.day === dayIdx);
                  const key = `${time}-${dayIdx}`;
                  if (!cls) return <div key={key} className="dg-grid-cell" />;
                  return (
                    <div key={key} className="dg-grid-cell">
                      <button
                        className={`dg-class-btn dg-type-${cls.type}${booked.has(key) ? " dg-booked" : ""}`}
                        onClick={() => toggleBook(key)}
                      >
                        {cls.name}
                        <span className="dg-class-trainer">{cls.trainer}</span>
                      </button>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </section>

        <section className="dg-membership">
          <h2 className="dg-section-title">Membership</h2>
          <p className="dg-section-sub">Choose the plan that matches your goals</p>
          <div className="dg-tiers">
            <div className="dg-tier">
              <div className="dg-tier-name">Basic</div>
              <div className="dg-tier-price">$29<span>/mo</span></div>
              <ul className="dg-tier-features">
                <li>Full gym access</li>
                <li>Locker included</li>
                <li>2 classes per week</li>
              </ul>
              <button className="dg-btn-primary">Get Started</button>
            </div>
            <div className="dg-tier dg-popular">
              <span className="dg-popular-badge">Most Popular</span>
              <div className="dg-tier-name">Pro</div>
              <div className="dg-tier-price">$59<span>/mo</span></div>
              <ul className="dg-tier-features">
                <li>Unlimited classes</li>
                <li>Personal training app</li>
                <li>Nutrition guide</li>
                <li>Priority booking</li>
              </ul>
              <button className="dg-btn-primary">Get Started</button>
            </div>
            <div className="dg-tier">
              <div className="dg-tier-name">Elite</div>
              <div className="dg-tier-price">$99<span>/mo</span></div>
              <ul className="dg-tier-features">
                <li>Everything in Pro</li>
                <li>4 PT sessions / month</li>
                <li>Recovery suite access</li>
                <li>Guest passes</li>
              </ul>
              <button className="dg-btn-primary">Get Started</button>
            </div>
          </div>
        </section>

        <section className="dg-trainers">
          <h2 className="dg-section-title">Meet Your Trainers</h2>
          <p className="dg-section-sub">The team behind every breakthrough</p>
          <div className="dg-trainer-grid">
            {TRAINERS.map(t => (
              <div key={t.name} className="dg-trainer-card">
                <div className="dg-trainer-avatar">{t.initials}</div>
                <div className="dg-trainer-name">{t.name}</div>
                <div className="dg-trainer-spec">{t.specialty}</div>
                <p className="dg-trainer-quote">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </section>

        <section className="dg-final-cta">
          <h2>Your first class is free.</h2>
          <p>No contracts. No pressure. Just results.</p>
          <button className="dg-btn-primary">Claim Your Free Trial</button>
        </section>
      </div>
    </DemoShell>
  );
}
