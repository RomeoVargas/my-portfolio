# Romeo’s World

A playable portfolio built with React and Vite. Original SVG pixel artwork, local fonts, and no game-engine dependency.

## Run locally

```sh
npm install
npm run dev
```

Open the URL printed by Vite. The current preview runs at http://127.0.0.1:5174.

## Explore

- Click **Explore my world**, then use WASD or arrow keys to move.
- Press **E** near a destination, or click a building directly.
- Collect five stars; a fox follows your character.
- Phone and tablet visitors can use the directional buttons.
- All content is available through ordinary navigation. Sound is opt-in, animation can be paused, and reduced-motion preferences are respected.

## Content

Professional content is adapted from the supplied `sResume.pdf`, with recent Nexus and Paycoinect work verified against the local `PAYCOINECT-Nexus` and `PAYCOINECT-main` repositories. Home address, demographic details, and references are intentionally excluded. Employment dates reflect the resume, not an independent update. Branding and mobile services are included as requested; Nexus and Paycoinect use the supplied brand artwork; other project artwork is illustrative. Contact uses an email link and copy action, with no backend or submission form.

Edit `src/data.js` for services, projects, career history, and email. `DESIGN.md` describes the visual direction. Google Fonts licenses are alongside the self-hosted fonts in `public/fonts`.

## Verification

```sh
npm test
npm run build
npm run test:browser
```

Browser tests use installed Google Chrome and the local preview on port 5174. No hosting deployment is configured.
