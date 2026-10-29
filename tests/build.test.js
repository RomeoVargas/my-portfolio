import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { services } from "../src/data.js";

const origin = "https://my-portfolio.romeovillegasvargas.workers.dev";

test("search landing pages have canonical metadata and crawlable service links", async () => {
  const home = await readFile("dist/index.html", "utf8");
  assert(home.includes(`<link rel="canonical" href="${origin}/"`));
  assert(!home.includes("your-domain.example"));
  assert.match(home, /<h1[^>]*>[^<]*full-stack developer/i);
  assert(home.includes('name="google-site-verification"'));
  const person = JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(person["@type"], "Person");
  assert.equal(person.url, `${origin}/`);
  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  for (const service of services) {
    assert(home.includes(`href="${service.path}"`));
    assert(sitemap.includes(`<loc>${origin}${service.path}</loc>`));
    const html = await readFile(`dist${service.path}index.html`, "utf8");
    assert(html.includes('href="/#capabilities"'));
    assert(!html.includes('href="/#services"'));
    assert(!html.includes('content="noindex'));
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.equal(schema["@type"], "Service");
    assert.equal(schema.url, `${origin}${service.path}`);
  }
});

test("fictional demos are excluded from search and legacy portfolios redirect", async () => {
  for (const slug of ["auto-dealership", "restaurant", "real-estate", "fitness-gym", "beauty-salon"]) {
    const html = await readFile(`dist/demos/${slug}/index.html`, "utf8");
    assert(html.includes('<meta name="robots" content="noindex, follow">'));
  }
  const redirects = await readFile("dist/_redirects", "utf8");
  assert.match(redirects, /^\/portfolio.html\s+\/\s+301$/m);
  assert.match(redirects, /^\/index.react.html\s+\/\s+301$/m);
});

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
