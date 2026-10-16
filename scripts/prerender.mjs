import { readFile, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

const server = await createServer({
  server: { middlewareMode: true, watch: null, ws: false },
  appType: "custom",
});
try {
  const { default: App } = await server.ssrLoadModule("/src/App.jsx");
  const html = await readFile("dist/index.html", "utf8");
  const placeholder = '<div id="root"></div>';
  assert(html.includes(placeholder), "Built HTML must contain an empty React root");
  const content = renderToString(createElement(App));
  await writeFile("dist/index.html", html.replace(placeholder, () => `<div id="root">${content}</div>`));
  console.log("Prerendered portfolio content into dist/index.html");
} finally {
  await server.close();
}
