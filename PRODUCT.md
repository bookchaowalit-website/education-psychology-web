# Psychology Explorer — Product truth

> Inferred from the code and copy (no user interview). Checked against the portfolio card claims review
> (`portfolio-site-web/docs/audits/CARD-CLAIMS-REVIEW-2026-10.md`, row `psychology-explorer`: topic databases,
> research summaries, bias catalogues and clinical psychology coverage were removed; the code holds 5 concepts and
> keeps notes in localStorage) on 2026-10-23.

## What it is

A client-only reading page with five hand-written concept notes and a private "margin" for saved prompts and notes.

## Who it is for

Someone who wants one small idea to reflect on, and a portfolio visitor looking at a calm editorial layout.

## What works today

1. Five concepts (Attention residue, Confirmation bias, Implementation intention, Cognitive reappraisal, The spacing
   effect), one per theme; filter by theme or pick from the index; "Turn the page" cycles within the theme.
2. Each concept shows a definition, an everyday example and a reflection prompt.
3. Save a prompt to "Your margin" and write a private note under it (≤ 1,000 characters, emoji never split; a blank
   or zero-width-only note is removed). Both persist in `localStorage` and are validated on load.
4. Front-end and server errors go to Sentry (errors only, personal data stripped) when `NEXT_PUBLIC_SENTRY_DSN` is set.

## What does not work (and must not be claimed)

- No topic database, research summaries, bias catalogue, clinical psychology, diagnosis or crisis support.
- No account, sharing or sync; no `/api/mcp` endpoint.

## Live URL and deploy state

- Live: https://psychology.bookchaowalit.com (HTTP 200 on 2026-10-23).
- The Vercel project `bookchaowalit-psychology-frontend` is deployed by CLI only and has no Git link, so a push to
  `main` does not deploy. The last production deploy is 2026-10-08 (CLI, commit ae4e149): the CVE patch deploy did not
  run because Vercel's free plan hit its 100-deployments/day limit on 2026-10-23. The coordinator deploys the latest
  green `main` after the quota resets; connecting Vercel Git to this repository is owner action D9.
- `NEXT_PUBLIC_SENTRY_DSN` is set on the Vercel project (Sentry project `education-psychology-web`, org
  `personal-yu0`); it takes effect on the next deploy.

## Boundaries

- Browser-only. No server routes besides robots and sitemap; notes never leave the browser.
