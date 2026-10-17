import { expect, test } from "vitest";
import { publishedNotes } from "../../src/lib/notes";

const draft = { id: "draft", data: { draft: true } };
const published = { id: "live", data: { draft: false } };

test("production hides drafts", () => {
  expect(publishedNotes([draft, published], true)).toEqual([published]);
});

test("development shows drafts", () => {
  expect(publishedNotes([draft, published], false)).toEqual([draft, published]);
});
