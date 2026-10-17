export function groupNotesByYear<T extends { date: Date }>(notes: T[]): { year: number; notes: T[] }[] {
  const sorted = [...notes].sort((a, b) => b.date.getTime() - a.date.getTime());
  const groups: { year: number; notes: T[] }[] = [];
  for (const note of sorted) {
    const year = note.date.getUTCFullYear();
    const last = groups.at(-1);
    if (last?.year === year) last.notes.push(note);
    else groups.push({ year, notes: [note] });
  }
  return groups;
}

export function publishedNotes<T extends { data: { draft: boolean } }>(entries: T[], isProd: boolean): T[] {
  return isProd ? entries.filter((entry) => !entry.data.draft) : entries;
}
