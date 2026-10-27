import React from "react";
import { demos } from "../demos.js";
import { EMAIL } from "../data.js";

export default function DemoGallery() {
  return (
    <>
      <style>{`
        .gallery-page { --g-bg: #0f1019; --g-surface: #181b28; --g-text: #f4f1e9; --g-muted: #b0b3c4; --g-primary: #b7a0f4; --g-accent: #f8d581; --g-line: #2a2d40; }
        .gallery-page { background: var(--g-bg); color: var(--g-text); min-height: 100vh; font-family: "DM Sans", Arial, sans-serif; }
        .gallery-header { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 20px 32px; border-bottom: 1px solid var(--g-line); flex-wrap: wrap; gap: 12px; }
        .gallery-brand { font-size: 1rem; font-weight: 700; color: var(--g-primary); display: flex; align-items: center; gap: 8px; }
        .gallery-nav { display: flex; gap: 20px; font-size: 1rem; }
        .gallery-nav a { color: var(--g-muted); }
        .gallery-nav a:hover { color: var(--g-primary); }
        .gallery-hero { max-width: 1200px; margin: 0 auto; padding: 56px 32px 40px; }
        .gallery-hero .g-eyebrow { font-size: 1rem; letter-spacing: 0.08em; color: var(--g-primary); font-weight: 600; }
        .gallery-hero h1 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; letter-spacing: -0.04em; margin: 16px 0 12px; line-height: 1.2; }
        .gallery-hero h1 span { color: var(--g-primary); }
        .gallery-hero p { color: var(--g-muted); font-size: 1.125rem; max-width: 60ch; line-height: 1.75; }
        .gallery-grid { max-width: 1200px; margin: 0 auto; padding: 0 32px 64px; display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
        .gallery-item { border: 1px solid var(--g-line); border-radius: 12px; overflow: hidden; background: var(--g-surface); transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s; }
        .gallery-item:hover { transform: translateY(-6px); border-color: var(--item-color, var(--g-primary)); box-shadow: 0 12px 40px var(--item-glow, #b7a0f416); }
        .gallery-item-art { height: 140px; background: var(--item-bg, #1a1a2e); display: flex; flex-direction: column; justify-content: center; padding: 24px 28px; position: relative; overflow: hidden; }
        .gallery-item-art::before { content: ""; position: absolute; inset: 0; background: linear-gradient(135deg, transparent 60%, var(--item-color, #b7a0f4) 200%); opacity: 0.08; }
        .gallery-item-industry { font-size: 1rem; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; color: var(--item-color, var(--g-primary)); position: relative; }
        .gallery-item-name { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.03em; margin-top: 8px; position: relative; }
        .gallery-item-body { padding: 24px 28px; }
        .gallery-item-body p { color: var(--g-muted); font-size: 1.125rem; line-height: 1.7; margin-bottom: 20px; }
        .gallery-item-cta { display: inline-flex; align-items: center; gap: 8px; color: var(--item-color, var(--g-primary)); font-size: 1rem; font-weight: 600; }
        .gallery-item-cta:hover { color: var(--g-accent); }
        .gallery-cta-section { max-width: 1200px; margin: 0 auto; padding: 48px 32px 64px; border-top: 1px solid var(--g-line); text-align: center; }
        .gallery-cta-section h2 { font-size: 1.625rem; margin-bottom: 12px; }
        .gallery-cta-section p { color: var(--g-muted); margin-bottom: 24px; font-size: 1.125rem; }
        .gallery-cta-btn { display: inline-flex; align-items: center; gap: 16px; background: var(--g-primary); color: #1a1a2e; padding: 14px 24px; border-radius: 8px; font-weight: 700; font-size: 1rem; }
        .gallery-cta-btn:hover { background: #cbb7ff; }
        .gallery-footer { max-width: 1200px; margin: 0 auto; padding: 20px 32px; border-top: 1px solid var(--g-line); display: flex; justify-content: space-between; font-size: 1rem; color: var(--g-muted); flex-wrap: wrap; gap: 12px; }
        .gallery-footer a { color: var(--g-primary); }
        .gi-auto { --item-color: #00d4ff; --item-bg: #0a1520; --item-glow: #00d4ff22; }
        .gi-restaurant { --item-color: #e8843c; --item-bg: #1a1008; --item-glow: #e8843c22; }
        .gi-real-estate { --item-color: #3b82f6; --item-bg: #0a1025; --item-glow: #3b82f622; }
        .gi-fitness { --item-color: #ef4444; --item-bg: #1a0a0a; --item-glow: #ef444422; }
        .gi-beauty { --item-color: #c084fc; --item-bg: #1a0a20; --item-glow: #c084fc22; }
        @media (max-width: 650px) {
          .gallery-grid { grid-template-columns: 1fr; padding-inline: 20px; }
          .gallery-hero { padding: 40px 20px 28px; }
          .gallery-header { padding-inline: 20px; }
          .gallery-cta-section { padding-inline: 20px; }
          .gallery-footer { padding-inline: 20px; }
        }
      `}</style>
      <div className="gallery-page">
        <header className="gallery-header">
          <a className="gallery-brand" href="/">← Romeo's World</a>
          <nav className="gallery-nav">
            <a href="/#services">Services</a>
            <a href="/#work">Work</a>
            <a href="/#contact">Contact</a>
          </nav>
        </header>
        <section className="gallery-hero">
          <span className="g-eyebrow">INTERACTIVE DEMOS</span>
          <h1>Websites built for <span>your industry.</span></h1>
          <p>Explore interactive demo websites for different industries. Each one is fully designed, responsive, and ready to show what your business website could look like.</p>
        </section>
        <div className="gallery-grid">
          {demos.map((d, i) => {
            const cls = ["gi-auto","gi-restaurant","gi-real-estate","gi-fitness","gi-beauty"][i] || "";
            return (
              <a key={d.id} className={`gallery-item ${cls}`} href={d.path}>
                <div className="gallery-item-art">
                  <span className="gallery-item-industry">{d.industry}</span>
                  <span className="gallery-item-name">{d.name}</span>
                </div>
                <div className="gallery-item-body">
                  <p>{d.description}</p>
                  <span className="gallery-item-cta">Explore demo ↗</span>
                </div>
              </a>
            );
          })}
        </div>
        <section className="gallery-cta-section">
          <h2>Want a website like these for your business?</h2>
          <p>Let's talk about what you need. I'll build it around your goals.</p>
          <a className="gallery-cta-btn" href={`mailto:${EMAIL}?subject=${encodeURIComponent("I saw your demo websites")}`}>
            Let's talk <span>↗</span>
          </a>
        </section>
        <footer className="gallery-footer">
          <span>&copy; {new Date().getFullYear()} Romeo Vargas Jr.</span>
          <a href="/">Back to portfolio ↗</a>
        </footer>
      </div>
    </>
  );
}
