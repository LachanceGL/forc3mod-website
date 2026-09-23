# FORC3MOD Website — Project Notes for Claude

This file exists so any future Claude session can pick up this project with full
context — no rediscovery needed. **Keep it up to date going forward**: whenever
you make a structural decision, fix a non-obvious bug, ship a new feature, or
flag something for later, add a note in the relevant section below (or a new
one). Treat this as a living doc, not a one-time snapshot.

## What this is

Static marketing site for FORC3MOD — an unofficial modding/livery-tool studio
for Assetto Corsa EVO. Flagship product is **FORC3 Designer** (a livery
painting app, still in development — not released yet), alongside **FORC3
Grid** (a browser-based livery manager/sharing tool at
`grid.forc3mod.com`; its page here is linked again — see "Showing /
hiding FORC3 Grid", it flips often). The site also
promotes the **GT3FORC3** sim racing community (that page is hidden as of
2026-09-22 — see "Showing / hiding a product page") and a Patreon support
page.

No framework, no build step. Plain HTML/CSS/JS, hand-edited and pushed
directly.

## Deploy

- Repo: `LachanceGL/forc3mod-website`, deployed via **GitHub Pages** from `main`.
- Custom domain: `www.forc3mod.com` (see `CNAME` file).
- No build/CI step — pushing to `main` is the deploy. There is no staging.
- Local testing: `python -m http.server <port>` from the repo root, then open
  in a browser. Always kill the server before ending a session.

## Current status: site is LIVE (full site, un-gated)

The site flips between a gated "Coming Soon" state and the full live site
constantly — see `MEMORY.md` for the log. It's flipped repeatedly across
2026-08-17 through 2026-08-20. **Never trust this heading; check
`index.html` itself**: if it has a `<section class="coming-soon">` it's
gated, if it has a `<header class="header">` with full nav it's live.

As of the most recent change, it's live:

- `index.html` is the **full real homepage** again (header/nav, hero, about,
  contact form, footer). `home.html` does not exist while live.
- `forc3designer.html`, `gt3forc3.html`, and `SupportUs.html` load normally —
  the `location.replace('index.html')` guard and its comment are gone from
  every page.
- The `.coming-soon` CSS block is removed from `css/style.css`.
- The GT3 live driver pill and Discord member counter are active again, and
  the contact form posts to Discord — `gt3forc3.html` polls the Worker every
  90s while open.

### How to gate it again (live → Coming Soon)

1. `git mv index.html home.html`, then recreate `index.html` as the Coming
   Soon page. **Don't reinvent it** — restore it from git history:
   `git show cecd217:index.html`. Its stylesheet block is the `.coming-soon`
   rules at the end of `git show cecd217:css/style.css` — append those back
   (extract with `sed -n '/^\/\* ===== Coming Soon/,$p'`).
2. Add this one line at the very top of `<head>` in `home.html`,
   `forc3designer.html`, `gt3forc3.html`, and `SupportUs.html`. That should
   be the *only* change to those four files — leave all content intact:
   ```html
   <script>location.replace('index.html');</script>
   ```
3. Commit and push.

### How to reopen it (Coming Soon → live)

1. Delete the `<script>location.replace('index.html');</script>` line, plus
   the explanatory comment above it, from `home.html`, `forc3designer.html`,
   `gt3forc3.html`, and `SupportUs.html`.
2. `git mv -f home.html index.html`.
3. Remove the now-dead `.coming-soon` CSS block from `css/style.css`.
4. Commit and push.

**Both directions change `css/style.css`** (the `.coming-soon` block is
appended or removed), so **bump the `?v=` cache-buster on every page in the
same commit** — see "Asset cache-busting" below. Easy to forget on a flip
because the change feels mechanical.

Don't bother counting how many times this has flipped; it happens often
enough that any tally here goes stale immediately — `MEMORY.md` has the
dated log. Expect it to keep happening while the FORC3 Designer release date
moves, and don't treat either state as permanent. Both directions are cheap
and scripted above; always resurrect the Coming Soon page from git rather
than rewriting it from scratch.

## File map

| File | Purpose |
|---|---|
| `index.html` | The site's real homepage — header/nav, hero, about, contact form. **Currently live** (see above). |
| `forc3designer.html` | FORC3 Designer product page. Lime theme (`body.theme-designer`). |
| `grid.html` | FORC3 Grid product page. Orange theme (`body.theme-grid`). **Linked and public** again since 2026-09-22 (owner: "put back the FORC3 grid section online"). It has flipped four times now — linked 09-16, hidden 09-16, relinked 09-21, hidden 09-22, relinked 09-22 — so don't treat either state as settled; check the page itself. See "Showing / hiding FORC3 Grid" for the edits that go together in either direction. |
| `gt3forc3.html` | GT3FORC3 community page. Red theme (`body.theme-gt3`). **Hidden** since 2026-09-22 (owner: "hide the GT3FORC3 section") — `noindex, nofollow`, linked from nowhere, reachable by URL. Its live driver pill still polls the GT3FORC3 Worker whenever someone opens it directly. |
| `SupportUs.html` | Patreon support page. Default blue theme. Unlinked from nav/footer even while live — see "Discord / community reference IDs". |
| `designer.html` | Legacy URL redirect shim → `forc3designer.html`. Leave alone. |
| `forc3-designer-download/index.html` | Redirect shim → GitHub's "latest release" download URL for FORC3 Designer. Gives a `forc3mod.com` link to hand out directly (owner: "it needs to be a forc3mod.com url"). See "FORC3 Designer download button" below. |
| `css/style.css` | Single shared stylesheet for every page. |
| `js/main.js` | Shared JS: mobile nav, nav dropdown, scroll-spy, modal system, contact form (posts to Discord via the Worker), GT3 live driver/member counters. |
| `img/forc3mod-logo.svg` | FORC3MOD wordmark. Blue gradient is baked into the file itself. |
| `img/designer-icon.png` | FORC3 Designer's hero icon since 2026-09-21 — the v2 "3D" mark, byte-for-byte `forc3designer_256.png` from `G:\FORC3MOD\LOCAL_forc3mod-website\Graphic\v2_Icons`. |
| `img/grid-icon.png` | FORC3 Grid's hero icon (added 2026-09-21) — the v2 "3G" mark, byte-for-byte `forc3grid_256.png` from the same folder, which is also identical to the Grid app's own `src-tauri/icons/256x256.png`. |
| `img/icon.png` | The **old** FORC3 Designer icon (blue-to-lime "FD" mark), unreferenced since 2026-09-21 when the v2 icon replaced it. Kept, same "owner-provided, don't delete" reasoning as the old screenshots and videos. New icons went in under new filenames rather than overwriting this one: images carry no `?v=` cache-buster, so reusing the name would have left some browsers on the old mark. |
| `img/FD_SitePreview.jpg` | Owner-provided app screenshot, used directly (no derivative crop) as the photo background on `forc3designer.html`'s "Your car, your canvas." card. The card's `aspect-ratio` is set to match this file's own pixel dimensions — see "Photo cards" below. |
| `img/FG_SitePreview.jpg` | Owner-provided FORC3 Grid screenshot (the app's "My Showroom" screen, 1259×823), copied byte-for-byte from `G:\FORC3MOD\LOCAL_forc3-grid\Screenshot_1.jpg` on 2026-09-21. Photo background of `grid.html`'s "What it does" card; the card's `aspect-ratio: 1259 / 823` is this file's real size — update it if the image is ever replaced. Same "real file, no derivative" rule as `FD_SitePreview.jpg`. |
| `img/FORC3Designer_Showcase01.jpg` | Earlier app screenshot, no longer referenced by any page. Left in place rather than deleted — it's owner-provided, not generated. |
| `video/forc3designer-demo-03.mp4` | **Currently active** owner-provided demo video (1960×1080, ~68s), used directly. Powers the "See what it does" video modal on `forc3designer.html` — see "Demo video modal" below. |
| `video/forc3designer-demo-02.mp4` | Earlier demo video (1960×1080, ~93s), no longer referenced — superseded by `-03` on 2026-09-04. Left in place rather than deleted, same reasoning as `img/FORC3Designer_Showcase01.jpg`: it's owner-provided, not generated. |
| `video/forc3designer-demo.mp4` | Earlier still (1960×1080, ~72s), no longer referenced — superseded by `-02` on 2026-08-31. Same "owner-provided, keep it" reasoning. If a `-04` ever supersedes `-03`, keep all the older files rather than deleting any. |
| `favicon.ico` | Site favicon, one multi-size ICO (**16/32/64/96/128/256**). Built 2026-09-15 from the owner's hand-drawn `forc3mod_<size>.png` set in `G:\FORC3MOD\LOCAL_forc3mod-website\Graphic\v2_Icons` (that folder is outside this repo and also holds `forc3designer_`, `forc3grid_` and `gt3forc3_` sets, unused here so far). Five of the six frames are the artist's own files, packed byte-for-byte — **don't rebuild those by rescaling one PNG**, re-pack from the source set so the small sizes keep their hand-tuned pixels. **The 96 is the one exception**: it's generated (LANCZOS downscale of the 256), added 2026-09-19 because Google wants a favicon frame that's a multiple of 48px and the source set has none — see "Favicon and Google search results". If the owner ever supplies a real hand-drawn 96, swap it in and drop the generated one. Replaced the old inline `data:image/svg+xml` blue-square "3" favicon on every page. |
| `robots.txt` | Added 2026-09-19. Allows everything and points at the sitemap — that Sitemap line is its only real job. **Never add a `Disallow` for a hidden page here**; see "Sitemap and robots.txt" below for why that backfires. |
| `sitemap.xml` | Hand-maintained sitemap (added 2026-09-19). Lists only the four public pages; `grid.html` is deliberately out while it's `noindex`, as are the two redirect shims. See "Sitemap" below before editing it. |
| `CNAME` | GitHub Pages custom domain config. |

## Theming system

- `:root` defines the default **blue** theme via CSS vars (`--accent`,
  `--accent-2`, `--accent-soft`, etc.).
- `forc3designer.html` → `body.theme-designer` → **lime** accent.
- `grid.html` → `body.theme-grid` → **orange** accent (added 2026-09-16,
  owner: "theme is orangeish this time"; the page borrowed
  `theme-designer`'s lime until then). Its "What it does" section is laid
  out to match `forc3designer.html`'s (owner, 2026-09-16: "this here should
  look similar to the designer one"): `.about__media` is the **first** child
  of `.about`, so the card takes the narrower 0.85fr column on the left and
  the text the wider 1.15fr on the right, and
  `.theme-grid .about__card` puts the heading in the card's bottom-right at
  22px, mirroring `.theme-designer .about__card--photo`. Measured identical
  to FORC3 Designer's at 1400px: media 469.2px at x=124, body 634.8px at
  x=641.2, heading 41px in from both the card's right and bottom edge.
  **Since 2026-09-21 it's a real photo card too** (owner: "use the image
  inside G:\FORC3MOD\LOCAL_forc3-grid as the preview one"):
  `img/FG_SitePreview.jpg`, with `.theme-grid .about__card--photo` at the
  file's own `aspect-ratio: 1259 / 823` and its own
  `.theme-grid .about__card--photo::before` override (bottom-right dark
  pool, same stops as theme-designer's). Verified at 375-1440px: the ratio
  holds at every width, the photo is in the `::before` layer, the heading
  paints above it (`elementFromPoint` returns the H3), no overflow. The two
  product pages' cards differ in height only because the two screenshots
  are different shapes (1.53 vs 1.70) — which is correct; don't force one
  ratio onto both.
- `gt3forc3.html` → `body.theme-gt3` → **red** accent.
- **Important**: on both themed pages, `.theme-designer .header` and
  `.theme-gt3 .header` explicitly re-pin the header's accent vars back to
  blue. The top nav bar stays blue-branded on every page regardless of the
  page's own accent color. Preserve this if you touch header colors.
- Footer link hover color is **hardcoded blue** (`#4fb3ff`), not themed —
  same reasoning: the footer should always read as FORC3MOD-blue.
- **A bright accent needs a dark `.btn--primary` label; a dark one keeps
  white.** `.btn--primary`'s fill is `linear-gradient(135deg, --accent-2,
  --accent)`, so the label's contrast is set by the *lighter* end. Lime and
  orange both fail white (measured: `#d4e100` 1.4:1, `#ffab33` 1.9:1), so
  `.theme-designer` and `.theme-grid` each override `color` to near-black
  (8.4:1 / 9.9:1); red passes at 3.1:1 and `.theme-gt3` leaves it alone.
  `.btn--lg` is the exception in both — its fill is translucent
  `--accent-soft` over the dark page, not the gradient — so each of those
  themes puts white back, in a rule placed **after** the `.btn--primary` one
  (equal specificity, so source order decides which wins on the hero button,
  which carries both classes). Measure a new accent before picking; don't
  copy whichever neighbouring theme happens to be above it.

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

## Photo cards (`.about__card--photo`) — two gotchas, plus a per-page gradient split

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
  override (copy the linear-gradient + `var(--about-photo)` block).
  `.theme-gt3`, `.theme-designer` and `.theme-grid` all have this override
  now — if you add a new theme, you'll need one too.
- **`url()` in a custom property resolves where it's *used*, not where it's
  *declared***: the inline `style="--about-photo: url('img/foo.jpg')"` lives
  in the HTML page (site root), but the actual `background: ..., var(--about-photo)`
  declaration lives in `css/style.css` (inside `/css/`) — so a relative path
  resolves against `/css/`, not the page, and 404s (e.g. resolves to
  `/css/img/foo.jpg`). Use a **root-absolute path** (`/img/foo.jpg`) in the
  inline style instead. Same underlying gotcha as the footer logo's
  `mask-image` path (see "Logo system" above) — CSS `url()` in general
  resolves relative to the *stylesheet* unless you go absolute.
- **`forc3designer.html`'s photo card is sized to match `FD_SitePreview.jpg`
  exactly**, not the generic 4/3 (desktop) / 16/10 (tablet) / auto+min-height
  (mobile) ratios the plain icon cards and `gt3forc3.html`'s card use.
  `.theme-designer .about__card--photo` sets
  `aspect-ratio: 824 / 485` — the *actual pixel dimensions* of the current
  file, read off it directly, not a design constant — which overrides
  `.about__card`'s responsive rules at every breakpoint (higher specificity
  wins regardless of which media query is active). With the box shaped
  exactly like the image, plain `background-size: cover` (same as every
  other photo card) shows the whole image with zero cropping and zero
  letterboxing — no per-image position tuning needed at all.
  - Also has to cancel `.about__card`'s mobile-only `min-height: 330px` (via
    `min-height: 0` in the same rule) — that property doesn't get overridden
    just because `aspect-ratio` does (CSS cascades per property, not per
    rule), and left in place it fights the fixed ratio: to satisfy both at a
    width where 824/485 naturally gives a shorter height, the browser
    widens the box past its container to hold the ratio, overflowing the
    viewport. Hit and fixed this exact overflow while building it.
  - **If `FD_SitePreview.jpg` is ever replaced with a different-shaped
    image, update the `824 / 485` to the new file's real dimensions** — this
    is deliberately *not* a derivative/cropped asset (a cropped-then-shrunk
    version was built and explicitly rejected — use the real file the owner
    provides, not a generated one), so the ratio has to be re-read from
    whatever file is actually in use, not assumed.
- **`forc3designer.html`'s card** needs its heading darkening from a
  gradient, since it has no badge and (as of 2026-08-20) no body paragraph
  either — just the h3 alone, positioned in the **bottom-right corner**
  rather than the top. Its `.theme-designer .about__card--photo::before`
  gradient is a corner pool: `linear-gradient(to top left, rgba(0,0,0,.9)
  0%, rgba(0,0,0,.55) 30%, transparent 65%)`, dark in that corner, fading
  out toward the rest of the photo.
  - Positioning: `align-items: flex-end` on the card (a column flex
    container) pushes the h3 to the right edge; `text-align: right` on the
    h3 right-aligns its own wrapped lines within that box.
    `justify-content` for the bottom-anchoring is inherited from the base
    `.about__card` rule (`flex-end`) — no override needed for that part,
    only the horizontal side needed one.
- **`gt3forc3.html`'s card also has a corner gradient now** — bottom-left,
  mirroring theme-designer's bottom-right one for visual consistency between
  the two product pages: `linear-gradient(to top right, rgba(0,0,0,.55) 0%,
  rgba(0,0,0,.25) 25%, transparent 50%)`. **This one is decorative only,
  NOT the contrast mechanism** — keep reading before touching it.
- **A percentage-position gradient was tried on the GT3 card once before, as
  the *actual* contrast fix, and had to be abandoned — don't repeat that
  mistake.** The badge is a long sentence that wraps 1-3 lines depending on
  card width, and it's the *last* flex child (see below), so h3's vertical
  position swings by ~25 percentage points of card height between mobile and
  desktop (measured: ~33-52% narrow vs ~58-67% wide). No fixed set of
  gradient stops can stay dark enough behind h3 at every width without also
  dragging that darkness down over the badge — which is the exact "badge is
  under a black gradient" complaint that started this. A card-height-relative
  gradient structurally cannot track flex-reflowed text, so it can never
  safely be the thing legibility depends on here.
- **Contrast is handled by `text-shadow` on `.theme-gt3 .about__card--photo
  h3, p` instead** — two stacked shadows, a tight dark one for edge
  definition and a soft wide one for a general halo. This works at the
  text's actual rendered position regardless of how the badge above it
  wrapped, so unlike a gradient it needs no knowledge of where anything else
  landed. **The bottom-left corner gradient added later doesn't replace
  this** — it's kept deliberately gentle (fades out earlier, lower peak
  opacity than theme-designer's) precisely because it isn't load-bearing.
  If contrast ever looks insufficient on a new/replaced photo, strengthen
  the text-shadow values, not the gradient — the gradient can't reliably
  track the text's position (see above), the shadow always can.
- **The badge went invisible after moving to first child — the real cause
  was `position`, not color, and it took three attempts to find.** Only
  h3/p got `text-shadow` when the 2026-08-19 fix landed, because the badge
  sat *after* them at the time (last child), reading fine by accident. When
  it moved back to first child on 2026-08-21 ("LIVE Server must be on
  top"), the owner reported it nearly illegible.
  - **Root cause**: `.about__card::before` (the photo+gradient layer) is
    `position: absolute; inset: 0`. `h3`/`p` are explicitly `position:
    relative` *specifically* so they paint above that layer — `.about__badge`
    never got the same treatment. It used to be `position: absolute` itself
    (an old top-left-pinned layout), which incidentally also promoted it
    above `::before` for free; when it moved to normal flow in an earlier
    redesign, that stacking promotion was lost and nothing replaced it. The
    photo was **literally painting over the badge** — confirmed with
    `document.elementFromPoint()` at the badge's own center returning the
    card div, not the badge span.
  - **Fix**: `.about__badge` (base rule, not a photo-card-only override) now
    has `position: relative` alongside its other properties. Verify any
    future stacking suspicion the same way: `elementFromPoint()` at an
    element's own center should return that element itself; if it returns
    an ancestor instead, something else — usually an absolutely-positioned
    sibling/pseudo-element — is painting on top of it.
  - **Two earlier color-only attempts both shipped and were both invisible
    underneath the photo the whole time** — neither was "wrong" as color
    choices, they just could never have worked, because the badge wasn't
    rendering above the photo layer yet:
    1. Added `text-shadow` (matching h3/p) + bumped the existing translucent
       green fill (`rgba(34,197,94,*)`) opacity `.16 -> .28`. Looked
       plausible (green-on-slightly-brighter-green *is* genuinely low
       contrast) but was moot regardless of values.
    2. Replaced the fill with a near-opaque dark `rgba(5,14,9,.85)` +
       `rgba(74,222,128,.35)` border (mirrors `.live-status`'s look),
       verified at 8.6–9:1 WCAG contrast — still invisible, for the same
       reason. **This fill is what's actually live now** — it started
       working the moment `position: relative` let it render at all, so it
       wasn't replaced, just finally shown.
  - **Lesson**: when a styling fix visibly "does nothing" across attempts
    with materially different values, stop iterating on color/shadow and
    check *whether the element is painting where you think it is* —
    `elementFromPoint()` at its own center is a fast, definitive check.
    Any child of a `position: relative` card that has an
    absolutely-positioned sibling (like these `::before` photo/gradient
    layers) needs its own explicit `position` to guarantee it paints above
    that sibling — don't assume normal DOM/paint order is enough once *any*
    sibling has been taken out of flow. This applies to any future element
    added inside `.about__card`/`.about__card--photo`, not just the badge.
- **`.about__badge` is the FIRST child of the card, in normal flow** (not
  absolutely positioned — it used to be pinned to the top-left corner via
  `position: absolute; top: 32px; left: 32px`, regardless of where h3/p
  sat). The card as a whole is still bottom-anchored (`justify-content:
  flex-end`, inherited from the base `.about__card` rule), so the badge+h3+p
  group sits at the bottom of the card either way — this only controls the
  order *within* that group. Has flipped twice: badge-before-h3 (original),
  then moved to *after* p (owner: that didn't read as "the bottom", since it
  sat above the group rather than below it — see MEMORY.md 2026-08-19), then
  back to badge-first (owner: "LIVE Server must be on top" — see MEMORY.md
  2026-08-21). If it moves again, don't assume either position is "settled" —
  check `MEMORY.md`'s dated log for the most recent instruction before
  guessing. If you add a badge to a *new* photo card, decide its position
  from scratch — the old absolute-positioned top-left version is gone, and
  there's no default to fall back on.

## Nav active-state — a fixed gotcha, don't reintroduce it

`js/main.js` has a scroll-spy (`setActiveLink`) that toggles `.is-active` on
nav links as the user scrolls.

- **Bug that was fixed**: it used to run against *every* nav link, including
  cross-page links like `href="forc3designer.html"`. Since those never match
  the `#<sectionId>` pattern the scroll-spy checks, it was wiping out the
  correct static `is-active` class (e.g. "FORC3 Designer" highlighted in the
  nav while on that page) on every single page load.
- **Fix in place**: only links whose `href` starts with `#` (same-page
  anchors like `#top`/`#contact`, only present on the homepage)
  participate in scroll-spying. Cross-page links keep whatever `is-active`
  state the page was rendered with, untouched.
- Also: the scroll-spy's default section is `'top'`, not `''` — because
  `#top` is a `<span>` marker, not a tracked `<section id="...">`. Without
  this default, "Home" would lose its highlight at the very top of the page.
- If you add new nav items: same-page anchor links auto-participate in
  scroll-spying; cross-page links are safe by default and need no special
  handling.

## Contact form (in `index.html`, the homepage)

- **Submits to Discord, not email.** It POSTs JSON
  (`{name, email, type, message}`) to `POST <worker>/contact`, and the
  Worker relays it into Discord channel `1534649367573827879` using the bot
  token. Endpoint constant: `CONTACT_ENDPOINT` at the top of `js/main.js`.
  **Live and verified end-to-end on 2026-08-18** — a real form submission
  returned 200 and posted to the channel. The Worker side is documented in
  [`docs/BOT-HANDOFF.md`](docs/BOT-HANDOFF.md).
- Worker-side validation confirmed by testing: missing fields and malformed
  JSON both return 400 (so bad input never reaches Discord), `GET /contact`
  falls through to 404, an `@everyone`/`@here` in the message body is
  neutralised by `allowed_mentions: { parse: [] }`, and a 4000-char message
  is truncated to 1500 rather than making Discord reject the embed.
- ⚠️ **Never put a Discord webhook URL in `js/main.js`.** This repo is
  public, so it would be world-readable (anyone could spam the channel), and
  GitHub's secret scanning gets Discord webhooks auto-revoked. The bot token
  must stay server-side in the Worker — that's the whole reason this goes
  through the Worker instead of posting to Discord directly.
- **Fallback**: if the Worker is unreachable or returns non-OK, the form
  falls back to the old `mailto:` hand-off so a backend outage never
  silently swallows a message. That's why `FORC3_EMAIL`
  (`forc3mod@gmail.com`) still exists at the top of `js/main.js` — it is no
  longer the primary path. UI copy still never spells out the address.
- Fields: name, email, a "type" `<select>` (Feature request / Bug report /
  General question / Something else), and a message `<textarea>` (no
  placeholder text — intentionally blank).
- Validation is manual JS (all 4 fields required + a basic email regex) —
  see the `contactForm` handler in `main.js`.

## Live driver count on `gt3forc3.html` — a cross-repo dependency

The hero on `gt3forc3.html` shows a live "GT3FORC3 servers // N drivers on
track" line, fed from **another project's** backend:

- Endpoint: `https://raspy-salad-d894.contact-eb9.workers.dev/discord/stats`
  — the GT3FORC3 Cloudflare Worker. Same source GT3FORC3.COM's own
  leaderboard uses, so the two sites always agree.
- It sends `Access-Control-Allow-Origin: *` and edge-caches for 120s, so
  calling it cross-origin from `forc3mod.com` is fine and cheap. The page
  re-polls every 90s.
- Response: `{ member_count, online_count, server_players }` where
  `server_players` maps a track id → players on that server. The pill names
  the Nordschleife server specifically, so `main.js` reads the
  **`nordschleife` key only** — it does *not* sum the servers. Summing under
  that label would misreport (e.g. 9 drivers on Spa must not appear as
  Nordschleife traffic).

**This is the only part of the site that depends on infrastructure outside
this repo.** Important consequences:

- That Worker lives in `gt3forc3-website` (deployed manually via the
  Cloudflare dashboard — see that repo's own notes). **Don't edit it from
  here.** If the shape of `/discord/stats` changes, this page breaks and the
  fix belongs in that repo.
- ⚠️ The track ids in `server_players` come from the Worker's
  `TRACK_KEYWORDS` map, which **gets reshuffled when servers change** — the
  key `nordschleife` is stable today but is not guaranteed forever. If it
  disappears, the pill silently stops showing (it fails safe rather than
  reporting a wrong number). If the counter mysteriously never appears, check
  that key in the Worker first.
- The same response's `member_count` also fills `[N MEMBERS]` inside the
  GT3FORC3 Discord CTA (`.btn__members`). One fetch feeds both, but they are
  updated **independently** — an empty track must not suppress the member
  count, and vice versa. Each hides itself if its own value is unreadable.
- **The pill only ever appears when someone is actually driving.** Zero
  drivers, a missing `nordschleife` key, a non-OK status, bad JSON — every
  one of those resolves to "render nothing". There is deliberately no
  empty/offline state: never "improve" this into showing `0 drivers`, both
  because it was explicitly asked for and because a count we couldn't read
  must never be rendered as a real one.
- The green is intentionally **not** themed — it reads as a live/online
  indicator, not page accent, matching the same status line on GT3FORC3.COM
  (same reasoning as the hardcoded blue on footer link hover).
- **Placement**: it renders as a pill on the hero title's *first line*, in
  the empty space beside "Race live." That means it lives **inside the
  `<h1>`**, so it must stay a `<span>` (an `h1` only accepts phrasing
  content — a `<p>` there is invalid). `.hero__title-line` is the flex row
  pairing the two; it replaces the old `<br>`, since a block-level flex child
  already pushes "Climb the..." to the next line. It wraps below the text on
  narrow screens rather than overflowing.
- Because it sits inside the `<h1>`, every inherited heading style has to be
  undone explicitly (font-size, weight, line-height, letter-spacing, colour)
  — otherwise it picks up the hero title's clamped display type.
- It needs an explicit `.live-status[hidden] { display: none }`, since a bare
  `[hidden]` loses to a `display` declaration.
- Trade-off accepted: the `<h1>`'s accessible name now includes the pill text
  ("Race live. GT3FORC3 servers // N drivers on track Climb the
  leaderboard."). That was the cost of putting it on the title line.

## FORC3 Designer download button — another cross-repo dependency

Both "Download for Windows" buttons on `forc3designer.html` (hero CTA and
the "What it does" section CTA) point directly at:

```
https://github.com/LachanceGL/forc3-designer-releases/releases/latest/download/FORC3-Designer-Setup.exe
```

- That's GitHub's "latest release" redirect URL, so it always serves
  whatever the newest published release's `FORC3-Designer-Setup.exe` asset
  is — **no code change needed here when a new version ships**, as long as
  the release in `forc3-designer-releases` keeps using that exact asset
  filename. If a future release renames the installer asset, this link
  breaks (404) until it's updated to match.
- `forc3-designer-releases` is a **separate GitHub repo** from this one and
  from the app's own source repo (`forc3-designer`, on Azure DevOps per
  `MEMORY.md`) — it exists purely to host built installer releases. Don't
  confuse the three: `forc3mod-website` (this repo, the marketing site),
  `forc3-designer` (ADO, the app's source), `forc3-designer-releases`
  (GitHub, built installers only).
- Both links carry `target="_blank" rel="noopener"`, matching this site's
  convention for every other external link (Discord, Patreon).
- As of 2026-08-21 when this was wired in, `CLAUDE.md`'s "What this is"
  section still describes FORC3 Designer as "still in development — not
  released yet." Wiring the download link doesn't by itself confirm a
  public release — if that status line goes stale, verify against whether
  the releases repo actually has a published release before trusting either
  claim over the other.

### "Hosted on GitHub" badge (added 2026-09-03)

A small `<span class="hero__source">` sits directly below the hero CTA row
in `forc3designer.html` — icon + "Hosted on GitHub" as **plain static
caption text, not an interactive element at all**. Owner request, from a
screenshot marking the empty space under the hero buttons.

- **Went through two corrections before landing here — both are dead ends,
  don't reintroduce either:**
  1. First shipped as an `<a>` styled as a pill (border, background,
     padding, border-radius — `.icon-btn`-style chrome) linking to
     `forc3-designer-releases`' releases page. Owner: "don't make it a
     button" — it read as a third CTA competing with the two real buttons
     above it.
  2. Stripped the box styling but kept it as a hover-tinting `<a>`
     (`var(--text-mute)` → `var(--text-dim)` on hover, still a real link).
     Owner: "nor a link" — even without box chrome, a hover color shift and
     a working `href` still reads as clickable.
  - **Current state**: a plain `<span>` (no `href` at all — not an `<a>`),
    static `color: var(--text-mute)` with no `:hover` rule and no
    `transition`. `cursor` is the browser default (`auto`), confirmed via
    `getComputedStyle`. It is purely informational now — there is nothing
    to click.
  - **Deliberately neutral/dark, not theme-lime** — owner said "neutral and
    darker" for the color itself, independent of the button/link
    corrections above. `.about__badge` and `.live-status` intentionally
    *do* pick up accent/status colors; this one doesn't and shouldn't.
- Icon is the GitHub Octocat mark, inline SVG, sized via the shared `.ico`
  class (`width/height: 1em`, `fill: currentColor` — see `css/style.css`
  line ~89) same as every other icon-in-a-pill on this site. No new SVG
  sizing rule needed.
- `index.html`'s hero has no CTA row (different layout — see its own
  markup), so this badge is `forc3designer.html`-only for now. If a future
  page wants the same "hosted on GitHub" credibility signal, `.hero__source`
  is generic enough to reuse as-is.

### FORC3 Grid's two hero buttons — one of them is dead until a build ships

`grid.html`'s hero has **"Download the app"** and **"Open the web version"**,
both with the same trailing arrow icon (owner, 2026-09-16 then 2026-09-21;
originally "Open FORC3 Grid" / "Paint one first", the second of which
pointed at `forc3designer.html`). The "Runs in your browser. Chrome or
Edge, on desktop." caption under them was removed 2026-09-21 on request, so
the buttons now sit in a plain `.hero__cta.hero__cta--offset` row like the
other pages — the `.hero__cta-group` wrapper only existed to keep that
caption aligned and went with it. `.hero__source` is still used by
`forc3designer.html`'s "Hosted on GitHub", so its CSS stays.

- **"Open web version"** → `https://grid.forc3mod.com`, the browser app.
  That's the one that actually works today.
- **"Download the app"** →
  `https://github.com/LachanceGL/forc3-grid-releases/releases/latest/download/FORC3-Grid-Setup.exe`
  — same "latest release" pattern as FORC3 Designer's button, and a
  **fourth** repo to keep straight (`forc3-grid-releases`, GitHub, built
  installers only). ⚠️ **It returns 404 as of 2026-09-16**: the repo exists
  but has **zero published releases**. Confirmed with the GitHub API and
  `curl` at the time of writing, and confirmed with the owner, who said
  "it will be the Github download link to the .exe, but it's not available
  yet" — so this is expected, not a bug to chase. It starts working on its
  own the moment a release is published *whose installer asset is named
  exactly `FORC3-Grid-Setup.exe`* — that filename is this doc's guess,
  copied from the Designer convention, not something read off a real
  release. **Check it against the first real release** rather than assuming.
- There's no `/forc3-grid-download` shim yet (the Designer has one). Add one
  the same way if a shareable `forc3mod.com` download URL is ever wanted.
- **Source of truth for what the app does is the Grid repo itself** —
  `G:\FORC3MOD\forc3-grid` (`README.md`, `CLAUDE.md`, `docs/ROADMAP.md`,
  `MEMORY.md`), not this page's old copy. On 2026-09-21 the hero lead was
  rewritten from it: the old line said packs install "re-linked to your own
  cars", which that project found on 2026-09-20 is the *wrong* behaviour —
  re-linking makes a livery drivable but invisible to other players, so a
  pack now carries the author's saved car and re-linking is only a fallback
  for old packs. The new lead also mentions the Community Grid (live on
  `grid.forc3mod.com`, Discord sign-in, uploads). **On 2026-09-22 the owner
  cut the author's-car clause from that lead** ("carrying the author's car
  with it, so the livery shows up exactly as it was made"), leaving
  "…installs the ones others share. Find more on the Community Grid." So the
  page no longer explains the mechanism anywhere — only the feature bullet
  "Drivers with the same pack see it on each other's cars online" hints at
  the result. Don't re-add it unasked; the removal was deliberate, twice over
  (the matching bullet went the day before). Re-read those docs before
  writing any new Grid copy here; the app moves faster than this page.
- The rest of the page was brought in line the same day, on request: the
  meta description, and the "What it does" list — "Installs with the
  author's car, so it looks the way they made it" replaced the re-link
  bullet, "Your game folder stays on your PC // nothing is uploaded unless
  you share it" replaced "Nothing uploaded" (the Community Grid takes
  uploads now), and a new bullet says **"Drivers with the same pack see it
  on each other's cars online"** (owner asked for something saying others
  will see it). Later that day the owner cut three of them — "Installs with
  the author's car…", "Spot broken or unlinked liveries…" and "Your game
  folder stays on your PC…" — leaving four: see every livery, pack into a
  `.grid`, install by dropping, and the online-visibility line. The
  author's-car point now lives only in the hero lead. A fifth bullet went in
  **first** the same day, on request: "Create and export liveries directly
  from FORC3 Designer" (the two apps share the same `ExternalLiveries`
  folder, which is what makes that true).
- ⚠️ **That multiplayer claim rests on one measurement** —
  `forc3-grid`'s `docs/ACEVO_LIVERIES.md`, "SOLVED (2026-09-18)": two of the
  owner's machines, each with the pack installed carrying the author's saved
  car, both saw the livery on the other's car in a session. It holds
  *because* both hold the same `car_guid`; a pack installed through the old
  re-link fallback would not. Keep the wording to "drivers with the same
  pack" — don't widen it to "everyone online sees your livery", which is
  not what was measured.
- The "What it does" section has **no button** since 2026-09-21 (owner:
  "remove that bottom button" — it was an unlabelled "Open FORC3 Grid" to the
  web app). The section now ends on its feature list, so a generic
  `.feature-list:last-child { margin-bottom: 0 }` drops the 26px that only
  spaced the list from a button; left in, it sat the text 13px above centre
  beside the card (measured 0px off centre after). Lists followed by a button
  (FORC3 Designer, Support Us) keep their 26px.

### FORC3 Grid's hero icon row and changelog (added 2026-09-21)

Owner: "just like the Designer page, add the Icon and changelog next to it".
`grid.html`'s hero now opens with the same `.hero__icon-row` as
`forc3designer.html`: `img/grid-icon.png` plus a "Change Log" button that
opens a `#changelog` modal. All shared CSS and the generic modal system in
`main.js`, so there are no CSS or JS changes. Measured identical to the Designer
row at 1440px (64px icon, 16px gap, 37px button, same left edge as the title).
`grid.html#changelog` deep-links like the Designer's, and entries are
`#v0-1-0` style.

- ⚠️ **The changelog has one placeholder entry on purpose: "v0.1.0 //
  Coming soon".** No FORC3 Grid release is published: `forc3-grid-releases`
  has only a **draft** v0.1.0, created 2026-09-17. Its notes predate two of
  the Grid project's own findings and now contradict the app and this page.
  They call re-linking "the whole reason this exists", and they say
  multiplayer visibility is "not verified". Since then, the 2026-09-18
  two-machine run verified it, and on 2026-09-20 re-linking was demoted to a
  fallback. Nor is it clear whether the v0.1.0 binary itself carries the
  author's car or still re-links, so rewriting those notes here would risk
  stating something false about that exact build. Fill the entry from the
  release notes once v0.1.0 is actually published (and corrected), using the
  Designer's entry markup.
- **Good news for the download button:** that draft already carries an asset
  named exactly `FORC3-Grid-Setup.exe`, alongside the versioned
  `FORC3.Grid_0.1.0_x64-setup.exe`. So the hero's
  `releases/latest/download/FORC3-Grid-Setup.exe` link should start working
  the moment the draft is published, with no change here. That filename was a
  guess until this check. Re-verify with `curl` after publishing, since only
  published releases resolve through `latest`.
- Checked via `gh api` (authenticated read) because unauthenticated API calls
  don't show drafts — which is why earlier checks reported "zero releases".

### `forc3mod.com/forc3-designer-download` — a shareable link

`forc3-designer-download/index.html` is a static redirect shim
(`<meta http-equiv="refresh">`, same technique as `designer.html`'s
legacy-URL shim) to the same "latest release" GitHub URL above. Exists
purely so the download link can be handed out as a `forc3mod.com` URL
instead of a raw `github.com` one — the owner asked for this directly ("it
needs to be a forc3mod.com url, is that possible"). GitHub Pages serves it
at `https://www.forc3mod.com/forc3-designer-download` (the folder +
`index.html` gives the clean URL, no `.html` needed) for free, no
server/build step required — same static-hosting mechanism as every other
page on this site.

- **Path history**: this folder was named `download/` initially, then
  renamed to `forc3-designer/`, then to its current
  `forc3-designer-download/` — all in the same request/session, owner
  iterating on the exact URL wanted. If asked to change this path again,
  rename the folder with `git mv` (not create a new one) and update the
  in-file `<link rel="canonical">` to match, same as done each time here.
- **Styled to match the site, not left as plain HTML** (owner: "make it
  dark mode and look better, themed with we have if people are going to
  see this") — loads the real `/css/style.css` and the real Rajdhani/Roboto
  Google Fonts link, shows the actual `img/forc3mod-logo.svg` and a
  `.btn.btn--primary` fallback button, on a dark background with a soft
  blue radial glow (same accent-glow language as the banner/cards
  elsewhere). Root-absolute asset paths (`/css/style.css`, `/img/...`) are
  required here specifically because this page lives one folder deep
  (`/forc3-designer-download/`) — a relative path would resolve against
  that folder instead of the site root and 404, same class of gotcha as
  the photo-card `url()` note elsewhere in this doc.
  - In practice almost nobody ever sees this — the `<meta http-equiv=
    "refresh">` above fires instantly for any normal visitor. It's styled
    anyway for the rare case a browser/extension blocks the redirect, so
    it still reads as forc3mod.com rather than a bare unstyled fallback.
  - **Verification note**: this page's own meta-refresh made it hard to
    screenshot normally (it immediately redirects away) — but the Browser
    pane tool used for testing explicitly denies navigating to
    download-triggering URLs (see the verification-gap note above), so in
    *that* tool specifically the redirect never fires and the styled page
    stays put — useful for checking it, not a general trick for viewing
    pages that redirect elsewhere.

- Points at the `latest` redirect (not a version-pinned URL), so it stays
  current automatically exactly like the on-site buttons — no edits needed
  when a new version ships, as long as the release keeps using the
  `FORC3-Designer-Setup.exe` asset name.
- **Couldn't fully verify the download actually fires inside the Browser
  pane tool** — navigating to a download-triggering URL is explicitly
  denied by that tool's own sandbox ("navigation to ... was denied or
  failed"), unrelated to whether the redirect itself works. Confirmed
  instead that: the meta tag renders with the correct URL, and that exact
  GitHub URL already returns `200` with the correct
  `Content-Disposition: attachment` header (checked via `curl` when the
  buttons above were first wired in) — same mechanism the two on-page
  `<a href>` buttons already use successfully. If this specific link is
  ever reported not working, don't assume the shim technique is broken;
  check the actual GitHub asset/URL first, same as for the other two
  buttons.

## Modal system (`js/main.js`)

Generic, reusable pattern — reuse this for any future popup instead of
building a new one:
- Any element with `data-modal-target="#someId"` opens the modal with that id.
- Any element inside the modal with `data-modal-close` closes it.
- Clicking the backdrop or pressing Escape also closes it.
- Currently used for: the Changelog modal and the demo video modal, both on
  `forc3designer.html`.
- Any `<video>` found inside a modal plays automatically when that modal
  opens and pauses + rewinds to 0 when it closes (generic — applies to any
  future video modal too, not hardcoded to the demo one). See "Demo video
  modal" below for the current instance.
- **Opening a modal no longer shifts the page** (fixed 2026-09-21; owner: "the
  whole site slightly move to the right"). `openModal()` locks scrolling with
  `overflow: hidden` on `<html>` and `<body>`, which removed the scrollbar:
  the page got ~10px wider and every centred element jumped ~5px right.
  `html { scrollbar-gutter: stable }` in `style.css` keeps the scrollbar's
  space reserved while locked; measured 0px shift on all three modals at
  1440 and 375px. Don't "fix" it instead by padding `<body>` in JS — the CSS
  property needs no measuring and can't drift. Note `clientWidth` still
  reports the old 1430 → 1440 change during a lock; measure element
  positions, not `clientWidth`, to check this.
- **Only one modal is ever open at a time.** Opening a modal closes any
  other currently-open one first. A mouse can't normally trigger this itself
  (an open modal's fixed-position overlay covers every trigger button on the
  page), but a keyboard user tabbing past the covered buttons still can —
  found by testing that path directly, not by inspection. Fixed in
  `openModal()` at the top, not as a special case.

### Every modal is deep-linkable (added 2026-08-28, on request)

Opening a modal pushes its own `id` onto the URL hash via
`history.pushState` (e.g. `forc3designer.html#changelog`), and closing
it (via close button, backdrop click, or Escape) clears the hash again via
`history.replaceState`. Loading a page with a matching hash already in the
URL opens that modal automatically on load. This is generic — it falls out
of the existing `data-modal-target`/modal-`id` wiring, so any future modal
gets a shareable link for free, no extra markup needed.

- Deliberately uses `pushState`/`replaceState` rather than setting
  `location.hash` directly — the latter triggers the browser's native
  scroll-to-anchor behavior, which this sidesteps entirely rather than
  relying on it being a harmless no-op for a `position: fixed` overlay.
- **A `hashchange` listener also opens/closes modals when the hash changes
  without a full page reload** (added 2026-08-28, once a second modal
  existed on the same page and exposed the gap). The original "open on load"
  check only runs once, during the page's initial script execution — it does
  NOT re-fire for a same-document hash change (typing a different hash into
  an already-loaded page's address bar, an in-page link jumping from one
  modal's hash straight to another's, or the browser's back/forward buttons
  moving between two hash states). Confirmed via `location.hash = '#other'`
  in a live tab that the original code silently did nothing in that case.
  The `hashchange` listener fixes all of those in one place: it finds
  whichever modal's id now matches the hash and opens it, and closes any
  open modal whose id no longer matches. This also means back/forward now
  closes an opened modal for free — an earlier version of this doc scoped
  that out as unnecessary, but it falls out of the same fix at no extra
  cost, so there's no reason to avoid it.
- Shareable URL for the changelog: `forc3designer.html#changelog`. Modal
  element id was renamed from `changelogModal` to plain `changelog`
  (2026-08-28, owner: "remove model from the link") purely for a cleaner
  URL — no behavior change, the deep-link system reads `modal.id`
  generically either way.
- Shareable URL for the demo video: `forc3designer.html#demo`.
- **Individual id'd elements inside a modal are linkable too** (added
  2026-08-31, on request — "changelogs should also have a specific link to
  them"). Any element inside a modal with its own `id` (e.g. one changelog
  version entry) is a `linkableEntry`: expanding a `<details>` one (by hand
  or via a matching hash) pushes *its own* id onto the hash instead of the
  modal's, and loading/jumping to that hash opens the containing modal,
  expands that one `<details>`, and scrolls it into view
  (`scrollIntoView`). Collapsing a linked entry falls back to the modal's
  own hash (`#changelog`), not an empty one — the modal is still open, it
  just no longer points at one specific entry. This is generic (matches any
  `[id]` inside a modal, not hardcoded to `.modal__entry`), so it costs
  nothing to add a linkable id to some future modal's internals.
  - Changelog entry ids are `v0-3-0`, `v0-2-1`, `v0-2-0`, `v0-1-2`,
    `v0-1-1`, `v0-1-0` (dashes, not dots — plays nicer as a URL fragment and
    avoids ever needing to escape a `.` in a selector). **Add a matching id
    to every new changelog entry going forward** — it's what makes
    `forc3designer.html#v0-3-0` linkable directly to that version.
  - Doesn't force-collapse other entries when jumping to one via hash —
    native `<details>` here allows multiple open at once, and jumping to a
    new entry only guarantees *that one* is open+visible, it doesn't touch
    whatever else was already expanded.
  - **Testing note**: a `<details>` element's `toggle` event does not fire
    perfectly synchronously with the click that causes it (confirmed:
     checking `location.hash` immediately after a synthetic `summary.click()`
    saw the old value; a small delay — or a real user click, which never
    hits this in practice — showed the update). Don't be fooled by a
    synchronous check into thinking the toggle-updates-hash wiring is
    broken; verify with a short `setTimeout`/`await` after the click.

### Modal widths — `.modal` / `.modal--wide` / `.modal--video`

Three sizes, all set by `max-width` on the modal box (each keeps `width:
100%`, so they shrink to fit narrow viewports on their own):

- `.modal` — 520px. The plain text-modal default.
- `.modal--wide` — 720px. **The changelog uses this** (added 2026-09-06, on
  request: "make so the popup window is wider"). It was on the bare 520px
  base until then, which got cramped once entries started embedding release
  screenshots and clips (see "Embedded release media" above) — 520px minus
  56px of padding left the side-by-side image row ~230px per image.
- `.modal--video` — 900px, plus the padding/overflow overrides described
  below.

720px rather than reusing 900px: the changelog is mostly prose, and a
900px box would put body text on an ~844px line. If a future text modal
also wants more room, reuse `.modal--wide` rather than adding a fourth
size.

### Demo video modal (added 2026-08-28, on request)

`forc3designer.html`'s hero "See what it does" button (`data-modal-target="#demo"`)
opens a modal playing `video/forc3designer-demo-03.mp4` — brought back after
being removed earlier (it used to scroll to `#features`) once an actual demo
video existed to show. The video file itself gets swapped in place as newer
demos are provided (see the file map's `video/` rows) — just update the
`<video src>` and, if the new file's own pixel dimensions differ, the
`aspect-ratio` below to match.

- **`.modal--video`** is a wider, padding-stripped variant of the base
  `.modal` (900px vs the text modals' 520px, or 720px with `.modal--wide`) — a video reads as a cinematic
  player, not a document in a card, so it gets no header/title row.
- **The close button (`.modal__close--video`) sits just above the video's
  top-right corner, outside its bounds** — it originally floated directly
  over the video, which the owner flagged as covering the content; moved
  to `position: absolute; top: -48px; right: 0` relative to `.modal--video`.
  That only works because `.modal--video` also overrides `overflow:
  visible` — the base `.modal` rule sets `overflow-y: auto` (which per the
  CSS spec forces the other axis to compute as `auto` too, not `visible`),
  and either `auto` or `hidden` would clip a negatively-positioned child the
  same way. The video's own rounded corners moved to `.modal__video`'s own
  `border-radius` instead of relying on the parent clipping them, since the
  parent no longer clips anything.
- **`.modal__video`'s `aspect-ratio: 1960 / 1080`** is the source file's own
  real pixel dimensions (read off it directly), same pattern as
  `FD_SitePreview.jpg`'s photo card sizing — if the video file is ever
  replaced with a different-shaped one, update this to match, don't assume
  16:9.
- **`controlsList="nodownload noplaybackrate"` +
  `disablePictureInPicture` + `disableRemotePlayback`** on the `<video>`
  suppress Chrome's native "⋮" overflow menu (download / playback speed /
  picture-in-picture / cast) — owner request ("remove the 3 dots options").
  Fullscreen is untouched; that's a primary control, not part of the
  overflow menu.
- `preload="none"` on the `<video>` so nothing downloads until a visitor
  actually opens the modal — the file is ~22MB, too large to load eagerly
  for every visitor.
- Autoplay is attempted (`.play().catch(() => {})`) but not forced — a
  user-gesture-triggered open (button click) reliably autoplays in every
  browser that matters here; a hash-driven page load with no prior gesture
  may get silently blocked by the browser's autoplay policy, in which case
  the video just sits paused with visible `controls` for the visitor to
  press play themselves. This is expected, not a bug to chase.
- **`index.html` used to carry a "See what it does" button** linking to
  `forc3designer.html#demo` — a plain link, reusing the deep-link system
  rather than duplicating the modal. It was replaced on 2026-09-22 by
  "Meet FORC3 Grid" when the homepage hero was rebalanced across both
  products (see "Homepage hero"), so **the demo is no longer reachable from
  the homepage** — only from the FORC3 Designer page's own hero. If it should
  come back, `<a href="forc3designer.html#demo">` is all it takes; don't
  duplicate the modal markup. Single source of truth for that modal; if a
  second page ever needs its own inline player, duplicate the block there.

### Changelog modal content — sourced from a doc, and from GitHub releases

[`docs/DESIGNER-CHANGELOG.md`](docs/DESIGNER-CHANGELOG.md) is the
**authoritative source** for the modal's entries (owner request,
2026-08-21) — same handoff pattern as `forc3-designer`'s
`docs/TooltipsTexts_Bindkeys`. When the owner gives new changelog content,
update that file first, then propagate it into `forc3designer.html`.

- **From now on (owner request, 2026-08-21), proactively check
  [`forc3-designer-releases`](https://github.com/LachanceGL/forc3-designer-releases/releases)
  for new releases** rather than waiting to be handed changelog text — its
  API (`https://api.github.com/repos/LachanceGL/forc3-designer-releases/releases`,
  no auth needed) exposes each release's body, which has a "What's new in
  X.Y.Z" section. That section *is* the changelog — the rest of the release
  body (download link, the "Windows protected your PC" note, the repeated
  footer blurb) is release-page boilerplate, strip it before using it here.
  Do this whenever asked to update the changelog, and also opportunistically
  when doing other FORC3 Designer work on this repo — don't require the
  owner to paste release notes in by hand.
- Keep the doc and the modal in sync in the same commit; don't let one drift
  from the other. Plain HTML/text + doc edit, no `?v=` bump for content-only
  changes — only bump it if you also touch `css/style.css` (e.g. the
  accordion styling below).

**Modal markup — each entry is a `<details>/<summary>` accordion**
(added 2026-08-21, replacing a flat one-line-per-entry layout), on request
("make so each title is a drop-down menu showing the actual changelog
inside it — must be like that from now on"). Native `<details>` needs no
JS for expand/collapse and is keyboard/screen-reader accessible for free —
don't reach for a custom JS toggle here. Shape for each entry:

```html
<details class="modal__entry">
  <summary class="modal__version"><span class="modal__version-text">vX.Y.Z <span class="modal__date">// Mon D, YYYY</span></span></summary>
  <div class="modal__entry-body">
    <p>Intro paragraph.</p>
    <h4>Optional grouping</h4>
    <ul class="feature-list"><li>...</li></ul>
  </div>
</details>
```

- **Collapsed title is date-only** (changed 2026-09-05, owner: "make so
  theres no title like that, only the date" — a screenshot marked every
  entry's summary text in red strikethrough). Was `vX.Y.Z — Short summary
  // Mon D, YYYY`; the `— Short summary //` part is gone, leaving
  `vX.Y.Z // Mon D, YYYY` (the separator was an em dash until 2026-09-15 —
  see "No em dashes in visible copy" below). Applied to all 9 existing entries, not just the
  newest — this is a title-format change, not a per-release decision.
  `docs/DESIGNER-CHANGELOG.md`'s one-line summary is now doc-only (still
  worth writing for anyone skimming that file) — it no longer gets
  propagated into the `<summary>` markup for new entries either. HTML-only
  change, no `?v=` bump.
- **`<summary>` MUST wrap its text in one `.modal__version-text` span — never
  put the version text and `.modal__date` span as siblings directly inside
  `<summary>`.** `.modal__version` (the `<summary>`) is `display: flex;
  justify-content: space-between` so the chevron pseudo-element lands on the
  right. A bare text node ("vX.Y.Z ") sitting next to the `.modal__date`
  span as **separate** flex children becomes two flex items, and
  `space-between` shoves a visible gap between them — shipped exactly this
  bug once (screenshot: owner reported "fix the alignment", 2026-08-21).
  Wrapping both in one span makes it a single flex item again, only
  separated from the chevron. If you ever add a 4th piece of text to the
  summary line, put it inside the same wrapper span too, not as a new
  direct child of `<summary>`.
- **All entries start collapsed** — no `open` attribute on any of them
  (owner request, 2026-08-21, right after the accordion shipped: "make so
  they are all collapsed by default"). The newest entry briefly shipped
  with `open` by default; that was reverted. Don't reintroduce `open` on
  any entry without being asked again.
- `.modal__version` (now the `<summary>`) gets a generated chevron via
  `::after` that rotates on `[open]` — see `css/style.css`'s "Modal" section.
  Don't add a real chevron element in the markup; the CSS already handles it.
- `.modal__entry-body`'s `<h4>` subheadings are optional — only add them
  when the release itself grouped changes (e.g. "Fixes" / "Layers" /
  "Elsewhere" in v0.1.2). A short release (like v0.1.0/v0.1.1) can just be
  one or two `<p>` tags with no subheadings.

### Embedded release media inside a changelog entry (added 2026-09-05)

The GitHub release itself often embeds screenshots/clips inline under the
bullet they illustrate (owner: "do something similar to what forc3-designer
is doing... we must add those markers and their content also"). v0.5.0's
entry does the same — mirror this for future entries whenever the release
body has inline images/videos, don't just take the text and drop the media.

- **Hotlink the GitHub release asset URLs directly** (e.g.
  `https://github.com/LachanceGL/forc3-designer-releases/releases/download/vX.Y.Z/Name.ext`)
  — don't download and re-host these under `img/`/`video/`. Unlike the demo
  video and app screenshots (which are owner-provided outside of any
  release and belong in this repo), these assets already live permanently
  at a stable, version-pinned URL as part of the release itself; hotlinking
  keeps the repo smaller and never goes stale (the URL is pinned to that
  exact tag, unlike the "latest" download link elsewhere on this page).
  - These URLs respond with `Content-Disposition: attachment` and
    `Content-Type: application/octet-stream` (confirmed via `curl -I`) —
    that looks like it should force a download, but **verified directly**
    (loaded one in a real `<img>`/`<video>` element and checked
    `naturalWidth`/`videoWidth`) that browsers ignore both headers for a
    subresource load and render the actual bytes normally. Don't assume
    these need to be re-hosted just because of those headers.
- **Markup shape**: a `<video class="modal__entry-media">` or
  `<img class="modal__entry-media">` sits **inside the `<li>`, after the
  bullet's own text** — not in a separate paragraph. For two images meant
  to sit side by side (e.g. the two Cyberpunk kit screenshots), wrap both
  in one `<span class="modal__entry-media-row">` instead of two separate
  `.modal__entry-media` elements. Video: set `style="aspect-ratio: W / H"`
  inline using the file's own real pixel dimensions (checked once per file
  via a live `<video>` element's `videoWidth`/`videoHeight` — same
  "measure the real file, don't assume" convention as `.modal__video`
  elsewhere in this doc), plus the same `controls preload="none" playsinline
  controlsList="nodownload noplaybackrate" disablePictureInPicture
  disableRemotePlayback` attribute set as the demo video, for the same
  reasons (suppress the native overflow menu, don't eagerly download).
  Image: set real `width`/`height` HTML attributes instead (the standard
  CLS-safe technique for a genuine `<img>` tag, as opposed to the demo's
  CSS-background photo card, which can't use attributes and needs
  `aspect-ratio` in CSS instead).
- **`.modal__entry-media` in `css/style.css`** is generic — `display:block;
  width:100%; height:auto;` plus the modal's usual rounded-corner/border
  treatment. `.modal__entry-media-row` is a `display:flex; gap:8px` wrapper
  whose `.modal__entry-media` children get `flex:1 1 0; min-width:0` so two
  images split the width evenly.
- ⚠️ **`.modal__entry-body li` needed `display:flex; flex-direction:
  column` added to it (previously plain block flow) for this to lay out
  correctly** — found the hard way: a block-level `<video>`/`<img>` sitting
  in a `<li>` right after a raw text node rendered at a fixed width (turned
  out to be correct — 100% of the `<li>`'s own content box) but positioned
  as if still inline-flowing after the text, overflowing the modal's right
  edge instead of dropping to its own full-width line below. This
  reproduced identically at both a ~375px and a 1280px viewport (ruled out
  a narrow-viewport-specific cause) and is inconsistent with what
  `display:block` is supposed to do in any spec-compliant browser — almost
  certainly a limitation of this project's own testing setup (the preview
  browser tool used for local verification) rather than something real
  visitors would see, especially since the *same* tool was also caught, in
  the same session, not applying the standard `details:not([open]) >
  *:not(summary){display:none}` UA rule (see the toggle/autoplay item
  below) — i.e. this specific rendering engine has now shown two gaps
  against ordinary, decades-old CSS behavior. Rather than ship on faith
  that real browsers would render it correctly, the `<li>` was switched to
  the same flex-column stacking technique already proven to work correctly
  in this environment for `.modal__entry-media-row` (a raw text run becomes
  one anonymous flex item, the media becomes another, `align-items:
  stretch` gives both full width) — removes the ambiguity entirely rather
  than trusting either the testing tool or spec-reasoning alone. Confirmed
  fixed via `getBoundingClientRect()` sweep of every descendant (zero
  elements crossing the modal's own edge) at both viewports, not just a
  screenshot — this environment's screenshots are separately known to be
  unreliable (see "Working conventions" below), so a geometry check is the
  standard of proof here, not a visual read.
- ⚠️ **The existing "any `<video>` in a modal autoplays on open, pauses on
  close" logic in `js/main.js` only ever looked at the modal's *first*
  video** (`modal.querySelector('video')`, singular) — fine when the demo
  modal was the only modal that could ever contain one, broken the moment
  a second modal (the changelog) could contain *several*. Reworked to be
  correct for any number of videos in any modal, generically:
  - `openModal()` now autoplays only a video that isn't inside a collapsed
    `<details>` — checked via `!video.closest('details:not([open])')`,
    **not** `offsetParent !== null`. The `offsetParent` approach was tried
    first and looked reasonable (a collapsed `<details>`'s content should
    have no layout box) but was proven wrong live: even a bare, freshly
    created `<details><summary></summary><p>x</p></details>` reports
    `getComputedStyle(p).display === 'block'` in this project's preview
    browser tool when collapsed — i.e. the same missing UA-stylesheet rule
    noted above, discovered via this exact bug. Checking the ancestor
    `<details>`'s own `.open` property instead is semantic (what actually
    matters — is this content collapsed) rather than layout-derived (how
    a particular engine happens to render that), so it's correct
    regardless of whether a given browser implements that UA rule.
  - `closeModal()` now pauses + rewinds **every** video in the modal
    (`modal.querySelectorAll('video')`), not just the first — otherwise a
    changelog preview clip played inside an expanded entry would keep
    playing invisibly after the whole modal was dismissed.
  - Collapsing a linkable `<details>` entry (already-existing toggle
    listener, used for the hash-linking behavior) now also pauses +
    rewinds any `<video>` inside that specific entry — so a clip doesn't
    keep playing after its own accordion section is closed, independent of
    whether the whole modal closes.
  - Preview clips do **not** autoplay when their entry is merely expanded
    (only the demo modal's single video autoplays, on modal-open) — a
    changelog clip is click-to-play via its own native `controls`, matching
    how GitHub's own release page presents these (no autoplay there
    either).
  - `?v=` bumped for both `css/style.css` and `js/main.js` across all 4
    pages in the same commit — this touched both files.

## Discord / community reference IDs

- **"GT3FORC3", one word, no space — not "GT3 FORC3".** The site used both
  inconsistently until 2026-09-03 (nav/footer/title said "GT3 FORC3", but
  the hero already said "GT3FORC3.COM"/"GT3FORC3 Discord"). Owner asked for
  the space removed everywhere; every page-visible instance was normalized
  to the no-space form in that pass. Don't reintroduce the spaced version —
  the filename (`gt3forc3.html`) and the real domain (`gt3forc3.com`) were
  already one word, so no-space is the correct/consistent form.
- FORC3MOD Discord invite: `https://discord.gg/CbJCmjtVma`
- GT3FORC3 Discord invite: `https://discord.gg/dfcK4x64vb` — only linked
  from `gt3forc3.html`'s hero CTA now. It used to be a "Discord / GT3FORC3"
  footer link on every page too; removed 2026-09-10 (see below).
- **Footer Community column is FORC3MOD-only, labels are bare platform
  names**: Facebook, Discord, X, Instagram (in that order). Until
  2026-09-10 they read "Facebook / FORC3MOD" etc., with a "Discord /
  GT3FORC3" entry alongside. The owner removed the GT3FORC3 one ("we only
  show the FORC3MOD ones, so no need to precise it anymore"), which made
  the " / FORC3MOD" suffix redundant, so it went too. Don't re-add a
  suffix unless a second community's link comes back into this column.
- Patreon: `https://www.patreon.com/cw/forc3mod/membership`
- Buy Me a Coffee: `https://buymeacoffee.com/forc3mod` — added 2026-09-10 as
  the second option in the header "Support us" dropdown (see below), the
  Patreon link's first-ever alternative on this site.
- Support-channel guild ID: `1534614323534499891` — **this is the one to use
  for channel deep links.**
- "Report a Bug" channel ID: `1534648749043879936`
  → `https://discord.com/channels/1534614323534499891/1534648749043879936`
- "Make a Suggestion" channel ID: `1534648689300341057`
  → `https://discord.com/channels/1534614323534499891/1534648689300341057`
- `906573991492349962` is the **old** guild ID, superseded on 2026-08-17.
  Deep links used to point at it; they're all updated now. Treat any
  reappearance of it as stale, not current.
- The header's "FORC3MOD Discord" button and the Support Us page's hero
  Discord button were both **intentionally removed** by request. Support Us
  now has zero Discord CTAs on purpose — don't add one back without asking.
- X (Twitter): `https://x.com/forc3mod`. Linked in the footer's Community
  column (all 4 pages, plain text link matching the Discord entries' style)
  and as a circular `.icon-btn` in the header, immediately **before** the
  Discord button, on `index.html`, `forc3designer.html`, and `gt3forc3.html`
  only — `SupportUs.html` has no header Discord button (see above), so
  there's no "next to Discord" slot there; it wasn't added to that page's
  header. Icon is the current X logo (not the old bird), inline SVG, reusing
  the site's existing `.icon-btn` treatment (same class as the hamburger and
  modal-close buttons) rather than a new one-off style.
- Instagram: `https://www.instagram.com/forc3mod/`. Same treatment as X —
  footer Community column link on all 4 pages (added below the X link), plus
  a header `.icon-btn` right after the X icon (before Discord), on the same
  3 pages. Both header icons share the `.header__social` class — see "Header
  social icons — an overflow gotcha" below.
- Facebook: `https://www.facebook.com/61593866946389/`. Same treatment
  again, added 2026-08-31 — footer Community column link **first**, above
  Discord (owner: "add at the top"), and a header `.icon-btn` first among
  the social icons (before X), on the same 3 pages. Also `.header__social`.

## Header social icons — an overflow gotcha, don't reintroduce it

`.header__actions` holds (in order): the hamburger, the Facebook icon, the
X icon, the Instagram icon, the Discord button, then "Support us" — on
`index.html`, `forc3designer.html`, `gt3forc3.html`. All three social icons
share the `.header__social` class, a circular `.icon-btn` each.

- **Bug hit and fixed (2026-08-21, adding the Instagram icon)**: with two
  social icons plus the hamburger, X, and Discord's icon-only mobile state
  all competing for space, the header row stopped fitting at **~401px** of
  *client* width even with the existing 480px-breakpoint gap/logo
  reductions already applied — real phones in the ~375-400px range
  (including iPhone 12/13 at 390px) overflowed. Fixed by hiding
  `.header__social` below a breakpoint (see below for the current value).
- **Bug hit and fixed again (2026-08-31, adding Facebook as a third icon)**
  — exactly the warning this doc already had: three icons need more room
  than two did. Required width jumped to **~443px**, overflowing the
  then-current 410px breakpoint by 32px at 411px. Confirmed the fix was
  real (not a stale-cache false read) by checking with `curl` directly
  against the local dev server — the served HTML already had 3 icons — while
  a freshly opened Browser-pane tab still rendered only 2; a cache-busting
  query string on the URL was what finally forced a true reload. Breakpoint
  raised from 410px to 450px (**570px** since 2026-09-16 — that 443px
  figure was measured with the 480px logo/gap reductions already applied,
  which don't apply across most of the range the icons are visible in; see
  "Header breakpoint ladder") (still a few px of buffer above the 443px
  measurement, same margin logic as the original fix). Verified no overflow
  at 450px (hidden) and 451px (all 3 visible) right at the edge, and no
  overflow at 375px.
- **The Facebook glyph is recentred in the markup, not with CSS** (2026-09-06,
  owner: "the Facebook icon is not well center and should be 5% bigger").
  `.icon-btn` flex-centres its `<svg>`, but that only centres the *box* —
  Facebook's artwork is not centred inside its own 24x24 viewBox. Measured
  with `getBBox()`: its bbox centre is **12.10 / 14.12** against the box's
  own 12 / 12, i.e. ~2.1 units low, so the "f" rendered visibly below
  centre while X (12.04 / 12) and Instagram (12 / 12) were already fine.
  Fixed by shifting that `<svg>`'s viewBox origin on all 3 pages that have
  the icon. **Don't "simplify" it back to `0 0 24 24` and nudge with a CSS
  transform instead**, and don't assume a new icon's artwork is centred in
  its viewBox just because the box is square — measure with `getBBox()`
  first.
- **Current values: `viewBox="0.1 2.12 24 24"`, rendered at 18.39px.**
  The `2.12` is the vertical recentring above — it's the artwork's own
  offset in viewBox space, so it holds at any render size. `0.1` is the
  horizontal recentring value with **no left/right nudge on top of it** —
  a 2026-09-06 owner request added a 1px-left nudge (`0.1 -> 1.405`,
  see the math below), then a 2026-09-07 request ("1px to the right")
  removed it again by subtracting the same 1.305 units back off, landing
  exactly on the original `0.1` centred value rather than overshooting past
  it. The size is two owner-requested bumps over the shared 17px — +5%,
  then +3% (17 -> 17.85 -> 18.39) — unaffected by this horizontal change.
- ⚠️ **minX and render size are coupled — changing the size means
  recomputing any nudge on top of `0.1`.** A viewBox unit is `size / 24`
  px, so a fixed-px nudge is a different number of units at every size: at
  18.39px, 1px = 24 / 18.39 = 1.305 units (hence the `0.1 + 1.305 = 1.405`
  used between 2026-09-06 and 2026-09-07). Recompute from `size / 24`
  rather than carrying an old nudge's unit count over if the size ever
  changes again.
- The size bumps don't change the overflow story: re-checked at 451px
  after each, the header still fits with all 3 icons visible.
- **If you add a fourth header social icon**, re-measure the same way
  (resize down from a wide viewport, binary-search the width where
  `header.scrollWidth > header.clientWidth` flips true) rather than assuming
  450px still holds. If a Browser-pane check ever contradicts a `curl`
  check of the same URL, trust the `curl` result for what's actually
  deployed — the discrepancy is almost certainly the preview tab's own HTTP
  cache (the local dev server's HTML isn't `?v=`-busted the way `css`/`js`
  are), not a real bug; force it with a cache-busting query string rather
  than concluding the fix didn't work.

## Header "Support us" dropdown — a responsive gotcha, don't reintroduce it

"Support us" used to sit inside `<nav class="nav">` with the other nav items,
then became a plain link relocated into `.header__actions`. **As of
2026-09-10 it's a dropdown** (owner request: "add a drop down where it shows
2 cards, One is Patreon... and the other one is Buy us Beers") — same
`.nav__group`/`.nav__toggle`/`.nav__menu` mechanism "Get support" already
uses (see "Nav dropdown system" below), so no JS changes were needed at all;
`main.js`'s dropdown wiring is `document.querySelectorAll('.nav__group')` and
picks up any number of groups automatically. The two links inside are:
**Patreon** (`https://www.patreon.com/cw/forc3mod/membership`, with the
Patreon logo as an inline SVG — Simple Icons' current 24x24 path, no local
asset needed) and **Buy Us A Beer** (`https://buymeacoffee.com/forc3mod`,
plain 🍺 emoji, no SVG — simplest option for a single-glyph icon that doesn't
need currentColor theming). Label wording has moved several times: the
owner's original request phrasing ("Buy us Beers") → "Buy Beers" → "Buy A
Beer" (all 2026-09-10) → current "Buy Us A Beer" (2026-09-13; still fits
one line in the fixed 104px header card). Older mentions of "Buy A Beer"
below refer to the same card. Treat the label as settled
on whatever CLAUDE.md/the live markup currently say, not on any of the
earlier quoted phrasings in this doc's history. **Card order differs by
location, on purpose (both set by the owner, 2026-09-10):** header and
mobile-drawer copies were Buy A Beer first until 2026-09-14, when the owner
asked for Buy Us A Beer "under instead" in the header dropdown: **all three
copies are now Patreon first, then Buy Us A Beer**. The header dropdown
stacks its cards vertically (`.header__actions .nav__menu--cards {
flex-direction: column; min-width: 0 }`); the drawer and footer copies stay
side by side. Same on all pages including `grid.html`'s header. The
footer's toggle line (`<button ... class="nav__toggle" ...>Support us</button>`,
no `.nav__link`) is unique per page, so anchor footer-only markup edits on
it — the drawer copy's `.nav__menu nav__menu--cards` line is identical to
the footer's.

It lives in `.header__actions`, after the social icons + Discord button
(`index.html`, `forc3designer.html`, `gt3forc3.html`) or after the hamburger
alone (`SupportUs.html`, which has no header Discord button — see above).
The toggle button keeps plain **`.nav__link` styling**, not a `.btn` — same
reasoning as before the dropdown existed: it should read as the same nav
item, not compete visually with the Discord button next to it. It also keeps
`is-active` on `SupportUs.html`'s toggle, same as any nav link on its own
page.

- **Cards, not a plain link list**: `.nav__menu--cards` switches the menu to
  a horizontal flex row of `.nav__card` boxes (bordered/backgrounded),
  instead of `.nav__menu`'s default vertical list of plain text links ("Get
  support" still uses that default — it's the generic case, `--cards` is
  the override). Reuse `.nav__card` for any future dropdown that wants
  icon+label options instead of plain text; reuse `.nav__menu--cards` on
  the wrapping `.nav__menu` to lay them out side-by-side.
- **Card layout differs by location, on purpose.** Header (and mobile
  drawer) cards are the base `.nav__card`: icon stacked above the label,
  fixed 104px width. **Footer cards only** put the icon and label side by
  side on one line (owner, 2026-09-10: "make so like if it was on a single
  line... that's for the footer only") via `.footer__col .nav__card` —
  `flex-direction: row`, auto width per label (`white-space: nowrap`),
  since "Buy A Beer" and "Patreon" aren't the same length. Don't unify the
  two; the owner asked for the difference.
  - The first attempt at this changed the base `.nav__card` (so the header
    changed too, which wasn't wanted) and **didn't work in the footer
    anyway**: `.footer__col a { display: block }` also matched the card
    `<a>`s inside the footer dropdown and out-ranks `.nav__card`, so they
    stayed block with the icon stacked on top. That rule is now
    `.footer__col > a` (direct children only), which also stopped it
    leaking its color, hover color and 9px bottom margin onto the cards.
    That first attempt was reported as working from card heights alone,
    without comparing them to the header's; the tell was that footer
    cards were taller than a one-line card could be. Check that icon and
    label centres line up rather than just reading a size.
- **Shipped with the wrong Patreon logo once — caught and fixed same-day
  (2026-09-10).** The first pass used the classic two-shape "bar + circle"
  Patreon mark; Patreon rebranded in 2023 to a single rounded drop-shape
  monogram, and the old mark now reads as outdated/wrong to anyone who
  knows the current brand. Fixed by pulling the current path straight from
  Simple Icons (`https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/patreon.svg`)
  rather than from memory — that's the reliable way to get a brand mark
  right; don't hand-recall a logo path for a brand that might have
  rebranded since training data was cut. If another brand icon on this site
  ever looks off, re-derive it the same way instead of guessing a fix.
- **Owner flagged the Patreon/Buy A Beer pair as "not well aligned" —
  three times, same day (2026-09-10), three different causes.** The first
  two were visual, not layout — the two cards' icon boxes measured
  pixel-identical. The third was a real layout bug introduced by the second
  fix:
  1. **Color/weight imbalance.** `.nav__card`'s default
     `color: var(--text-dim)` (and `#fff` on hover) drives the Patreon
     SVG's fill via `currentColor`, so it dimmed/brightened with the
     card's hover state — but the beer emoji is a native-color glyph that
     ignores `color` entirely and always renders at full saturation. At
     rest that made the Patreon mark read as a washed-out grey blob next
     to a vivid mug. Fixed with `.nav__card-icon.ico { color: var(--text); }`
     — pins the SVG to a bright, fixed tone independent of the card's own
     hover-driven text color.
  2. **Uneven "breathing room," reported as "icons must have some spacing
     on top, it's not well unified."** The Patreon path already spans its
     full 24x24 viewBox edge-to-edge (measured with `getBBox`:
     y 0.0003-24.0003, no built-in padding), while an emoji glyph's own
     internal padding is font/platform-dependent and not something CSS
     controls — at equal box sizes the two read with visibly uneven margins
     around them, purely from each glyph's own silhouette, not from any
     CSS asymmetry between the two cards. Fixed by making `.nav__card-icon`
     an oversized, flex-centred 26px **slot** and rendering both actual
     glyphs smaller inside it (20px SVG, 20px emoji font-size) — a fixed,
     equal margin on every side for both, regardless of either glyph's own
     bbox quirks. This is the general fix for this class of problem: don't
     try to pad each icon individually to compensate for its own shape;
     shrink both into a shared oversized slot instead.
  3. **Labels at different heights — caused by fix 2 itself.** The emoji
     `<span>` is a real 26px slot with a 20px glyph inside, but the
     Patreon `<svg>` has no wrapper, so it *is* the slot — shrinking it to
     20px made its box 20px, not 26px. The Patreon card's content ended up
     6px shorter, so in the stacked header cards (`justify-content:
     center`) its label sat 3px higher than "Buy A Beer" (measured label
     tops 41px vs 44px). Fixed with `margin: 3px` on `.nav__card-icon.ico`,
     so both icons take up the same 26x26. When comparing two cards,
     measure the **label** positions, not just the icon boxes — fix 2 was
     signed off on icon boxes and missed this.
  - If a future icon+emoji (or icon+icon) pairing gets a "looks unaligned
    but measures identical" complaint, check color/contrast parity and
    then relative glyph-fill-vs-box-size before re-measuring geometry —
    both times here, the geometry was already correct.
- **`.nav__menu--right`**: this dropdown's toggle sits at the very right edge
  of the header row, but `.nav__menu`'s default is `left: 0` (fine for "Get
  support", which sits mid-row). Left-aligned, two ~104px cards here would
  grow off the right edge of the viewport at typical widths. `--right` flips
  to `left: auto; right: 0` so the menu hangs from the toggle's right edge
  instead, growing leftward. Any future dropdown anchored near the right
  edge of a row should reuse this rather than re-deriving it.
- Don't "upgrade" the toggle to `.btn`/`.btn--primary` to match the Discord
  button next to it — that was tried (before the dropdown existed) and
  explicitly rejected; it stays nav-link styled.
- **Responsive swap, mechanism unchanged from the old plain-link version**:
  unlike the Discord button (which has an icon and hides its text below
  740px via `.btn--discord span { display:none }`), this toggle is
  text-only — there's nothing to collapse to. Left unconditional, the header
  row (logo + hamburger + Discord + this dropdown) stops fitting the
  container gutter at **~494px** and starts breaching it, then overflows
  outright further down.
- **Fix in place** (the breakpoint is **670px** since 2026-09-16, not the
  520px described below — the old number assumed the Discord button had
  already collapsed to its icon, which doesn't happen until 740px; see
  "Header breakpoint ladder"): both halves live in one media query
  block — `.header__actions .nav__group--support` (the whole group, not just
  the toggle, so an already-open menu doesn't get orphaned) is hidden, and
  the `.nav__group--support-mobile` duplicate inside `.nav` (hidden
  everywhere else via the inverse rule) appears in the hamburger drawer so
  it stays reachable, flattened into a static, indented sub-list by the same
  generic `.nav.is-open .nav__group`/`.nav__menu` rules "Get support" uses.
  520px rather than 494px just to leave slack. These class names
  (`nav__group--support` / `nav__group--support-mobile`) replace the old
  plain-link version's `.nav__link--support` — same swap mechanism, renamed
  because the thing being swapped is now a whole `.nav__group`, not a bare
  `<a>`.
- Those two rules are **exact complements of one breakpoint** — never
  change one without the other, or Support us will either overflow the
  header row or vanish from the site entirely. They're intentionally NOT
  folded into the nearby 480px query (which handles `--logo-h`/gaps), since
  this one needs its own threshold.
- Note the markup therefore has **two** "Support us" `.nav__group`s per
  page, only ever one visible at a time. That's intentional, not leftover
  duplication.
- Cards keep their side-by-side layout and their own padding/font-size even
  flattened into the mobile drawer — `.nav.is-open .nav__menu--cards` and
  `.nav.is-open .nav__menu--cards a.nav__card` re-assert those, since the
  generic `.nav.is-open .nav__menu a` rule (higher specificity than the base
  `.nav__card`) would otherwise win and squash them to the plain-list
  padding/size.
- **Couldn't verify the exact ~495-520px overflow boundary directly in this
  session** — the Browser pane's `resize_window` custom-width sizing has a
  floor around ~612px in this environment (requesting 521px or 600px both
  silently rendered at 612px; 700px+ and the `mobile` preset (375px) both
  worked correctly). Verified instead at 375px (mobile preset — drawer
  version renders correctly, cards fit) and 900px+ (header version — no
  overflow), and confirmed by inspection that a `<button>` with
  `.nav__link.nav__toggle` renders at the same box size as the `<a>` it
  replaced (same font/padding, background/border already reset to none on
  both), so the pre-existing 520px threshold — tuned against the old plain
  link — should still hold. If this is ever reported broken in the
  495-520px range specifically, re-measure for real rather than trusting
  this reasoning.
- **The footer's "Projects" column "Support us" link became the same
  dropdown too (2026-09-10, on request: "the footer button link should do
  the same").** Third `.nav__group` per page now (header, mobile-drawer,
  footer), same Buy A Beer/Patreon cards, same generic JS wiring — still
  zero JS changes needed. Two things needed adjusting for the footer
  context specifically, since it's a different parent than the nav/header:
  - **Styling**: `.footer__col a` styles real `<a>` tags only, so the
    footer's toggle `<button>` needed its own `.footer__col .nav__toggle`
    rule reproducing the same color/size/spacing as its sibling footer
    links. Deliberately does **not** carry `.nav__link` (the header's
    Rajdhani/uppercase-leaning style) — it should read as a plain footer
    link, matching "FORC3 Designer"/"GT3FORC3" above it, not as a nav item.
  - **Menu alignment**: uses the plain `.nav__menu` default (`left: 0`), not
    `.nav__menu--right`. The header instance needed `--right` because its
    toggle sits at the row's right edge; the footer instance sits at the
    **left** edge of the "Projects" column (second of four columns), with
    room to its right, so the default left-aligned menu doesn't overflow.
    Don't copy `--right` here just because the header instance uses it —
    match the alignment to where the toggle actually sits.
  - **`.footer__col .nav__group { display: flex; }`** — block-level in the
    footer. The default `inline-flex` group sits on a text line and picks
    up baseline space, which put "Support us" 33px below "GT3FORC3"
    instead of the 29px every other footer link uses.
  - No new breakpoint logic needed: the footer isn't part of the
    hamburger-drawer system at all, so there's only one footer copy (no
    mobile-swap duplicate), and the grid's own existing responsive column
    collapse (900px → 2 columns, 560px → 1 column) doesn't interact with
    the dropdown's own positioning.

## Nav spacing — why padding is small and `gap` is large

`.nav` uses `gap: 14px` with only `10px` of horizontal padding on
`.nav__link`. That split is deliberate, not arbitrary:

- The active/hover state paints a background, which makes *that* link's
  padding visible while every other link's padding stays invisible. With wide
  padding and a small gap the space after the active pill reads far tighter
  than the space between two plain labels — even though the numbers are
  identical. Small padding + large gap keeps the pill hugging its label so the
  rhythm reads evenly.
- Label-to-label distance is `10 + 14 + 10 = 34px`. If you retune these, keep
  that sum constant or the whole nav's rhythm shifts.
- Reported as "badly aligned / multiple different spacings" on 2026-08-18.
  Measuring showed the spacing was already uniform (equal gaps, pixel-identical
  vertical alignment) — the unevenness was purely this pill-padding effect, so
  measure before assuming a real misalignment.
- **The "Get support" toggle has no caret glyph, deliberately.** (Labeled
  "Support" until 2026-08-21, when it was renamed to "Get support" — see
  below. The no-caret reasoning is unaffected by the label text.) A trailing
  caret can't satisfy both requirements at once here: in the flow it pushes
  the label off-centre inside the toggle's own box (visible the moment the
  hover/active background paints), and pulling it out of the flow needs wider
  symmetric padding, which makes the label-to-label gap before this toggle
  46px against 34px everywhere else. Both were tried and rejected on
  2026-08-18. Without it the toggle is pixel-identical to a plain
  `.nav__link`. `aria-haspopup`/`aria-expanded` still announce it as a menu —
  if a visual affordance is wanted back, expect to reopen one of those two
  trade-offs (an underline or a colour shift avoids both).
- The mobile drawer overrides padding via `.nav.is-open .nav__link`, so none
  of this affects it.

## Nav dropdown system (the "Get support" tab)

**"Get support" is a dropdown, not a page.** (Labeled "Support" until
2026-08-21; renamed on request — same dropdown, same behavior, just the
label text.) It has no `href` of its own — it opens a menu of three items:
**Contact us** (the homepage `#contact` anchor), plus the Report a Bug /
Make a Suggestion Discord deep links (IDs above). Don't "fix" it into a link
to `SupportUs.html`; that was tried and corrected. `SupportUs.html` remains
reachable only via the Patreon "Support us" links, which are a separate
thing from "Get support" — the footer's "Get support" column heading
(above the same three links) was renamed at the same time, for the same
reason; both used to just say "Support."

- There is **no top-level Contact tab** — it was moved into this dropdown on
  2026-08-18. Consequence: on the homepage `#contact` no longer participates
  in the scroll-spy (that only tracks `.nav__link`s, and the menu items
  aren't one), so no nav item highlights while the contact section is in
  view. That's accepted, not a bug.
- Label casing is deliberate: **"Support us"**, **"Contact us"**, and **"Get
  support"**, lowercase second (and third) word, set by the owner. Don't
  title-case them back.

Generic and reusable — use it for any future nav dropdown rather than
building a second mechanism:

```html
<div class="nav__group">
  <button class="nav__link nav__toggle" aria-haspopup="true" aria-expanded="false">…</button>
  <div class="nav__menu"> <a>…</a> </div>
</div>
```

- JS toggles `.is-open` on the `.nav__group`; outside-click and Escape close
  it. It's **click-driven, not hover**, so it behaves the same on touch and
  inside the mobile drawer.
- The toggle is a `<button>` carrying `.nav__link`, so `.nav__toggle` resets
  the button chrome (`background: transparent; border: 0; font-family:
  inherit`). Base state only — `.nav__link:hover` is more specific, so the
  hover background still wins.
- **Two gotchas that are already handled — don't undo them:**
  - The mobile drawer's "close after choosing a link" handler is scoped
    `.nav__link:not(.nav__toggle), .nav__menu a`. Without the `:not()`, the
    toggle would close the drawer instead of opening its submenu.
  - Inside the drawer the menu is flattened (`position: static`, indented)
    — an absolutely positioned panel would overlay the links beneath it.
- The scroll-spy is safe here for free: it only tracks links whose `href`
  starts with `#`, and the toggle is a `<button>` with no `href` at all.

#### Showing / hiding a product page — four edits, they go together

**Current state (2026-09-22): `grid.html` shown, `gt3forc3.html` hidden.**
This flips constantly — Grid alone went linked 09-16, hidden 09-16, relinked
09-21, hidden 09-22, relinked 09-22 — so **check the live markup, not this
line**. Either direction, for either page, is these four edits in one commit:

| | Shown | Hidden |
|---|---|---|
| The page's robots meta | none | `<meta name="robots" content="noindex, nofollow">` |
| Nav tab + footer Projects link, all five pages | present (`is-active` on its own page) | absent |
| `--container` / nav breakpoint | see below — depends on how many nav links remain | |
| `sitemap.xml` | lists the page | doesn't |

**The width pair is what bites, and it is not a constant.** It depends on
the total nav width, so **measure it** (`logo + nav + actions + 2*gap +
container padding`, then add 17px for the scrollbar a media query counts but
the content can't use) rather than reusing a number from a previous flip:

| Nav links | Row content | Pair |
|---|---|---|
| About / Designer / Grid / GT3FORC3 / Get support | 1131px | 1200px / 1220px, no 1800px step |
| About / Designer / GT3FORC3 / Get support | 1030px | 1100px / 1120px + the 1800px step |
| About / Designer / Grid / Get support (now) | 1035px | 1100px / 1120px + the 1800px step |

Note the last two differ by 5px despite both having four links — "FORC3
Grid" is ~6px wider than "GT3FORC3". Close enough to share a pair here, but
that is a measured coincidence, not a rule.
- The sitemap and the robots meta have to agree — a `noindex` page listed
  in a sitemap is a Search Console error.
- Bump `style.css?v=` on all five pages (the width change touches the CSS).
- Re-measure rather than trusting these numbers if anything else in the
  header changed in between. Relinking on 2026-09-21 re-verified them: 5
  pages × 17 widths, 321-1920px, 17px scrollbar penalty, zero overflow, nav
  flipping exactly between 1220 and 1221. Hiding it again on 2026-09-22 was
  checked the same way: zero overflow, nav flipping between 1120 and 1121,
  `--container` 1100 up to 1799px and 1200 from 1800px. Relinking again the
  same day re-checked it once more (5 pages × 17 widths): zero overflow, nav
  flipping between 1220 and 1221. Hiding `gt3forc3.html` on 2026-09-22 was
  checked the same way (5 pages × 17 widths): zero overflow, nav flipping
  between 1120 and 1121, `--container` 1100 up to 1799px and 1200 from
  1800px. **The flip is routine enough to trust this table** — but still run
  the sweep, since it's what caught the original overflow.
- ⚠️ **Bump `?v=` BEFORE loading the page to measure, or measure on a fresh
  port.** Hiding GT3FORC3 bumped `?v=72` in the same script that removed the
  links, then loaded the pages to measure the new nav width — which cached
  `style.css?v=72` with the *old* CSS. The later width edit then appeared to
  do nothing: the sweep reported `--container: 1200px` and the nav collapsed
  at 1121px. Nothing was wrong with the CSS. Restarting the server on a new
  port fixed it (the trick already noted under "Asset cache-busting"). If a
  CSS change reads as having no effect, suspect this before debugging the
  rule.

## Nav width — re-measure before adding items

- **Live values: `--container: 1100px`, nav collapses at `max-width:
  1120px`** — three nav links (About / FORC3 Designer / FORC3 Grid) plus
  "Get support", measured 2026-09-22 at 1035px of content (logo 218.8 + nav
  396.1 + actions 372 + 2×24px gaps). With GT3FORC3 back in as well, the
  pair is 1200 / 1220 — see the table in "Showing / hiding a product page".
- **Measured (2026-09-16, with a FORC3 Grid tab as a 4th nav link)**:
  the tab costs **101.5px** of nav width (390 → 491.5), which put the row
  1131px wide against a 1052px content box — it overflowed the viewport
  outright below ~1210px and breached the container gutter above it. Fixed
  by raising **both** `--container` (1100 → 1200px) and the nav breakpoint
  (1120 → 1220px): raising one without the other reintroduces the overflow.
  That pair was reverted with the tab when the page was hidden again, but
  the numbers hold — reuse them verbatim when Grid (or any 5th item) comes
  back. Consequence to expect then: 1152px-class laptops get the hamburger
  where they currently get the full nav; 1280px and up are unaffected.
- **Measured (2026-08-31, after adding the header Facebook icon — 3 social
  icons now)**: **verified no overflow at 1121px**, right at the breakpoint
  edge, same as with 2 icons — the `estimatedRequiredWidth` heuristic used
  in earlier measurements here (~1079-1083px depending on run) has enough
  run-to-run variance from font rendering that it's not worth chasing to
  the pixel; treat the actual `header.scrollWidth > header.clientWidth`
  check at the breakpoint edge as the authoritative test, not the estimate.
  `.nav` collapsed at `max-width: 1120px` at the time (1220px now). Below it a *separate*
  overflow surfaced instead (the collapsed/hamburger layout, not this nav
  breakpoint) — see "Header social icons — an overflow gotcha" for that one;
  it's a different fix (`.header__social` hid below 450px then, 570px now, was 410px
  for 2 icons) at a different width entirely, not a nav-breakpoint change.
  If you want the full nav on 1024px-wide laptops, lowering the breakpoint
  to ~1023px is *probably* still safe but re-verify with the same
  overflow check rather than trusting the estimate; nobody has asked for
  that yet.
- History: the requirement was 1081px with the Contact tab present, and the
  breakpoint was **1080px and actively overflowing** the moment the
  dropdown's caret was added (the caret pushed it from 1058px to 1081px).
  Raising it to 1120px was the fix; removing Contact later freed 91px.
- Before adding another nav item, measure again (`logo + nav + actions +
  2*gap + container padding`) and raise the breakpoint to match. Don't
  guess — that's exactly how the overflow above was caught.

## Asset cache-busting — bump `?v=` when you edit CSS or JS

Every page loads `css/style.css?v=N` and `js/main.js?v=N`. **When you change
either file, bump `N` in all five pages in the same commit** — otherwise the
version query is worse than useless, because it looks like it's handling
cache invalidation while doing nothing. "All five" means `index.html`,
`forc3designer.html`, `grid.html`, `gt3forc3.html`, `SupportUs.html`. An
older "all four pages" phrasing here left `grid.html` on `style.css?v=34`
while the rest reached 58, until its header was synced on 2026-09-14 —
don't drop it from the list again. (`forc3-designer-download/index.html`
loads the stylesheet too and is still on its own stale `?v=32`; it's a
redirect shim nobody sees, so it has never been kept in step.)

- Why it exists: GitHub Pages serves these with `Cache-Control: max-age=600`
  (10 min) plus an ETag, so visitors *do* self-heal within ~10 minutes. The
  query makes a deploy take effect **immediately** instead. That started
  mattering once the contact form's behaviour moved into JS — a stale
  `main.js` silently sends messages to email instead of Discord, which looks
  like a broken backend rather than a cache.
- This bit for real on 2026-08-18: after the contact form switched to the
  Worker, a cached `main.js` kept showing the old "Opening your email app…"
  message and never called the Worker, so nothing reached Discord.
- The same staleness repeatedly hit *local* testing too — the preview browser
  serves a cached `js/main.js` across reloads. Starting the test server on a
  **different port** forces a clean fetch; that's faster than fighting it.

## Homepage hero — two products, not one

Rewritten 2026-09-22 (owner marked the lead + button row: "change this to
reflect better FORC3 Grid addition"). It had described FORC3 Designer only,
from before FORC3 Grid existed.

- **Lead** now covers both: the studio line, Designer's beta, then
  "// FORC3 Grid manages the liveries you make with it, and shares them with
  the grid." Four lines on desktop instead of three. Also fixed a missing
  comma after "livery painting application" while rewriting.
- **Buttons are one per product**: "Get FORC3 Designer" (primary →
  `forc3designer.html`) and "Meet FORC3 Grid" (ghost → `grid.html`), both
  with the shared arrow icon. "Meet" rather than "Get" on purpose — it links
  to a page, and Grid's own download isn't published yet, so "Get" would
  promise a file.
- ⚠️ This **replaced** the old "See what it does" demo-video link — see the
  demo-modal section. That was a deliberate trade (the marked region included
  both buttons, and a third button would crowd the row), not an oversight.
- The `<h1>` "Design liveries. Own the grid." was already a fit for both
  products and was left alone.
- If either product page gets hidden (they flip often — see "Showing /
  hiding a product page"), **this hero still links to it**. A hidden page is
  unlinked from nav and footer but reachable by URL, so a hero button
  pointing at it would quietly become the only path in. Check this section
  whenever hiding a product.
- Checked 321-1440px: no overflow, buttons wrap to a stacked column below
  ~560px.

## Design conventions

- Fonts: **Rajdhani** (`--font-head`) for headings/nav/eyebrows; **Roboto**
  specifically for `.btn` label text; **Inter** (`--font`) for body copy. All
  loaded via one Google Fonts `<link>` per page — keep the weights in sync
  if you add a new font usage.
- Buttons: compose from existing modifiers — `.btn--primary` (blue
  gradient), `.btn--ghost` (outline), `.btn--lg` (large hero CTA sizing),
  `.btn--discord` (Discord purple), `.btn--sm` (compact, e.g. the Changelog
  button). Avoid inventing new one-off button styles.
- **No em dashes in visible copy — `//` everywhere instead** (owner,
  2026-09-15: "replace any — by //"). Every `—` and `&mdash;` in
  visitor-facing text was swapped for `//` in one pass: page `<title>`s and
  `<meta name="description">`s, hero/section body copy, changelog entry
  dates and bullets, and the contact form's two JS status messages. The
  sweep deliberately skipped HTML/CSS/JS **comments** and this repo's own
  docs — nobody reads those as site copy. `docs/DESIGNER-CHANGELOG.md`'s
  entry sections were updated too, to keep the doc and the modal in sync.
  Write new copy with `//` from the start; if you ever find an em dash in
  something a visitor can see, it's a leftover, not a deliberate choice.
- `//` is used deliberately as a clause separator in body copy (a stylistic
  choice, not a typo) — preserve it when editing existing copy unless told
  otherwise.
- **The header has no bottom border** — its 1px `var(--border)` line was
  removed on request (2026-09-11). Header is now exactly 82px tall (the
  `.header__inner` height), matching the mobile drawer's pre-JS `top: 82px`
  fallback. The homepage contact card (`.cta`) lost its 1px outline the
  same day ("here too"); it's set apart by its `--surface` background alone.
- **Content starts exactly on the logo's left edge** on desktop
  (`min-width: 901px`), via `--content-inset: 0px` in `:root`. It was 15px
  (owner, 2026-09-12: "aligned here (with the logo) but leave like 15px"),
  then set to 0 on 2026-09-13 ("actually make so it's aligned with the
  logo"). The inset rules below are kept, reading the variable, so a
  future nudge is a one-value change. Hero text on every page (`.hero__inner` drops its centred 760px
  column), the homepage contact card box (`.cta { margin-left }`), the
  photo-card sections on FORC3 Designer / GT3FORC3 (`.container.about`)
  and the Support Us section (left-aligned, 720px text column) all start
  there. Right edges stay on the container edge. Below 901px the stacked
  mobile layout is unchanged (hero still a centred column at 641-900px).
  - **Hero buttons start 100px right of the hero text on desktop**
    (`--hero-cta-offset: 100px` in `:root`, `.hero__cta--offset`, all four
    pages; owner, 2026-09-14, marked the spot on a screenshot — converted
    from screenshot px using the logo's known 218.8px width). Before that
    (2026-09-13) they were centred on the page. Below 901px they're still
    centred. FORC3 Designer wraps its buttons and "Hosted on GitHub"
    caption in `.hero__cta-group` (grid, one auto column,
    `justify-items: start`) so the caption's icon stays on the Download
    button's left edge wherever the group sits (centring the caption on its
    own was reported as misaligned). Below 543px those buttons wrap to two
    lines, so a `max-width: 542px` rule centres buttons and caption — the
    measured wrap width; re-measure if the labels change.
  - The hero background glow (all three `radial-gradient(ellipse at
    30% 20%, ...)` rules: default, `.theme-designer`, `.theme-gt3`) was
    mirrored from 70% to 30% across the same day, so it sits behind the
    now left-aligned hero text. Keep them in step if one moves.
  - Same day, the owner said the glows "must have a similar size to the
    Designer one": they all scaled with their own hero's height, and the
    Designer hero is tallest (533px vs 418px index/GT3FORC3, 469px Support
    Us). All three now use fixed px geometry computed from the Designer
    hero: `ellipse 98.99% 603px at 30% 107px`. If the Designer hero's
    height changes a lot, recompute (ry = 0.8 × H × √2, cy = 0.2 × H).
    Screenshots timed out when verifying this; the change was checked via
    `getComputedStyle` only.
  - History, same day: it was first aligned to where the **nav** starts
    (a `--nav-line` variable = logo width + header gap), then the contact
    card was pulled left to remove a big empty block it left, then the
    owner moved the whole thing to the logo edge + 15px. Don't bring back
    the nav-start alignment.
- **Content width** (`--container`): **1100px**, 1200px at `min-width:
  1800px`, 1440px at `min-width: 2600px` — the owner's chosen ladder. A
  fourth nav link forces the base to 1200px (and the 1800px step out);
  see "Showing / hiding a product page" for the measured table. History: 1200/1440/1720 →
  narrowed 2026-09-14 to the current ladder (owner: "reduce the width of
  the site, we have a lot of wasted space", then chose a narrower column
  over a wider one) → base forced to 1200px on 2026-09-16 when the FORC3
  Grid nav tab stopped fitting → straight back to 1100px hours later when
  that tab was hidden again. **1100px is the owner's choice; 1200px is what
  a 5th nav item costs.** The header sets the floor: logo 219 + nav 390 +
  actions 373 + 2×24px gaps = 1030px of content, so 1100px leaves 22px of
  slack at the 1121px nav breakpoint even after a 17px scrollbar. Don't
  narrow further, and don't widen it without a header item to justify it.
- **Keep solid icon sizes whole CSS pixels** when a request ends in a
  fraction (e.g. "+10% then +15%" gave the header Discord icon 16.45px).
  The owner said 16.45px "does not seem to appear clean": it isn't a whole
  number of screen pixels at 100/125/150/200% Windows scaling, so the
  logo's edges and small counters (Discord's eyes) smear across pixels.
  Round to the nearest whole px (16px there) and say so. The Facebook
  icon's 18.39px is an existing exception that hasn't been reported.
- **Favicon**: every page links `<link rel="icon" href="/favicon.ico" sizes="any" />`
  — root-absolute, so the one file also serves
  `forc3-designer-download/index.html` a folder deep. Six pages carry it
  (the five site pages plus that shim). Browsers also auto-request
  `/favicon.ico`, so the file's location is doing double duty.
- **`index.html`'s `<title>` is the brand line, not a keyword string**:
  `FORC3MOD // AC EVO DEVELOPMENT` (set 2026-09-15, owner request from a
  screenshot of the browser tab). It matches the logo's tagline and uses the
  site's usual `//` separator. It replaced
  `EVO Livery Painting Tool — FORC3 Designer | FORC3MOD`, which was
  keyword-led and got truncated in the tab anyway. Accepted tradeoff: the
  homepage title no longer carries search keywords — the `<meta
  name="description">` still does, and the other pages keep their own
  keyword-led `Thing — What it is | FORC3MOD` titles, so this is a
  homepage-only exception, not a new title format to copy.
- **Site version label** is the `// V 0.3` text in each page's
  `.footer__bottom` (`<p class="footer__links">`) — currently 0.3 (bumped
  from 0.1 on 2026-09-10, on request). It's hand-edited, not derived from
  anything; change it on every page at once, including `grid.html`.
- Keep the header and footer markup/behavior **identical** across all five
  content pages (`index.html`, `forc3designer.html`, `grid.html`,
  `gt3forc3.html`, `SupportUs.html`). When you change one page's
  header/footer, mirror the change to the other four in the same turn.
  - `grid.html` was synced into this set on 2026-09-14 (owner: "sync the
    grid.html header with the other pages", then "sync the footer too") after
    drifting to old copies (plain "Support us" links, an extra tab) whose
    header ran 22px past a 1280px window. **Keep mirroring header/footer
    changes into it whichever state it's in** — that drift is exactly what
    happened the first time it sat unlinked. While hidden its header carries
    no active nav item and nothing links to it; while shown it's a normal
    page with its own tab `is-active`.

## Favicon and Google search results

The owner asked on 2026-09-19 why `forc3mod.com` shows a blank placeholder
icon in Google results. **Nothing was broken** — diagnosis worth keeping,
because the same question will come back:

- **The search snippet's own title dated it.** It read "FORC3MOD | FORC3
  Designer — Free Livery Maker for …", a title the homepage last carried on
  **2026-08-17**. `favicon.ico` only landed 2026-09-15. So Google's crawl
  predated the file by a month, and the icon in the result was Google's
  generic placeholder, not a broken one of ours. **Check the snippet's title
  against git history before debugging a favicon** — it tells you how old the
  crawl is for free.
- **Before 2026-09-15 there was nothing for Google to fetch at all**: the
  favicon was an inline `data:image/svg+xml` URI, and Google can't use a
  `data:` URI favicon — it needs a real crawlable URL. Don't ever go back to
  an inline one.
- Verified at the time: `/favicon.ico` returns 200 `image/vnd.microsoft.icon`,
  there is no `robots.txt` (404, so nothing blocks Googlebot), and every page
  declares `<link rel="icon" href="/favicon.ico" sizes="any" />`.
- **Google wants favicon frames that are a multiple of 48px** (48, 96,
  144…). The original 16/32/64/128/256 set contained none, so a **96** was
  added 2026-09-19 — the only generated frame in the file (see the file map
  row). The other five are still byte-identical to the artist's PNGs;
  verified by diffing them against the previous `favicon.ico` after the
  repack.
- **Timing, so nobody chases this again**: page title/snippet refreshes on
  the next normal recrawl (days to weeks; **Request Indexing** in Search
  Console makes it ~a day). The **favicon is fetched on a separate, much
  slower schedule** — weeks is normal and there's no way to force it.
  Request Indexing does not speed the icon up.

### Google Search Console — already verified, via Cloudflare DNS

`forc3mod.com`'s nameservers are Cloudflare (`dana`/`alexis.ns.cloudflare.com`)
and the domain already carries
`google-site-verification=7nJIkg9iK5RJJKji2jibQJthEBC6hGObTZz3NmgvbjM` as a
TXT record — i.e. a **Domain property already exists**. Don't add a
`google-site-verification` meta tag or `googleXXXX.html` file to this repo;
neither is needed, and their absence is NOT evidence the site is unverified
(that's the wrong conclusion to draw from grepping the repo — the DNS method
leaves no trace here). A Domain property covers the apex, `www` and every
subdomain, so `grid.forc3mod.com` is in scope too.

URL Inspection is the search bar across the top of
[Search Console](https://search.google.com/search-console) once the property
is selected — it is not in Chrome DevTools, which is where the owner looked
first.

### Sitemap and robots.txt

`sitemap.xml` (added 2026-09-19, on request) currently lists four pages:
`/`, `/forc3designer.html`, `/grid.html`, `/SupportUs.html`.

- **It is hand-maintained** — no build step generates it. Add a `<url>` when
  a new public page ships; update a `<lastmod>` when that page's *content*
  changes, not when a `?v=` bump or a CSS tweak touches the file.
- **A page is listed only while it's shown.** A noindex page in a sitemap is
  a Search Console error, so pages go in and out with the "Showing / hiding
  a product page" checklist. As of 2026-09-22 `grid.html` is in (four round
  trips so far) and `gt3forc3.html` is out.
- **The redirect shims are excluded too** (`designer.html`,
  `forc3-designer-download/`). A sitemap is for URLs that answer 200 with
  their own content, not for redirects.
- **No `<changefreq>` or `<priority>`** — Google ignores both, and a wrong
  value is worse than none. Don't "improve" the file by adding them.
- **URL forms**: the homepage is listed as bare `/`; the others keep their
  `.html`, matching every internal link on the site. GitHub Pages happens to
  answer 200 on the extensionless form too (`/forc3designer` works), but
  nothing links that way, so the `.html` form is the one to list — don't mix
  both, that's two URLs for one page.
- **Registering it**: Search Console → Sitemaps → submit
  `https://www.forc3mod.com/sitemap.xml`.

`robots.txt` (added 2026-09-19, right after) exists almost entirely for its
`Sitemap:` line. It allows everything — which is exactly what the previous
404 already meant — so it changed nothing about crawling.

- ⚠️ **Never `Disallow` a page you want kept out of search.** It's the
  obvious-looking move for `grid.html` and it backfires: `Disallow` blocks
  **crawling**, and a page Google can't crawl is a page whose
  `<meta name="robots" content="noindex">` Google can never read. It can
  still get indexed from an external link, just with no title or
  description — strictly worse than the current state. Allowing the crawl so
  the noindex tag *is* read is what actually keeps a page out. The same
  applies to any future hidden page. This reasoning is repeated inside
  `robots.txt` itself, because that's where someone will be standing when
  they get the idea.
- Consequence worth knowing: whenever a page is hidden with `noindex`, its
  exclusion from search rests entirely on that meta tag — the page stays
  crawlable on purpose.

## Working conventions for this project

- No build step — edit files directly, no compilation/bundling.
- Test locally via `python -m http.server <port>`, verify in the Browser
  tool. **Screenshots in this environment have been intermittently
  unreliable** (stale/stuck compositor frames showing content in the wrong
  place). When a screenshot looks wrong, cross-check with
  `getBoundingClientRect()` / `getComputedStyle()` via JS before assuming
  something is actually broken.
- **This preview browser tool's rendering engine also has real gaps beyond
  screenshots** (found 2026-09-05, building the v0.5.0 changelog's embedded
  media): it does not apply the standard `details:not([open]) >
  *:not(summary){display:none}` UA rule (confirmed: a bare, freshly created
  `<details><summary></summary><p>x</p></details>` reports the `<p>` as
  `display:block` even while collapsed), and relatedly a block-level
  `<video>`/`<img>` placed right after raw text inside a `<li>` rendered at
  the correct width but positioned as if still inline instead of dropping
  to its own line. Both are basic, decades-old CSS behavior that every
  real browser gets right — treat a `getBoundingClientRect()`/
  `getComputedStyle()` result that contradicts well-established CSS
  semantics as a possible tool limitation too, not just proof the code is
  wrong. Where practical, prefer semantic checks over layout-derived ones
  (e.g. an element's own `.open` property rather than whether the browser
  chose to give something a layout box) and structure new markup so it
  doesn't depend on subtle "does this force a new line" behavior in the
  first place (see "Embedded release media" above for the flex-column
  fix) — that way it's correct regardless of which engine renders it.
- Always stop/kill the local test server before finishing.
- Commit and push straight to `main` after each change — this is a solo
  static site with direct-to-prod deploys via GitHub Pages, no PR workflow.
- When a change makes some CSS/JS/HTML dead, remove it in the same commit —
  don't leave stale selectors, unused classes, or leftover markup behind.

## Pending / open items

*(Nothing open right now. The long-standing header overflow that used to
live here was fixed on 2026-09-16 — see "Header breakpoint ladder" below.)*

## Header breakpoint ladder — the one thing to re-derive as a whole

`.header__actions` sheds its lowest-priority item at each of four
thresholds: **740px** Discord's label, **670px** "Support us", **570px**
the three social icons, **480px** the logo size and gaps. Plus **1120px**
for the nav itself (1220px whenever a fourth nav link is in — see
"Nav width"). The live numbers and arithmetic are in `css/style.css`
under the same heading; the point to carry here is *why they moved*.

- **Every one of them used to be measured only at its own edge**, against a
  row that already had the *narrower* rules applied. That's a silent trap:
  each config stays active across a whole range, and what a threshold has
  to clear is the width of the configuration **above** it, not its own. The
  450px social-icon breakpoint, for instance, was derived from a 443px
  measurement taken with the 480px logo/gap reductions in effect — but the
  icons stayed visible up to 520px+, at full logo size, needing 541px.
- **Result, found 2026-09-13 and fixed 2026-09-16**: the header ran 5-59px
  past the viewport's right edge across roughly **451-713px**, on every
  page, with "Support us" and the social icons clipped by
  `body { overflow-x: hidden }` rather than scrolling — a much wider band
  than the "~543-641px" this doc originally recorded. Fixed by raising the
  whole ladder at once (640→740, 520→670, 450→570), not one line of it.
- **A media query counts the classic scrollbar; the content can't use it.**
  Budget 17px on top of every requirement. That gap is what made the
  1201px-window case only ~5px of slack while the FORC3 Grid tab was in,
  pushing the nav breakpoint from 1200 to 1220 for as long as it lasted.
- **Verified** across 5 pages × 32 widths from 321px to 1920px, each
  checked with the 17px scrollbar penalty applied: zero overflow anywhere
  and the header/drawer "Support us" pair never both-on or both-off.
  Re-verified over 24 widths after the Grid tab came back out, with the nav
  flipping exactly between 1120 and 1121. The four `.header__actions`
  thresholds are independent of how many nav links there are — every one of
  them sits below 1120px, where `.nav` is already a hamburger — so removing
  or adding a nav tab doesn't disturb this ladder, only `--container` and
  the nav breakpoint.
- **Before adding anything to the header**, recompute the whole table in
  `style.css`, not just the breakpoint nearest your change.
