import { z } from "astro/zod";

export const noteSchema = z.strictObject({
  title: z.string().min(1),
  // YYYY-MM-DD only: other formats parse in local time and can shift the day
  date: z.union([z.date(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]).pipe(z.coerce.date()),
  description: z.string().min(1),
  draft: z.boolean().default(false),
});

export const projectSchema = z.strictObject({
  title: z.string().min(1),
  summary: z.string().min(1),
  tag: z.string().min(1),
  shortTag: z.string().min(1).optional(),
  year: z.number().int(),
  status: z.enum(["live", "soon", "private"]),
  link: z.url().optional(),
  visual: z.enum(["thesis-trace", "mirrortrace-rename"]).optional(),
  order: z.number().int(),
});
