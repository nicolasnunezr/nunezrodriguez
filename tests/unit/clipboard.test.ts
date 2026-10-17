import { expect, test } from "vitest";
import { copyText, shareUrl } from "../../src/lib/clipboard";

const okClipboard = { clipboard: { writeText: async () => {} } } as unknown as Pick<Navigator, "clipboard">;
const badClipboard = { clipboard: { writeText: async () => Promise.reject(new Error("denied")) } } as unknown as Pick<Navigator, "clipboard">;

test("copyText reports success when the clipboard accepts", async () => {
  expect(await copyText("a", okClipboard)).toBe(true);
});

test("copyText reports failure without throwing", async () => {
  expect(await copyText("a", {} as Pick<Navigator, "clipboard">)).toBe(false);
  expect(await copyText("a", badClipboard)).toBe(false);
});

test("shareUrl uses the native share sheet when available", async () => {
  expect(await shareUrl("u", "t", { share: async () => {} })).toBe("shared");
});

test("shareUrl treats a dismissed share sheet as cancelled", async () => {
  const share = async () => Promise.reject(new DOMException("", "AbortError"));
  expect(await shareUrl("u", "t", { share })).toBe("cancelled");
});

test("shareUrl falls back to copying, then to failed", async () => {
  expect(await shareUrl("u", "t", okClipboard)).toBe("copied");
  expect(await shareUrl("u", "t", {})).toBe("failed");
});
