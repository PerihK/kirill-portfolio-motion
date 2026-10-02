# Project previews — 2 October 2026

The preview transition lifts the original card to the viewport center before a uniform camera zoom. Opening takes 1.7 seconds; closing takes 1.5 seconds and reverses the same path. The image remains opaque on its way back; only copy and the project-colored scrim fade. This replaces the previous independent horizontal/vertical stretch and whole-dialog fade.

The flight retains the source image's crop and aspect ratio. Closing reads the current animation pose and current source bounds, so early dismissal does not jump to a fullscreen pose. The underlying card is hidden during flight to prevent double images. Stable page gutters avoid a layout shift when scrolling is locked. A resized preview refits its background; when source proportions no longer match, dismissal uses a fade instead of a distorted return. Reduced-motion preferences skip flight. Catalog previews return to the catalog, with keyboard focus restored.

Each project has a more distinct gallery palette. The fullscreen image uses a darker tint derived from that project's palette, behind white text. Actual desktop screenshots appear below the introduction: first screen plus a project-specific interactive section. They are captured from the local demo pages with embedded mode, not fabricated interfaces; the screenshot UI content must be reviewed before release. PNG QA captures remain ignored. The shipped WebP files in `dist/images/project-screens` load lazily and are not requested by the main gallery.

Reference: https://johngearhart.me/ — observed centering, camera approach, reverse return, project palette and screenshot presentation. Own typography, copy, images and implementation remain in use.
