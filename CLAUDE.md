# FORC3MOD Website — Project Notes for Claude

This file exists so any future Claude session can pick up this project with full
context — no rediscovery needed. **Keep it up to date going forward**: whenever
you make a structural decision, fix a non-obvious bug, ship a new feature, or
flag something for later, add a note in the relevant section below (or a new
one). Treat this as a living doc, not a one-time snapshot.

## What this is

Static marketing site for FORC3MOD — an unofficial modding/livery-tool studio
for Assetto Corsa EVO. Flagship product is **FORC3 Designer** (a livery
painting app, still in development — not released yet). The site also
promotes the **GT3 FORC3** sim racing community and a Patreon support page.

No framework, no build step. Plain HTML/CSS/JS, hand-edited and pushed
directly.

## Deploy

- Repo: `LachanceGL/forc3mod-website`, deployed via **GitHub Pages** from `main`.
- Custom domain: `www.forc3mod.com` (see `CNAME` file).
- No build/CI step — pushing to `main` is the deploy. There is no staging.
- Local testing: `python -m http.server <port>` from the repo root, then open
  in a browser. Always kill the server before ending a session.

## Current status: site is in "Coming Soon" mode (again)

The site has flipped between a gated "Coming Soon" state and the full live
site more than once now — see `MEMORY.md` for the blow-by-blow (2026-08-09
gated it, 2026-08-10 reopened it, 2026-08-16 gated it again). **Check
`index.html` itself if you're unsure which state it's currently in**: if it
has a `<section class="coming-soon">`, it's gated; if it has a `<header
class="header">` with full nav, it's live.

As of the most recent change, it's gated again:

- `index.html` is a **minimal Coming Soon page**: logo, an "Under
  construction" eyebrow line, and a copyright footer line. No nav, no CTA
  buttons, no Discord link.
- `home.html` holds the **full real homepage**, completely intact.
- `home.html`, `forc3designer.html`, `gt3forc3.html`, and `SupportUs.html`
  each have exactly **one line** added at the very top of `<head>`:
  ```html
  <script>location.replace('index.html');</script>
  ```
  That is the *only* change made to those four files for this. Nothing else
  in them was touched — all content is fully preserved and ready to restore.

### How to reopen the full site

1. Delete the `<script>location.replace('index.html');</script>` line from
   `home.html`, `forc3designer.html`, `gt3forc3.html`, and `SupportUs.html`.
2. Copy `home.html`'s content back into `index.html` (or just rename it),
   then delete `home.html`.
3. Remove the now-dead `.coming-soon` CSS block from `css/style.css`.
4. Commit and push.

This exact cycle (gate → reopen → gate again) has happened before — don't
be surprised if it happens again. The pattern is cheap to redo either way:
the Coming Soon page's HTML/CSS block is short and both directions are
documented step-by-step above and in `MEMORY.md`.

## File map

| File | Purpose |
|---|---|
| `index.html` | **Currently the Coming Soon page.** Normally this is the site's real homepage — see above. |
| `home.html` | The real homepage, preserved, currently gated/redirects to `index.html`. |
| `forc3designer.html` | FORC3 Designer product page. Lime theme (`body.theme-designer`). Currently gated. |
| `gt3forc3.html` | GT3 FORC3 community page. Red theme (`body.theme-gt3`). Currently gated. |
| `SupportUs.html` | Patreon support page. Default blue theme. Currently gated (and also unlinked from nav/footer even when live — see "Discord / community reference IDs"). |
| `designer.html` | Legacy URL redirect shim → `forc3designer.html`. Leave alone. |
| `css/style.css` | Single shared stylesheet for every page. |
| `js/main.js` | Shared JS: mobile nav, nav scroll-spy, modal system, contact form mailto handler. |
| `img/forc3mod-logo.svg` | FORC3MOD wordmark. Blue gradient is baked into the file itself. |
| `img/icon.png` | FORC3 Designer app icon (blue-to-lime "FD" mark), shown inline in the hero on `forc3designer.html`. |
| `img/FORC3Designer_Showcase01.jpg` | Real app screenshot, used as the photo background on `forc3designer.html`'s "Your car, your canvas." card. |
| `CNAME` | GitHub Pages custom domain config. |

## Theming system

- `:root` defines the default **blue** theme via CSS vars (`--accent`,
  `--accent-2`, `--accent-soft`, etc.).
- `forc3designer.html` → `body.theme-designer` → **lime** accent.
- `gt3forc3.html` → `body.theme-gt3` → **red** accent.
- **Important**: on both themed pages, `.theme-designer .header` and
  `.theme-gt3 .header` explicitly re-pin the header's accent vars back to
  blue. The top nav bar stays blue-branded on every page regardless of the
  page's own accent color. Preserve this if you touch header colors.
- Footer link hover color is **hardcoded blue** (`#4fb3ff`), not themed —
  same reasoning: the footer should always read as FORC3MOD-blue.

## Logo system

- Header/product-page logo is a real `<img class="logo__img" src="img/forc3mod-logo.svg">`.
  Its color is baked into the SVG (a blue gradient) — you cannot recolor it
  with CSS `color`.
- The **footer** logo is different: it's `<span class="logo__img
  logo__img--mono">`, not an `<img>`. It's recolored to gray via CSS
  `mask-image` — the same SVG file is used purely as an alpha/shape stencil,
  painted with `background-color: var(--text-mute)`. This is how you'd
  recolor this specific SVG anywhere else too (can't just set `color`).
- `--logo-h` (26px desktop / 20px at the ≤480px breakpoint) is the **single
  source of truth** for logo height. The header defines it; the footer
  derives its (smaller) size from it via `.footer__brand .logo { transform:
  scale(0.75); }`. Never hardcode a logo height somewhere new — tie it back
  to `--logo-h`.
- **Logo shadow: currently none — both options were tried and rejected.**
  `filter: drop-shadow()` forces an offscreen compositing pass that visibly
  softened/jaggied the SVG's edges. Switching to `box-shadow` fixed that, but
  `box-shadow` draws a hard-edged rectangle from the element's bounding box
  — since the SVG has empty space at the bottom of its box, that rectangle
  didn't hug the letters and showed up as a visible band under the logo. The
  shadow was removed entirely rather than pick between those two tradeoffs.
  If a shadow is wanted again, it'll need a different technique (e.g. a
  second blurred copy of the logo positioned behind it) — don't just flip
  back to `filter` or `box-shadow`, both are already-tried dead ends.

## Photo cards (`.about__card--photo`) — two gotchas

Used for the "what it does" section's media card when it should show a real
photo/screenshot instead of the plain icon card (see `gt3forc3.html` and
`forc3designer.html` for examples). Set the image via an inline
`style="--about-photo: url('...')"` on the `.about__card.about__card--photo`
element.

- **CSS specificity trap**: each theme block has its own
  `.theme-X .about__card::before` override (for the plain icon card's tinted
  radial gradient). Because that selector has higher specificity than the
  base `.about__card--photo::before` rule, adding `--photo` to a themed page
  **silently falls back to the flat gradient and drops the photo entirely**
  unless that theme also has its own `.theme-X .about__card--photo::before`
  override (copy the linear-gradient + `var(--about-photo)` block). Both
  `.theme-gt3` and `.theme-designer` have this override now — if you add a
  new theme, you'll need one too.
- **`url()` in a custom property resolves where it's *used*, not where it's
  *declared***: the inline `style="--about-photo: url('img/foo.jpg')"` lives
  in the HTML page (site root), but the actual `background: ..., var(--about-photo)`
  declaration lives in `css/style.css` (inside `/css/`) — so a relative path
  resolves against `/css/`, not the page, and 404s (e.g. resolves to
  `/css/img/foo.jpg`). Use a **root-absolute path** (`/img/foo.jpg`) in the
  inline style instead. Same underlying gotcha as the footer logo's
  `mask-image` path (see "Logo system" above) — CSS `url()` in general
  resolves relative to the *stylesheet* unless you go absolute.

## Nav active-state — a fixed gotcha, don't reintroduce it

`js/main.js` has a scroll-spy (`setActiveLink`) that toggles `.is-active` on
nav links as the user scrolls.

- **Bug that was fixed**: it used to run against *every* nav link, including
  cross-page links like `href="forc3designer.html"`. Since those never match
  the `#<sectionId>` pattern the scroll-spy checks, it was wiping out the
  correct static `is-active` class (e.g. "FORC3 Designer" highlighted in the
  nav while on that page) on every single page load.
- **Fix in place**: only links whose `href` starts with `#` (same-page
  anchors like `#top`/`#contact`, only present on `index.html`/`home.html`)
  participate in scroll-spying. Cross-page links keep whatever `is-active`
  state the page was rendered with, untouched.
- Also: the scroll-spy's default section is `'top'`, not `''` — because
  `#top` is a `<span>` marker, not a tracked `<section id="...">`. Without
  this default, "Home" would lose its highlight at the very top of the page.
- If you add new nav items: same-page anchor links auto-participate in
  scroll-spying; cross-page links are safe by default and need no special
  handling.

## Contact form (in `home.html`, or `index.html` when the site isn't gated)

- No backend. Submits via a `mailto:` link. The real address
  (`forc3mod@gmail.com`) lives in **one place**: the `FORC3_EMAIL` constant
  at the top of `js/main.js`. UI copy intentionally never spells out the
  literal address — the success message says "FORC3 Email" instead.
- Fields: name, email, a "type" `<select>` (Feature request / Bug report /
  General question / Something else), and a message `<textarea>` (no
  placeholder text — intentionally blank).
- Validation is manual JS (all 4 fields required + a basic email regex) —
  see the `contactForm` handler in `main.js`.

## Modal system (`js/main.js`)

Generic, reusable pattern — reuse this for any future popup instead of
building a new one:
- Any element with `data-modal-target="#someId"` opens the modal with that id.
- Any element inside the modal with `data-modal-close` closes it.
- Clicking the backdrop or pressing Escape also closes it.
- Currently used for: the Changelog modal on `forc3designer.html` (button
  sits above the hero eyebrow line).

## Discord / community reference IDs

- FORC3MOD Discord invite: `https://discord.gg/CbJCmjtVma`
- GT3 FORC3 Discord invite: `https://discord.gg/dfcK4x64vb`
- FORC3MOD Discord guild ID: `906573991492349962`
- "Report Bugs" channel ID: `1534648749043879936` — footer link deep-links
  directly to it: `https://discord.com/channels/906573991492349962/1534648749043879936`
- The header's "FORC3MOD Discord" button and the Support Us page's hero
  Discord button were both **intentionally removed** by request. Support Us
  now has zero Discord CTAs on purpose — don't add one back without asking.

## Design conventions

- Fonts: **Rajdhani** (`--font-head`) for headings/nav/eyebrows; **Roboto**
  specifically for `.btn` label text; **Inter** (`--font`) for body copy. All
  loaded via one Google Fonts `<link>` per page — keep the weights in sync
  if you add a new font usage.
- Buttons: compose from existing modifiers — `.btn--primary` (blue
  gradient), `.btn--ghost` (outline), `.btn--lg` (large hero CTA sizing),
  `.btn--discord` (Discord purple), `.btn--sm` (compact, e.g. the Changelog
  button). Avoid inventing new one-off button styles.
- `//` is used deliberately as a clause separator in body copy (a stylistic
  choice, not a typo) — preserve it when editing existing copy unless told
  otherwise.
- Keep the header and footer markup/behavior **identical** across all real
  content pages (`index.html`, `forc3designer.html`, `gt3forc3.html`,
  `SupportUs.html`). When you change one page's header/footer, mirror the
  change to the other three in the same turn.

## Working conventions for this project

- No build step — edit files directly, no compilation/bundling.
- Test locally via `python -m http.server <port>`, verify in the Browser
  tool. **Screenshots in this environment have been intermittently
  unreliable** (stale/stuck compositor frames showing content in the wrong
  place). When a screenshot looks wrong, cross-check with
  `getBoundingClientRect()` / `getComputedStyle()` via JS before assuming
  something is actually broken.
- Always stop/kill the local test server before finishing.
- Commit and push straight to `main` after each change — this is a solo
  static site with direct-to-prod deploys via GitHub Pages, no PR workflow.
- When a change makes some CSS/JS/HTML dead, remove it in the same commit —
  don't leave stale selectors, unused classes, or leftover markup behind.

## Pending / open items

- *(none right now — add items here as they come up, and remove them once resolved)*
