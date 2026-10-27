import { test, expect } from "@playwright/test";

const examples = {
  "/services/branding-identity/": ["Paycoinect Nexus", "Paycoinect", "MBS Alert", "Paycoinect Business", "Manila Fashion Festival"],
  "/services/website-development/": ["Paycoinect Nexus", "Paycoinect", "MBS Alert", "Paycoinect Business", "Pacific Wireless", "Manila Fashion Festival", "Orthero Doctor’s Directory", "Orthero Academy", "New Life Church"],
  "/services/custom-systems/": ["Paycoinect Nexus", "Paycoinect", "MBS Alert", "Paycoinect Business", "Pacific Wireless"],
  "/services/mobile-app-development/": ["Paycoinect", "MBS Alert"],
};

test("each service has an indexable page with the owner's exact project assignments", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const titles = new Set();
  for (const [path, names] of Object.entries(examples)) {
    const response = await page.goto(`http://127.0.0.1:5174${path}`);
    expect(response.status()).toBe(200);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator(".project-card h3")).toHaveText(names);
    await expect(page.getByRole("heading", { name: "What I can help you build" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Discuss your project", exact: true })).toHaveAttribute("href", /^mailto:romeovillegasvargas@gmail.com/);
    const canonical = `https://my-portfolio.romeovillegasvargas.workers.dev${path}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonical);
    expect(sitemap).toContain(`<loc>${canonical}</loc>`);
    titles.add(await page.title());
  }
  expect(titles.size).toBe(4);
  await context.close();
});

test("read more navigation, reload, back and mobile layout work", async ({ page }) => {
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("link", { name: "View services & work" }).click();
  await page.getByRole("link", { name: "Read more about Branding & identity" }).click();
  await expect(page).toHaveURL(/\/services\/branding-identity\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Branding & identity for your business");
  await page.reload();
  await expect(page.locator(".project-card")).toHaveCount(5);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.evaluate(() => document.documentElement.style.fontSize = "200%");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goBack();
  await expect(page).toHaveURL(/\/#services$/);
  expect(errors).toEqual([]);
});
