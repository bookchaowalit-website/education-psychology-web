# Psychology Explorer

A quiet reading room of five short psychology concept notes (definition, everyday example, reflection prompt) across
five themes. Save a prompt to "Your margin" and write a private note under it; both stay in this browser's
`localStorage`. Educational information only: not diagnosis, treatment or crisis support.

Live: https://psychology.bookchaowalit.com (deployed by Vercel CLI; it can lag `main`, see `PRODUCT.md`).

## What it does

- Browse the five concepts by theme (work, thinking, habits, emotion, learning) or pick one from the index.
- "Turn the page" moves to the next concept within the current theme.
- Save reflection prompts to "Your margin" and keep a private note (up to 1,000 characters) under each.
- Saved prompts and notes are validated on load (unknown concepts, blank or zero-width notes dropped).

## What does not work

- No topic database, research summaries, bias catalogue or clinical content. No account or sync.

## Run

```bash
npm ci
npm run dev
```

## Checks

```bash
npm test           # Vitest: concept, saved-prompt and note rules, site/robots/sitemap, home render, Sentry scrubbing
npm run lint
npm run typecheck
npm run build
```

CI (`.github/workflows/ci.yml`) runs the shared Node workflow (with a line-coverage gate) and the shared security
scan on every push and PR to `main`.

## Configuration

- `NEXT_PUBLIC_SITE_URL` (optional): canonical origin for metadata, `/sitemap.xml` and `/robots.txt`. Defaults to
  `https://psychology.bookchaowalit.com`; must be an absolute http(s) URL.
- `NEXT_PUBLIC_SENTRY_DSN` (optional): turns on error reporting; unset means Sentry is off.

## Code map

- `lib/concepts.ts`: the five concepts, theme filter, page turning, saved prompts and notes (used by the page).
- `lib/use-stored-state.ts`: state mirrored to `localStorage`, read after mount.
- `lib/site.ts`: canonical URL, robots and sitemap.
- `lib/sentry.ts` + `instrumentation*.ts`: error reporting to Sentry, errors only, personal data stripped.
- There is no `/api/mcp` route and no more-projects page in this repository.
