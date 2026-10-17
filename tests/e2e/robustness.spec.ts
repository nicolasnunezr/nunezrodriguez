import { expect, test, type Page } from "@playwright/test";

const note = "/notes/what-i-learned-building-an-ai-fact-checker/";
const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const longWord = "Supercalifragilisticexpialidociousness-and-more";

test("a very long word in a note title does not cause horizontal scroll", async ({ page }) => {
  await page.goto(note);
  await page.locator("h1").evaluate((el, w) => (el.textContent = w), longWord);
  expect(await overflow(page)).toBeLessThanOrEqual(0);
});

test("a URL as a project title does not cause horizontal scroll", async ({ page }) => {
  await page.goto("/");
  await page
    .locator("#projects .tt")
    .first()
    .evaluate((el) => (el.textContent = "https://example.com/averyveryverylongprojecturlwithoutanyspacesorhyphens"));
  expect(await overflow(page)).toBeLessThanOrEqual(0);
});

test("touch screens get 44px tap targets", async ({ page }) => {
  await page.goto("/");
  test.skip(!(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)), "only on touch screens");
  for (const sel of ["button.copy", "#notes .nrow", "#projects summary"]) {
    expect((await page.locator(sel).first().boundingBox())!.height, sel).toBeGreaterThanOrEqual(44);
  }
  await page.goto(note);
  expect((await page.locator("button.share").boundingBox())!.height).toBeGreaterThanOrEqual(44);
});
