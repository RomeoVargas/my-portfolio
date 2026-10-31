import { test, expect } from "@playwright/test";

test("homepage service discovery works on desktop and mobile without runtime errors", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("Romeo Vargas Jr.");
    await expect(page.locator("h1")).toContainText("full-stack developer");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const links = page.locator('#capabilities a[href^="/services/"]');
    await expect(links).toHaveCount(4);
    for (const link of await links.all()) await link.click({ trial: true });
  }
  await page.locator('a[href="/services/website-development/"]').click();
  await expect(page.locator("h1")).toHaveText("Website development for businesses");
  await page.locator(".service-breadcrumb").getByRole("link", { name: "Services", exact: true }).click();
  await expect(page).toHaveURL(/\/#capabilities$/);
  expect(errors).toEqual([]);
});

test("search landing pages remain readable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto("/");
    const paths = await page.locator('#capabilities a[href^="/services/"]').evaluateAll(links => links.map(link => link.getAttribute("href")));
    expect(paths).toHaveLength(4);
    for (const path of paths) {
      const response = await page.goto(path);
      expect(response.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator(".service-intro")).toBeVisible();
    }
  } finally {
    await context.close();
  }
});
