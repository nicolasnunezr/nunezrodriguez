import { expect, test } from "vitest";
import { projectTag } from "../../src/lib/project-tag";

const thesis = { tag: "Thesis", year: 2026, status: "private" as const };
const mirrortrace = { tag: "Mac app", shortTag: "Mac", year: 2026, status: "soon" as const };

test("full tag shows the year, or Soon for upcoming projects", () => {
  expect(projectTag(thesis, false)).toBe("Thesis · 2026");
  expect(projectTag(mirrortrace, false)).toBe("Mac app · Soon");
});

test("short tag drops the year and prefers shortTag", () => {
  expect(projectTag(thesis, true)).toBe("Thesis");
  expect(projectTag(mirrortrace, true)).toBe("Mac · Soon");
});
