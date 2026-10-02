# Project previews — 2 October 2026

The preview transition lifts the original card to the viewport center before a uniform camera zoom. Opening takes 1.7 seconds; closing takes 1.5 seconds and reverses the same path. The image remains opaque on its way back; only copy and the project-colored scrim fade. This replaces the previous independent horizontal/vertical stretch and whole-dialog fade.

The flight retains the source image's crop and aspect ratio. Closing reads the current animation pose and current source bounds, so early dismissal does not jump to a fullscreen pose. The underlying card is hidden during flight to prevent double images. Preserving the page width avoids a layout shift when scrolling is locked, without reserving a blank viewport strip. A resized preview refits its background; when source proportions no longer match, dismissal uses a fade instead of a distorted return. Reduced-motion preferences skip flight. Catalog previews return to the catalog, with keyboard focus restored.

Each project has a more distinct gallery palette. The fullscreen image uses a darker tint derived from that project's palette, behind white text. Actual desktop screenshots appear below the introduction: first screen plus a project-specific interactive section. They are captured from the local demo pages with embedded mode, not fabricated interfaces; the screenshot UI content must be reviewed before release. PNG QA captures remain ignored. The shipped WebP files in `dist/images/project-screens` load lazily and are not requested by the main gallery.

Reference: https://johngearhart.me/ — observed centering, camera approach, reverse return, project palette and screenshot presentation. Own typography, copy, images and implementation remain in use.


Palette revision: LESNO uses pale lichen (#c8ceba), LINIYA neutral stone (#c9c5bc), MILE warm paper (#e0d5bf), and HVOST soft oat milk (#e8dccb). YASNO, TIHO, PLAN and STEBEL retain their approved colors. LESNO also supplies the entrance background.

Duplicate-card fix: slides receive inline visibility from the gallery renderer and can override inherited visibility:hidden. The preview now hides the gallery through parent opacity:0, which composites every slide away immediately, and restores the layer only after the return flight finishes. Desktop and mobile opening / early closing were checked.


Axis correction: the gallery card is centered in the page area, which excludes the desktop scrollbar. Preview flight now keeps that actual horizontal axis during lift and zoom; it no longer shifts to innerWidth / 2. Fullscreen cover scaling accounts for both distances from the axis to the viewport edges. The reverse lift uses the current source left coordinate. Catalog cards retain their deliberate move toward the viewport center.

Browser geometry verification: at 1920 × 1080 the card and flight stayed at X = 952.5 px through lift, fullscreen zoom and return (less than 0.005 px rounding). At 2560 × 1440 the lift stayed at X = 1272.5 px. Both zoom axes use the same scale and the background covers both viewport edges.
