import { expect, test } from "vitest";
import { formatDuration, formatMonthYear, monthsBetween } from "../../src/lib/duration";

const oct2026 = new Date(Date.UTC(2026, 9, 17));

test("counts months inclusively, LinkedIn style", () => {
  expect(monthsBetween("2025-03", "present", oct2026)).toBe(20);
  expect(monthsBetween("2026-07", "present", oct2026)).toBe(4);
  expect(monthsBetween("2025-03", "2026-06", oct2026)).toBe(16);
});

test("handles year boundaries and single months", () => {
  expect(monthsBetween("2025-12", "2026-01", oct2026)).toBe(2);
  expect(monthsBetween("2026-05", "2026-05", oct2026)).toBe(1);
  expect(monthsBetween("2025-03", "present", new Date(Date.UTC(2027, 0, 1)))).toBe(23);
});

test("formats durations as years and months", () => {
  expect(formatDuration(20)).toBe("1 yr 8 mo");
  expect(formatDuration(16)).toBe("1 yr 4 mo");
  expect(formatDuration(12)).toBe("1 yr");
  expect(formatDuration(4)).toBe("4 mo");
  expect(formatDuration(24)).toBe("2 yr");
});

test("formats month-year labels", () => {
  expect(formatMonthYear("2026-07")).toBe("Jul 2026");
  expect(formatMonthYear("2025-03")).toBe("Mar 2025");
  expect(formatMonthYear("present")).toBe("Present");
});
