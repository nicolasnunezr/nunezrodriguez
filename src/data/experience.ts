import type { YearMonth } from "../lib/duration";

interface Role {
  title: string;
  start: YearMonth;
  end: YearMonth | "present";
}

interface Company {
  company: string;
  logo: string;
  roles: Role[];
}

export const experience: Company[] = [
  {
    company: "Securitize",
    logo: "/logos/securitize.svg",
    roles: [
      { title: "Data Scientist", start: "2026-07", end: "present" },
      { title: "Data & AI Intern", start: "2025-03", end: "2026-06" },
    ],
  },
];
