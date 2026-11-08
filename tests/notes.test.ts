import { expect, test } from "vitest";
import { groupNotesByYear, publishedNotes } from "../src/lib/notes";

const note = (date: string) => ({ date: new Date(date) });
const draft = { id: "draft", data: { draft: true } };
const published = { id: "live", data: { draft: false } };

test("groups by year, newest first", () => {
  const a = note("2025-04-06");
  const b = note("2026-10-05");
  const c = note("2026-10-12");
  expect(groupNotesByYear([a, b, c])).toEqual([
    { year: 2026, notes: [c, b] },
    { year: 2025, notes: [a] },
  ]);
});

test("a note on Jan 1 stays in its own year", () => {
  expect(groupNotesByYear([note("2026-01-01")])[0].year).toBe(2026);
});

test("production hides drafts", () => {
  expect(publishedNotes([draft, published], true)).toEqual([published]);
});

test("development shows drafts", () => {
  expect(publishedNotes([draft, published], false)).toEqual([draft, published]);
});
