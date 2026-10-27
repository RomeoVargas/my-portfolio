import React, { Suspense, lazy } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import ServicePage from "./ServicePage.jsx";
import { services } from "./data.js";
import { demos } from "./demos.js";
import "./styles.css";
import "./cursor.css";

const DemoGallery = lazy(() => import("./demos/DemoGallery.jsx"));
const demoComponents = {
  "auto-dealership": lazy(() => import("./demos/AutoDealership.jsx")),
  "restaurant": lazy(() => import("./demos/Restaurant.jsx")),
  "real-estate": lazy(() => import("./demos/RealEstate.jsx")),
  "fitness-gym": lazy(() => import("./demos/FitnessGym.jsx")),
  "beauty-salon": lazy(() => import("./demos/BeautySalon.jsx")),
};

const root = document.getElementById("root");
const path = window.location.pathname.replace(/\/?$/, "/");
const service = services.find(s => s.path === path);
const demo = demos.find(d => d.path === path);
const isDemoGallery = path === "/demos/";

if (service) {
  document.title = service.pageTitle;
  document.querySelector('meta[name="description"]').content = service.summary;
  document.querySelector('meta[property="og:title"]').content = service.pageTitle;
  document.querySelector('meta[property="og:description"]').content = service.summary;
  const url = `https://my-portfolio.romeovillegasvargas.workers.dev${service.path}`;
  document.querySelector('link[rel="canonical"]').href = url;
  document.querySelector('meta[property="og:url"]').content = url;
} else if (demo) {
  document.title = demo.pageTitle;
  document.querySelector('meta[name="description"]').content = demo.summary;
} else if (isDemoGallery) {
  document.title = "Interactive Demo Websites | Romeo Vargas Jr.";
  document.querySelector('meta[name="description"]').content = "Explore interactive demo websites for different industries, built by Romeo Vargas Jr.";
}

let page;
if (service) {
  page = <ServicePage service={service} />;
} else if (isDemoGallery) {
  page = <Suspense fallback={null}><DemoGallery /></Suspense>;
} else if (demo) {
  const DemoComponent = demoComponents[demo.id];
  page = <Suspense fallback={null}><DemoComponent /></Suspense>;
} else {
  page = <App />;
}

const app = <React.StrictMode>{page}</React.StrictMode>;
const canHydrate = root.hasChildNodes() && !demo && !isDemoGallery;
if (canHydrate) hydrateRoot(root, app);
else createRoot(root).render(app);
