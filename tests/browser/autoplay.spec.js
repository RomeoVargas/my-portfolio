import { test, expect } from "@playwright/test";
test("welcome starts music and remains controllable from the sticky header", async ({
  page,
}) => {
  await page.goto("/");
  const welcome = page.getByRole("dialog");
  await expect(
    welcome.getByRole("img", { name: "Romeo’s pixel avatar" }),
  ).toBeVisible();
  await expect(
    welcome.getByRole("button", { name: "Explore my world", exact: true }),
  ).toBeFocused();
  await page.screenshot({ path: "test-results/welcome-desktop.png" });
  const track = page.locator('audio[data-audio="music"]');
  expect(await track.evaluate((el) => el.paused)).toBe(true);
  await welcome
    .getByRole("button", { name: "Explore my world", exact: true })
    .click();
  await expect(welcome).not.toBeVisible();
  await expect
    .poll(() => track.evaluate((el) => el.currentTime))
    .toBeGreaterThan(0);
  await page.locator("footer").scrollIntoViewIfNeeded();
  const mute = page.getByRole("button", { name: "Mute sound", exact: true });
  expect((await mute.boundingBox()).y).toBeLessThan(150);
  await expect(mute).toHaveText("");
  await mute.click();
  expect(await track.evaluate((el) => el.paused)).toBe(true);
  await page.getByRole("button", { name: "My work", exact: true }).click();
  await expect(page.getByRole("dialog").locator(".sound-toggle")).toHaveCount(
    0,
  );
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Enable sound", exact: true }).click();
  await expect.poll(() => track.evaluate((el) => el.paused)).toBe(false);
});

test("only opening and closing popups plays the effect", async ({ page }) => {
  await page.addInitScript(() => {
    window.popupSounds = 0;
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (this.dataset.audio === "click") window.popupSounds++;
      return play.call(this);
    };
  });
  await page.goto("/");
  expect(await page.evaluate(() => window.popupSounds)).toBe(0);
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Explore my world", exact: true })
    .click();
  expect(await page.evaluate(() => window.popupSounds)).toBe(1);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Services", exact: true })
    .click();
  expect(await page.evaluate(() => window.popupSounds)).toBe(1);
  await page.getByRole("button", { name: "My work", exact: true }).click();
  expect(await page.evaluate(() => window.popupSounds)).toBe(2);
  await page.getByRole("button", { name: "Websites", exact: true }).click();
  expect(await page.evaluate(() => window.popupSounds)).toBe(2);
  await page.keyboard.press("Escape");
  expect(await page.evaluate(() => window.popupSounds)).toBe(3);
  await page.getByRole("button", { name: "Mute sound", exact: true }).click();
  await page.getByRole("button", { name: "My work", exact: true }).click();
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  expect(await page.evaluate(() => window.popupSounds)).toBe(3);
});

test("welcome fits a phone and header mute stays enabled across popups", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  const welcome = page.getByRole("dialog");
  expect(await welcome.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
    true,
  );
  await page.screenshot({ path: "test-results/welcome-mobile.png" });
  await expect(welcome.locator(".sound-toggle")).toHaveCount(0);
  await welcome
    .getByRole("button", { name: "Explore my world", exact: true })
    .click();
  await page.getByRole("button", { name: "Mute sound", exact: true }).click();
  expect(
    await page.locator('audio[data-audio="music"]').evaluate((el) => el.paused),
  ).toBe(true);
  await page.getByRole("button", { name: "My work", exact: true }).click();
  expect(
    await page.locator('audio[data-audio="click"]').evaluate((el) => el.paused),
  ).toBe(true);
});
