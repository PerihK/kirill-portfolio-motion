# Portfolio deployment

This is the separate Kirill Motion experiment, hosted on Vercel in the `kiriw1/kirill-portfolio-motion` project. Its repository is `PerihK/kirill-portfolio-motion`. Never deploy this checkout to `kirill-portfolio`, which is the original portfolio. Use Vercel for deployments. The `.openai/hosting.json` file is inherited historical metadata and is not the current publishing target.

The site is static. Deploy `dist` using the repository's `vercel.json`; no build or package installation is required. Run `node --check dist/app.js` and `node check.mjs` after source changes. Keep all nine project demos in `dist/demos` working. The user requested removing the phone-in-a-dialog preview; cases now link directly to the responsive demos.

Never commit or upload `.env*`, `.vercel`, credentials, or local QA screenshots.
