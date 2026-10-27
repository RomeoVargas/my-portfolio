import React, { useState, useEffect, useRef } from "react";
import DemoShell from "./DemoShell.jsx";

const menu = {
  Starters: [
    { name: "Truffle Burrata", price: 18, desc: "Creamy burrata with black truffle, heirloom tomatoes, and aged balsamic.", note: "Our burrata is flown in twice weekly from Puglia. Best paired with a glass of Vermentino." },
    { name: "Seared Scallops", price: 24, desc: "Hokkaido scallops with cauliflower purée, pancetta crisp, and brown butter.", note: "Hand-dived scallops, seared to a golden crust. The cauliflower is roasted overnight for depth." },
    { name: "Wild Mushroom Soup", price: 14, desc: "Porcini and chanterelle velouté with truffle oil and sourdough croutons.", note: "A house favorite since opening night. We forage our mushrooms from local woodlands each morning." },
    { name: "Wagyu Tartare", price: 28, desc: "Hand-cut A5 wagyu with quail egg, capers, shallot, and house-made potato crisps.", note: "Sourced from Miyazaki prefecture. Prepared tableside on request for parties of two or more." },
  ],
  Mains: [
    { name: "Dry-Aged Ribeye", price: 62, desc: "45-day dry-aged prime ribeye, bone marrow butter, roasted garlic, and seasonal greens.", note: "Aged in our dedicated dry-aging room. Served medium-rare unless otherwise requested." },
    { name: "Pan-Seared Halibut", price: 48, desc: "Wild halibut with saffron beurre blanc, fennel confit, and citrus gremolata.", note: "Line-caught and sustainably sourced. The saffron is hand-harvested from La Mancha." },
    { name: "Braised Short Rib", price: 54, desc: "72-hour braised short rib with red wine reduction, celery root, and horseradish cream.", note: "Slow-braised for three full days. The wine reduction uses our sommelier's Barolo selection." },
    { name: "Forest Risotto", price: 38, desc: "Carnaroli rice with wild mushrooms, aged parmesan, white truffle, and herbs.", note: "Stirred to order — allow 25 minutes. A beautiful vegetarian centrepiece worth the wait." },
  ],
  Desserts: [
    { name: "Crème Brûlée", price: 16, desc: "Tahitian vanilla bean custard with a caramelized sugar crust.", note: "Torched tableside. Our vanilla pods are sourced directly from a single estate in Tahiti." },
    { name: "Dark Chocolate Fondant", price: 18, desc: "Valrhona 70% chocolate with a molten centre, served with salted caramel ice cream.", note: "Allow 14 minutes. The chocolate is single-origin from Venezuela — intense and bittersweet." },
    { name: "Seasonal Fruit Tart", price: 15, desc: "Buttery pâte sucrée with pastry cream and market-fresh seasonal fruits.", note: "The fruits change weekly. Ask your server about tonight's selection." },
    { name: "Cheese Selection", price: 22, desc: "Five artisan cheeses with honeycomb, quince paste, and walnut bread.", note: "Our fromager curates the board daily. Pairs beautifully with a glass of late-harvest Riesling." },
  ],
  Drinks: [
    { name: "Old Fashioned", price: 18, desc: "Woodford Reserve bourbon, Demerara sugar, Angostura bitters, orange zest.", note: "Stirred 40 times and served over a single hand-cut ice sphere. A timeless classic, done right." },
    { name: "Signature Negroni", price: 20, desc: "Barrel-aged gin, Campari, sweet vermouth, and a flamed orange peel.", note: "We age our gin in-house in charred oak barrels for six weeks. Smoky, complex, unforgettable." },
    { name: "Wine Flight", price: 32, desc: "Three curated 90ml pours selected by our sommelier to complement tonight's menu.", note: "The flight changes nightly. Ask about our reserve pairings for the full tasting experience." },
    { name: "Espresso Martini", price: 19, desc: "Fresh espresso, Absolut vodka, Kahlúa, and vanilla syrup with a coffee bean garnish.", note: "Made with a double shot pulled to order. The perfect bridge between dinner and the evening ahead." },
  ],
};

export default function Restaurant() {
  const [tab, setTab] = useState("Starters");
  const [expanded, setExpanded] = useState(null);
  const [specialVisible, setSpecialVisible] = useState(false);
  const specialRef = useRef(null);

  useEffect(() => {
    const el = specialRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSpecialVisible(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <DemoShell industry="Restaurant">
      <style>{`
        .dr-page { --bg: #1a0f08; --surface: #241810; --accent: #e8843c; --gold: #d4a853; --cream: #f5e6d3; --muted: #b8a08a; --line: #3a2a1e; background: var(--bg); color: var(--cream); min-height: 100vh; font-family: "DM Sans", system-ui, sans-serif; overflow-x: hidden; }
        .dr-serif { font-family: Georgia, "Times New Roman", serif; }

        /* Hero */
        .dr-hero { position: relative; min-height: 90vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 80px 24px; background: linear-gradient(180deg, #1a0f08 0%, #2a1a10 40%, #1a0f08 100%); overflow: hidden; }
        .dr-hero::before { content: ""; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 80%, #e8843c10 0%, transparent 60%); pointer-events: none; }
        .dr-hero-name { font-family: Georgia, "Times New Roman", serif; font-size: clamp(3rem, 8vw, 6rem); letter-spacing: 0.18em; font-weight: 400; line-height: 1.1; position: relative; }
        .dr-hero-line { width: 80px; height: 1px; background: var(--gold); margin: 24px auto; }
        .dr-hero-tagline { font-family: Georgia, "Times New Roman", serif; font-size: clamp(1.125rem, 2.5vw, 1.5rem); color: var(--muted); font-style: italic; letter-spacing: 0.04em; }
        .dr-hero-actions { display: flex; gap: 16px; margin-top: 40px; flex-wrap: wrap; justify-content: center; }
        .dr-btn { padding: 14px 28px; border-radius: 2px; font-size: 1rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; transition: background 0.2s, color 0.2s, transform 0.2s; border: none; }
        .dr-btn:active { transform: translateY(1px); }
        .dr-btn-primary { background: var(--accent); color: #1a0f08; }
        .dr-btn-primary:hover { background: #f09550; }
        .dr-btn-secondary { background: transparent; color: var(--gold); border: 1px solid var(--gold); }
        .dr-btn-secondary:hover { background: #d4a85315; }

        /* Embers */
        .dr-ember { position: absolute; width: 4px; height: 4px; border-radius: 50%; bottom: 20%; opacity: 0; pointer-events: none; animation: dr-float 4s ease-out infinite; }
        @keyframes dr-float { 0% { opacity: 0; transform: translateY(0) scale(1); } 15% { opacity: 0.8; } 70% { opacity: 0.3; } 100% { opacity: 0; transform: translateY(-35vh) scale(0.3); } }
        .dr-ember:nth-child(1) { left: 15%; background: #e8843c; animation-delay: 0s; animation-duration: 5s; }
        .dr-ember:nth-child(2) { left: 30%; background: #d4a853; animation-delay: 0.8s; animation-duration: 4.2s; }
        .dr-ember:nth-child(3) { left: 50%; background: #e8843c; animation-delay: 1.6s; animation-duration: 5.5s; }
        .dr-ember:nth-child(4) { left: 70%; background: #f0a050; animation-delay: 2.4s; animation-duration: 4.8s; }
        .dr-ember:nth-child(5) { left: 85%; background: #d4a853; animation-delay: 3.2s; animation-duration: 5.2s; }
        .dr-ember:nth-child(6) { left: 25%; background: #f0a050; animation-delay: 0.5s; animation-duration: 6s; }
        .dr-ember:nth-child(7) { left: 60%; background: #e8843c; animation-delay: 2s; animation-duration: 4.5s; }
        .dr-ember:nth-child(8) { left: 42%; background: #d4a853; animation-delay: 3.5s; animation-duration: 5.8s; }

        /* Menu */
        .dr-section { max-width: 1000px; margin: 0 auto; padding: 64px 24px; }
        .dr-section-title { font-family: Georgia, "Times New Roman", serif; font-size: clamp(1.75rem, 4vw, 2.5rem); text-align: center; margin-bottom: 8px; letter-spacing: 0.04em; }
        .dr-section-sub { text-align: center; color: var(--muted); font-style: italic; margin-bottom: 40px; font-size: 1.125rem; }
        .dr-tabs { display: flex; justify-content: center; gap: 8px; margin-bottom: 36px; flex-wrap: wrap; }
        .dr-tab { padding: 10px 22px; border: 1px solid var(--line); border-radius: 2px; background: transparent; color: var(--muted); font-size: 1rem; letter-spacing: 0.04em; cursor: pointer; transition: all 0.2s; }
        .dr-tab:hover { border-color: var(--accent); color: var(--cream); }
        .dr-tab[aria-selected="true"] { background: var(--accent); color: #1a0f08; border-color: var(--accent); font-weight: 600; }
        .dr-menu-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .dr-dish { padding: 24px; border: 1px solid var(--line); border-radius: 4px; background: var(--surface); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .dr-dish:hover { transform: translateY(-3px); box-shadow: 0 8px 24px #e8843c15; border-color: #e8843c44; }
        .dr-dish-top { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
        .dr-dish-name { font-family: Georgia, "Times New Roman", serif; font-size: 1.25rem; font-weight: 400; }
        .dr-dish-price { color: var(--gold); font-size: 1.125rem; font-weight: 600; white-space: nowrap; }
        .dr-dish-desc { color: var(--muted); margin-top: 8px; font-size: 1rem; line-height: 1.6; }
        .dr-dish-note { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--line); color: var(--gold); font-style: italic; font-size: 0.9375rem; line-height: 1.6; animation: dr-fadein 0.3s ease; }
        @keyframes dr-fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .dr-dish-expand { font-size: 0.875rem; color: var(--accent); margin-top: 10px; display: block; }

        /* Chef's Special */
        .dr-special { background: linear-gradient(135deg, #2a1a10 0%, #1a0f08 100%); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .dr-special-inner { max-width: 800px; margin: 0 auto; padding: 72px 24px; text-align: center; opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .dr-special-inner.visible { opacity: 1; transform: translateY(0); }
        .dr-special-label { font-size: 1rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 16px; }
        .dr-special-dish { font-family: Georgia, "Times New Roman", serif; font-size: clamp(1.5rem, 3vw, 2rem); line-height: 1.5; margin-bottom: 12px; }
        .dr-special-price { font-size: 1.5rem; color: var(--gold); font-weight: 600; }
        .dr-special-note { color: var(--muted); font-style: italic; margin-top: 12px; font-size: 1rem; }

        /* Ambiance */
        .dr-ambiance-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .dr-ambiance-card { padding: 32px 24px; border: 1px solid var(--line); border-radius: 4px; background: var(--surface); text-align: center; transition: border-color 0.2s; }
        .dr-ambiance-card:hover { border-color: var(--gold); }
        .dr-ambiance-icon { font-size: 2rem; margin-bottom: 16px; display: block; }
        .dr-ambiance-card h3 { font-family: Georgia, "Times New Roman", serif; font-size: 1.25rem; margin-bottom: 8px; }
        .dr-ambiance-card p { color: var(--muted); font-size: 1rem; line-height: 1.6; }

        /* Reservation */
        .dr-reserve { background: linear-gradient(180deg, var(--bg), #2a1a10); border-top: 1px solid var(--line); }
        .dr-form { max-width: 560px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .dr-form-full { grid-column: 1 / -1; }
        .dr-label { display: block; font-size: 0.875rem; color: var(--muted); margin-bottom: 6px; letter-spacing: 0.04em; text-transform: uppercase; }
        .dr-input { width: 100%; padding: 12px 14px; background: var(--surface); border: 1px solid var(--line); border-radius: 2px; color: var(--cream); font-size: 1rem; font-family: inherit; }
        .dr-input:focus { outline: none; border-color: var(--gold); }
        .dr-form .dr-btn { margin-top: 8px; width: 100%; }

        /* Footer */
        .dr-footer { max-width: 1000px; margin: 0 auto; padding: 24px; border-top: 1px solid var(--line); display: flex; justify-content: space-between; color: var(--muted); font-size: 0.875rem; flex-wrap: wrap; gap: 12px; }

        @media (max-width: 700px) {
          .dr-menu-grid { grid-template-columns: 1fr; }
          .dr-ambiance-grid { grid-template-columns: 1fr; }
          .dr-form { grid-template-columns: 1fr; }
          .dr-form-full { grid-column: 1; }
          .dr-hero { min-height: 70vh; padding: 60px 20px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dr-ember { animation: none; display: none; }
          .dr-special-inner { opacity: 1; transform: none; transition: none; }
        }
      `}</style>
      <div className="dr-page">
        {/* Hero */}
        <section className="dr-hero">
          {Array.from({ length: 8 }, (_, i) => <span key={i} className="dr-ember" />)}
          <h1 className="dr-hero-name">EMBER &amp; OAK</h1>
          <div className="dr-hero-line" />
          <p className="dr-hero-tagline">Where flavor meets fire.</p>
          <div className="dr-hero-actions">
            <a className="dr-btn dr-btn-primary" href="#dr-menu">View Our Menu</a>
            <a className="dr-btn dr-btn-secondary" href="#dr-reserve">Reserve a Table</a>
          </div>
        </section>

        {/* Menu */}
        <section className="dr-section" id="dr-menu">
          <h2 className="dr-section-title dr-serif">Our Menu</h2>
          <p className="dr-section-sub">Seasonal ingredients, timeless technique.</p>
          <div className="dr-tabs" role="tablist">
            {Object.keys(menu).map(cat => (
              <button key={cat} className="dr-tab" role="tab" aria-selected={tab === cat} onClick={() => { setTab(cat); setExpanded(null); }}>
                {cat}
              </button>
            ))}
          </div>
          <div className="dr-menu-grid">
            {menu[tab].map((dish, i) => {
              const key = `${tab}-${i}`;
              const isOpen = expanded === key;
              return (
                <div key={key} className="dr-dish" onClick={() => setExpanded(isOpen ? null : key)} role="button" tabIndex={0} aria-expanded={isOpen} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpanded(isOpen ? null : key); } }}>
                  <div className="dr-dish-top">
                    <span className="dr-dish-name">{dish.name}</span>
                    <span className="dr-dish-price">${dish.price}</span>
                  </div>
                  <p className="dr-dish-desc">{dish.desc}</p>
                  {isOpen && <p className="dr-dish-note">Chef's note: {dish.note}</p>}
                  <span className="dr-dish-expand">{isOpen ? "Less ▴" : "Chef's note ▾"}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Chef's Special */}
        <section className="dr-special" ref={specialRef}>
          <div className={`dr-special-inner${specialVisible ? " visible" : ""}`}>
            <div className="dr-special-label">Tonight's Special</div>
            <h2 className="dr-special-dish dr-serif">Herb-Crusted Rack of Lamb</h2>
            <p className="dr-section-sub" style={{ marginBottom: 16 }}>with roasted garlic jus, seasonal vegetables, and truffle potato purée</p>
            <span className="dr-special-price">$72</span>
            <p className="dr-special-note">Available this evening while supplies last. Ask your server for wine pairing recommendations.</p>
          </div>
        </section>

        {/* Ambiance */}
        <section className="dr-section">
          <h2 className="dr-section-title dr-serif">The Experience</h2>
          <p className="dr-section-sub">More than a meal — an evening to remember.</p>
          <div className="dr-ambiance-grid">
            <div className="dr-ambiance-card">
              <span className="dr-ambiance-icon">🕯</span>
              <h3>Private Dining</h3>
              <p>An intimate space for up to 12 guests, with a bespoke menu crafted by our head chef for your occasion.</p>
            </div>
            <div className="dr-ambiance-card">
              <span className="dr-ambiance-icon">🍷</span>
              <h3>Wine Cellar</h3>
              <p>Over 400 labels curated by our sommelier. Enjoy a guided tasting in our temperature-controlled cellar room.</p>
            </div>
            <div className="dr-ambiance-card">
              <span className="dr-ambiance-icon">🌿</span>
              <h3>Garden Terrace</h3>
              <p>Dine under the stars on our candlelit terrace, surrounded by herbs we grow and use in tonight's dishes.</p>
            </div>
          </div>
        </section>

        {/* Reservation */}
        <section className="dr-reserve" id="dr-reserve">
          <div className="dr-section">
            <h2 className="dr-section-title dr-serif">Reserve Your Table</h2>
            <p className="dr-section-sub">We look forward to welcoming you.</p>
            <form className="dr-form" onSubmit={e => { e.preventDefault(); alert("This is a demo — no reservation was made."); }}>
              <div>
                <label className="dr-label" htmlFor="dr-date">Date</label>
                <input className="dr-input" id="dr-date" type="date" required />
              </div>
              <div>
                <label className="dr-label" htmlFor="dr-time">Time</label>
                <select className="dr-input" id="dr-time" required defaultValue="">
                  <option value="" disabled>Select a time</option>
                  {["6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM","9:30 PM","10:00 PM"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="dr-label" htmlFor="dr-party">Party size</label>
                <select className="dr-input" id="dr-party" required defaultValue="">
                  <option value="" disabled>Guests</option>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}
                </select>
              </div>
              <div>
                <label className="dr-label" htmlFor="dr-name">Name</label>
                <input className="dr-input" id="dr-name" type="text" placeholder="Your name" required />
              </div>
              <div className="dr-form-full">
                <button className="dr-btn dr-btn-primary" type="submit">Confirm Reservation</button>
              </div>
            </form>
          </div>
        </section>

        <footer className="dr-footer">
          <span>Ember &amp; Oak — Demo Restaurant</span>
          <span>A sample website by Romeo Vargas Jr.</span>
        </footer>
      </div>
    </DemoShell>
  );
}
