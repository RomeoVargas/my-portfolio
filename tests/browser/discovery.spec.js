import { test, expect } from "@playwright/test";
import { EMAIL, services } from "../../src/data.js";

test("clients can read services, work and contact without JavaScript", async ({ browser, request }) => {
  const response = await request.get("/");
  expect(await response.text()).toContain("Responsive websites that tell your story");
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5174/");
  for (const service of services) {
    await expect(page.locator("#services")).toContainText(service.description);
  }
  await expect(page.locator("#work").getByRole("heading", { name: "Paycoinect Nexus", exact: true })).toBeVisible();
  await expect(page.locator("#work").getByRole("link", { name: /Visit Paycoinect Nexus website/ })).toHaveAttribute("href", "https://nexus.paycoinect.com/");
  await expect(page.locator("#contact").getByRole("link", { name: EMAIL, exact: true })).toHaveAttribute("href", `mailto:${EMAIL}`);
  await context.close();
});

test("welcome offers direct access to services and hydrated projects still open", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("link", { name: "View services & work" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page).toHaveURL(/#services$/);
  await expect(page.locator("#services")).toBeFocused();
  await expect(page.locator(".game-shell")).toHaveClass(/still/);
  await page.getByRole("button", { name: "View all projects" }).click();
  await expect(page.getByRole("dialog").locator(".project-card")).toHaveCount(9);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "View all projects" })).toBeFocused();
  expect(errors).toEqual([]);
});
