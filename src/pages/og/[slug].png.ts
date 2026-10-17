import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { formatLongDate } from "../../lib/dates";
import { publishedNotes } from "../../lib/notes";
import { renderOgCard } from "../../lib/og-card";

type Card = {
  kicker: string;
  title: string;
  byline: string;
};

export const getStaticPaths = (async () => {
  const notes = publishedNotes(await getCollection("notes"), import.meta.env.PROD);
  const home: Card = {
    kicker: "NUNEZRODRIGUEZ.COM",
    title: "Nicolás Núñez Rodríguez",
    byline: "Data Scientist at Securitize. Building AI for tokenized finance.",
  };
  return [
    { params: { slug: "home" }, props: home },
    ...notes.map((note) => ({
      params: { slug: note.id },
      props: {
        kicker: `NOTE · ${formatLongDate(note.data.date).toUpperCase()}`,
        title: note.data.title,
        byline: "Nicolás Núñez Rodríguez",
      } satisfies Card,
    })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgCard(props as Card);
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
