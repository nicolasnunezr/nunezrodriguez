import { expect, test } from "@playwright/test";

const site = "https://nunezrodriguez.com";
const slug = "what-i-learned-building-an-ai-fact-checker";
const meta = (name: string) => `meta[property="${name}"], meta[name="${name}"]`;

test("home has share metadata", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(meta("og:image"))).toHaveAttribute("content", `${site}/og/home.png`);
  await expect(page.locator(meta("twitter:card"))).toHaveAttribute("content", "summary_large_image");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${site}/`);
  await expect(page.locator(meta("description"))).toHaveAttribute(
    "content",
    "Data Scientist at Securitize. Building AI for tokenized finance.",
  );
});

test("note has its own share metadata", async ({ page }) => {
  await page.goto(`/notes/${slug}/`);
  await expect(page.locator(meta("og:image"))).toHaveAttribute("content", `${site}/og/${slug}.png`);
  await expect(page.locator(meta("og:title"))).toHaveAttribute("content", "What I learned building an AI fact-checker");
});

test("share images are served as PNG", async ({ request }) => {
  for (const path of ["/og/home.png", `/og/${slug}.png`]) {
    const res = await request.get(path);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
  }
});

for (const [from, hash] of [
  ["/experience/", "#experience"],
  ["/education/", "#education"],
  ["/projects/", "#projects"],
  ["/articles/", "#notes"],
]) {
  test(`old ${from} redirects to ${hash}`, async ({ page }) => {
    await page.goto(from);
    await expect(page).toHaveURL(new RegExp(`/${hash}$`));
  });
}
