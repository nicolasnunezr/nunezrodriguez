interface Taggable {
  tag: string;
  shortTag?: string;
  year: number;
  status: "live" | "soon" | "private";
}

export function projectTag(p: Taggable, short: boolean): string {
  const label = short ? (p.shortTag ?? p.tag) : p.tag;
  if (p.status === "soon") return `${label} · Soon`;
  return short ? label : `${label} · ${p.year}`;
}
