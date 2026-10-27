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
- All content is available through ordinary navigation. Sound is enabled by default: the sticky header button pauses or resumes looping music at 25% volume and click effects at 35%. A welcome popup with Romeo’s avatar starts music when visitors choose “Explore my world.” The speaker control is icon-only. An explicit mute keeps both tracks paused. Sound controls appear only in the sticky header. Animation respects reduced-motion preferences.

## Content

Professional content is adapted from the supplied `sResume.pdf`, with recent Nexus and Paycoinect work verified against the local `PAYCOINECT-Nexus` and `PAYCOINECT-main` repositories. Home address, demographic details, and references are intentionally excluded. Employment dates reflect the resume, not an independent update. Nexus and Paycoinect use the supplied brand artwork; other project artwork is illustrative. Pacific Wireless is included with the owner’s solo-development credit. The nine project website links and service assignments are owner-supplied. Public product context was reviewed on 16 October 2026; see [project sources](docs/project-sources.md). MBS Alert (formerly BSA Rescue) is in final testing ahead of its planned rollout in Barangay San Antonio, as confirmed by the owner. Its supplied URL remains labeled as a staging website. Paycoinect Business is described as a Paycoinect subservice, with links to its portal and public overview. Contact uses email links and a copy action, with no backend or submission form.

Edit `src/data.js` for services, projects, career history, and email. `DESIGN.md` describes the visual direction. Google Fonts licenses are alongside the self-hosted fonts in `public/fonts`.

## Verification

```sh
npm test
npm run build
npm run test:browser
```

Browser tests use installed Google Chrome and the production preview on port 5174. Run `npm run build`, then start `npm run preview -- --port 5174 --strictPort` in another terminal before running browser tests. No hosting deployment is configured.

## Search and deployment

The page title, description, canonical URL, and Open Graph text identify Romeo Vargas Jr. as a full-stack developer in the Philippines. `public/robots.txt` references `public/sitemap.xml`, which lists the homepage and four service pages. External project sites are not pages of this portfolio and are not included in its sitemap.

`npm run build` prerenders the React homepage into `dist/index.html` and each service page into `dist/services/<slug>/index.html` using `scripts/prerender.mjs`. Deploy the complete `dist/` directory using this build command, with static HTML directory-index serving enabled. Service explanations, related projects, and email links are readable without JavaScript. Each service page has its own title, description, canonical, and Open Graph metadata. React hydrates the same content; ordinary links handle navigation without a router dependency. Project views reuse `src/ProjectCard.jsx` and content from `src/data.js`. The welcome dialog offers “View services & work” for visitors who want to browse directly. The development server remains client-rendered, so verify search visibility against the production build.

Service paths are `/services/branding-identity/`, `/services/website-development/`, `/services/custom-systems/`, and `/services/mobile-app-development/`. Homepage “Read more” links and the studio popup lead to these pages. `serviceIds` and `contributions` in `src/data.js` define each project’s related services and contribution text. The same assignments drive the project filters: branding has five projects, websites nine, custom systems five, and mobile two. Update `public/sitemap.xml` when adding or renaming service paths.

The canonical production URL is `https://my-portfolio.romeovillegasvargas.workers.dev/`. If the portfolio moves to a custom domain, update `index.html`, `src/main.jsx`, `scripts/prerender.mjs`, `public/robots.txt`, and `public/sitemap.xml` together. The owner’s Google verification tag is in `index.html` and is preserved in generated pages. After deploying, submit `sitemap.xml` in Search Console and inspect the service URLs as well as the homepage.

The owner-provided `1-01. Title.mp3` is bundled as `public/audio/background-music.mp3`. `ragnarok_login_sound.mp3` is bundled as `public/audio/click.mp3` only for opening and closing popups. A media failure resets the music toggle and shows a retry message; the welcome button supplies the interaction required by browser autoplay policies.

The game cursor uses six unchanged 32×32 CUR frames extracted from `Ro Normal Select.ani` (hotspot 0,0). `src/cursor.css` preserves the source’s 500ms first frame and five 100ms frames. Reduced-motion settings freeze the first frame. A standard pointer is the fallback for unsupported cursor formats.

Star collection plays the original three-note synthesized chime, separate from the popup MP3. The header mute control silences it too.
