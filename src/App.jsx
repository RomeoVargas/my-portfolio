import React, { useEffect, useRef, useState } from "react";
import Game from "./Game.jsx";
import ProjectCard from "./ProjectCard.jsx";
import { Character } from "./WorldArt";
import { EMAIL, services, projects, experience } from "./data";
import { demos } from "./demos";

function Icon({ name, ...props }) {
  const paths = {
    sound: "M11 5 6 9H3v6h3l5 4V5Zm4 3a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14",
    muted: "M11 5 6 9H3v6h3l5 4V5Zm5 4 5 6m0-6-5 6",
    arrow: "M4 12h16m-6-6 6 6-6 6",
    mail: "M3 5h18v14H3V5Zm0 1 9 7 9-7",
    close: "m6 6 12 12M6 18 18 6",
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

export default function App() {
  const [panel, setPanel] = useState("welcome");
  const [service, setService] = useState(null);
  const [filter, setFilter] = useState("all");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundAllowed = useRef(true);
  const clickSound = useRef(null);
  const chimeAudio = useRef(null);
  const [audioError, setAudioError] = useState("");
  const music = useRef(null);
  const soundRequest = useRef(0);
  const [motion, setMotion] = useState(false);
  const [copyState, setCopyState] = useState("Copy email");
  const dialog = useRef(null),
    gameRef = useRef(null),
    lastFocus = useRef(null),
    timer = useRef(null);
  function startMusic() {
    const request = ++soundRequest.current;
    const track = music.current;
    track.volume = 0.25;
    if (track.error) track.load();
    void track.play().catch((error) => {
      if (request !== soundRequest.current || !soundAllowed.current) return;
      if (error.name !== "AbortError") {
        track.pause();
        soundAllowed.current = false;
        setSoundEnabled(false);
        setAudioError("Music couldn’t play. Try enabling sound again.");
      }
    });
  }
  function toggleSound() {
    setAudioError("");
    if (chimeAudio.current)
      chimeAudio.current.gain.gain.value = soundAllowed.current ? 0 : 1;
    if (soundAllowed.current) {
      soundRequest.current += 1;
      soundAllowed.current = false;
      music.current.pause();
      clickSound.current.pause();
      setSoundEnabled(false);
    } else {
      soundAllowed.current = true;
      setSoundEnabled(true);
      if (panel !== "welcome") startMusic();
    }
  }
  function playChime() {
    if (!soundAllowed.current) return;
    try {
      if (!chimeAudio.current) {
        const context = new (
          window.AudioContext || window.webkitAudioContext
        )();
        const gain = context.createGain();
        gain.connect(context.destination);
        chimeAudio.current = { context, gain };
      }
      const { context, gain } = chimeAudio.current;
      void context.resume().catch(() => {});
      [523.25, 659.25, 783.99].forEach((frequency, i) => {
        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        oscillator.connect(envelope);
        envelope.connect(gain);
        const time = context.currentTime + i * 0.07;
        envelope.gain.setValueAtTime(0, time);
        envelope.gain.linearRampToValueAtTime(0.045, time + 0.015);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
        oscillator.onended = () => {
          oscillator.disconnect();
          envelope.disconnect();
        };
        oscillator.start(time);
        oscillator.stop(time + 0.23);
      });
    } catch {
      setAudioError(
        "The star sound couldn’t play. You can still explore the site.",
      );
    }
  }
  function playClick() {
    if (!soundAllowed.current) return;
    const effect = clickSound.current;
    effect.volume = 0.35;
    effect.currentTime = 0;
    void effect.play().catch((error) => {
      if (error.name !== "AbortError" && error.name !== "NotAllowedError")
        setAudioError(
          "The click sound couldn’t play. You can still explore the site.",
        );
    });
  }
  useEffect(() => {
    const track = music.current;
    const effect = clickSound.current;
    return () => {
      soundRequest.current += 1;
      track.pause();
      effect.pause();
      void chimeAudio.current?.context.close().catch(() => {});
      chimeAudio.current = null;
    };
  }, []);
  function open(id, selected = null) {
    playClick();
    lastFocus.current = document.activeElement;
    setService(selected);
    setFilter("all");
    setPanel(id);
  }
  function close() {
    if (panel === "welcome" && soundAllowed.current) startMusic();
    playClick();
    dialog.current?.close();
    setPanel(null);
    setCopyState("Copy email");
    if (panel === "welcome") explore();
    else lastFocus.current?.focus({ preventScroll: true });
  }
  useEffect(() => {
    if (panel) {
      dialog.current.showModal();
      if (panel === "welcome")
        dialog.current
          .querySelector(".primary-button")
          .focus({ preventScroll: true });
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
    setMotion(!media.matches);
    const change = (e) => setMotion(!e.matches);
    media.addEventListener("change", change);
    return () => {
      media.removeEventListener("change", change);
      clearTimeout(timer.current);
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
    welcome: "I’m Romeo Vargas Jr.",
    about: "Meet the maker.",
    services: service
      ? services.find((s) => s.id === service)?.title
      : "What can we build?",
    projects: "Ideas brought to life.",
    contact: "Every great thing starts with hello.",
    help: "Your adventure starts here.",
  };
  const soundLabel = soundEnabled ? "Mute sound" : "Enable sound";
  const soundButton = (
    <button
      className="sound-toggle"
      aria-label={soundLabel}
      title={soundLabel}
      aria-pressed={soundEnabled}
      onClick={toggleSound}
    >
      <Icon name={soundEnabled ? "sound" : "muted"} />
    </button>
  );
  return (
    <>
      <audio
        ref={music}
        data-audio="music"
        src="/audio/background-music.mp3"
        loop
        preload="auto"
        onError={() => {
          soundAllowed.current = false;
          soundRequest.current += 1;
          clickSound.current?.pause();
          setSoundEnabled(false);
          setAudioError("Music couldn’t play. Try enabling sound again.");
        }}
      />
      <audio
        ref={clickSound}
        data-audio="click"
        src="/audio/click.mp3"
        preload="auto"
      />
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
        <div className="header-actions">
          <button className="header-contact" onClick={() => open("contact")}>
            Let’s talk <span>↗</span>
          </button>
          {soundButton}
        </div>
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
              A full-stack developer in the Philippines building business
              websites, custom systems, and mobile apps. From your first idea
              to a working product, let’s build something useful.
            </p>
            <a className="project-link" href="#work">
              See selected work ↓
            </a>
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
            onCollect={playChime}
            onOpen={open}
            active={!panel}
            motion={motion}
            gameRef={gameRef}
          />
        </section>
        <div className="adventure-bar">
          <div className="controls-legend">
            <div className="legend-item">
              <span className="key-group" aria-hidden="true">
                <kbd>W</kbd>
                <span>
                  <kbd>A</kbd>
                  <kbd>S</kbd>
                  <kbd>D</kbd>
                </span>
              </span>
              <span>
                Move around
                <span className="sr-only"> with WASD or arrow keys</span>
              </span>
            </div>
            <div className="legend-item">
              <kbd>E</kbd>
              <span>Interact</span>
            </div>
            <div className="legend-item">
              <span className="mouse-symbol" aria-hidden="true">
                ↖
              </span>
              <span>Click or tap to explore</span>
            </div>
          </div>
        </div>
        {audioError && (
          <p className="audio-status" role="status">
            {audioError}
          </p>
        )}
        <section
          className="services-section"
          id="services"
          tabIndex={-1}
          aria-labelledby="services-title"
        >
          <div className="section-heading">
            <div>
              <div className="eyebrow">YOUR IDEA. OUR NEXT QUEST.</div>
              <h2 id="services-title">
                Websites, apps & <span>custom systems.</span>
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
              <a
                key={s.id}
                className={`service-card ${s.color}`}
                href={s.path}
                aria-label={`Read more about ${s.title}`}
              >
                <span className="service-icon">{s.icon}</span>
                <span className="card-arrow">↗</span>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <span className="service-bottom">
                  Read more <span>→</span>
                </span>
              </a>
            ))}
          </div>
        </section>
        <section className="selected-work" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <div>
              <div className="eyebrow">FROM IDEA TO LAUNCH</div>
              <h2 id="work-title">
                Selected <span>work.</span>
              </h2>
            </div>
            <button className="secondary-button" onClick={() => open("projects")}>
              View all projects <Icon name="arrow" />
            </button>
          </div>
          <div className="projects-grid">
            {projects
              .filter((p) =>
                ["Paycoinect Nexus", "Paycoinect", "Manila Fashion Festival"].includes(p.name),
              )
              .map((p) => <ProjectCard key={p.name} project={p} />)}
          </div>
        </section>
        <section className="demos-section" id="demos" aria-labelledby="demos-title">
          <div className="section-heading">
            <div>
              <div className="eyebrow">INTERACTIVE DEMOS</div>
              <h2 id="demos-title">Websites built for <span>your industry.</span></h2>
            </div>
            <a className="secondary-button" href="/demos/">
              Browse all <Icon name="arrow" />
            </a>
          </div>
          <div className="demo-grid">
            {demos.map(d => (
              <a key={d.id} className={`demo-card demo-${d.id}`} href={d.path}>
                <span className="demo-card-industry">{d.industry}</span>
                <h3>{d.name}</h3>
                <p>{d.tagline}</p>
                <span className="demo-card-cta">Explore demo <span>↗</span></span>
              </a>
            ))}
          </div>
        </section>
        <section
          className="contact-strip"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="mini-character">
            <svg viewBox="-28 -50 56 65" aria-hidden="true">
              <Character />
            </svg>
          </div>
          <div>
            <h2 id="contact-title">Tell me about your project.</h2>
            <p>Share what you want to build and your timeline.</p>
            <a className="project-link contact-email" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
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
        className={`content-dialog${panel === "welcome" ? " welcome-dialog" : ""}`}
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
              {panel === "welcome" && (
                <div className="welcome-avatar">
                  <svg
                    viewBox="-35 -55 70 75"
                    role="img"
                    aria-label="Romeo’s pixel avatar"
                  >
                    <Character />
                  </svg>
                  <span className="eyebrow">FULL-STACK DEVELOPER</span>
                </div>
              )}
              <h2 id="panel-title">{titles[panel]}</h2>
              {panel === "welcome" && (
                <>
                  <p className="dialog-lead">
                    I build websites, mobile apps, and custom systems, and help
                    businesses shape their brand identity.
                  </p>
                  <p>
                    Explore my world to see my projects, discover my services,
                    and get to know the person behind the work.
                  </p>
                  <button className="primary-button" autoFocus onClick={close}>
                    Explore my world <Icon name="arrow" />
                  </button>
                  <a
                    className="welcome-services project-link"
                    href="#services"
                    onClick={() => {
                      if (soundAllowed.current) startMusic();
                      playClick();
                      dialog.current.close();
                      setPanel(null);
                      document.getElementById("services").focus({ preventScroll: true });
                    }}
                  >
                    View services & work
                  </a>
                </>
              )}
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
                          <a className="project-link" href={s.path}>
                            Read more about {s.title} →
                          </a>
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
                      ["branding", "Branding & identity"],
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
                      .filter((p) => filter === "all" || p.serviceIds.includes(filter))
                      .map((p) => (
                        <ProjectCard key={p.name} project={p} />
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
                          Use the sound button in the top bar to mute music and
                          popup sounds after closing this window. Music starts
                          when you enter from the welcome screen. Animation
                          respects your device’s reduced-motion preference. All
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
            {panel !== "welcome" && (
              <div className="dialog-footer">
                <span>✦ A LITTLE CURIOSITY GOES A LONG WAY.</span>
                <button onClick={close}>
                  Back to the island <span>↵</span>
                </button>
              </div>
            )}
          </>
        )}
      </dialog>
    </>
  );
}
