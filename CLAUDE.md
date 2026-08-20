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

## Current status: site is LIVE (full site, un-gated)

The site flips between a gated "Coming Soon" state and the full live site
constantly — see `MEMORY.md` for the log. It was gated, reopened, gated and
reopened again across 2026-08-17/18 alone. **Never trust this heading; check
`index.html` itself**: if it has a `<section class="coming-soon">` it's
gated, if it has a `<header class="header">` with full nav it's live.

As of the most recent change, it's live:

- `index.html` is the **full real homepage** (header/nav, hero, about,
  contact form, footer). `home.html` does not exist while live.
- `forc3designer.html`, `gt3forc3.html` and `SupportUs.html` load normally —
  no `location.replace` guard on any page.
- The `.coming-soon` CSS block is removed from `css/style.css`.
- The GT3 live driver pill and Discord member counter are active, and the
  contact form posts to Discord — `gt3forc3.html` polls the Worker every 90s.

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
| `gt3forc3.html` | GT3 FORC3 community page. Red theme (`body.theme-gt3`). |
| `SupportUs.html` | Patreon support page. Default blue theme. Unlinked from nav/footer even while live — see "Discord / community reference IDs". |
| `designer.html` | Legacy URL redirect shim → `forc3designer.html`. Leave alone. |
| `css/style.css` | Single shared stylesheet for every page. |
| `js/main.js` | Shared JS: mobile nav, nav dropdown, scroll-spy, modal system, contact form (posts to Discord via the Worker), GT3 live driver/member counters. |
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
- **The dark overlay gradient over the photo differs by page, on purpose.**
  On `gt3forc3.html`, the badge, h3 and p are all normal flex children of the
  bottom-anchored `.about__card` (`justify-content: flex-end`) — badge first,
  so it sits directly above the heading, all bottom-grouped. Its
  `.theme-gt3 .about__card--photo::before` gradient is transparent at the top
  (0-45%) and only darkens from 60% down: flat photo up top, faded for the
  text group at the bottom. Checked by sampling the actual photo's pixels at
  the badge's position (not just eyeballing a screenshot) — that image is
  dark enough there on its own that the badge stays legible even without
  gradient help. `forc3designer.html`'s card has no badge and its own h3/p
  sit at the *top* instead (see the comment above that rule), so it still
  needs the full dark band at 0-15% for its own text contrast — **don't copy
  the GT3 version over there**, it would make that page's heading illegible.
  If a third themed photo card gets added, decide where its text/badge
  actually sit before copying either gradient.
- **`.about__badge` is in normal flow, not absolutely positioned** — it used
  to be pinned to the card's top-left corner (`position: absolute; top: 32px;
  left: 32px`) regardless of where the h3/p sat. Moved into flow on
  2026-08-19 so it groups with whatever text follows it; if you add a badge
  to a *new* photo card, decide from scratch where it should sit rather than
  assuming the absolute-positioned version — that one's gone.

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

## Header "Support us" link — a responsive gotcha, don't reintroduce it

"Support Us" used to sit inside `<nav class="nav">` with the other nav items.
It now lives in `.header__actions` instead, immediately **after** the Discord
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
- **The "Support" toggle has no caret glyph, deliberately.** A trailing caret
  can't satisfy both requirements at once here: in the flow it pushes the
  label off-centre inside the toggle's own box (visible the moment the
  hover/active background paints), and pulling it out of the flow needs wider
  symmetric padding, which makes the label-to-label gap before "Support"
  46px against 34px everywhere else. Both were tried and rejected on
  2026-08-18. Without it the toggle is pixel-identical to a plain
  `.nav__link`. `aria-haspopup`/`aria-expanded` still announce it as a menu —
  if a visual affordance is wanted back, expect to reopen one of those two
  trade-offs (an underline or a colour shift avoids both).
- The mobile drawer overrides padding via `.nav.is-open .nav__link`, so none
  of this affects it.

## Nav dropdown system (the "Support" tab)

**"Support" is a dropdown, not a page.** It has no `href` of its own — it
opens a menu of three items: **Contact us** (the homepage `#contact`
anchor), plus the Report a Bug / Make a Suggestion Discord deep links (IDs
above). Don't "fix" it into a link to `SupportUs.html`; that was tried and
corrected. `SupportUs.html` remains reachable only via the Patreon
"Support us" links, which are a separate thing from "Support".

- There is **no top-level Contact tab** — it was moved into this dropdown on
  2026-08-18. Consequence: on the homepage `#contact` no longer participates
  in the scroll-spy (that only tracks `.nav__link`s, and the menu items
  aren't one), so no nav item highlights while the contact section is in
  view. That's accepted, not a bug.
- Label casing is deliberate: **"Support us"** and **"Contact us"**, lowercase
  second word, set by the owner. Don't title-case them back.

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

- **Measured (2026-08-18, after Contact moved into the dropdown)**: the
  header row (logo + 4 nav items incl. this dropdown + actions) needs
  **990px** of *client* width. `.nav` still collapses at
  `max-width: 1120px`, so there is now ~110px of spare room — deliberately
  left conservative rather than re-tuned. If you want the full nav on
  1024px-wide laptops, lowering the breakpoint to ~1023px is safe on this
  measurement; nobody has asked for that yet.
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
- Always stop/kill the local test server before finishing.
- Commit and push straight to `main` after each change — this is a solo
  static site with direct-to-prod deploys via GitHub Pages, no PR workflow.
- When a change makes some CSS/JS/HTML dead, remove it in the same commit —
  don't leave stale selectors, unused classes, or leftover markup behind.

## Pending / open items

- *(none right now — add items here as they come up, and remove them once resolved)*
