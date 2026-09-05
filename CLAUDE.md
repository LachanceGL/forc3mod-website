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
promotes the **GT3FORC3** sim racing community and a Patreon support page.

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
| `gt3forc3.html` | GT3FORC3 community page. Red theme (`body.theme-gt3`). |
| `SupportUs.html` | Patreon support page. Default blue theme. Unlinked from nav/footer even while live — see "Discord / community reference IDs". |
| `designer.html` | Legacy URL redirect shim → `forc3designer.html`. Leave alone. |
| `forc3-designer-download/index.html` | Redirect shim → GitHub's "latest release" download URL for FORC3 Designer. Gives a `forc3mod.com` link to hand out directly (owner: "it needs to be a forc3mod.com url"). See "FORC3 Designer download button" below. |
| `css/style.css` | Single shared stylesheet for every page. |
| `js/main.js` | Shared JS: mobile nav, nav dropdown, scroll-spy, modal system, contact form (posts to Discord via the Worker), GT3 live driver/member counters. |
| `img/forc3mod-logo.svg` | FORC3MOD wordmark. Blue gradient is baked into the file itself. |
| `img/icon.png` | FORC3 Designer app icon (blue-to-lime "FD" mark), shown inline in the hero on `forc3designer.html`. |
| `img/FD_SitePreview.jpg` | Owner-provided app screenshot, used directly (no derivative crop) as the photo background on `forc3designer.html`'s "Your car, your canvas." card. The card's `aspect-ratio` is set to match this file's own pixel dimensions — see "Photo cards" below. |
| `img/FORC3Designer_Showcase01.jpg` | Earlier app screenshot, no longer referenced by any page. Left in place rather than deleted — it's owner-provided, not generated. |
| `video/forc3designer-demo-03.mp4` | **Currently active** owner-provided demo video (1960×1080, ~68s), used directly. Powers the "See what it does" video modal on `forc3designer.html` — see "Demo video modal" below. |
| `video/forc3designer-demo-02.mp4` | Earlier demo video (1960×1080, ~93s), no longer referenced — superseded by `-03` on 2026-09-04. Left in place rather than deleted, same reasoning as `img/FORC3Designer_Showcase01.jpg`: it's owner-provided, not generated. |
| `video/forc3designer-demo.mp4` | Earlier still (1960×1080, ~72s), no longer referenced — superseded by `-02` on 2026-08-31. Same "owner-provided, keep it" reasoning. If a `-04` ever supersedes `-03`, keep all the older files rather than deleting any. |
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

### Demo video modal (added 2026-08-28, on request)

`forc3designer.html`'s hero "See what it does" button (`data-modal-target="#demo"`)
opens a modal playing `video/forc3designer-demo-03.mp4` — brought back after
being removed earlier (it used to scroll to `#features`) once an actual demo
video existed to show. The video file itself gets swapped in place as newer
demos are provided (see the file map's `video/` rows) — just update the
`<video src>` and, if the new file's own pixel dimensions differ, the
`aspect-ratio` below to match.

- **`.modal--video`** is a wider, padding-stripped variant of the base
  `.modal` (900px vs the text modals' 520px) — a video reads as a cinematic
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
- **`index.html`'s own "See what it does" button doesn't duplicate the modal
  or video reference** — it's a plain link to `forc3designer.html#demo`,
  reusing the deep-link system instead. Single source of truth for the
  modal markup; if a second page ever needs its own inline demo player,
  duplicate the modal block there rather than trying to share one across
  pages.

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
  <summary class="modal__version"><span class="modal__version-text">vX.Y.Z <span class="modal__date">— Short summary // Mon D, YYYY</span></span></summary>
  <div class="modal__entry-body">
    <p>Intro paragraph.</p>
    <h4>Optional grouping</h4>
    <ul class="feature-list"><li>...</li></ul>
  </div>
</details>
```

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
- GT3FORC3 Discord invite: `https://discord.gg/dfcK4x64vb`
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
  raised from 410px to **450px** (still a few px of buffer above the 443px
  measurement, same margin logic as the original fix). Verified no overflow
  at 450px (hidden) and 451px (all 3 visible) right at the edge, and no
  overflow at 375px.
- **If you add a fourth header social icon**, re-measure the same way
  (resize down from a wide viewport, binary-search the width where
  `header.scrollWidth > header.clientWidth` flips true) rather than assuming
  450px still holds. If a Browser-pane check ever contradicts a `curl`
  check of the same URL, trust the `curl` result for what's actually
  deployed — the discrepancy is almost certainly the preview tab's own HTTP
  cache (the local dev server's HTML isn't `?v=`-busted the way `css`/`js`
  are), not a real bug; force it with a cache-busting query string rather
  than concluding the fix didn't work.

## Header "Support us" link — a responsive gotcha, don't reintroduce it

"Support Us" used to sit inside `<nav class="nav">` with the other nav items.
It now lives in `.header__actions` instead, after the social icons + Discord
button (`index.html`, `forc3designer.html`, `gt3forc3.html`) or after the
hamburger alone (`SupportUs.html`, which has no header Discord button — see
above). It deliberately keeps plain **`.nav__link` styling**, not a `.btn` —
it should read as the same nav link it always was, just relocated. It also
keeps `is-active` on `SupportUs.html`, same as any nav link on its own page.

- Don't "upgrade" it to `.btn`/`.btn--primary` to match the Discord button
  next to it — that was tried and explicitly rejected; it stays a nav link.
- **Bug hit and fixed**: unlike the Discord button (which has an icon and
  hides its text below 640px via `.btn--discord span { display:none }`),
  this link is text-only — there's nothing to collapse to. Left
  unconditional, the header row (logo + hamburger + Discord + this link)
  stops fitting the container gutter at **~494px** and starts breaching it,
  then overflows outright further down.
- **Fix in place**: both halves live in one `@media (max-width: 520px)`
  block next to the `.nav__link` rules — `.header__actions .nav__link` is
  hidden, and the `.nav__link--support` duplicate inside `.nav` (hidden
  everywhere else via the inverse rule) appears in the hamburger drawer so
  it stays reachable. 520px rather than 494px just to leave slack.
- Those two rules are **exact complements of one breakpoint** — never
  change one without the other, or Support Us will either overflow the
  header row or vanish from the site entirely. They're intentionally NOT
  folded into the nearby 480px query (which handles `--logo-h`/gaps), since
  this one needs its own threshold.
- Note the markup therefore has **two** "Support Us" anchors per page, only
  ever one visible at a time. That's intentional, not leftover duplication.

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

### Nav width — re-measure before adding items

- **Measured (2026-08-31, after adding the header Facebook icon — 3 social
  icons now)**: **verified no overflow at 1121px**, right at the breakpoint
  edge, same as with 2 icons — the `estimatedRequiredWidth` heuristic used
  in earlier measurements here (~1079-1083px depending on run) has enough
  run-to-run variance from font rendering that it's not worth chasing to
  the pixel; treat the actual `header.scrollWidth > header.clientWidth`
  check at the breakpoint edge as the authoritative test, not the estimate.
  `.nav` still collapses at `max-width: 1120px`. Below 1120px a *separate*
  overflow surfaced instead (the collapsed/hamburger layout, not this nav
  breakpoint) — see "Header social icons — an overflow gotcha" for that one;
  it's a different fix (`.header__social` now hides below 450px, was 410px
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
either file, bump `N` in all four pages in the same commit** — otherwise the
version query is worse than useless, because it looks like it's handling
cache invalidation while doing nothing.

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

- *(none right now — add items here as they come up, and remove them once resolved)*
