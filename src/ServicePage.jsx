import React from "react";
import { EMAIL, services, projects } from "./data.js";
import ProjectCard from "./ProjectCard.jsx";

export default function ServicePage({ service }) {
  const examples = projects.filter((p) => p.serviceIds.includes(service.id));
  const email = `mailto:${EMAIL}?subject=${encodeURIComponent(`Project inquiry: ${service.title}`)}`;

  return (
    <>
      <a className="skip-link" href="#service-content">Skip to service details</a>
      <header className="site-header service-page-header">
        <a className="brand" href="/" aria-label="Romeo’s World home">
          <span className="brand-mark">r<span>v</span><i /></span>
          <span>romeo’s<span className="brand-world">world<span className="brand-dot">.</span></span></span>
        </a>
        <nav aria-label="Service navigation">
          <a href="/#services">All services</a>
          <a href="#service-projects">Related work</a>
          <a href="#service-contact">Contact</a>
        </nav>
      </header>
      <main className={`service-page ${service.color}`} id="service-content">
        <nav className="service-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a><span aria-hidden="true">/</span>
          <a href="/#services">Services</a><span aria-hidden="true">/</span>
          <span aria-current="page">{service.title}</span>
        </nav>
        <section className="service-hero" aria-labelledby="service-heading">
          <div>
            <div className="eyebrow">ROMEO VARGAS JR. · PHILIPPINES</div>
            <h1 id="service-heading">{service.heading}</h1>
            <p className="service-intro">{service.detail}</p>
            <div className="service-actions">
              <a className="primary-button" href={email}>Discuss your project <span aria-hidden="true">↗</span></a>
              <a className="project-link" href="#service-projects">See related work ↓</a>
            </div>
          </div>
          <aside className="service-fit" aria-labelledby="fit-title">
            <span className="service-icon" aria-hidden="true">{service.icon}</span>
            <h2 id="fit-title">Is this what you need?</h2>
            <p>{service.fit}</p>
            <div className="tags">{service.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
          </aside>
        </section>
        <section className="service-scope" aria-labelledby="scope-title">
          <div className="section-heading">
            <div>
              <div className="eyebrow">SHAPED AROUND YOUR GOALS</div>
              <h2 id="scope-title">What I can help you build</h2>
            </div>
          </div>
          <ul className="service-deliverables">
            {service.deliverables.map(item => <li key={item}>{item}</li>)}
          </ul>
          <p className="service-scope-note">We’ll agree on the features, deliverables, and timeline for your project before development begins.</p>
        </section>
        <section className="service-examples" id="service-projects" aria-labelledby="examples-title">
          <div className="section-heading">
            <div>
              <div className="eyebrow">EXAMPLES FROM MY WORK</div>
              <h2 id="examples-title">{service.title} in practice</h2>
            </div>
            <p>{examples.length} related projects</p>
          </div>
          <div className="projects-grid">
            {examples.map(project => <ProjectCard key={project.name} project={project} serviceId={service.id} />)}
          </div>
        </section>
        <section className="service-process" aria-labelledby="process-title">
          <h2 id="process-title">How we get started</h2>
          <ol>
            <li><strong>Tell me about your business.</strong> Share the problem, who will use the result, and what you already have.</li>
            <li><strong>Define the scope together.</strong> We’ll identify the essential features, content, integrations, and deliverables.</li>
            <li><strong>Agree on the next steps.</strong> We’ll discuss the approach, timeline, and budget before work begins.</li>
          </ol>
        </section>
        <section className="contact-strip" id="service-contact" aria-labelledby="service-contact-title">
          <div>
            <h2 id="service-contact-title">Let’s talk about what you need.</h2>
            <p>Send your goals, timeline, and any examples you have in mind.</p>
            <a className="project-link contact-email" href={email}>{EMAIL}</a>
          </div>
        </section>
        <nav className="other-services" aria-label="Explore other services">
          {services.filter(s => s.id !== service.id).map(s => <a className="project-link" key={s.id} href={s.path}>{s.title} →</a>)}
        </nav>
      </main>
      <footer>
        <span>Romeo Vargas Jr. · Full-stack developer in the Philippines</span>
        <a className="project-link" href="/">Back to my world ↗</a>
      </footer>
    </>
  );
}
