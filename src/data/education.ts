export interface School {
  name: string;
  shortName?: string;
  logo: string;
  badge?: string;
  degree: string;
  dates: string;
  location: string;
}

// Most recent first.
export const education: School[] = [
  {
    name: "University of Richmond",
    logo: "/logos/university-of-richmond.svg",
    badge: "Dean's List",
    degree: "Exchange year · Computer Science and Business",
    dates: "Aug 2025 – May 2026",
    location: "Virginia, USA",
  },
  {
    name: "Universidad Carlos III de Madrid",
    shortName: "UC3M",
    logo: "/logos/uc3m.svg",
    degree: "BSc Computer Science and Engineering",
    dates: "2022 – 2026",
    location: "Madrid, Spain",
  },
];
