import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("banner is a decorative 5:1 picture with modern formats", async ({ page }) => {
  const picture = page.locator(".banner picture");
  await expect(picture.locator('source[type="image/avif"]')).toHaveCount(1);
  await expect(picture.locator('source[type="image/webp"]')).toHaveCount(1);
  const img = picture.locator("img");
  await expect(img).toHaveAttribute("alt", "");
  const box = await img.boundingBox();
  expect(box!.width / box!.height).toBeGreaterThan(4.9);
  expect(box!.width / box!.height).toBeLessThan(5.1);
});

test("name, two-tone lede and links", async ({ page }) => {
  await expect(page.locator("h1")).toHaveText("Nicolás Núñez Rodríguez");
  await expect(page.locator(".lede")).toHaveText(
    "Data Scientist at Securitize. Building AI and data systems for tokenized finance.",
  );
  await expect(page.getByRole("link", { name: "X", exact: true })).toHaveAttribute("href", "https://x.com/nicolasnunezr");
  await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/nicolas-nunez-rodriguez/",
  );
  await expect(page.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/nicolasnunezr");
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
});

test("copy button copies the address and confirms", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const button = page.locator("button.copy");
  await expect(button).toContainText("nicolas@nunezrodriguez.com");
  await button.click();
  await expect(button).toContainText("Copied ✓");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("nicolas@nunezrodriguez.com");
});

test("copy button is tall enough to tap on phones", async ({ page }) => {
  test.skip(page.viewportSize()!.width > 640, "touch target rule applies to phones");
  const box = await page.locator("button.copy").boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(44);
});

test("footer shows the year and domain", async ({ page }) => {
  await expect(page.locator("footer")).toContainText(`© ${new Date().getFullYear()}`);
  await expect(page.locator("footer")).toContainText("nunezrodriguez.com");
});

test.describe("on a 2x screen", () => {
  test.use({ deviceScaleFactor: 2 });

  test("banner loads a version at least 1280px wide", async ({ page }) => {
    test.skip(page.viewportSize()!.width < 1000, "checked on desktop");
    const img = page.locator(".banner img");
    await expect(img).toHaveJSProperty("complete", true);
    // naturalWidth is density-corrected, so read the width descriptor of the file actually loaded
    const loadedWidth = await img.evaluate((el: HTMLImageElement) => {
      const file = new URL(el.currentSrc).pathname;
      const srcsets = [...el.parentElement!.querySelectorAll("source")].map((s) => s.srcset).join(",");
      const entry = srcsets.split(",").map((c) => c.trim().split(" ")).find(([url]) => url === file);
      return Number(entry?.[1]?.replace("w", "") ?? 0);
    });
    expect(loadedWidth).toBeGreaterThanOrEqual(1280);
  });
});
