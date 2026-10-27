import React from "react";

export default function DemoShell({ industry, children }) {
  return (
    <>
      <div className="demo-banner-bar">
        <div className="demo-banner-inner">
          <span className="demo-badge">DEMO</span>
          <span>Sample <strong>{industry.toLowerCase()}</strong> website &mdash; built by Romeo Vargas Jr.</span>
          <nav>
            <a href="/demos/">All demos</a>
            <a href="/">Portfolio</a>
          </nav>
        </div>
      </div>
      {children}
    </>
  );
}
