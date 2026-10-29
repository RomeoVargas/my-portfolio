import React, { useEffect, useRef, useState } from "react";
import ProjectCard from "./ProjectCard.jsx";
import { EMAIL, services, projects, experience } from "./data";
import { demos } from "./demos";

function Icon({ name, ...props }) {
  const paths = {
    sun: "M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.6-6.4-.8.8m-10.4 10.4-.8.8m0-12-.8-.8m10.4 10.4.8.8M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
    moon: "M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z",
    arrow: "M4 12h16m-6-6 6 6-6 6",
    mail: "M3 5h18v14H3V5Zm0 1 9 7 9-7",
    github: "M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69C6.73 19.91 6.14 18 6.14 18c-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.16.59.67.5A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10Z",
    linkedin: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6ZM2 9h4v12H2V9Zm2-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z",
    external: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6v6m-11 5L21 3",
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d={paths[name] || paths.arrow} />
    </svg>
  );
}

function useTheme() {
  const [dark, setDark] = useState(() => {
    try { const s = localStorage.getItem("theme"); return s ? s === "dark" : true; } catch { return true; }
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);
  return [dark, () => setDark(d => !d)];
}

function Glow() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    function move(e) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--gx", e.clientX + "px");
        el.style.setProperty("--gy", e.clientY + "px");
      });
    }
    window.addEventListener("pointermove", move, { passive: true });
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}

export default function App() {
  const [dark, toggleTheme] = useTheme();
  const [filter, setFilter] = useState("all");
  const [copyState, setCopyState] = useState("Copy email");
  const timer = useRef(null);

  async function copyEmail() {
    try { await navigator.clipboard.writeText(EMAIL); setCopyState("Copied!"); }
    catch { setCopyState("Select the email above"); }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopyState("Copy email"), 3500);
  }

  return (
    <>
      <Glow />
      <header className="site-header">
        <a className="brand" href="#">
          <span className="brand-mark">R<span>V</span></span>
        </a>
        <nav>
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#demos">Demos</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="theme-toggle" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
          <Icon name={dark ? "sun" : "moon"} />
        </button>
      </header>

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="hero-inner">
            <span className="hero-greeting">Hi, I'm Romeo</span>
            <h1>I build things<br />for the web.</h1>
            <p className="hero-lead">
              Full-stack developer from the Philippines with 10+ years of experience building
              websites, mobile apps, custom systems, and brand identities for growing businesses.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#work">See my work <Icon name="arrow" /></a>
              <a className="btn btn-ghost" href="#contact">Get in touch</a>
            </div>
          </div>
          <div className="hero-gradient" aria-hidden="true" />
        </section>

        {/* Projects */}
        <section id="work" className="section">
          <span className="section-label">SELECTED WORK</span>
          <h2>Ideas brought to life.</h2>
          <p className="section-lead">
            Recent product work and selected freelance projects — from mobile wallets
            to merchant platforms and business websites.
          </p>
          <div className="filter-bar" role="group" aria-label="Filter projects">
            {[["all","All"],["branding","Branding"],["web","Websites"],["systems","Systems"],["mobile","Mobile"]].map(([id,label]) => (
              <button key={id} className={filter === id ? "active" : ""} onClick={() => setFilter(id)}>{label}</button>
            ))}
          </div>
          <div className="projects-grid">
            {projects
              .filter(p => filter === "all" || p.serviceIds.includes(filter))
              .map(p => <ProjectCard key={p.name} project={p} />)}
          </div>
        </section>

        {/* Services */}
        <section id="services" className="section">
          <span className="section-label">WHAT I DO</span>
          <h2>Services.</h2>
          <p className="section-lead">Useful digital experiences, shaped around your goals.</p>
          <div className="services-grid">
            {services.map(s => (
              <article key={s.id} className={`service-card sc-${s.color}`}>
                <span className="service-icon">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <div className="tags">{s.tags.map(t => <span key={t}>{t}</span>)}</div>
              </article>
            ))}
          </div>
        </section>

        {/* Demos */}
        <section id="demos" className="section">
          <span className="section-label">INTERACTIVE DEMOS</span>
          <h2>Live showcases.</h2>
          <p className="section-lead">
            Interactive websites built for different industries. Each one showcases
            a unique web experience you can explore right now.
          </p>
          <div className="demo-grid">
            {demos.map(d => (
              <a key={d.id} className={`demo-card demo-${d.id}`} href={d.path}>
                <span className="demo-industry">{d.industry}</span>
                <h3>{d.name}</h3>
                <p>{d.tagline}</p>
                <span className="demo-cta">Explore demo <Icon name="external" width="16" height="16" /></span>
              </a>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="section">
          <span className="section-label">ABOUT ME</span>
          <h2>Meet the maker.</h2>
          <div className="about-grid">
            <div className="about-bio">
              <p className="section-lead">
                I'm a developer based in the Philippines, with a software career
                that started in 2014. I've worked on mobile games, payroll tools,
                learning platforms, real-estate software, and custom systems for
                growing businesses.
              </p>
              <p>
                I enjoy connecting the dots between an idea, a useful interface,
                and a reliable backend.
              </p>
              <h3>Tools in my inventory</h3>
              <div className="tags inventory">
                {["PHP","Laravel","Symfony","Vue.js","React","Nuxt","JavaScript","MySQL","PostgreSQL","REST APIs","WordPress","Git","AWS","Google Cloud","Docker"].map(t => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
            <div className="about-timeline">
              <h3>Experience</h3>
              <div className="timeline">
                {experience.map(([date, company, role, desc]) => (
                  <article key={company} className="timeline-entry">
                    <span className="timeline-date">{date}</span>
                    <h4>{company}</h4>
                    <span className="timeline-role">{role}</span>
                    <p>{desc}</p>
                  </article>
                ))}
              </div>
              <p className="footnote">¹ Employment dates are reproduced from the supplied résumé.</p>
            </div>
          </div>
          <div className="education">
            <h3>Education</h3>
            <p>STI College Shaw · Information Technology · 2011–2014</p>
            <p>Rizal Technological University · Computer Engineering · 2009–2011</p>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section section-contact">
          <span className="section-label">LET'S CONNECT</span>
          <h2>Every great thing<br />starts with hello.</h2>
          <p className="section-lead">
            A website, a custom system, a fresh brand, or an idea you haven't quite
            figured out yet — I'd love to hear about it.
          </p>
          <div className="contact-card">
            <a className="contact-email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <div className="contact-actions">
              <a className="btn btn-primary" href={`mailto:${EMAIL}?subject=${encodeURIComponent("Let's build something together")}`}>
                Send an email <Icon name="arrow" />
              </a>
              <button className="btn btn-ghost" onClick={copyEmail}>{copyState}</button>
            </div>
            <div className="contact-meta">
              <span>Philippines · UTC+8</span>
              <span>English & Tagalog</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <span className="footer-brand">Romeo Vargas Jr.</span>
          <nav className="footer-links">
            <a href="#work">Work</a>
            <a href="#services">Services</a>
            <a href="#demos">Demos</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
          <span className="footer-copy">© {new Date().getFullYear()} Romeo Vargas Jr.</span>
        </div>
      </footer>
    </>
  );
}
