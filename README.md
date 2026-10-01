# Kirill Motion

An independent experimental portfolio for Kirill Perikh. The original remains at https://kirill-portfolio-black.vercel.app/.

Eight projects form a full-screen gallery. Native page scrolling controls card transforms, title transitions and the shared background. Thumbnail buttons jump to any project. The catalog opens every demo directly. YASNO retains one live mobile iframe with its calculator. STEBEL appears as a regular project.

No animation framework or WebGL runtime is required. Motion respects prefers-reduced-motion. Only nearby large previews load. Fonts, demos and images are local files.

## Development

Run node serve.mjs and open http://127.0.0.1:4188/.

Before publishing, run node --check dist/app.js and node check.mjs. Deploy dist using vercel.json to the separate kiriw1/kirill-portfolio-motion project. Never deploy this repository to the original portfolio project.

Telegram: https://t.me/KiriwPerih
