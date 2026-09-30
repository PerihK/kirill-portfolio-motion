# Portfolio deployment

This portfolio is hosted on Vercel in the `kiriw1/kirill-portfolio` project. Use Vercel for future deployments unless the user explicitly requests a different provider. The `.openai/hosting.json` file records the previous Sites deployment and is not the current publishing target.

The site is static. Deploy `dist` using the repository's `vercel.json`; no build or package installation is required. Run `node --check dist/app.js` and `node check.mjs` after source changes. Keep all eight project demos in `dist/demos` working, including the embedded previews.

Never commit or upload `.env*`, `.vercel`, credentials, or local QA screenshots.
