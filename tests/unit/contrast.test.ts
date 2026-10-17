import { readFileSync } from "node:fs";
import { expect, test } from "vitest";

const css = readFileSync(new URL("../../src/styles/global.css", import.meta.url), "utf8");
const root = css.match(/:root\s*{([^}]*)}/)?.[1] ?? "";
const tokens = Object.fromEntries(
  [...root.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]),
);

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test("informational greys meet WCAG AA on --bg", () => {
  expect(contrast(tokens["--faint"], tokens["--bg"])).toBeGreaterThanOrEqual(4.5);
  expect(contrast(tokens["--mute"], tokens["--bg"])).toBeGreaterThanOrEqual(4.5);
  expect(contrast(tokens["--ink"], tokens["--bg"])).toBeGreaterThanOrEqual(7);
});

test("amber labels meet WCAG AA on their own background and on --bg", () => {
  expect(contrast(tokens["--amber"], tokens["--amber-bg"])).toBeGreaterThanOrEqual(4.5);
  expect(contrast(tokens["--amber"], tokens["--bg"])).toBeGreaterThanOrEqual(4.5);
});

test("only the latin subset of each font is loaded", () => {
  const imports = [...css.matchAll(/@import\s+"([^"]+)"/g)].map((m) => m[1]);
  expect(imports.length).toBeGreaterThan(0);
  for (const path of imports) expect(path).toMatch(/\/latin-[\w-]+\.css$/);
});
