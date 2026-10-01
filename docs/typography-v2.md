# Motion typography revision

The portfolio shell uses self-hosted Oswald (400) for display headings and Roboto (400–600) for interface text. Both Latin and Cyrillic subsets are served as WOFF2; their OFL licenses are included in `dist/fonts`. Existing fonts in the eight independent project demos are unchanged.

John Gearhart's reference uses Heathergreen for display titles and Roboto for small labels. Oswald provides a similar tall, condensed direction for Russian project names. No font files were copied from the reference website.

`dist/typography.css` defines the new type hierarchy and gallery proportions. Desktop titles are substantially larger; cards are wider and taller. Heading rows adapt to viewport height. Phones retain portrait covers with increased height; portrait tablets use a taller card crop. Catalogue, project previews, brief and contacts share the same font pair.

The subsequent balance pass uses Oswald for both identity lines in the masthead, enlarges gallery titles by another 5% and metadata by 1px, and rounds covers to 28px (20px on phones). Compact phone layouts reserve enough height for both metadata rows. Preview expansion reads the source card's radius, so opening and closing match its corners.

Entrance cards remain opaque through the entire depth animation. Each stays hidden until its own pass begins, and the card has a solid background while artwork loads. Only the final single-card overlay fades into the resting gallery.

The full-screen entrance uses card-relative scene dimensions, including perspective and all depth keyframes. Width no longer grows independently of the 1400px gallery cap. Each card projects its own perspective into a flat, explicitly ordered stack; tilted planes cannot cut through another project's image. The final landing uses the same projection and cancels cleanly on resize or input.

Both masthead identity lines roll vertically, letter by letter, on pointer hover or keyboard focus. The SVG spark turns a quarter rotation. Echo letters are hidden from assistive technology, the link retains one descriptive accessible name, touch layouts remain still, and reduced-motion preferences disable the effect.

Sources: https://fonts.google.com/specimen/Oswald, https://fonts.google.com/specimen/Roboto, https://github.com/google/fonts/tree/main/ofl/oswald, https://github.com/google/fonts/tree/main/ofl/roboto.
