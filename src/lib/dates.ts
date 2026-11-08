const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const long = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export const formatShortDate = (d: Date): string => short.format(d);
export const formatLongDate = (d: Date): string => long.format(d);
