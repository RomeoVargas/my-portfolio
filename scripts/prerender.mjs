import { readFile, writeFile, mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";
import { services } from "../src/data.js";

const escapeHtml = value => value.replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);

const server = await createServer({
  server: { middlewareMode: true, watch: null, ws: false },
  appType: "custom",
});
try {
  const { default: App } = await server.ssrLoadModule("/src/App.jsx");
  const { default: ServicePage } = await server.ssrLoadModule("/src/ServicePage.jsx");
  const html = await readFile("dist/index.html", "utf8");
  const placeholder = '<div id="root"></div>';
  assert(html.includes(placeholder), "Built HTML must contain an empty React root");
  const content = renderToString(createElement(App));
  await writeFile("dist/index.html", html.replace(placeholder, () => `<div id="root">${content}</div>`));
  for (const service of services) {
    const url = `https://my-portfolio.romeovillegasvargas.workers.dev${service.path}`;
    let page = html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(service.pageTitle)}</title>`);
    for (const [attribute, name, value] of [
      ["name", "description", service.summary],
      ["property", "og:title", service.pageTitle],
      ["property", "og:description", service.summary],
      ["property", "og:url", url],
    ]) {
      const tag = new RegExp(`<meta\\s+${attribute}="${name}"\\s+content="[^"]*"\\s*\\/?>`);
      assert(tag.test(page), `Missing ${name} metadata in built HTML`);
      page = page.replace(tag, () => `<meta ${attribute}="${name}" content="${escapeHtml(value)}" />`);
    }
    page = page.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, () => `<link rel="canonical" href="${url}" />`);
    const markup = renderToString(createElement(ServicePage, { service }));
    page = page.replace(placeholder, () => `<div id="root">${markup}</div>`);
    const directory = `dist${service.path}`;
    await mkdir(directory, { recursive: true });
    await writeFile(`${directory}index.html`, page);
  }
  console.log(`Prerendered homepage and ${services.length} service pages`);
} finally {
  await server.close();
}
