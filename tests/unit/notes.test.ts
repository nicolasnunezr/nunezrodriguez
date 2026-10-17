import { expect, test } from "vitest";
import { groupNotesByYear } from "../../src/lib/notes";

const note = (date: string) => ({ date: new Date(date) });

test("empty list gives no groups", () => {
  expect(groupNotesByYear([])).toEqual([]);
});

test("groups by UTC year, newest first", () => {
  const a = note("2025-04-06");
  const b = note("2026-10-05");
  const c = note("2026-10-12");
  expect(groupNotesByYear([a, b, c])).toEqual([
    { year: 2026, notes: [c, b] },
    { year: 2025, notes: [a] },
  ]);
});

test("a note on Jan 1 stays in its own year in any time zone", () => {
  expect(groupNotesByYear([note("2026-01-01")])[0].year).toBe(2026);
});
