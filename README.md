# Kirill Motion

An independent experimental portfolio for Kirill Perikh. The original remains at https://kirill-portfolio-black.vercel.app/.

Eight projects form a full-screen gallery with individually composed covers. Native page scrolling controls card transforms, title transitions and the shared background. An interruptible entrance passes all eight covers across the screen on each page load. Thumbnail buttons jump to any project.

Selecting a cover opens a slowly expanding project preview with a dimmed visual, a short description and a link to the demo in a new tab. Each project has an optional mobile view. Seven use lightweight screenshots in a scrollable handset; YASNO retains its live phone and calculator, loaded only when requested. STEBEL appears as a regular project.

No animation framework or WebGL runtime is required. Motion respects prefers-reduced-motion. The eight optimized cover assets total about 1.1 MB; full mobile screenshots and the live phone load on demand. Fonts, demos and images are local files.

The previous live-demo version is preserved in the Git tag `backup-motion-live-sites-2026-10-01`.

## Development

Run node serve.mjs and open http://127.0.0.1:4188/.

Before publishing, run node --check dist/app.js and node check.mjs. Deploy dist using vercel.json to the separate kiriw1/kirill-portfolio-motion project. Never deploy this repository to the original portfolio project.

Telegram: https://t.me/KiriwPerih
