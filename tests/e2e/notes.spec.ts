import { expect, test } from "@playwright/test";

const slug = "what-i-learned-building-an-ai-fact-checker";
const title = "What I learned building an AI fact-checker";

test("home lists the note under its year", async ({ page }) => {
  await page.goto("/");
  const notes = page.locator("#notes");
  const row = notes.getByRole("link", { name: new RegExp(title) });
  await expect(row).toHaveAttribute("href", `/notes/${slug}/`);
  await expect(row).toContainText("Oct 17");
  await expect(notes.locator(".y:visible, .yr:visible").first()).toHaveText("2026");
});

test("note page layout", async ({ page }) => {
  await page.goto(`/notes/${slug}/`);
  await expect(page.getByRole("link", { name: "← Nicolás Núñez Rodríguez" })).toHaveAttribute("href", "/");
  await expect(page.locator("h1")).toHaveText(title);
  await expect(page.locator(".nmeta")).toHaveText("Oct 17, 2026 · 1 min read");
  await expect(page.locator(".nrowmeta button.share")).toHaveText("Share");
  expect(await page.locator(".prose").evaluate((el) => getComputedStyle(el).fontFamily)).toContain("Newsreader");
  await expect(page.getByRole("link", { name: "← All notes" })).toHaveAttribute("href", "/#notes");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("share falls back to copying the link", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.addInitScript(() => Object.defineProperty(navigator, "share", { value: undefined }));
  await page.goto(`/notes/${slug}/`);
  const button = page.locator("button.share");
  await button.click();
  await expect(button).toHaveText("Link copied ✓");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(page.url());
});

test("dismissing the share sheet changes nothing", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "share", {
      value: () => Promise.reject(new DOMException("dismissed", "AbortError")),
    }),
  );
  await page.goto(`/notes/${slug}/`);
  const button = page.locator("button.share");
  await button.click();
  await page.waitForTimeout(200);
  await expect(button).toHaveText("Share");
  expect(errors).toEqual([]);
});
