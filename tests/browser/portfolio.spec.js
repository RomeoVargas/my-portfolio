import { test, expect } from "@playwright/test";

test("portfolio destinations, filters, keyboard movement and modal focus", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.goto("/");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Explore my world", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Real impact.",
  );
  await page.screenshot({ path: "test-results/desktop.png", fullPage: true });
  await page
    .getByRole("button", { name: "Explore my world", exact: true })
    .click();
  const game = page.getByRole("region", { name: /Interactive island/ });
  await expect(game).toBeFocused();
  const before = await page.locator(".player-label").getAttribute("style");
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(400);
  await page.keyboard.up("ArrowRight");
  expect(await page.locator(".player-label").getAttribute("style")).not.toBe(
    before,
  );
  await page
    .getByRole("button", { name: "Explore Project lab: my work" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Pacific Wireless", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("dialog").locator(".project-card h3").first()).toHaveText(
    "Paycoinect Nexus",
  );
  await expect(page.getByRole("dialog").locator(".project-card h3").nth(1)).toHaveText(
    "Paycoinect",
  );
  await expect(page.getByRole("dialog").locator(".project-card")).toHaveCount(9);
  await expect(
    page.getByRole("heading", { name: "Foodefy", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Brightest Skin", exact: true }),
  ).toHaveCount(0);
  const destinations = {
    "Paycoinect Nexus": "https://nexus.paycoinect.com/",
    Paycoinect: "https://paycoinect.com/",
    "Pacific Wireless": "https://pacificwireless.com.ph/",
    "Manila Fashion Festival": "https://mff-official.com/",
    "Orthero Doctor’s Directory": "https://providers.orthero.ph/",
    "Orthero Academy": "https://ortheroacademy.com/",
    "New Life Church": "https://newlife.ph/",
    "MBS Alert": "https://staging-bsarescue.hexacodetech.com/",
    "Paycoinect Business": "https://biz.paycoinect.com/",
  };
  for (const [name, url] of Object.entries(destinations)) {
    const link = page.getByRole("dialog").getByRole("link", {
      name: `Visit ${name} website (opens in a new tab)`,
      exact: true,
    });
    await expect(link).toHaveAttribute("href", url);
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
  await page.getByRole("button", { name: "Mobile apps", exact: true }).click();
  await expect(page.getByRole("dialog").locator(".project-card")).toHaveCount(2);
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: "Paycoinect", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("dialog").locator(".project-card img")).toBeVisible();
  await page.getByRole("button", { name: "Websites", exact: true }).click();
  await expect(page.getByRole("dialog").locator(".project-card")).toHaveCount(9);
  await expect(
    page.getByRole("heading", { name: "Pacific Wireless", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Branding & identity", exact: true }).click();
  await expect(page.getByRole("dialog").locator(".project-card")).toHaveCount(5);
  await page.getByRole("button", { name: "Custom systems", exact: true }).click();
  await expect(page.getByRole("dialog").locator(".project-card")).toHaveCount(5);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Explore Project lab: my work" }),
  ).toBeFocused();
  for (const name of [
    "Explore The studio: services",
    "Explore Base camp: about me",
    "Explore Say hello: contact",
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Close dialog" }).click();
  }
  await page.getByRole("button", { name: "Explore The studio: services", exact: true }).click();
  await expect(
    page.getByRole("dialog").getByRole("link", { name: /Read more about Branding & identity/ }),
  ).toHaveAttribute("href", "/services/branding-identity/");
  await page.getByRole("button", { name: "Discuss your project" }).click();
  await expect(page.getByRole("link", { name: "Open email" })).toHaveAttribute(
    "href",
    /^mailto:romeovillegasvargas@gmail.com/,
  );
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Mute sound" }).click();
  await page.getByRole("button", { name: "Enable sound" }).click();
  await expect(
    page.getByRole("button", { name: "Mute sound" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(errors).toEqual([]);
});

test("phone layout, touch controls, reduced motion and email fallback", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Explore my world", exact: true })
    .click();
  await expect(page.locator(".game-shell")).toHaveClass(/still/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
  const before = await page.locator(".player-label").getAttribute("style");
  const right = page.getByRole("button", { name: "Move right", exact: true });
  await right.scrollIntoViewIfNeeded();
  await right.dispatchEvent("pointerdown", { pointerId: 1 });
  await page.waitForTimeout(300);
  await right.dispatchEvent("pointerup", { pointerId: 1 });
  expect(await page.locator(".player-label").getAttribute("style")).not.toBe(
    before,
  );
  await page.getByRole("button", { name: "Let’s talk", exact: false }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("denied")) },
      configurable: true,
    }),
  );
  await page.getByRole("button", { name: "Copy email", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Select the email above to copy" }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/mobile-contact.png",
    fullPage: true,
  });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("all five stars can be collected by walking and small screens do not overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.addInitScript(() => {
    window.starNotes = [];
    const start = OscillatorNode.prototype.start;
    OscillatorNode.prototype.start = function (...args) {
      window.starNotes.push(this.frequency.value);
      return start.apply(this, args);
    };
  });
  await page.goto("/");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Explore my world", exact: true })
    .click();
  const map = page.locator(".game-map");
  await map.scrollIntoViewIfNeeded();
  const box = await map.boundingBox();
  let count = 0;
  for (const [x, y] of [
    [375, 454],
    [614, 414],
    [555, 327],
    [340, 285],
    [131, 339],
  ]) {
    await page.mouse.click(
      box.x + (x / 900) * box.width,
      box.y + (y / 600) * box.height,
    );
    await expect(page.locator(".stars-counter b")).toHaveText(String(++count), {
      timeout: 5000,
    });
    if (count === 1)
      await page
        .getByRole("button", { name: "Mute sound", exact: true })
        .click();
    if (count === 2) {
      expect(await page.evaluate(() => window.starNotes.length)).toBe(3);
      await page
        .getByRole("button", { name: "Enable sound", exact: true })
        .click();
    }
  }
  const notes = await page.evaluate(() => window.starNotes);
  expect(notes).toHaveLength(12);
  expect(notes.slice(0, 3).map(Math.round)).toEqual([523, 659, 784]);
  await expect(page.locator(".game-hint")).toContainText("All stars found");
  await page.setViewportSize({ width: 320, height: 700 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("readable typography on desktop and phone, including enlarged text", async ({
  page,
}) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Explore my world", exact: true })
      .click();
    const smallText = await page
      .locator("body *")
      .evaluateAll((elements) =>
        elements
          .filter(
            (el) =>
              el.getClientRects().length &&
              !el.closest("svg,.sr-only") &&
              [...el.childNodes].some(
                (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
              ) &&
              parseFloat(getComputedStyle(el).fontSize) < 16,
          )
          .map((el) => `${el.className}: ${getComputedStyle(el).fontSize}`),
      );
    expect(smallText).toEqual([]);
    expect(
      await page
        .locator(".intro-description")
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
    ).toBeGreaterThanOrEqual(18);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "My work", exact: true }).click();
    expect(
      await page
        .locator(".project-copy p")
        .first()
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
    ).toBeGreaterThanOrEqual(18);
    await page.keyboard.press("Escape");
  }
  await page.setViewportSize({ width: 640, height: 900 });
  await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "My work", exact: true }).click();
  expect(
    await page
      .getByRole("dialog")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  await expect(
    page.getByRole("button", { name: "Close dialog" }),
  ).toBeVisible();
});

test("popup sound plays when opening a dialog and the game cursor has a motion fallback", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Explore my world", exact: true })
    .click();
  const click = page.locator('audio[data-audio="click"]');
  await expect(click).toHaveAttribute("src", "/audio/click.mp3");
  await page.getByRole("button", { name: "My work", exact: true }).click();
  await expect
    .poll(() => click.evaluate((el) => el.currentTime))
    .toBeGreaterThan(0);
  await page.keyboard.press("Escape");
  expect(
    await page
      .locator(".game-map")
      .evaluate((el) => getComputedStyle(el).cursor),
  ).toContain("/cursors/ro-");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".game-shell")).toHaveClass(/still/);
  expect(
    await page
      .locator(".game-map")
      .evaluate((el) => getComputedStyle(el).cursor),
  ).toContain("/cursors/ro-0.cur");
  await page.setViewportSize({ width: 320, height: 700 });
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("button", { name: "Mute sound", exact: true }),
  ).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("music failure keeps the toggle honest and permits retry", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    window.failMusic = true;
    HTMLMediaElement.prototype.play = function () {
      if (this.dataset.audio === "music" && window.failMusic)
        return Promise.reject(
          new DOMException("Unavailable", "NotSupportedError"),
        );
      return play.call(this);
    };
  });
  await page.goto("/");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Explore my world", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Enable sound", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await expect(
    page.getByRole("status").filter({ hasText: "Music couldn’t play" }),
  ).toBeVisible();
  await page.evaluate(() => (window.failMusic = false));
  await page.getByRole("button", { name: "Enable sound", exact: true }).click();
  await expect
    .poll(() =>
      page
        .locator('audio[data-audio="music"]')
        .evaluate((el) => el.currentTime),
    )
    .toBeGreaterThan(0);
});

test("search metadata and discovery files use the deployed portfolio URL", async ({
  page,
  request,
}) => {
  const url = "https://my-portfolio.romeovillegasvargas.workers.dev/";
  await page.goto("/");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Explore my world", exact: true })
    .click();
  await expect(page).toHaveTitle(
    "Romeo Vargas Jr. | Full-Stack Developer in the Philippines",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    url,
  );
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain(`Sitemap: ${url}sitemap.xml`);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain(`<loc>${url}</loc>`);
});
