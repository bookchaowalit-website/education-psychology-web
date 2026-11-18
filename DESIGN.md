# Design direction — Psychology Explorer

A reading room rather than a dashboard. Since 2026-11-19 the site uses the shared **Reader shell**
(see `READER.md`): `app/reader-shell.css`, `components/reader-shell.tsx` and `tests/reader-shell.test.tsx`
are copied byte for byte from content-techblog-web. Geist via `next/font` (variable on `<html>`), `--rs-*`
tokens in light and dark.

- Structure: one h1 and lede, then the concepts as cards (definition, everyday example, reflection prompt,
  Save button), theme chips (`aria-pressed`) with counts, a result count, then "Your margin".
- Your margin: saved prompts with a private note each (this browser only), Remove per prompt; when empty, an
  empty state explains what to do and links back to the concepts.
- Site CSS in `app/globals.css` only lays out the card details and the note field.
- Floor: text ≥ 12px, controls ≥ 44px, 4.5:1 text contrast, forced colours, no horizontal scroll at 320px,
  footer link back to https://bookchaowalit.com/.
- Honesty: educational information, not diagnosis or treatment (lede and footer).
