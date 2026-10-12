# CMD — Computational Materials Design for Advanced Functional Materialss

Website for the CMD research group, built with **Next.js 16 (App Router)**, **React 19**, **TypeScript** and **Tailwind CSS v4**.

## Run it

Requires Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Pages

| Route           | What it shows |
| --------------- | ------------- |
| `/`             | Hero with a rotatable 3D Janus monolayer, research themes, workflow, live band-structure demo, selected papers, news |
| `/research`     | Each theme in depth, plus an interactive periodic table filtered by theme |
| `/lab`          | Interactive lab: Haldane-model band structure with Chern number, phase diagram, and the Janus layer “flip” demo |
| `/people`       | Group leads with bios, members by career stage, alumni table |
| `/publications` | Searchable, filterable list grouped by year, with BibTeX copy/show (`/publications?theme=energy` pre-filters) |
| `/news`         | Timeline of announcements |
| `/join`         | Open positions, how to apply, contact form |

## Editing content

All text lives in `src/data/` — you rarely need to touch the components.

| File | Contents |
| ---- | -------- |
| `site.ts` | Group name, university, address, email, social links, navigation |
| `research.ts` | Research themes, workflow steps, software list, elements per theme |
| `people.ts` | Members, roles, bios, alumni. Put photos in `public/people/` and set `photo: "/people/name.jpg"` |
| `publications.ts` | Papers. Add `doi` to show a “View article” link, `pdf` for a download link, `highlight: true` for selected papers |
| `news.ts` | News items, newest first |
| `positions.ts` | Open positions |

> **All people, publications, news and positions are sample placeholders.** Replace them before going live.

## Design notes

- **Colours** (`src/app/globals.css`): ink `#142230` for simulation panels, cool paper `#F2F4F6` for reading.
  The two accents always mean the same thing — cyan = valence/occupied, amber = conduction/unoccupied.
- **Type**: Spectral (headings) and IBM Plex Sans (body), self-hosted via `@fontsource`, so no external font requests.
- Accessible: skip link, visible focus rings, keyboard-rotatable 3D model, labelled sliders, `prefers-reduced-motion` respected.

## Interactive components

- `src/components/LatticeCanvas.tsx` — dependency-free canvas renderer for a 1T-type Janus layer (drag, arrow keys, flip).
- `src/components/BandExplorer.tsx` + `src/lib/haldane.ts` — Haldane tight-binding model along Γ–K–M–Γ.
  Gap computed over the full Brillouin zone; Chern number from the Dirac masses at K and K′.
- `src/components/PeriodicTable.tsx`, `PublicationList.tsx`, `ThemeList.tsx`, `ContactForm.tsx`.

## Contact form

The form opens the visitor's email app with the message pre-filled (no backend needed).
To store messages instead, add `src/app/api/contact/route.ts` or use a service such as Formspree, and change `onSubmit` in `ContactForm.tsx`.

## Deploying

The easiest option is [Vercel](https://vercel.com): import the repository and deploy with default settings.
Any Node host works with `npm run build && npm start`.
