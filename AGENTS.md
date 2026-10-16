# Portfolio deployment

Commercial redesign (16 October 2026): `dist/index.html` is now the business landing page, using `commercial-v2.css` (imports `commercial.css`), `commercial.js`, and `portfolio-data.js`. The original motion experience lives at `dist/gallery.html`; keep its `app.js`, animations, and selected-work order intact. Homepage order requested by the user: personal hero → approach → prices → AI demo → process/FAQ/contact → projects at the very bottom. No decorative arrow or star motif and no monogram logo on the commercial page. Approved starting prices: 15k / 35k / 60k RUB. AI is explicitly a scenario demo, not a real LLM. Brief prepares a Telegram message for the visitor to send. Also run `node --check dist/commercial.js` after edits. Exclude `qa-commercial/` from commits and deployments.

This is the separate Kirill Motion experiment, hosted on Vercel in the `kiriw1/kirill-portfolio-motion` project. Its repository is `PerihK/kirill-portfolio-motion`. Never deploy this checkout to `kirill-portfolio`, which is the original portfolio. Use Vercel for deployments. The `.openai/hosting.json` file is inherited historical metadata and is not the current publishing target.

The site is static. Deploy `dist` using the repository's `vercel.json`; no build or package installation is required. Run `node --check dist/app.js` and `node check.mjs` after source changes. Keep all nine project demos in `dist/demos` working. The user requested removing the phone-in-a-dialog preview; cases now link directly to the responsive demos.

Never commit or upload `.env*`, `.vercel`, credentials, or local QA screenshots.

Selected works: NIVAL → ЛЕСНО → ПОРЯДОК → ПЛАН. Keep ТИХО in the full catalog. ПОРЯДОК is the tenth project; link to its existing standalone origin `https://poryadok-cleaning-demo.vercel.app/` so `/order`, `/admin` and browser-local CRM data stay together. Do not overwrite or rebuild the other nine demos when updating this entry. Preserve the gallery and intro animation timings.

Decorative arrows, checks and stars in demos must be inline SVG with currentColor; CSS pseudo-elements use SVG masks. Do not reintroduce Unicode emoji-capable glyphs or a runtime DOM replacement observer. Run `node check-ui-symbols.mjs` after demo updates. `node prepare-demos.mjs --only=lesno` updates just that export.
