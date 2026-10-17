export type YearMonth = `${number}-${string}`;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parse(ym: YearMonth): [number, number] {
  const [y, m] = ym.split("-").map(Number);
  return [y, m];
}

/** Inclusive month count, as LinkedIn shows it: Mar 2025 – Oct 2026 is 20 months. */
export function monthsBetween(start: YearMonth, end: YearMonth | "present", today: Date): number {
  const [sy, sm] = parse(start);
  const [ey, em] = end === "present" ? [today.getUTCFullYear(), today.getUTCMonth() + 1] : parse(end);
  return (ey - sy) * 12 + (em - sm) + 1;
}

export function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${rest} mo`;
  return rest === 0 ? `${years} yr` : `${years} yr ${rest} mo`;
}

export function formatMonthYear(ym: YearMonth | "present"): string {
  if (ym === "present") return "Present";
  const [y, m] = parse(ym);
  return `${MONTHS[m - 1]} ${y}`;
}
