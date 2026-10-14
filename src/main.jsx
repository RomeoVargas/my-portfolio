import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Game from "./Game.jsx";
import { Character } from "./WorldArt";
import { EMAIL, services, projects, experience } from "./data";
import "./styles.css";

function Icon({ name, ...props }) {
  const paths = {
    sound: "M11 5 6 9H3v6h3l5 4V5Zm4 3a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14",
    muted: "M11 5 6 9H3v6h3l5 4V5Zm5 4 5 6m0-6-5 6",
    sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-6v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1",
    moon: "M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z",
    arrow: "M4 12h16m-6-6 6 6-6 6",
    mail: "M3 5h18v14H3V5Zm0 1 9 7 9-7",
    close: "m6 6 12 12M6 18 18 6",
    pause: "M8 5v14m8-14v14",
    play: "m7 4 13 8-13 8V4",
    download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  };
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.arrow} />
    </svg>
  );
}

function App() {
  const [panel, setPanel] = useState(null);
  const [service, setService] = useState(null);
  const [filter, setFilter] = useState("all");
  const [visited, setVisited] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [motion, setMotion] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [night, setNight] = useState(false);
  const [copyState, setCopyState] = useState("Copy email");
  const dialog = useRef(null),
    gameRef = useRef(null),
    audio = useRef(null),
    lastFocus = useRef(null),
    timer = useRef(null);
  function chime() {
    if (!soundEnabled) return;
    try {
      const context =
        audio.current ??
        new (window.AudioContext || window.webkitAudioContext)();
      audio.current = context;
      void context.resume().catch(() => {});
      [523.25, 659.25, 783.99].forEach((f, i) => {
        const o = context.createOscillator(),
          g = context.createGain();
        o.type = "sine";
        o.frequency.value = f;
        o.connect(g);
        g.connect(context.destination);
        const t = context.currentTime + i * 0.07;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.045, t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        o.start(t);
        o.stop(t + 0.23);
      });
    } catch {
      setSoundEnabled(false);
    }
  }
  function open(id, selected = null) {
    lastFocus.current = document.activeElement;
    setService(selected);
    setFilter("all");
    setPanel(id);
    chime();
    if (["about", "services", "projects", "contact"].includes(id))
      setVisited((v) => (v.includes(id) ? v : [...v, id]));
  }
  function close() {
    dialog.current?.close();
    setPanel(null);
    setCopyState("Copy email");
    lastFocus.current?.focus({ preventScroll: true });
  }
  useEffect(() => {
    if (panel) {
      dialog.current.showModal();
      dialog.current.scrollTop = 0;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [panel]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = (e) => setMotion(!e.matches);
    media.addEventListener("change", change);
    return () => {
      media.removeEventListener("change", change);
      clearTimeout(timer.current);
      void audio.current?.close();
    };
  }, []);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopyState("Email copied!");
    } catch {
      setCopyState("Select the email above to copy");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopyState("Copy email"), 3500);
  }
  function explore() {
    gameRef.current?.scrollIntoView({
      behavior: motion ? "smooth" : "instant",
      block: "center",
    });
    gameRef.current?.focus({ preventScroll: true });
  }
  const titles = {
    about: "Meet the maker.",
    services: service
      ? services.find((s) => s.id === service)?.title
      : "What can we build?",
    projects: "Ideas brought to life.",
    contact: "Every great thing starts with hello.",
    help: "Your adventure starts here.",
  };
  return (
    <>
      <a className="skip-link" href="#services">
        Skip to services
      </a>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Romeo’s World home">
          <span className="brand-mark">
            r<span>v</span>
            <i />
          </span>
          <span>
            romeo’s
            <span className="brand-world">
              world<span className="brand-dot">.</span>
            </span>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a className="active" href="#home">
            The world
          </a>
          <button onClick={() => open("about")}>About me</button>
          <button onClick={() => open("projects")}>My work</button>
          <a href="#services">Services</a>
        </nav>
        <button className="header-contact" onClick={() => open("contact")}>
          Let’s talk <span>↗</span>
        </button>
      </header>
      <main id="home">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-intro">
            <div className="eyebrow">
              <span className="status-light" /> DEVELOPER. MAKER. PLAYER TWO.
            </div>
            <h1 id="hero-title">
              Big ideas.
              <br />
              Little pixels.
              <br />
              <span>Real impact.</span>
            </h1>
            <p className="intro-name">
              Hey, I’m <strong>Romeo Vargas Jr.</strong>{" "}
              <span className="wave">✌</span>
            </p>
            <p className="intro-description">
              A full-stack developer turning your ideas into websites, apps, and
              things that just work. Welcome to my little corner of the
              internet.
            </p>
            <button className="primary-button" onClick={explore}>
              <span>Explore my world</span>
              <Icon name="arrow" />
            </button>
            <p className="intro-hint">
              <span>✦</span> A portfolio you can actually play.
            </p>
            <div className="intro-details">
              <span>
                <i /> Based in the Philippines
              </span>
              <button onClick={() => open("about")}>Get to know me ↗</button>
            </div>
          </div>
          <Game
            onOpen={open}
            active={!panel}
            motion={motion}
            sound={chime}
            gameRef={gameRef}
            night={night}
          />
        </section>
        <div className="adventure-bar">
          <div className="controls-legend">
            <span className="key-group">
              <kbd>W</kbd>
              <span>
                <kbd>A</kbd>
                <kbd>S</kbd>
                <kbd>D</kbd>
              </span>
            </span>
            <span>Move around</span>
            <span className="legend-divider" />
            <kbd>E</kbd>
            <span>Interact</span>
            <span className="mouse-symbol">↖</span>
            <span>or click to explore</span>
          </div>
          <div className="exploration">
            <span className="compass">✥</span>
            <span>World explored</span>
            <div
              className="progress-track"
              aria-label={`${visited.length} of 4 destinations explored`}
              role="progressbar"
              aria-valuenow={visited.length}
              aria-valuemin="0"
              aria-valuemax="4"
            >
              <span style={{ width: `${visited.length * 25}%` }} />
            </div>
            <b>{visited.length}/4</b>
          </div>
          <div className="settings">
            <button
              aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
              title={soundEnabled ? "Mute sound" : "Enable sound"}
              aria-pressed={soundEnabled}
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              <Icon name={soundEnabled ? "sound" : "muted"} />
            </button>
            <button
              aria-label={
                motion ? "Pause ambient animation" : "Enable ambient animation"
              }
              title={
                motion ? "Pause ambient animation" : "Enable ambient animation"
              }
              aria-pressed={!motion}
              onClick={() => setMotion(!motion)}
            >
              <Icon name={motion ? "pause" : "play"} />
            </button>
            <button
              aria-label={night ? "Switch to daytime" : "Switch to nighttime"}
              title={night ? "Switch to daytime" : "Switch to nighttime"}
              aria-pressed={night}
              onClick={() => setNight(!night)}
            >
              <Icon name={night ? "moon" : "sun"} />
            </button>
          </div>
        </div>
        <section
          className="services-section"
          id="services"
          aria-labelledby="services-title"
        >
          <div className="section-heading">
            <div>
              <div className="eyebrow">YOUR IDEA. OUR NEXT QUEST.</div>
              <h2 id="services-title">
                Let’s make something <span>great.</span>
              </h2>
            </div>
            <p>
              From the first spark to the final launch,
              <br />
              here’s what I can help you build.
            </p>
          </div>
          <div className="service-grid">
            {services.map((s) => (
              <button
                key={s.id}
                className={`service-card ${s.color}`}
                onClick={() => open("services", s.id)}
              >
                <span className="service-icon">{s.icon}</span>
                <span className="card-arrow">↗</span>
                <h3>{s.title}</h3>
                <p>{s.subtitle}</p>
                <span className="service-bottom">
                  Explore service <span>→</span>
                </span>
              </button>
            ))}
          </div>
        </section>
        <section className="contact-strip">
          <div className="mini-character">
            <svg viewBox="-28 -50 56 65" aria-hidden="true">
              <Character />
            </svg>
          </div>
          <div>
            <h2>Have a quest in mind?</h2>
            <p>Bring the idea. I’ll bring the build.</p>
          </div>
          <button onClick={() => open("contact")}>
            Let’s team up <Icon name="arrow" />
          </button>
          <span className="strip-spark">✦</span>
        </section>
      </main>
      <footer>
        <span>© {new Date().getFullYear()} Romeo Vargas Jr.</span>
        <span>
          Built with code, coffee & a little imagination.{" "}
          <span className="footer-star">✦</span>
        </span>
        <button onClick={() => open("about")}>View résumé ↗</button>
      </footer>
      <dialog
        ref={dialog}
        className="content-dialog"
        aria-labelledby="panel-title"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) {
            const r = dialog.current.getBoundingClientRect();
            if (
              e.clientX < r.left ||
              e.clientX > r.right ||
              e.clientY < r.top ||
              e.clientY > r.bottom
            )
              close();
          }
        }}
      >
        {panel && (
          <>
            <div className="dialog-top">
              <span className="eyebrow">
                ROMEO’S WORLD /{" "}
                {panel === "help" ? "PLAYER GUIDE" : panel.toUpperCase()}
              </span>
              <button
                className="icon-button"
                onClick={close}
                aria-label="Close dialog"
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="dialog-body">
              <h2 id="panel-title">{titles[panel]}</h2>
              {panel === "about" && (
                <>
                  <p className="dialog-lead">
                    Full-stack developer. Thoughtful problem solver. Your next
                    creative teammate.
                  </p>
                  <div className="about-intro">
                    <div className="portrait-pixel">
                      <svg viewBox="-35 -55 70 75" aria-hidden="true">
                        <Character />
                      </svg>
                      <span>ROMEO VARGAS JR.</span>
                    </div>
                    <div>
                      <p>
                        I’m a developer based in the Philippines, with a
                        software career that started in 2014. I’ve worked on
                        mobile games, payroll tools, learning platforms,
                        real-estate software, and custom systems for growing
                        businesses.
                      </p>
                      <p>
                        I enjoy connecting the dots between an idea, a useful
                        interface, and a reliable backend.
                      </p>
                    </div>
                  </div>
                  <h3 className="subheading">Tools in my inventory</h3>
                  <div className="tags inventory">
                    {[
                      "PHP",
                      "Laravel",
                      "Symfony",
                      "Vue.js",
                      "React",
                      "Nuxt",
                      "JavaScript",
                      "MySQL",
                      "PostgreSQL",
                      "REST APIs",
                      "WordPress",
                      "Git",
                      "AWS",
                      "Google Cloud",
                      "Docker",
                    ].map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <h3 className="subheading">The journey so far</h3>
                  <div className="timeline">
                    {experience.map(([date, company, role, desc]) => (
                      <article key={company}>
                        <span className="timeline-date">{date}</span>
                        <h4>{company}</h4>
                        <span className="role">{role}</span>
                        <p>{desc}</p>
                      </article>
                    ))}
                  </div>
                  <p className="source-note">
                    ¹ Employment dates are reproduced from the supplied résumé.
                  </p>
                  <h3 className="subheading">Education</h3>
                  <p>
                    STI College Shaw · Information Technology · 2011–2014
                    <br />
                    Rizal Technological University · Computer Engineering ·
                    2009–2011
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => {
                      setPanel("contact");
                      setVisited((v) =>
                        v.includes("contact") ? v : [...v, "contact"],
                      );
                    }}
                  >
                    Let’s work together <Icon name="arrow" />
                  </button>
                </>
              )}
              {panel === "services" && (
                <>
                  <p className="dialog-lead">
                    Useful digital experiences, shaped around your goals.
                  </p>
                  <div className="service-detail-list">
                    {services
                      .filter((s) => !service || s.id === service)
                      .map((s) => (
                        <article
                          className={`service-detail ${s.color}`}
                          key={s.id}
                        >
                          <span className="service-icon">{s.icon}</span>
                          <h3>{s.title}</h3>
                          <p>{s.description}</p>
                          <div className="tags">
                            {s.tags.map((t) => (
                              <span key={t}>{t}</span>
                            ))}
                          </div>
                        </article>
                      ))}
                  </div>
                  <div className="dialog-callout">
                    <p>
                      Tell me what you’re imagining. We’ll work out the right
                      scope together.
                    </p>
                    <button
                      className="primary-button"
                      onClick={() => {
                        setPanel("contact");
                        setVisited((v) =>
                          v.includes("contact") ? v : [...v, "contact"],
                        );
                      }}
                    >
                      Discuss your project <Icon name="arrow" />
                    </button>
                  </div>
                </>
              )}
              {panel === "projects" && (
                <>
                  <p className="dialog-lead">
                    Recent product work and selected freelance projects. From
                    mobile wallets to merchant platforms and business websites.
                  </p>
                  <div className="filter-bar" aria-label="Filter projects">
                    {[
                      ["all", "All projects"],
                      ["web", "Websites"],
                      ["systems", "Custom systems"],
                      ["mobile", "Mobile apps"],
                    ].map(([id, label]) => (
                      <button
                        aria-pressed={filter === id}
                        onClick={() => setFilter(id)}
                        key={id}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="projects-grid">
                    {projects
                      .filter((p) => filter === "all" || p.type === filter)
                      .map((p) => (
                        <article className="project-card" key={p.name}>
                          <div className={`project-art ${p.color}`}>
                            {p.image ? (
                              <img
                                className="project-brand"
                                src={p.image}
                                alt={`${p.name} brand artwork`}
                                width="120"
                                height="100"
                              />
                            ) : (
                              <span>{p.glyph}</span>
                            )}
                            <i className="project-grid-line" />
                            <span className="project-art-label">
                              {p.category.toUpperCase()}
                            </span>
                          </div>
                          <div className="project-copy">
                            <span className="eyebrow">{p.category}</span>
                            <h3>{p.name}</h3>
                            <p>{p.description}</p>
                            <div className="tags">
                              {p.tags.map((t) => (
                                <span key={t}>{t}</span>
                              ))}
                            </div>
                          </div>
                        </article>
                      ))}
                  </div>
                  <p className="source-note">
                    Nexus and Paycoinect use original brand artwork. Other
                    project artwork is illustrative.
                  </p>
                </>
              )}
              {panel === "contact" && (
                <>
                  <p className="dialog-lead">
                    A website, a custom system, a fresh brand, or an idea you
                    haven’t quite figured out yet. I’d love to hear about it.
                  </p>
                  <div className="contact-panel">
                    <span className="mail-art">
                      <Icon name="mail" width="48" height="48" />
                    </span>
                    <span className="eyebrow">
                      SEND A MESSAGE TO PLAYER TWO
                    </span>
                    <a className="email-address" href={`mailto:${EMAIL}`}>
                      {EMAIL}
                    </a>
                    <div className="contact-actions">
                      <a
                        className="primary-button"
                        href={`mailto:${EMAIL}?subject=${encodeURIComponent("Let’s build something together")}`}
                      >
                        Open email <Icon name="arrow" />
                      </a>
                      <button className="secondary-button" onClick={copyEmail}>
                        {copyState}
                      </button>
                    </div>
                    <span className="sr-only" role="status">
                      {copyState === "Copy email" ? "" : copyState}
                    </span>
                    <p>
                      Share a little about your project, your timeline,
                      <br />
                      and what a great result looks like to you.
                    </p>
                  </div>
                  <div className="contact-meta">
                    <span>◎ Philippines · UTC+8</span>
                    <span>English & Tagalog</span>
                  </div>
                </>
              )}
              {panel === "help" && (
                <>
                  <p className="dialog-lead">
                    There’s no wrong way to explore. Wander around, or jump
                    straight to what you came for.
                  </p>
                  <div className="help-list">
                    <div>
                      <span>⌨</span>
                      <div>
                        <h3>Take a walk</h3>
                        <p>
                          Click the island to focus it, then use WASD or the
                          arrow keys. You can also click a clear patch of ground
                          to walk there. On touch screens, use the direction
                          buttons.
                        </p>
                      </div>
                    </div>
                    <div>
                      <span>⌂</span>
                      <div>
                        <h3>Visit a destination</h3>
                        <p>
                          Walk up to a building and press E, or click its label.
                          The studio has my services, the lab has my projects,
                          and base camp has my story.
                        </p>
                      </div>
                    </div>
                    <div>
                      <span>✦</span>
                      <div>
                        <h3>A little side quest</h3>
                        <p>
                          Collect all five golden stars around the island. Your
                          fox companion follows along! Exploration progress
                          lasts for this visit.
                        </p>
                      </div>
                    </div>
                    <div>
                      <span>♫</span>
                      <div>
                        <h3>Make yourself at home</h3>
                        <p>
                          The controls below the island switch sound, ambient
                          animation, and day or night. Sound starts off. All
                          portfolio content is also available through the
                          navigation.
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    className="primary-button"
                    onClick={() => {
                      close();
                      explore();
                    }}
                  >
                    Let’s explore <Icon name="arrow" />
                  </button>
                </>
              )}
            </div>
            <div className="dialog-footer">
              <span>✦ A LITTLE CURIOSITY GOES A LONG WAY.</span>
              <button onClick={close}>
                Back to the island <span>↵</span>
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
