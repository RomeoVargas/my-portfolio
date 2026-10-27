import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import ServicePage from "./ServicePage.jsx";
import { services } from "./data.js";
import "./styles.css";
import "./cursor.css";

const root = document.getElementById("root");
const path = window.location.pathname.replace(/\/?$/, "/");
const service = services.find(s => s.path === path);
// The production build supplies these tags; also keep the Vite preview in development accurate.
if (service) {
  document.title = service.pageTitle;
  document.querySelector('meta[name="description"]').content = service.summary;
  document.querySelector('meta[property="og:title"]').content = service.pageTitle;
  document.querySelector('meta[property="og:description"]').content = service.summary;
  const url = `https://my-portfolio.romeovillegasvargas.workers.dev${service.path}`;
  document.querySelector('link[rel="canonical"]').href = url;
  document.querySelector('meta[property="og:url"]').content = url;
}
const app = (
  <React.StrictMode>
    {service ? <ServicePage service={service} /> : <App />}
  </React.StrictMode>
);
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
