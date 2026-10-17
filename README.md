# nunezrodriguez.com

Personal site, built with [Astro](https://astro.build) and published to GitHub Pages on every push to `main`.

## Everyday tasks

1. **New note.** Copy `src/content/notes/_template.md` to `src/content/notes/my-note.md`, fill in the fields and write. The file name is the URL: `nunezrodriguez.com/notes/my-note/`.
2. **New project.** Create `src/content/projects/<slug>.md` with the fields below.
3. **Job change.** Edit `src/data/experience.ts` (newest role first). Durations update by themselves.
4. **Preview locally.** `npm install` once, then `npm run dev` and open the URL it prints.
5. **Publish.** `git push` to `main`. The site updates in a minute or two.

If a required field is missing, `npm run build` fails and tells you which one.

## Note format

```yaml
---
title: "What building a fact-checker taught me about LLMs"   # required
date: 2026-10-12                                              # required, YYYY-MM-DD
description: "One sentence for Google and the X card."        # required
draft: false                                                  # optional; true = not published
---
Markdown text.
```

Reading time and the share image for X are generated automatically.

## Project format

```yaml
---
title: "Mirrortrace"                                   # required
summary: "Every screenshot, named by what's in it."    # required, one sentence
tag: "Mac app"                                         # required: Thesis, Mac app, Hackathon, Side project…
shortTag: "Mac"                                        # optional, shorter tag for phones
year: 2026                                             # required
status: soon                                           # required: live | soon | private
link: "https://mirrortrace.co"                         # optional; only shown with status: live
visual: mirrortrace-rename                             # optional: a component in src/components/visuals/
order: 2                                               # required: position in the list
---
Short paragraph shown when the row is opened (1–3 sentences).
```

## Tests

- `npm test`: unit tests (Vitest).
- `npm run test:e2e`: builds the site and checks it in Chromium at phone, tablet and desktop sizes (Playwright). Run `npx playwright install chromium` once first.

## One-time setup before the first deploy

In GitHub, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**, *before* merging this site into `main`. If you merge first, Pages would publish the raw repository (it would show this README as the home page) until the setting is changed.
