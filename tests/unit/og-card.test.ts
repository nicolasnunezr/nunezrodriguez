import { expect, test } from "vitest";
import { renderOgCard } from "../../src/lib/og-card";

test("renders a 1200x630 PNG", async () => {
  const png = await renderOgCard({
    kicker: "NOTE · OCT 17, 2026",
    title: "What I learned building an AI fact-checker",
    byline: "Nicolás Núñez Rodríguez",
  });
  expect([...png.slice(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const view = new DataView(png.buffer, png.byteOffset);
  expect(view.getUint32(16)).toBe(1200);
  expect(view.getUint32(20)).toBe(630);
}, 20_000);

test("text stays inside the 72px margins", async () => {
  const { Resvg } = await import("@resvg/resvg-js");
  const { ogCardSvg } = await import("../../src/lib/og-card");
  const svg = await ogCardSvg({
    kicker: "NOTE · OCT 17, 2026",
    title: "What I learned building an AI fact-checker",
    byline: "Nicolás Núñez Rodríguez",
  });
  const { pixels, width, height } = new Resvg(svg).render();
  const isBackground = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    return pixels[i] === 0xfa && pixels[i + 1] === 0xf9 && pixels[i + 2] === 0xf6;
  };
  for (let y = height - 60; y < height; y++) for (let x = 0; x < width; x++) expect(isBackground(x, y)).toBe(true);
  for (let y = 0; y < height; y++) for (let x = width - 60; x < width; x++) expect(isBackground(x, y)).toBe(true);
}, 20_000);
