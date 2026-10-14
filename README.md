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

Professional content is adapted from the supplied `sResume.pdf`, with recent Nexus and Paycoinect work verified against the local `PAYCOINECT-Nexus` and `PAYCOINECT-main` repositories. Home address, demographic details, and references are intentionally excluded. Employment dates reflect the resume, not an independent update. Branding and mobile services are included as requested; Nexus and Paycoinect use the supplied brand artwork; other project artwork is illustrative. Pacific Wireless is included with the owner’s solo-development credit. The seven project website links are owner-supplied. Contact uses an email link and copy action, with no backend or submission form.

Edit `src/data.js` for services, projects, career history, and email. `DESIGN.md` describes the visual direction. Google Fonts licenses are alongside the self-hosted fonts in `public/fonts`.

## Verification

```sh
npm test
npm run build
npm run test:browser
```

Browser tests use installed Google Chrome and the local preview on port 5174. No hosting deployment is configured.

## Search and deployment

The page title, description, canonical URL, and Open Graph text identify Romeo Vargas Jr. as a full-stack developer in the Philippines. `public/robots.txt` references `public/sitemap.xml`, which lists the single portfolio homepage. External project sites are not pages of this portfolio and are not included in its sitemap.

The canonical production URL is `https://my-portfolio.romeovillegasvargas.workers.dev/`. If the portfolio moves to a custom domain, update `index.html`, `public/robots.txt`, and `public/sitemap.xml` together. After deploying, register the site in Google Search Console, submit `sitemap.xml`, and inspect the homepage. No verification token or Search Console registration is configured here.

The owner-provided `1-01. Title.mp3` is bundled as `public/audio/background-music.mp3`. `ragnarok_login_sound.mp3` is bundled as `public/audio/click.mp3` only for opening and closing popups. A media failure resets the music toggle and shows a retry message; the welcome button supplies the interaction required by browser autoplay policies.

The game cursor uses six unchanged 32×32 CUR frames extracted from `Ro Normal Select.ani` (hotspot 0,0). `src/cursor.css` preserves the source’s 500ms first frame and five 100ms frames. Reduced-motion settings freeze the first frame. A standard pointer is the fallback for unsupported cursor formats.

Star collection plays the original three-note synthesized chime, separate from the popup MP3. The header mute control silences it too.
