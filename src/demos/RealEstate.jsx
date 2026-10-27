import React, { useState, useRef, useMemo } from "react";
import DemoShell from "./DemoShell.jsx";

const PROPERTIES = [
  { id: 1, name: "Modern Hillside Villa", address: "742 Oak Crest Dr", price: 875000, beds: 4, baths: 3, sqft: 3200, type: "House", grad: "135deg, #1a3a5c, #0d2240" },
  { id: 2, name: "Downtown Loft", address: "88 Market St #12", price: 425000, beds: 2, baths: 2, sqft: 1100, type: "Condo", grad: "200deg, #2a1a3e, #14102a" },
  { id: 3, name: "Lakeside Retreat", address: "15 Clearwater Ln", price: 1250000, beds: 5, baths: 4, sqft: 4800, type: "House", grad: "160deg, #0c2a2a, #081e1e" },
  { id: 4, name: "Urban Studio", address: "200 Central Ave #4B", price: 289000, beds: 1, baths: 1, sqft: 650, type: "Apartment", grad: "180deg, #2a2015, #1a140c" },
  { id: 5, name: "Family Farmhouse", address: "3001 Country Rd", price: 545000, beds: 4, baths: 2, sqft: 2400, type: "House", grad: "145deg, #1a2a10, #0e1a08" },
  { id: 6, name: "Coastal Penthouse", address: "1 Ocean Blvd #PH", price: 2100000, beds: 3, baths: 3, sqft: 2800, type: "Condo", grad: "170deg, #0a1a30, #061228" },
];

const PRICE_RANGES = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "$200k – $400k", min: 200000, max: 400000 },
  { label: "$400k – $600k", min: 400000, max: 600000 },
  { label: "$600k – $1M", min: 600000, max: 1000000 },
  { label: "$1M+", min: 1000000, max: Infinity },
];

const TYPES = ["All", "House", "Condo", "Apartment", "Townhouse"];

const NEIGHBORHOODS = [
  { name: "Riverside Heights", desc: "Tree-lined streets, top-rated schools, and a growing arts district. Perfect for families.", avg: "$620k" },
  { name: "Downtown Core", desc: "Walkable urban living with dining, nightlife, and transit at your doorstep.", avg: "$480k" },
  { name: "Coastal Drive", desc: "Oceanfront luxury with panoramic views, private beach access, and resort-style amenities.", avg: "$1.8M" },
];

function fmt(n) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function PropertyCard({ p }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  function onMove(e) {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: y * -12, ry: x * 12 });
  }

  return (
    <div
      ref={ref}
      className="dre-card"
      style={{ transform: `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
    >
      <div className="dre-card-img" style={{ background: `linear-gradient(${p.grad})` }}>
        <span className="dre-badge-sale">For Sale</span>
      </div>
      <div className="dre-card-body">
        <h3>{p.name}</h3>
        <p className="dre-address">{p.address}</p>
        <p className="dre-price">${fmt(p.price)}</p>
        <div className="dre-specs">
          <span>{p.beds} bed</span>
          <span>{p.baths} bath</span>
          <span>{fmt(p.sqft)} sqft</span>
        </div>
      </div>
    </div>
  );
}

export default function RealEstate() {
  const [typeFilter, setTypeFilter] = useState("All");
  const [priceIdx, setPriceIdx] = useState(0);
  const [query, setQuery] = useState("");

  const [homePrice, setHomePrice] = useState(500000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);

  const filtered = useMemo(() => {
    const range = PRICE_RANGES[priceIdx];
    return PROPERTIES.filter(p => {
      if (typeFilter !== "All" && p.type !== typeFilter) return false;
      if (p.price < range.min || p.price > range.max) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.address.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [typeFilter, priceIdx, query]);

  const mortgage = useMemo(() => {
    const principal = homePrice * (1 - downPct / 100);
    const monthlyRate = rate / 100 / 12;
    const n = term * 12;
    const pi = monthlyRate > 0
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
      : principal / n;
    const tax = homePrice * 0.012 / 12;
    return { pi, tax, total: pi + tax };
  }, [homePrice, downPct, rate, term]);

  return (
    <DemoShell industry="Real Estate">
      <style>{`
        .dre-page{--blue:#3b82f6;--green:#10b981;--bg:#0c1222;--surface:#111827;--border:#1e293b;--text:#e8ecf4;--muted:#94a3b8;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
        .dre-wrap{max-width:1200px;margin:0 auto;padding:0 32px}
        .dre-hero{text-align:center;padding:72px 32px 56px}
        .dre-hero-eyebrow{font-size:1rem;letter-spacing:.12em;color:var(--blue);font-weight:600;text-transform:uppercase}
        .dre-hero h1{font-size:clamp(2.25rem,5vw,3.5rem);font-weight:800;letter-spacing:-.04em;margin:16px 0 12px;line-height:1.1}
        .dre-hero h1 span{color:var(--blue)}
        .dre-hero p{color:var(--muted);font-size:1.25rem;margin-bottom:36px}
        .dre-search{display:flex;gap:10px;max-width:800px;margin:0 auto;flex-wrap:wrap}
        .dre-search input,.dre-search select{flex:1;min-width:140px;padding:14px 16px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text);font-size:1rem}
        .dre-search input::placeholder{color:var(--muted)}
        .dre-search select{cursor:pointer}
        .dre-search-btn{padding:14px 28px;background:var(--blue);color:#fff;border:0;border-radius:8px;font-weight:700;font-size:1rem;cursor:pointer;white-space:nowrap}
        .dre-search-btn:hover{background:#2563eb}
        .dre-section{padding:56px 0}
        .dre-section-title{font-size:1.5rem;font-weight:700;margin-bottom:8px;letter-spacing:-.02em}
        .dre-section-sub{color:var(--muted);margin-bottom:32px;font-size:1.125rem}
        .dre-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px}
        .dre-card{border:1px solid var(--border);border-radius:12px;overflow:hidden;background:var(--surface);transition:transform .25s ease,box-shadow .25s ease;will-change:transform;cursor:default}
        .dre-card:hover{box-shadow:0 16px 48px #3b82f622}
        .dre-card-img{height:180px;position:relative;display:flex;align-items:flex-start;justify-content:flex-end;padding:14px}
        .dre-badge-sale{background:var(--green);color:#fff;padding:4px 12px;border-radius:6px;font-size:.875rem;font-weight:700;letter-spacing:.02em}
        .dre-card-body{padding:20px}
        .dre-card-body h3{font-size:1.25rem;font-weight:700;margin-bottom:4px}
        .dre-address{color:var(--muted);font-size:.9375rem;margin-bottom:10px}
        .dre-price{font-size:1.5rem;font-weight:800;color:var(--blue);margin-bottom:12px}
        .dre-specs{display:flex;gap:16px;color:var(--muted);font-size:.9375rem}
        .dre-specs span{display:flex;align-items:center;gap:4px}
        .dre-specs span::before{content:"";width:4px;height:4px;border-radius:50%;background:var(--border)}
        .dre-specs span:first-child::before{display:none}
        .dre-empty{grid-column:1/-1;text-align:center;padding:48px 0;color:var(--muted);font-size:1.125rem}

        .dre-calc{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start}
        .dre-calc-inputs{display:flex;flex-direction:column;gap:24px}
        .dre-field label{display:block;font-size:.9375rem;color:var(--muted);margin-bottom:8px}
        .dre-field-row{display:flex;align-items:center;gap:12px}
        .dre-field input[type=range]{flex:1;accent-color:var(--blue);height:6px}
        .dre-field-val{min-width:80px;text-align:right;font-weight:700;font-size:1rem;font-variant-numeric:tabular-nums}
        .dre-term-row{display:flex;gap:12px}
        .dre-term-btn{padding:10px 20px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--muted);font-size:1rem;cursor:pointer}
        .dre-term-btn[data-active=true]{background:var(--blue);border-color:var(--blue);color:#fff;font-weight:700}
        .dre-result{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:36px;text-align:center}
        .dre-result-label{font-size:1rem;color:var(--muted);margin-bottom:8px}
        .dre-result-amount{font-size:clamp(2.5rem,5vw,3.5rem);font-weight:800;color:var(--green);margin-bottom:24px;font-variant-numeric:tabular-nums}
        .dre-result-amount span{font-size:1.25rem;color:var(--muted);font-weight:400;margin-left:4px}
        .dre-breakdown{display:grid;gap:12px;text-align:left}
        .dre-breakdown-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:.9375rem}
        .dre-breakdown-row:last-child{border:0;font-weight:700;color:var(--text)}
        .dre-breakdown-row span:first-child{color:var(--muted)}
        .dre-breakdown-row:last-child span:first-child{color:var(--text)}

        .dre-hoods{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .dre-hood{padding:28px;border:1px solid var(--border);border-radius:12px;background:var(--surface);transition:border-color .2s}
        .dre-hood:hover{border-color:var(--blue)}
        .dre-hood h3{font-size:1.25rem;font-weight:700;margin-bottom:8px}
        .dre-hood p{color:var(--muted);font-size:.9375rem;line-height:1.65;margin-bottom:16px}
        .dre-hood-avg{font-size:1.125rem;font-weight:700;color:var(--blue)}
        .dre-hood-avg span{font-size:.875rem;color:var(--muted);font-weight:400;margin-left:4px}

        .dre-cta{text-align:center;padding:64px 32px;border-top:1px solid var(--border);margin-top:24px}
        .dre-cta h2{font-size:2rem;font-weight:800;margin-bottom:12px}
        .dre-cta p{color:var(--muted);font-size:1.125rem;margin-bottom:28px}
        .dre-cta-btn{display:inline-flex;align-items:center;gap:12px;background:var(--blue);color:#fff;padding:16px 32px;border-radius:10px;font-size:1.125rem;font-weight:700}
        .dre-cta-btn:hover{background:#2563eb}

        .dre-footer{max-width:1200px;margin:0 auto;padding:24px 32px;border-top:1px solid var(--border);display:flex;justify-content:space-between;color:var(--muted);font-size:.875rem;flex-wrap:wrap;gap:12px}
        .dre-footer a{color:var(--blue)}

        @media(max-width:768px){
          .dre-wrap{padding:0 20px}
          .dre-hero{padding:48px 20px 36px}
          .dre-grid{grid-template-columns:1fr}
          .dre-calc{grid-template-columns:1fr}
          .dre-hoods{grid-template-columns:1fr}
          .dre-search{flex-direction:column}
          .dre-search input,.dre-search select{min-width:0}
        }
      `}</style>
      <div className="dre-page">
        <section className="dre-hero">
          <span className="dre-hero-eyebrow">Horizon Realty</span>
          <h1>Find your next <span>horizon.</span></h1>
          <p>Premium properties. Expert guidance. Your journey starts here.</p>
          <div className="dre-search">
            <input type="text" placeholder="Search by name or address…" value={query} onChange={e => setQuery(e.target.value)} />
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              {TYPES.map(t => <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>)}
            </select>
            <select value={priceIdx} onChange={e => setPriceIdx(+e.target.value)}>
              {PRICE_RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
            </select>
            <button className="dre-search-btn" type="button">Search</button>
          </div>
        </section>

        <div className="dre-wrap">
          <section className="dre-section">
            <h2 className="dre-section-title">Featured Listings</h2>
            <p className="dre-section-sub">{filtered.length} {filtered.length === 1 ? "property" : "properties"} found</p>
            <div className="dre-grid">
              {filtered.length ? filtered.map(p => <PropertyCard key={p.id} p={p} />) : <p className="dre-empty">No properties match your filters. Try adjusting your search.</p>}
            </div>
          </section>

          <section className="dre-section">
            <h2 className="dre-section-title">Mortgage Calculator</h2>
            <p className="dre-section-sub">Estimate your monthly payment in real time.</p>
            <div className="dre-calc">
              <div className="dre-calc-inputs">
                <div className="dre-field">
                  <label>Home Price</label>
                  <div className="dre-field-row">
                    <input type="range" min={100000} max={3000000} step={10000} value={homePrice} onChange={e => setHomePrice(+e.target.value)} />
                    <span className="dre-field-val">${fmt(homePrice)}</span>
                  </div>
                </div>
                <div className="dre-field">
                  <label>Down Payment</label>
                  <div className="dre-field-row">
                    <input type="range" min={0} max={50} step={1} value={downPct} onChange={e => setDownPct(+e.target.value)} />
                    <span className="dre-field-val">{downPct}%</span>
                  </div>
                </div>
                <div className="dre-field">
                  <label>Interest Rate</label>
                  <div className="dre-field-row">
                    <input type="range" min={1} max={12} step={0.1} value={rate} onChange={e => setRate(+e.target.value)} />
                    <span className="dre-field-val">{rate.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="dre-field">
                  <label>Loan Term</label>
                  <div className="dre-term-row">
                    <button type="button" className="dre-term-btn" data-active={term === 15} onClick={() => setTerm(15)}>15 years</button>
                    <button type="button" className="dre-term-btn" data-active={term === 30} onClick={() => setTerm(30)}>30 years</button>
                  </div>
                </div>
              </div>
              <div className="dre-result">
                <p className="dre-result-label">Estimated Monthly Payment</p>
                <p className="dre-result-amount">${fmt(Math.round(mortgage.total))}<span>/mo</span></p>
                <div className="dre-breakdown">
                  <div className="dre-breakdown-row"><span>Principal & Interest</span><span>${fmt(Math.round(mortgage.pi))}</span></div>
                  <div className="dre-breakdown-row"><span>Property Tax (est.)</span><span>${fmt(Math.round(mortgage.tax))}</span></div>
                  <div className="dre-breakdown-row"><span>Total Monthly</span><span>${fmt(Math.round(mortgage.total))}</span></div>
                </div>
              </div>
            </div>
          </section>

          <section className="dre-section">
            <h2 className="dre-section-title">Explore Neighborhoods</h2>
            <p className="dre-section-sub">Discover the perfect community for your lifestyle.</p>
            <div className="dre-hoods">
              {NEIGHBORHOODS.map(n => (
                <div key={n.name} className="dre-hood">
                  <h3>{n.name}</h3>
                  <p>{n.desc}</p>
                  <span className="dre-hood-avg">{n.avg}<span>avg. price</span></span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="dre-cta">
          <h2>Ready to find your home?</h2>
          <p>Connect with our team for personalized property recommendations and private viewings.</p>
          <a className="dre-cta-btn" href="mailto:hello@horizonrealty.demo">Schedule Viewing ↗</a>
        </section>

        <footer className="dre-footer">
          <span>Horizon Realty — Demo Website</span>
          <a href="/">Built by Romeo Vargas Jr. ↗</a>
        </footer>
      </div>
    </DemoShell>
  );
}
