import { expect, test } from "@playwright/test";

const isPhone = (width: number) => width <= 640;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("two projects in order, both closed", async ({ page }) => {
  const rows = page.locator("#projects details.proj");
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0).locator("summary")).toContainText("Multi-agent system for verifying economic data");
  await expect(rows.nth(1).locator("summary")).toContainText("Mirrortrace");
  await expect(rows.nth(0)).not.toHaveAttribute("open");
  await expect(rows.nth(1)).not.toHaveAttribute("open");
});

test("tags show full or short labels by screen size", async ({ page }) => {
  const tags = page.locator("#projects .tag:visible");
  const phone = isPhone(page.viewportSize()!.width);
  await expect(tags.nth(0)).toHaveText(phone ? "Thesis" : "Thesis · 2026");
  await expect(tags.nth(1)).toHaveText(phone ? "Mac · Soon" : "Mac app · Soon");
});

test("opening the thesis shows the real system trace", async ({ page }) => {
  const thesis = page.locator("#projects details.proj").nth(0);
  await thesis.locator("summary").click();
  await expect(thesis).toHaveAttribute("open");
  const trace = thesis.locator(".trace");
  await expect(trace).toContainText("Spain borrowed more cheaply than France in 2025.");
  for (const step of ["Query agent", "Eurostat API", "Interpretation", "Verdict agent"]) {
    await expect(trace).toContainText(step);
  }
  await expect(trace.locator(".pill")).toHaveText("True");
  await expect(trace).toContainText("Spain 3.21%");
  await expect(trace).toContainText("France 3.35%");
  await expect(trace).toContainText("10-year yield, 2025 · Eurostat");
});

test("no links inside a project row", async ({ page }) => {
  await expect(page.locator("#projects summary a")).toHaveCount(0);
});

test("keyboard Enter opens a project", async ({ page }) => {
  const summary = page.locator("#projects details.proj").nth(1).locator("summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#projects details.proj").nth(1)).toHaveAttribute("open");
});

test("Mirrortrace has no link while it is coming soon", async ({ page }) => {
  await expect(page.locator('#projects a[href*="mirrortrace.co"]')).toHaveCount(0);
});

test("chevron never wraps onto its own line", async ({ page }) => {
  const summary = page.locator("#projects details.proj").nth(0).locator("summary");
  const [titleBox, chevBox] = await Promise.all([
    summary.locator(".tt").evaluate((el) => {
      const rects = el.getClientRects();
      const r = rects[rects.length - 1];
      return { top: r.top, bottom: r.bottom };
    }),
    summary.locator(".chev").boundingBox(),
  ]);
  const chevMiddle = chevBox!.y + chevBox!.height / 2;
  expect(chevMiddle).toBeGreaterThan(titleBox.top);
  expect(chevMiddle).toBeLessThan(titleBox.bottom);
});

test.describe("with reduced motion", () => {
  test.use({ colorScheme: "light", contextOptions: { reducedMotion: "reduce" } });

  test("Mirrortrace shows the new name without animating", async ({ page }) => {
    const row = page.locator("#projects details.proj").nth(1);
    await row.locator("summary").click();
    const newName = row.locator(".fname .new");
    await expect(newName).toBeVisible();
    await expect(newName).toHaveText("Cannot find 'User' in scope (Xcode).png");
    expect(await newName.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    await expect(row.locator(".fname .old")).toBeHidden();
  });
});
