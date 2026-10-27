import React, { useState, useEffect, useRef, useCallback } from "react";
import DemoShell from "./DemoShell.jsx";

const SERVICES = [
  { icon: "✂", name: "Hair Styling", desc: "Transform your look", price: 85 },
  { icon: "🎨", name: "Color & Highlights", desc: "Artistry in every strand", price: 120 },
  { icon: "✦", name: "Facial Treatment", desc: "Radiance redefined", price: 95 },
  { icon: "💅", name: "Nail Artistry", desc: "Details that dazzle", price: 55 },
  { icon: "🌿", name: "Body Massage", desc: "Release and restore", price: 110 },
  { icon: "💍", name: "Bridal Package", desc: "Your perfect day, perfected", price: 450 },
];

const SLOTS = [
  "Mon 10:00", "Mon 14:00", "Mon 16:00",
  "Tue 11:00", "Tue 13:00", "Tue 15:00",
  "Wed 10:00", "Wed 12:00", "Wed 16:00",
  "Thu 11:00", "Thu 14:00", "Thu 17:00",
  "Fri 10:00", "Fri 13:00", "Fri 15:00",
  "Sat 10:00", "Sat 12:00", "Sat 14:00",
];

const TESTIMONIALS = [
  { text: "The best salon experience I've ever had. Absolutely magical.", author: "Sarah M." },
  { text: "Luxe Studio transformed me for my wedding. I felt like a queen.", author: "Diana K." },
  { text: "My go-to for every occasion. The attention to detail is unmatched.", author: "Priya R." },
];

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  left: `${7 + (i * 8) % 90}%`,
  size: 3 + (i % 3) * 2,
  delay: `${i * 0.7}s`,
  dur: `${5 + (i % 4) * 2}s`,
  color: ["#c084fc", "#f9a8d4", "#fef3c7"][i % 3],
}));

export default function BeautySalon() {
  const [bookStep, setBookStep] = useState(0);
  const [selService, setSelService] = useState(null);
  const [selSlot, setSelSlot] = useState(null);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [sliderX, setSliderX] = useState(50);
  const sliderRef = useRef(null);
  const dragging = useRef(false);
  const servicesRef = useRef(null);
  const bookingRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setCarouselIdx(i => (i + 1) % 3), 4000);
    return () => clearInterval(id);
  }, []);

  const onSliderPointerDown = useCallback((e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);
  const onSliderPointerMove = useCallback((e) => {
    if (!dragging.current || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    setSliderX(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
  }, []);
  const onSliderPointerUp = useCallback(() => { dragging.current = false; }, []);

  return (
    <DemoShell industry="Beauty & Spa">
      <style>{`
        .db-page { --db-bg: #1a0f1e; --db-surface: #231528; --db-primary: #c084fc; --db-accent: #f9a8d4; --db-cream: #fef3c7; --db-text: #f0e8f5; --db-muted: #b8a5c8; --db-line: #3a2845; background: var(--db-bg); color: var(--db-text); font-family: "DM Sans", Arial, sans-serif; min-height: 100vh; overflow-x: hidden; }
        .db-page h1,.db-page h2,.db-page h3 { font-family: Georgia, "Times New Roman", serif; font-weight: 400; }

        /* Hero */
        .db-hero { position: relative; min-height: 85vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 80px 24px 64px; background: linear-gradient(170deg, #2d1535 0%, #1a0f1e 40%, #1f0f28 70%, #12081a 100%); overflow: hidden; }
        .db-particle { position: absolute; border-radius: 50%; opacity: 0; animation: db-float linear infinite; pointer-events: none; }
        @keyframes db-float { 0% { opacity: 0; transform: translateY(0) scale(0.5); } 15% { opacity: 0.7; } 85% { opacity: 0.7; } 100% { opacity: 0; transform: translateY(-85vh) scale(1.2); } }
        .db-hero-title { font-size: clamp(2.5rem, 7vw, 5rem); letter-spacing: 0.25em; color: var(--db-cream); margin-bottom: 16px; line-height: 1.1; }
        .db-hero-sub { font-size: clamp(1.125rem, 2.5vw, 1.5rem); color: var(--db-accent); font-style: italic; margin-bottom: 40px; font-family: Georgia, serif; }
        .db-hero-actions { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
        .db-btn-primary { background: linear-gradient(135deg, var(--db-primary), var(--db-accent)); color: #1a0f1e; padding: 14px 32px; border-radius: 40px; font-weight: 700; font-size: 1rem; border: none; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
        .db-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px #c084fc44; }
        .db-btn-outline { border: 1px solid var(--db-primary); color: var(--db-primary); padding: 14px 32px; border-radius: 40px; font-size: 1rem; background: transparent; cursor: pointer; transition: background 0.2s, color 0.2s; }
        .db-btn-outline:hover { background: #c084fc18; }

        /* Section shared */
        .db-section { max-width: 1100px; margin: 0 auto; padding: 64px 24px; }
        .db-section-label { font-size: 1rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--db-primary); font-weight: 600; font-family: "DM Sans", sans-serif; margin-bottom: 8px; }
        .db-section-title { font-size: clamp(1.75rem, 3.5vw, 2.5rem); color: var(--db-cream); margin-bottom: 12px; }
        .db-section-sub { color: var(--db-muted); font-size: 1.125rem; max-width: 50ch; margin-bottom: 40px; line-height: 1.7; }
        .db-divider { border: none; border-top: 1px solid var(--db-line); margin: 0; }

        /* Services grid */
        .db-services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .db-svc-card { background: var(--db-surface); border: 1px solid var(--db-line); border-radius: 14px; padding: 28px 24px; transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s; cursor: default; }
        .db-svc-card:hover { transform: translateY(-6px); border-color: var(--db-primary); box-shadow: 0 12px 40px #c084fc22; }
        .db-svc-icon { width: 56px; height: 56px; border-radius: 14px; background: linear-gradient(135deg, #2d1b3a, #3a2048); display: grid; place-items: center; font-size: 1.5rem; margin-bottom: 18px; }
        .db-svc-card h3 { font-size: 1.25rem; color: var(--db-cream); margin-bottom: 6px; }
        .db-svc-card p { color: var(--db-muted); font-size: 1rem; margin-bottom: 14px; }
        .db-svc-price { font-family: "DM Sans", sans-serif; font-size: 1rem; color: var(--db-primary); font-weight: 600; }

        /* Booking wizard */
        .db-booking { background: var(--db-surface); border: 1px solid var(--db-line); border-radius: 16px; padding: 40px 32px; max-width: 640px; margin: 0 auto; }
        .db-steps { display: flex; justify-content: center; gap: 12px; margin-bottom: 32px; }
        .db-step-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--db-line); transition: background 0.3s, box-shadow 0.3s; }
        .db-step-dot.active { background: var(--db-primary); box-shadow: 0 0 12px #c084fc88; }
        .db-step-content { min-height: 260px; }
        .db-step-fade { animation: db-fade-in 0.35s ease; }
        @keyframes db-fade-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .db-book-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
        .db-book-tile { background: #2d1b3a; border: 1px solid var(--db-line); border-radius: 10px; padding: 16px; cursor: pointer; text-align: center; transition: border-color 0.2s, background 0.2s; }
        .db-book-tile:hover { border-color: var(--db-accent); }
        .db-book-tile.selected { border-color: var(--db-primary); background: #3a2048; box-shadow: 0 0 16px #c084fc33; }
        .db-book-tile-icon { font-size: 1.25rem; margin-bottom: 6px; }
        .db-book-tile-name { font-size: 1rem; font-weight: 600; color: var(--db-cream); }
        .db-book-tile-price { font-size: 0.875rem; color: var(--db-primary); margin-top: 4px; }
        .db-slot-grid { display: flex; flex-wrap: wrap; gap: 10px; }
        .db-slot { padding: 10px 18px; border: 1px solid var(--db-line); border-radius: 8px; background: #2d1b3a; cursor: pointer; font-size: 0.9375rem; color: var(--db-text); transition: border-color 0.2s, background 0.2s; }
        .db-slot:hover { border-color: var(--db-accent); }
        .db-slot.selected { border-color: var(--db-primary); background: #3a2048; }
        .db-confirm-summary { background: #2d1b3a; border-radius: 10px; padding: 20px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
        .db-confirm-row { display: flex; justify-content: space-between; font-size: 1rem; }
        .db-confirm-row span:first-child { color: var(--db-muted); }
        .db-confirm-row span:last-child { color: var(--db-cream); font-weight: 600; }
        .db-input { width: 100%; padding: 12px 16px; background: #2d1b3a; border: 1px solid var(--db-line); border-radius: 8px; color: var(--db-text); font-size: 1rem; font-family: inherit; margin-bottom: 16px; }
        .db-input:focus { outline: 2px solid var(--db-primary); outline-offset: 2px; border-color: var(--db-primary); }
        .db-book-nav { display: flex; justify-content: space-between; margin-top: 24px; }
        .db-book-nav button { min-width: 100px; }
        .db-book-label { font-size: 1rem; color: var(--db-muted); margin-bottom: 16px; }

        /* Before & After slider */
        .db-ba-wrapper { position: relative; max-width: 700px; margin: 0 auto; height: 320px; border-radius: 14px; overflow: hidden; cursor: ew-resize; touch-action: none; user-select: none; border: 1px solid var(--db-line); }
        .db-ba-before, .db-ba-after { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-family: Georgia, serif; }
        .db-ba-before { background: linear-gradient(135deg, #2a2030 0%, #3a2835 50%, #28202e 100%); color: #887888; z-index: 1; }
        .db-ba-after { background: linear-gradient(135deg, #3a1848 0%, #c084fc33 50%, #2d1540 100%); color: var(--db-cream); z-index: 0; }
        .db-ba-before { clip-path: inset(0 0 0 0); }
        .db-ba-divider { position: absolute; top: 0; bottom: 0; width: 3px; background: var(--db-cream); z-index: 3; transform: translateX(-50%); }
        .db-ba-handle { position: absolute; top: 50%; width: 36px; height: 36px; background: var(--db-cream); border-radius: 50%; z-index: 4; transform: translate(-50%, -50%); display: grid; place-items: center; box-shadow: 0 2px 12px #00000066; }
        .db-ba-handle::after { content: "↔"; font-size: 1rem; color: #1a0f1e; }
        .db-ba-label { position: absolute; bottom: 16px; z-index: 5; font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase; font-family: "DM Sans", sans-serif; font-weight: 600; padding: 4px 12px; border-radius: 4px; }
        .db-ba-label-before { left: 16px; color: #887888; background: #2a203088; }
        .db-ba-label-after { right: 16px; color: var(--db-cream); background: #3a184888; }

        /* Testimonials */
        .db-testi-wrapper { position: relative; min-height: 180px; }
        .db-testi-card { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px; opacity: 0; transition: opacity 0.6s; }
        .db-testi-card.active { opacity: 1; }
        .db-testi-quote { font-size: 1.25rem; font-family: Georgia, serif; font-style: italic; color: var(--db-cream); max-width: 50ch; line-height: 1.7; margin-bottom: 16px; }
        .db-testi-quote::before { content: "\\201C"; font-size: 2.5rem; color: var(--db-primary); line-height: 0; vertical-align: -0.3em; margin-right: 4px; }
        .db-testi-author { font-size: 1rem; color: var(--db-accent); font-family: "DM Sans", sans-serif; }
        .db-testi-dots { display: flex; justify-content: center; gap: 10px; margin-top: 16px; }
        .db-testi-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--db-line); border: none; cursor: pointer; padding: 0; transition: background 0.3s; }
        .db-testi-dot.active { background: var(--db-primary); }

        /* CTA */
        .db-cta { text-align: center; padding: 80px 24px; background: linear-gradient(170deg, #2d1535, #1a0f1e); }
        .db-cta h2 { font-size: clamp(1.75rem, 4vw, 2.75rem); color: var(--db-cream); margin-bottom: 16px; }
        .db-cta p { color: var(--db-muted); font-size: 1.125rem; margin-bottom: 32px; }

        /* Footer */
        .db-footer { max-width: 1100px; margin: 0 auto; padding: 20px 24px; border-top: 1px solid var(--db-line); display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--db-muted); flex-wrap: wrap; gap: 8px; }

        @media (max-width: 600px) {
          .db-hero { min-height: 70vh; padding: 60px 20px 48px; }
          .db-hero-title { letter-spacing: 0.12em; }
          .db-section { padding: 48px 20px; }
          .db-booking { padding: 28px 20px; }
          .db-services-grid { grid-template-columns: 1fr; }
          .db-book-grid { grid-template-columns: 1fr 1fr; }
          .db-ba-wrapper { height: 220px; }
        }
      `}</style>
      <div className="db-page">
        {/* Hero */}
        <section className="db-hero">
          {PARTICLES.map((p, i) => (
            <span key={i} className="db-particle" style={{ left: p.left, bottom: "-10px", width: p.size, height: p.size, background: p.color, animationDelay: p.delay, animationDuration: p.dur }} />
          ))}
          <h1 className="db-hero-title">LUXE STUDIO</h1>
          <p className="db-hero-sub">Indulge in elegance.</p>
          <div className="db-hero-actions">
            <button className="db-btn-primary" onClick={() => bookingRef.current?.scrollIntoView({ behavior: "smooth" })}>Book Your Visit</button>
            <button className="db-btn-outline" onClick={() => servicesRef.current?.scrollIntoView({ behavior: "smooth" })}>Explore Treatments</button>
          </div>
        </section>

        {/* Services */}
        <div ref={servicesRef}>
          <section className="db-section">
            <span className="db-section-label">Our Treatments</span>
            <h2 className="db-section-title">Crafted for you.</h2>
            <p className="db-section-sub">Each experience is designed to make you feel extraordinary.</p>
            <div className="db-services-grid">
              {SERVICES.map(s => (
                <div key={s.name} className="db-svc-card">
                  <div className="db-svc-icon">{s.icon}</div>
                  <h3>{s.name}</h3>
                  <p>{s.desc}</p>
                  <span className="db-svc-price">from ${s.price}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <hr className="db-divider" />

        {/* Booking wizard */}
        <div ref={bookingRef}>
          <section className="db-section">
            <span className="db-section-label">Book an Appointment</span>
            <h2 className="db-section-title">Your visit, your way.</h2>
            <p className="db-section-sub">Reserve your spot in three simple steps.</p>
            <div className="db-booking">
              <div className="db-steps">
                {[0, 1, 2].map(i => <span key={i} className={`db-step-dot${bookStep >= i ? " active" : ""}`} />)}
              </div>
              <div className="db-step-content">
                {bookStep === 0 && (
                  <div className="db-step-fade" key="s0">
                    <p className="db-book-label">Choose a treatment</p>
                    <div className="db-book-grid">
                      {SERVICES.map((s, i) => (
                        <div key={i} className={`db-book-tile${selService === i ? " selected" : ""}`} onClick={() => setSelService(i)}>
                          <div className="db-book-tile-icon">{s.icon}</div>
                          <div className="db-book-tile-name">{s.name}</div>
                          <div className="db-book-tile-price">${s.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {bookStep === 1 && (
                  <div className="db-step-fade" key="s1">
                    <p className="db-book-label">Pick a date and time</p>
                    <div className="db-slot-grid">
                      {SLOTS.map(slot => (
                        <button key={slot} className={`db-slot${selSlot === slot ? " selected" : ""}`} onClick={() => setSelSlot(slot)}>{slot}</button>
                      ))}
                    </div>
                  </div>
                )}
                {bookStep === 2 && (
                  <div className="db-step-fade" key="s2">
                    <div className="db-confirm-summary">
                      <div className="db-confirm-row"><span>Treatment</span><span>{selService != null ? SERVICES[selService].name : "—"}</span></div>
                      <div className="db-confirm-row"><span>Date & Time</span><span>{selSlot || "—"}</span></div>
                      <div className="db-confirm-row"><span>Price</span><span>{selService != null ? `$${SERVICES[selService].price}` : "—"}</span></div>
                    </div>
                    <input className="db-input" type="text" placeholder="Your name" aria-label="Your name" />
                    <button className="db-btn-primary" style={{ width: "100%" }} onClick={() => { setBookStep(0); setSelService(null); setSelSlot(null); }}>Confirm Booking</button>
                  </div>
                )}
              </div>
              <div className="db-book-nav">
                {bookStep > 0 ? <button className="db-btn-outline" onClick={() => setBookStep(s => s - 1)}>Back</button> : <span />}
                {bookStep < 2 && <button className="db-btn-primary" disabled={bookStep === 0 && selService == null || bookStep === 1 && !selSlot} onClick={() => setBookStep(s => s + 1)}>Next</button>}
              </div>
            </div>
          </section>
        </div>

        <hr className="db-divider" />

        {/* Before & After */}
        <section className="db-section">
          <span className="db-section-label">Transformations</span>
          <h2 className="db-section-title">See the difference.</h2>
          <p className="db-section-sub">Drag the slider to reveal the transformation.</p>
          <div className="db-ba-wrapper" ref={sliderRef} onPointerDown={onSliderPointerDown} onPointerMove={onSliderPointerMove} onPointerUp={onSliderPointerUp} onPointerCancel={onSliderPointerUp}>
            <div className="db-ba-after">After</div>
            <div className="db-ba-before" style={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}>Before</div>
            <div className="db-ba-divider" style={{ left: `${sliderX}%` }} />
            <div className="db-ba-handle" style={{ left: `${sliderX}%`, top: "50%" }} />
            <span className="db-ba-label db-ba-label-before">Before</span>
            <span className="db-ba-label db-ba-label-after">After</span>
          </div>
        </section>

        <hr className="db-divider" />

        {/* Testimonials */}
        <section className="db-section" style={{ textAlign: "center" }}>
          <span className="db-section-label">Client Love</span>
          <h2 className="db-section-title">Words that glow.</h2>
          <div className="db-testi-wrapper">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`db-testi-card${carouselIdx === i ? " active" : ""}`}>
                <p className="db-testi-quote">{t.text}</p>
                <span className="db-testi-author">— {t.author}</span>
              </div>
            ))}
          </div>
          <div className="db-testi-dots">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} className={`db-testi-dot${carouselIdx === i ? " active" : ""}`} onClick={() => setCarouselIdx(i)} aria-label={`Testimonial ${i + 1}`} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="db-cta">
          <h2>Begin your transformation.</h2>
          <p>Book your appointment today and experience the Luxe difference.</p>
          <button className="db-btn-primary" onClick={() => bookingRef.current?.scrollIntoView({ behavior: "smooth" })}>Book Now</button>
        </section>

        <footer className="db-footer">
          <span>Luxe Studio — Demo Website</span>
          <span>Built by Romeo Vargas Jr.</span>
        </footer>
      </div>
    </DemoShell>
  );
}
