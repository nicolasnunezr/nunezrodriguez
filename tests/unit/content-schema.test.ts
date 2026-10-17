import { expect, test } from "vitest";
import { noteSchema, projectSchema } from "../../src/lib/content-schemas";

const project = {
  title: "Mirrortrace",
  summary: "Every screenshot, named by what's in it.",
  tag: "Mac app",
  shortTag: "Mac",
  year: 2026,
  status: "soon",
  visual: "mirrortrace-rename",
  order: 2,
};

test("a note without description is rejected", () => {
  expect(noteSchema.safeParse({ title: "x", date: "2026-10-17" }).success).toBe(false);
});

test("a complete note parses, with draft defaulting to false", () => {
  const parsed = noteSchema.parse({ title: "x", date: "2026-10-17", description: "y" });
  expect(parsed.draft).toBe(false);
  expect(parsed.date.toISOString()).toBe("2026-10-17T00:00:00.000Z");
});

test("a complete project parses", () => {
  expect(projectSchema.safeParse(project).success).toBe(true);
});

test("unknown status and malformed link are rejected", () => {
  expect(projectSchema.safeParse({ ...project, status: "draft" }).success).toBe(false);
  expect(projectSchema.safeParse({ ...project, link: "not a url" }).success).toBe(false);
});

test("note dates must be written as YYYY-MM-DD", () => {
  const note = { title: "x", description: "y" };
  expect(noteSchema.safeParse({ ...note, date: "12/10/2026" }).success).toBe(false);
  expect(noteSchema.safeParse({ ...note, date: "October 12" }).success).toBe(false);
  expect(noteSchema.safeParse({ ...note, date: "2026-10-12" }).success).toBe(true);
  // YAML turns an unquoted 2026-10-12 into a Date before zod sees it
  expect(noteSchema.safeParse({ ...note, date: new Date("2026-10-12") }).success).toBe(true);
});

test("misspelled fields are rejected instead of ignored", () => {
  expect(noteSchema.safeParse({ title: "x", date: "2026-10-12", description: "y", drafts: true }).success).toBe(false);
  expect(projectSchema.safeParse({ ...project, shorttag: "Mac" }).success).toBe(false);
});
