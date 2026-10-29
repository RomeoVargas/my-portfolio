import { createScene, THREE } from "./three-setup.js";
import React, { useEffect, useRef, useState } from "react";
import DemoShell from "./DemoShell.jsx";

const SERVICES = [
  { name: "Hair Styling", icon: "✂", desc: "Transform your look", price: 85 },
  { name: "Color & Highlights", icon: "🎨", desc: "Artistry in every strand", price: 120 },
  { name: "Facial Treatment", icon: "✦", desc: "Radiance redefined", price: 95 },
  { name: "Nail Artistry", icon: "💅", desc: "Details that dazzle", price: 55 },
  { name: "Body Massage", icon: "🌿", desc: "Release and restore", price: 110 },
  { name: "Bridal Package", icon: "💍", desc: "Your perfect day, perfected", price: 450 },
];

const TIMES = [
  "Mon 10:00", "Mon 14:00", "Mon 16:00",
  "Tue 11:00", "Tue 13:00", "Tue 15:00",
  "Wed 10:00", "Wed 12:00", "Wed 16:00",
  "Thu 11:00", "Thu 14:00", "Thu 16:00",
  "Fri 10:00", "Fri 13:00", "Fri 15:00",
];

const TESTIMONIALS = [
  { text: "The best salon experience I've ever had. Absolutely magical.", author: "Sarah M." },
  { text: "Luxe Studio transformed me for my wedding. I felt like a queen.", author: "Diana K." },
  { text: "My go-to for every occasion. The attention to detail is unmatched.", author: "Priya R." },
];

function CrystalScene() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { scene, camera, start, dispose } = createScene(canvas, {
      background: 0x0f0818,
      fog: 0.02,
      bloom: true,
      bloomStrength: 1.3,
      bloomRadius: 0.5,
      bloomThreshold: 0.7,
      autoRotateSpeed: 0.3,
      fov: 45,
      exposure: 1.0,
    });

    camera.position.set(4, 3, 5);
    camera.lookAt(0, 1, 0);

    // Platform
    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.2, 0.05, 64),
      new THREE.MeshStandardMaterial({ color: 0x1a0f1e, metalness: 0.9, roughness: 0.05 })
    );
    scene.add(platform);

    // Crystals
    const crystalColors = [0xc084fc, 0xf9a8d4, 0xfef3c7, 0xe0c3fc];
    const crystals = [];
    for (let i = 0; i < 10; i++) {
      const geo = i % 2 === 0
        ? new THREE.IcosahedronGeometry(0.2 + Math.random() * 0.6, 0)
        : new THREE.OctahedronGeometry(0.2 + Math.random() * 0.5, 0);
      const mat = new THREE.MeshPhysicalMaterial({
        color: crystalColors[i % crystalColors.length],
        transmission: 0.6,
        roughness: 0.05,
        metalness: 0.1,
        ior: 2.0,
        thickness: 0.5,
        transparent: true,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const angle = (i / 10) * Math.PI * 2;
      const radius = 0.5 + Math.random() * 2.5;
      mesh.position.set(Math.cos(angle) * radius, 0.5 + Math.random() * 2.5, Math.sin(angle) * radius);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      scene.add(mesh);
      crystals.push({ mesh, phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.4, axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize() });
    }

    // Rose petals
    const petals = [];
    for (let i = 0; i < 50; i++) {
      const petal = new THREE.Mesh(
        new THREE.PlaneGeometry(0.08, 0.06),
        new THREE.MeshBasicMaterial({ color: 0xf9a8d4, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
      );
      petal.position.set((Math.random() - 0.5) * 8, Math.random() * 6, (Math.random() - 0.5) * 8);
      petal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      scene.add(petal);
      petals.push({ mesh: petal, drift: (Math.random() - 0.5) * 0.2, rotSpeed: 0.5 + Math.random() });
    }

    // Sparkle particles
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      const r = 6 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      sparkPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      sparkPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      sparkPos[i * 3 + 2] = r * Math.cos(phi);
    }
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
    const sparkles = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ color: 0xfef3c7, size: 0.015, transparent: true, opacity: 0.8 }));
    scene.add(sparkles);

    // Lights
    const spotPurple = new THREE.SpotLight(0xc084fc, 40, 20, Math.PI / 4);
    spotPurple.position.set(-4, 6, 2);
    spotPurple.lookAt(0, 1, 0);
    scene.add(spotPurple);

    const spotPink = new THREE.SpotLight(0xf9a8d4, 30, 20, Math.PI / 4);
    spotPink.position.set(4, 5, -2);
    spotPink.lookAt(0, 1, 0);
    scene.add(spotPink);

    const pointGold = new THREE.PointLight(0xfef3c7, 10, 15);
    pointGold.position.set(0, 2, 0);
    scene.add(pointGold);

    scene.add(new THREE.AmbientLight(0x1a0a20, 0.2));

    start((t) => {
      crystals.forEach((c) => {
        c.mesh.rotateOnAxis(c.axis, 0.005);
        c.mesh.position.y += Math.sin(t * c.speed + c.phase) * 0.002;
      });
      petals.forEach((p) => {
        p.mesh.position.y -= 0.004;
        p.mesh.position.x += p.drift * 0.01;
        p.mesh.rotation.x += p.rotSpeed * 0.005;
        p.mesh.rotation.z += p.rotSpeed * 0.003;
        if (p.mesh.position.y < -1) p.mesh.position.y = 5 + Math.random() * 2;
      });
      sparkles.rotation.y = t * 0.02;
    });

    return dispose;
  }, []);

  return <canvas ref={canvasRef} className="db-canvas" />;
}

export default function BeautySalon() {
  const [bookingStep, setBookingStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef(null);
  const dragging = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(id);
  }, []);

  function onSliderPointerDown(e) {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onSliderPointerMove(e) {
    if (!dragging.current || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    setSliderPos(Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100)));
  }
  function onSliderPointerUp() { dragging.current = false; }

  return (
    <DemoShell industry="Beauty & Spa">
      <style>{`
        .db-page { background: #0f0818; color: #f5e6d3; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; min-height: 100vh; overflow-x: hidden; }
        .db-hero { position: relative; width: 100%; height: 65vh; min-height: 400px; }
        .db-canvas { display: block; width: 100%; height: 100%; }
        .db-hero-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; z-index: 2; }
        .db-hero-title { font-family: Georgia, "Times New Roman", serif; font-size: clamp(2.5rem, 6vw, 5rem); letter-spacing: 0.3em; color: #fef3c7; text-shadow: 0 0 40px #c084fc88, 0 0 80px #c084fc44; margin: 0; font-weight: 400; }
        .db-hero-tagline { font-size: clamp(1rem, 2vw, 1.375rem); color: #f9a8d4; margin-top: 12px; font-style: italic; letter-spacing: 0.1em; }
        .db-hero-ctas { display: flex; gap: 16px; margin-top: 28px; pointer-events: auto; flex-wrap: wrap; justify-content: center; }
        .db-btn-primary { background: linear-gradient(135deg, #c084fc, #f9a8d4); color: #0f0818; border: none; padding: 14px 28px; border-radius: 30px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
        .db-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px #c084fc55; }
        .db-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .db-btn-outline { background: transparent; color: #f9a8d4; border: 1px solid #f9a8d444; padding: 14px 28px; border-radius: 30px; font-size: 1rem; cursor: pointer; transition: border-color 0.2s, color 0.2s; }
        .db-btn-outline:hover { border-color: #f9a8d4; color: #fef3c7; }

        .db-section { max-width: 1100px; margin: 0 auto; padding: 64px 24px; }
        .db-section-title { font-family: Georgia, "Times New Roman", serif; font-size: clamp(1.5rem, 3vw, 2.25rem); text-align: center; margin-bottom: 12px; color: #fef3c7; letter-spacing: 0.05em; }
        .db-section-sub { text-align: center; color: #c084fc; font-size: 1rem; margin-bottom: 12px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }
        .db-divider { width: 60px; height: 1px; background: linear-gradient(90deg, transparent, #c084fc, transparent); margin: 0 auto 48px; }

        .db-services { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .db-service-card { background: #1a0f1e; border: 1px solid #2a1a35; border-radius: 16px; padding: 28px; transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s; cursor: default; }
        .db-service-card:hover { transform: translateY(-6px); border-color: #c084fc66; box-shadow: 0 12px 35px #c084fc22; }
        .db-service-icon { font-size: 2rem; margin-bottom: 14px; display: block; }
        .db-service-card h3 { font-family: Georgia, serif; font-size: 1.25rem; margin: 0 0 6px; color: #fef3c7; }
        .db-service-card p { color: #b8a0c8; font-size: 1rem; margin: 0 0 14px; }
        .db-service-price { color: #c084fc; font-size: 1rem; font-weight: 600; }

        .db-booking { background: #1a0f1e; border: 1px solid #2a1a35; border-radius: 20px; padding: 40px 28px; max-width: 700px; margin: 0 auto; }
        .db-steps { display: flex; justify-content: center; gap: 12px; margin-bottom: 32px; }
        .db-step-dot { width: 10px; height: 10px; border-radius: 50%; background: #2a1a35; border: 1px solid #3a2a45; transition: background 0.3s; }
        .db-step-dot.active { background: #c084fc; border-color: #c084fc; box-shadow: 0 0 10px #c084fc88; }
        .db-step-content { min-height: 200px; }
        .db-service-tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
        .db-service-tile { padding: 16px; background: #251a30; border: 1px solid #3a2a45; border-radius: 12px; cursor: pointer; text-align: center; transition: border-color 0.2s, background 0.2s; }
        .db-service-tile:hover { border-color: #c084fc66; }
        .db-service-tile.selected { border-color: #c084fc; background: #2d1a3a; box-shadow: 0 0 15px #c084fc33; }
        .db-service-tile span { display: block; font-size: 1.5rem; margin-bottom: 6px; }
        .db-service-tile strong { color: #fef3c7; font-size: 0.95rem; }
        .db-time-chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .db-time-chip { padding: 10px 18px; background: #251a30; border: 1px solid #3a2a45; border-radius: 20px; cursor: pointer; font-size: 0.9rem; color: #d4bfe8; transition: border-color 0.2s, background 0.2s; }
        .db-time-chip:hover { border-color: #c084fc66; }
        .db-time-chip.selected { border-color: #f9a8d4; background: #3a1a40; color: #fef3c7; }
        .db-confirm-summary { text-align: center; padding: 20px 0; }
        .db-confirm-summary h3 { font-family: Georgia, serif; font-size: 1.375rem; color: #fef3c7; margin-bottom: 8px; }
        .db-confirm-summary p { color: #b8a0c8; margin: 4px 0; }
        .db-confirm-input { display: block; width: 100%; max-width: 300px; margin: 20px auto 0; padding: 12px 16px; background: #251a30; border: 1px solid #3a2a45; border-radius: 10px; color: #f5e6d3; font-size: 1rem; outline: none; }
        .db-confirm-input:focus { border-color: #c084fc; }
        .db-booking-nav { display: flex; justify-content: center; gap: 12px; margin-top: 28px; }

        .db-slider-wrap { position: relative; width: 100%; max-width: 600px; margin: 0 auto; height: 260px; border-radius: 16px; overflow: hidden; cursor: ew-resize; touch-action: none; user-select: none; }
        .db-slider-before, .db-slider-after { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: Georgia, serif; font-size: 1.5rem; letter-spacing: 0.1em; }
        .db-slider-before { background: linear-gradient(135deg, #1a1a1a, #2a2a2a, #1a1a1a); color: #888; z-index: 1; clip-path: inset(0 0 0 0); }
        .db-slider-after { background: linear-gradient(135deg, #2d1040, #c084fc33, #f9a8d422); color: #fef3c7; z-index: 0; }
        .db-slider-handle { position: absolute; top: 0; bottom: 0; width: 3px; background: #fef3c7; z-index: 3; transform: translateX(-50%); pointer-events: none; }
        .db-slider-handle::after { content: "⟷"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #fef3c7; color: #0f0818; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; pointer-events: auto; cursor: ew-resize; }

        .db-testimonials { position: relative; max-width: 600px; margin: 0 auto; text-align: center; min-height: 120px; }
        .db-testimonial blockquote { font-family: Georgia, serif; font-size: 1.25rem; font-style: italic; color: #e8d4f0; line-height: 1.7; margin: 0 0 12px; }
        .db-testimonial cite { color: #c084fc; font-style: normal; font-size: 0.95rem; }
        .db-dots { display: flex; justify-content: center; gap: 8px; margin-top: 20px; }
        .db-dot { width: 8px; height: 8px; border-radius: 50%; background: #2a1a35; border: 1px solid #3a2a45; cursor: pointer; transition: background 0.3s; padding: 0; }
        .db-dot.active { background: #c084fc; border-color: #c084fc; }

        .db-cta { text-align: center; padding: 64px 24px; background: linear-gradient(180deg, transparent, #1a0f1e44); }
        .db-cta h2 { font-family: Georgia, serif; font-size: clamp(1.5rem, 3vw, 2.25rem); color: #fef3c7; margin-bottom: 16px; }
        .db-cta p { color: #b8a0c8; margin-bottom: 28px; font-size: 1.125rem; }

        .db-footer { text-align: center; padding: 24px; color: #5a4a68; font-size: 0.875rem; border-top: 1px solid #1a0f1e; }

        @media (max-width: 600px) {
          .db-hero { height: 55vh; min-height: 340px; }
          .db-section { padding: 48px 16px; }
          .db-booking { padding: 28px 16px; }
          .db-service-tiles { grid-template-columns: repeat(2, 1fr); }
          .db-slider-wrap { height: 200px; }
        }
      `}</style>
      <div className="db-page">
        <div className="db-hero">
          <CrystalScene />
          <div className="db-hero-overlay">
            <h1 className="db-hero-title">LUXE STUDIO</h1>
            <p className="db-hero-tagline">Indulge in elegance.</p>
            <div className="db-hero-ctas">
              <button className="db-btn-primary" onClick={() => { setBookingStep(0); document.getElementById("db-booking")?.scrollIntoView({ behavior: "smooth" }); }}>Book Your Visit</button>
              <button className="db-btn-outline" onClick={() => document.getElementById("db-services")?.scrollIntoView({ behavior: "smooth" })}>Explore Treatments</button>
            </div>
          </div>
        </div>

        <section className="db-section" id="db-services">
          <p className="db-section-sub">OUR TREATMENTS</p>
          <h2 className="db-section-title">Beauty, refined.</h2>
          <div className="db-divider" />
          <div className="db-services">
            {SERVICES.map((s) => (
              <div className="db-service-card" key={s.name}>
                <span className="db-service-icon">{s.icon}</span>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <span className="db-service-price">From ${s.price}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="db-section" id="db-booking">
          <p className="db-section-sub">BOOK YOUR VISIT</p>
          <h2 className="db-section-title">Reserve your moment.</h2>
          <div className="db-divider" />
          <div className="db-booking">
            <div className="db-steps">
              {[0, 1, 2].map((i) => <span key={i} className={`db-step-dot${bookingStep >= i ? " active" : ""}`} />)}
            </div>
            <div className="db-step-content">
              {bookingStep === 0 && (
                <>
                  <p style={{ textAlign: "center", color: "#b8a0c8", marginBottom: 20 }}>Select a treatment</p>
                  <div className="db-service-tiles">
                    {SERVICES.map((s) => (
                      <div key={s.name} className={`db-service-tile${selectedService === s.name ? " selected" : ""}`} onClick={() => setSelectedService(s.name)}>
                        <span>{s.icon}</span>
                        <strong>{s.name}</strong>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {bookingStep === 1 && (
                <>
                  <p style={{ textAlign: "center", color: "#b8a0c8", marginBottom: 20 }}>Pick a time</p>
                  <div className="db-time-chips">
                    {TIMES.map((t) => (
                      <button key={t} className={`db-time-chip${selectedTime === t ? " selected" : ""}`} onClick={() => setSelectedTime(t)}>{t}</button>
                    ))}
                  </div>
                </>
              )}
              {bookingStep === 2 && (
                <div className="db-confirm-summary">
                  <h3>Confirm Your Booking</h3>
                  <p><strong style={{ color: "#c084fc" }}>{selectedService || "—"}</strong></p>
                  <p>{selectedTime || "—"}</p>
                  <input className="db-confirm-input" placeholder="Your name" aria-label="Your name" />
                </div>
              )}
            </div>
            <div className="db-booking-nav">
              {bookingStep > 0 && <button className="db-btn-outline" onClick={() => setBookingStep((s) => s - 1)}>Back</button>}
              {bookingStep < 2 ? (
                <button className="db-btn-primary" disabled={(bookingStep === 0 && !selectedService) || (bookingStep === 1 && !selectedTime)} onClick={() => setBookingStep((s) => s + 1)}>Next</button>
              ) : (
                <button className="db-btn-primary" onClick={() => alert("This is a demo — no real booking was made.")}>Confirm Booking</button>
              )}
            </div>
          </div>
        </section>

        <section className="db-section">
          <p className="db-section-sub">THE TRANSFORMATION</p>
          <h2 className="db-section-title">See the difference.</h2>
          <div className="db-divider" />
          <div
            className="db-slider-wrap"
            ref={sliderRef}
            onPointerDown={onSliderPointerDown}
            onPointerMove={onSliderPointerMove}
            onPointerUp={onSliderPointerUp}
            onPointerCancel={onSliderPointerUp}
          >
            <div className="db-slider-after">AFTER</div>
            <div className="db-slider-before" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>BEFORE</div>
            <div className="db-slider-handle" style={{ left: `${sliderPos}%` }} />
          </div>
        </section>

        <section className="db-section">
          <p className="db-section-sub">CLIENT STORIES</p>
          <h2 className="db-section-title">What they say.</h2>
          <div className="db-divider" />
          <div className="db-testimonials">
            <div className="db-testimonial">
              <blockquote>"{TESTIMONIALS[testimonialIdx].text}"</blockquote>
              <cite>— {TESTIMONIALS[testimonialIdx].author}</cite>
            </div>
            <div className="db-dots">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} className={`db-dot${i === testimonialIdx ? " active" : ""}`} onClick={() => setTestimonialIdx(i)} aria-label={`Testimonial ${i + 1}`} />
              ))}
            </div>
          </div>
        </section>

        <div className="db-cta">
          <h2>Begin your transformation.</h2>
          <p>Book your visit and let us take care of the rest.</p>
          <button className="db-btn-primary" onClick={() => { setBookingStep(0); document.getElementById("db-booking")?.scrollIntoView({ behavior: "smooth" }); }}>Book Now</button>
        </div>

        <footer className="db-footer">Luxe Studio — Demo website by Romeo Vargas Jr.</footer>
      </div>
    </DemoShell>
  );
}
