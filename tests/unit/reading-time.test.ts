import { expect, test } from "vitest";
import { readingTime } from "../../src/lib/reading-time";

test("rounds up at 230 words per minute", () => {
  expect(readingTime("word ".repeat(900))).toBe(4);
  expect(readingTime("word ".repeat(230))).toBe(1);
  expect(readingTime("word ".repeat(231))).toBe(2);
});

test("never goes below one minute", () => {
  expect(readingTime("")).toBe(1);
});
