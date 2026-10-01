# Motion typography revision

The portfolio shell uses self-hosted Oswald (400) for display headings and Roboto (400–600) for interface text. Both Latin and Cyrillic subsets are served as WOFF2; their OFL licenses are included in `dist/fonts`. Existing fonts in the eight independent project demos are unchanged.

John Gearhart's reference uses Heathergreen for display titles and Roboto for small labels. Oswald provides a similar tall, condensed direction for Russian project names. No font files were copied from the reference website.

`dist/typography.css` defines the new type hierarchy and gallery proportions. Desktop titles are substantially larger; cards are wider and taller. Heading rows adapt to viewport height. Phones retain portrait covers with increased height; portrait tablets use a taller card crop. Catalogue, project previews, brief and contacts share the same font pair.

Sources: https://fonts.google.com/specimen/Oswald, https://fonts.google.com/specimen/Roboto, https://github.com/google/fonts/tree/main/ofl/oswald, https://github.com/google/fonts/tree/main/ofl/roboto.
