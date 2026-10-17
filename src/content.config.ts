import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { noteSchema, projectSchema } from "./lib/content-schemas";

const notes = defineCollection({
  loader: glob({ pattern: ["**/*.md", "!**/_*.md"], base: "./src/content/notes" }),
  schema: noteSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: projectSchema,
});

export const collections = { notes, projects };
