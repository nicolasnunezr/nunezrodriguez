import { expect, test, type Page } from "@playwright/test";

async function openAt(page: Page, isoDate: string) {
  await page.clock.setFixedTime(new Date(isoDate));
  await page.goto("/");
}

test("company total and role durations, LinkedIn style", async ({ page }) => {
  await openAt(page, "2026-10-17T12:00:00Z");
  const exp = page.locator("#experience");
  await expect(exp.locator(".total")).toHaveText("1 yr 8 mo");
  const roles = exp.locator(".role");
  await expect(roles).toHaveCount(2);
  await expect(roles.nth(0)).toContainText("Data Scientist");
  await expect(roles.nth(0)).toContainText("Jul 2026 – Present · 4 mo");
  await expect(roles.nth(1)).toContainText("Data & AI Intern");
  await expect(roles.nth(1)).toContainText("Mar 2025 – Jun 2026 · 1 yr 4 mo");
  await expect(exp.locator("details")).toHaveCount(0);
});

test("durations are recalculated in the browser", async ({ page }) => {
  await openAt(page, "2027-01-01T12:00:00Z");
  await expect(page.locator("#experience .total")).toHaveText("1 yr 11 mo");
  await expect(page.locator("#experience .role").nth(0)).toContainText("Jul 2026 – Present · 7 mo");
});

test("current role has a filled dot, past role a hollow one", async ({ page }) => {
  await openAt(page, "2026-10-17T12:00:00Z");
  const dot = (i: number) =>
    page
      .locator("#experience .role")
      .nth(i)
      .evaluate((el) => getComputedStyle(el, "::before").backgroundColor);
  expect(await dot(0)).toBe("rgb(20, 20, 19)");
  expect(await dot(1)).not.toBe("rgb(20, 20, 19)");
});

test("education lists Richmond first, then UC3M", async ({ page }) => {
  await openAt(page, "2026-10-17T12:00:00Z");
  const items = page.locator("#education .org");
  await expect(items).toHaveCount(2);
  await expect(items.nth(0)).toContainText("University of Richmond");
  await expect(items.nth(0)).toContainText("Dean's List");
  await expect(items.nth(0)).toContainText("Exchange year · Computer Science and Business");
  await expect(items.nth(0)).toContainText("Aug 2025 – May 2026");
  await expect(items.nth(0)).toContainText("Virginia, USA");
  await expect(items.nth(1)).toContainText("BSc Computer Science and Engineering");
  await expect(items.nth(1)).toContainText("2022 – 2026");
  await expect(items.nth(1)).toContainText("Madrid, Spain");
  await expect(page.locator("#education details")).toHaveCount(0);
});

test("UC3M uses its short name on phones and full name on larger screens", async ({ page }) => {
  await openAt(page, "2026-10-17T12:00:00Z");
  const name = page.locator("#education .org").nth(1).locator(".t:visible");
  const phone = page.viewportSize()!.width <= 640;
  await expect(name).toHaveText(phone ? "UC3M" : "Universidad Carlos III de Madrid");
});
