import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

const require = createRequire(import.meta.url);
const font = (file: string) => readFile(require.resolve(file));

let fonts: Promise<Parameters<typeof satori>[1]["fonts"]> | undefined;
function loadFonts() {
  fonts ??= Promise.all([
    font("@fontsource/newsreader/files/newsreader-latin-400-normal.woff"),
    font("@fontsource/inter/files/inter-latin-400-normal.woff"),
    font("@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff"),
  ]).then(([serif, sans, mono]) => [
    { name: "Newsreader", data: serif, weight: 400, style: "normal" },
    { name: "Inter", data: sans, weight: 400, style: "normal" },
    { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
  ]);
  return fonts;
}

// Satori only wraps text inside a flex box with a known width, so every block gets both.
const el = (style: Record<string, unknown>, children: unknown) => ({
  type: "div",
  props: { style: { display: "flex", width: "100%", ...style }, children },
});

type OgInput = { kicker: string; title: string; byline: string };

export async function ogCardSvg(input: OgInput): Promise<string> {
  const card = el(
    {
      // padding is added outside width/height here: 1056 + 2×72 = 1200, 486 + 2×72 = 630
      width: 1056,
      height: 486,
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: 72,
      background: "#faf9f6",
    },
    [
      el({ fontFamily: "JetBrains Mono", fontSize: 22, letterSpacing: 2, color: "#a3a29c", marginBottom: 20 }, input.kicker),
      // one box per word, so lines only break between words and never at "fact-|checker"
      el(
        { fontFamily: "Newsreader", fontSize: 64, lineHeight: 1.12, color: "#141413", letterSpacing: -1, flexWrap: "wrap" },
        input.title.split(" ").map((word) => ({ type: "span", props: { style: { marginRight: 16 }, children: word } })),
      ),
      el({ fontFamily: "Inter", fontSize: 24, color: "#6f6e69", marginTop: 26 }, input.byline),
    ],
  );
  return satori(card as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts: await loadFonts() });
}

export async function renderOgCard(input: OgInput): Promise<Uint8Array> {
  return new Resvg(await ogCardSvg(input)).render().asPng();
}
