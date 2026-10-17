import { expect, test } from "vitest";
import { formatLongDate, formatShortDate } from "../../src/lib/dates";

// z.coerce.date() turns "2026-10-17" into midnight UTC
const d = new Date("2026-10-17");

test("short date ignores the local time zone", () => {
  expect(formatShortDate(d)).toBe("Oct 17");
});

test("long date ignores the local time zone", () => {
  expect(formatLongDate(d)).toBe("Oct 17, 2026");
});
