import React from "react";

export default function ProjectCard({ project: p, serviceId }) {
  return (
    <article className="project-card">
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
        {serviceId && (
          <p className="project-contribution"><strong>My contribution</strong>{p.contributions[serviceId]}</p>
        )}
        <div className="tags">
          {p.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <a
          className="project-link"
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${p.name} website (opens in a new tab)`}
        >
          {p.preview ? "View staging website" : "Visit website"} <span aria-hidden="true">↗</span>
        </a>
        {p.overviewUrl && (
          <a className="project-link project-overview" href={p.overviewUrl} target="_blank" rel="noopener noreferrer">
            Read the business overview <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}
