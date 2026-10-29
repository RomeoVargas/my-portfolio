import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { services } from "../src/data.js";

test("production build preserves the static homepage and prerenders service pages", async () => {
  const source = await readFile("index.html", "utf8");
  const homepage = await readFile("dist/index.html", "utf8");
  assert.equal(homepage.match(/<title>(.*?)<\/title>/s)?.[1], source.match(/<title>(.*?)<\/title>/s)?.[1]);
  assert(!homepage.includes('<div id="root">'));
  for (const service of services) {
    const html = await readFile(`dist${service.path}index.html`, "utf8");
    assert(html.includes(service.heading.replaceAll("&", "&amp;")));
    assert(html.includes(`href="https://my-portfolio.romeovillegasvargas.workers.dev${service.path}"`));
    assert(!html.includes('<div id="root"></div>'));
    assert(!html.includes('/src/main.jsx'));
    const script = html.match(/<script[^>]+src="([^"]+)"/);
    assert(script, "Service pages need a bundled hydration script");
    await readFile(`dist${script[1]}`);
  }
});
