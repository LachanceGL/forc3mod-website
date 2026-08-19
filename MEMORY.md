# FORC3MOD Website — Session Memory Log

A running, dated changelog of work done on this site — decisions, fixes, and
things flagged for later. This complements `CLAUDE.md` (which explains *how
the project currently works*); this file is a chronological record of *what
happened and why*, newest entries on top.

**Add a new entry here at the end of every session that touches this repo.**
One line per notable change is enough — link back to the commit hash if you
want detail. If a change reverses or supersedes an earlier entry, say so
explicitly rather than leaving the old entry looking still-current.

---

## 2026-08-18

- **Owner reported the contact form still opening an email client and no
  message reaching Discord.** Root cause was a stale cached `js/main.js` in
  their browser, not a code or Worker fault: the message they saw ("Opening
  your email app to send this to FORC3 Email…") is the *old* handler's
  string, which no longer exists in the source, and the old code goes
  straight to `mailto:` without ever calling the Worker — which explains both
  symptoms at once. Verified the deployed site was fine by submitting the
  form from `www.forc3mod.com` itself: Worker returned 200 and the message
  landed. Fix on their side was a hard refresh.
- Added `?v=1` to `css/style.css` and `js/main.js` on all four pages so
  deploys take effect immediately. Measured first: GitHub Pages sends
  `Cache-Control: max-age=600` + ETag, so visitors self-heal in ~10 min
  anyway — the query is about *immediate* propagation, not a fix for a
  permanent cache. **`CLAUDE.md` now says to bump the number whenever CSS/JS
  changes**; forgetting makes it worse than not having it.

- **Contact form is live end-to-end.** Owner deployed the Worker `/contact`
  endpoint; a real submission through the form returned 200 and posted to
  Discord channel `1534649367573827879`. Pending item cleared from
  `CLAUDE.md`.
- Verified by testing against the deployed endpoint, not just the happy path:
  missing fields -> 400, malformed JSON -> 400 (so bad input never reaches
  Discord), `GET /contact` -> 404 (correctly falls through), `@everyone` in
  the message body is neutralised by `allowed_mentions: { parse: [] }`, and a
  4000-char message truncates to 1500 instead of Discord rejecting the embed.
- Three clearly-labelled test messages were posted to that channel during
  verification; owner was told to delete them.
- Process note: when generating code for the owner to paste elsewhere, write
  it with a **quoted** heredoc (`<<'PYEOF'`). An unquoted one let bash expand
  every backtick template literal in the Worker code and silently produced a
  broken file — caught only by diffing against the original. Also match the
  target file's line endings (that Worker is CRLF) or the diff is useless.

- **Contact form now targets Discord instead of email.** Front-end rewritten
  to POST `{name, email, type, message}` to `<worker>/contact`, with a
  sending state and a `mailto:` fallback kept for when the Worker is
  unreachable — so an outage can never silently eat a message.
- Deliberately did **not** use a Discord webhook URL: this repo is public, so
  the URL would be readable by anyone (channel spam) and GitHub secret
  scanning gets Discord webhooks auto-revoked. Routing through the Worker
  keeps the bot token server-side, which is also how `/discord/stats` and
  `/discord/verify-request` already work there.
- **Blocked on infrastructure outside this repo**: the `/contact` endpoint
  doesn't exist yet (verified: it 404s), so submissions currently fall back
  to email. It has to be added to `gt3forc3-website`'s `workers.js` and
  pasted into the Cloudflare dashboard manually. Logged under "Pending /
  open items" in `CLAUDE.md`, and the Worker snippet was handed to the owner
  in chat, and the full 514-line `workers.js` (existing Worker + the new
  block, CRLF-matched, diff verified as pure addition) was sent as a file.
- Owner wants this **tracked in the `forc3-discordbot` repo**, so the
  write-up went into `docs/BOT-HANDOFF.md` here rather than editing that
  repo — per the handoff workflow. Key finding recorded there: the bot
  **cannot** be the HTTP receiver. `index.js`/`package.json` have no
  express/`createServer`/`.listen`, only discord.js/dotenv/node-cron/
  puppeteer, and it runs locally with a nightly restart — so it has no
  public URL. A public entry point (the Worker) is required either way.
- When writing that endpoint, two non-obvious bits: put the message in the
  embed `description` (4096 chars) not a `field` (1024, would 400 on long
  messages), and set `allowed_mentions: { parse: [] }` so someone can't get
  the bot to fire `@everyone` through the form.

- **Fixed the Support nav tab rendering in the wrong font** (owner spotted it
  visually). `.nav__toggle` had `font-family: inherit`, which beat
  `.nav__link`'s `var(--font-head)` — equal specificity, but declared later —
  so the tab rendered in Inter while every other nav item used Rajdhani.
  Removed that declaration; `.nav__link`'s own font properties already
  override the global `button { font: inherit }` reset. Noted in `CLAUDE.md`
  as a do-not-re-add.
- **Removed the top-level Contact tab**; "Contact us" is now the first item
  in the Support dropdown. Footer "Contact" → "Contact us", and every
  "Support Us" label → "Support us" (owner's casing — don't title-case back).
- Side effect worth knowing: on the homepage `#contact` no longer takes part
  in the scroll-spy, because that only tracks `.nav__link`s and dropdown menu
  items aren't one. So nothing highlights while the contact section is in
  view. Accepted, documented.
- Re-measured the nav after removing Contact: the header row now needs
  **990px** of client width (was 1081px). The collapse breakpoint is still
  1120px, so it's ~110px conservative — left as-is rather than re-tuned,
  since nothing was broken. Lowering it to ~1023px would put the full nav
  back on 1024px laptops if that's ever wanted.

- **Site reopened again the same day** — gated and un-gated within hours, so
  the state in `CLAUDE.md` genuinely can be stale; always check `index.html`
  itself rather than trusting the doc. Reversed by the documented steps:
  removed the four guards, `git mv -f home.html index.html`, and deleted the
  `.coming-soon` CSS block (located by grepping for its section comment
  rather than by line number, since the stylesheet keeps growing).
- Verified after reopening: all four pages load without redirecting, nav
  shows the Support dropdown, GT3 badge and `[N MEMBERS]` render (1089 at
  the time — the count moves between checks), and the driver pill stayed
  correctly hidden with 0 on Nordschleife.

- **Site gated again — back into Coming Soon mode** (5th flip). Followed the
  documented procedure exactly: `git mv index.html home.html`, restored the
  Coming Soon page from `git show cecd217:index.html`, re-appended the
  `.coming-soon` CSS block from the same commit, and re-added the
  `location.replace('index.html')` guard to `home.html`,
  `forc3designer.html`, `gt3forc3.html`, `SupportUs.html`. Nothing else in
  those pages touched — all of today's work is preserved in `home.html`.
- Verified all four redirect to the Coming Soon page and that it renders with
  its CSS (logo 40px, year filled). Note the gated `index.html` loads no
  `js/main.js`, so nothing polls the GT3FORC3 Worker while gated.
- Tip for next time: `navigate` reports a *failure* when a page redirects via
  `location.replace()` — that's the guard working, not a broken page. Check
  `location.pathname` afterwards instead of trusting the tool error.

- **Reworked the "Support" nav tab into a dropdown.** It is not a page: it
  now opens a two-item menu (Report a Bug / Make a Suggestion), both Discord
  channel deep links. Supersedes yesterday's entry where Support linked to
  `SupportUs.html` — that page is again reachable only via the Patreon
  "Support Us" links, and its header link got its `is-active` back.
- Built a small generic nav-dropdown system (`.nav__group` / `.nav__toggle` /
  `.nav__menu` + JS) rather than a one-off, mirroring how the modal system is
  reused. Click-driven, not hover, so touch and the mobile drawer behave the
  same. Two non-obvious bits, both documented in `CLAUDE.md`: the drawer's
  close-on-link handler needed `:not(.nav__toggle)` or the toggle dismissed
  the drawer instead of opening its submenu, and inside the drawer the menu
  is flattened to `position: static` so it can't overlay the links below.
- **Caught the nav overflow I'd predicted the day before.** The caret pushed
  the header row's requirement from 1058px to 1081px of client width while
  the collapse breakpoint was still 1080px — i.e. actively overflowing.
  Raised it to 1120px (~20px slack on a 17px scrollbar). The note left in
  `CLAUDE.md` to re-measure before adding nav items is what caught it.
- Updated the Discord deep links to the owner's current URLs: guild
  `1534614323534499891` replaces the older `906573991492349962` everywhere.
  Just an update, not a bug — I initially wrote it up as a broken link and
  was corrected. Don't re-derive drama from the ID change; the owner is the
  authority on their own Discord.
- Footer "Support" column is now Contact / Report a Bug / Make a Suggestion,
  matching the nav dropdown.
- **Added a live driver counter to `gt3forc3.html`'s hero**, mirroring the
  status line on GT3FORC3.COM. Reads the GT3FORC3 Cloudflare Worker's
  `/discord/stats` (CORS `*`, 120s edge cache), sums `server_players` into
  one total, re-polls every 90s. Verified against the live endpoint: it
  returned `{member_count:1091, online_count:95, server_players:{...}}` with
  1 driver on Nordschleife, matching the screenshot the owner sent.
- Notable: this is the **only** part of the site depending on infrastructure
  outside this repo — the Worker belongs to `gt3forc3-website` and must not
  be edited from here. Documented in `CLAUDE.md` along with why it sums
  rather than reads fixed track keys (server reshuffles rename them) and why
  failure is silent (rendering "0 drivers" on a failed fetch would be a lie).
- Long-form badge on the GT3 photo card now carries the full
  "LIVE NOW : GT3FORC3.COM // HOT LAP // Nurburgring Nordschleife" line
  (the trailing "- Leaderboard" was dropped straight after). Needed `text-transform: none` (the label deliberately
  mixes caps and title case, which the base badge's uppercase would flatten)
  plus a max-width and relaxed radius, since it's absolutely positioned and
  now wraps.
- Added `[N MEMBERS]` inside the GT3FORC3 Discord CTA from the same
  endpoint's `member_count` (1091 at the time). One fetch now feeds both it
  and the driver pill, updated independently so an empty track can't suppress
  the member count.
- **Found and fixed a pre-existing mobile bug** while doing the badge: the
  `.about__card` forces `aspect-ratio: 16/10`, which below ~560px is shorter
  than its own content — the heading overflowed past the card's top edge and
  was clipped by `overflow: hidden`, with the absolute badge sitting on it.
  Not caused by the badge (the badge just made it obvious). Fixed with
  `aspect-ratio: auto; min-height: 330px` under 560px. The height has to
  clear the *top-anchored* badge against *bottom-anchored* text
  (`justify-content: flex-end`), which is why it needs to be that generous.
  This also silently fixed the same clipping on `forc3designer.html`'s card.
- Final form of the counter: label is "GT3 Nordschleife server : N driver(s)
  on track", it reads **only** the `nordschleife` key (not the sum — the
  label names one server, so summing would misreport), and it renders
  **nothing at all** when that server is empty. That removed the muted
  "0 drivers" state entirely, so its CSS and the live/empty colour transition
  were deleted as dead code in the same commit.
- Owner then moved it onto the hero title's first line (beside "Race live.")
  and asked for nicer formatting — it's now a rounded pill with a tinted
  green background, border, glow and an emphasised tabular-nums count. Living
  on the title line means it sits **inside the `<h1>`**, so it had to become a
  `<span>` (a `<p>` there is invalid) and undo every inherited heading style.
  Accepted trade-off: the h1's accessible name now includes the pill text.
- Two CSS things worth remembering: `[hidden]` alone loses to a `display`
  rule, so `.live-status[hidden] { display: none }` is required; and
  `.eyebrow` is `inline-flex`, so a sibling `inline-flex` element lands
  *beside* it rather than on its own row (that bit me at the first placement).
- Measurement gotcha that bit me twice now: reading `getComputedStyle`
  immediately after toggling a class returns the *start* of any transitioned
  property, so styles look like they "didn't apply" while untransitioned
  ones snap. Set `el.style.transition = 'none'` before reading. Cost me a
  false "empty state is broken" reading here and a false caret one earlier.
- Confirmed I can read sibling repos directly (`G:\FORC3MOD\gt3forc3-website`
  is cloned locally), so porting a feature across projects doesn't need the
  other conversation's transcript — just read the source repo.
- Removed the footer "Changelog" link from all four pages — it was a dead
  `href="#"` placeholder. The Changelog *modal* on `forc3designer.html` (hero
  button + `#changelogModal`) is a separate thing and stays.
- **Local-testing note**: the preview browser served a stale cached
  `js/main.js` for several reloads, so the dropdown appeared dead while the
  file on disk was correct — `location.reload(true)` and a page-level cache
  buster both failed to shift it (the script URL was unchanged). Restarting
  the server on a *different port* forced a clean fetch. Worth reaching for
  early next time JS edits seem not to apply; verifying the CSS separately
  (adding `.is-open` by hand) was what proved the code wasn't at fault.

## 2026-08-17

- **Site reopened — back to the full live site.** Reversed the 2026-08-16
  gating exactly per the plan in `CLAUDE.md`: deleted the
  `location.replace('index.html')` guard (and its explanatory comment) from
  `home.html`, `forc3designer.html`, `gt3forc3.html`, `SupportUs.html`;
  `git mv -f home.html index.html` so the real homepage is `index.html`
  again; removed the now-dead `.coming-soon` CSS block from the end of
  `css/style.css`. No content edits — pure un-gating.
- Verified locally on `http://localhost:8123` before pushing: all four pages
  load without redirecting, `index.html` has `header.header` and no
  `.coming-soon`, `forc3designer.html` still carries `body.theme-designer`
  with its photo-card background intact, no console errors, and the only
  server 404 is `/favicon.ico` (pre-existing — the site uses an inline
  data-URI favicon, browsers probe `/favicon.ico` anyway).
- Screenshots failed again in this environment ("Browser pane is not
  displayed, so the page is not compositing frames") — verified structurally
  via `javascript_tool` DOM/`getComputedStyle` checks instead, which is the
  fallback `CLAUDE.md` already recommends.
- Fixed `.claude/launch.json` (local-only, gitignored): it was an
  attach-only config named `gt3forc3-static` pointing at a server nobody
  started. Now `forc3mod-static`, actually running
  `python -m http.server 8123` — `preview_start` works out of the box here.
- The Coming Soon page is NOT kept as a file anymore. If it needs to come
  back, restore it from `git show cecd217:index.html` (+ the `.coming-soon`
  rules at the end of `git show cecd217:css/style.css`). `CLAUDE.md` now
  documents both flip directions explicitly.
- **Moved "Support Us" out of the nav row to sit right of the header's
  Discord button**, on request. It's now in `.header__actions`, right after
  Discord (or after the hamburger alone on `SupportUs.html`, which has no
  header Discord button by design), and keeps `is-active` on its own page.
- **Got "same formatting" wrong on the first pass and corrected it**: I read
  it as "format it like the Discord button" and shipped it as a
  `.btn.btn--primary`. The owner meant "keep the formatting it already had"
  — i.e. still a plain `.nav__link`, just relocated. Now styled as a
  `.nav__link`. Noted in `CLAUDE.md` as a don't-redo-this, since turning it
  into a button next to the Discord button is a tempting-looking change.
- Hit and fixed a real responsive bug while doing this: being text-only, it
  has no icon to collapse to (unlike Discord's icon-only mobile fallback),
  so the header row stopped fitting the container gutter at ~494px. Fixed
  by hiding it below 520px and showing a `.nav__link--support` duplicate in
  the hamburger drawer at the same breakpoint. Both rules deliberately sit
  together in one 520px query rather than being folded into the existing
  480px one, since they need their own threshold — measured, not guessed.
  This means each page carries two "Support Us" anchors, only one ever
  visible; documented in `CLAUDE.md` so it doesn't look like duplication.
- Hero lead copy reworked twice on request: "free Windows app" became "free
  3D and 2D Painting app" and the "No 3D software, no design experience
  needed" clause was dropped (both pages); then the **home page only** was
  changed again to lead with the Beta announcement ("our free flagship
  application for Windows … is now available for Beta testing").
  `forc3designer.html` deliberately keeps the 3D/2D wording. Also updated
  that page's eyebrow to "DEDICATED 3D &amp; 2D PAINTING SOFTWARE".
- Owner wrote "Best testing" in the requested copy; shipped it as "Beta
  testing" as an obvious typo, and flagged it in the reply rather than
  silently publishing the typo to a live production site.
- **Added a "Support" nav tab** (after Contact) pointing at `SupportUs.html`
  — that page previously had *zero* inbound links anywhere, since every
  "Support Us" link goes straight to Patreon. The tab carries `is-active` on
  its own page, so the header Patreon link dropped the `is-active` it had
  been holding as a stand-in.
- Measured while doing that: the header row now needs **1058px** of client
  width but `.nav` only collapses at 1080px — single-digit slack once a
  scrollbar is subtracted. Fits everywhere today, but the nav is full;
  `CLAUDE.md` now warns to re-measure and lower that breakpoint before
  adding a sixth nav item.

## 2026-08-16 (later)

- **Site gated again — back into Coming Soon mode.** Restored the exact
  final Coming Soon `index.html` + `.coming-soon` CSS block from git history
  (state as of commit `724641e~1`, right before the previous reopening) —
  didn't reinvent it, just resurrected it per the plan already written down
  in `CLAUDE.md`. Backed up the current real homepage (with the "DEDICATED
  3D PAINTING SOFTWARE" eyebrow change and everything else from today) into
  `home.html`, and re-added the `location.replace('index.html')` guard to
  `home.html`, `forc3designer.html`, `gt3forc3.html`, `SupportUs.html`.
  Verified all four redirect correctly.
- Before gating, also changed forc3designer.html's eyebrow from "FORC3MOD
  Projects & Sim Racing Community servers" to "DEDICATED 3D PAINTING
  SOFTWARE" (scoped to that page only — index.html/home.html kept the
  original, more general eyebrow since it covers both products).
- Site has now cycled gated → live → gated within this project's history.
  See `CLAUDE.md` "Current status" for how to tell which state `index.html`
  is in and how to flip it either direction — expect this to keep happening
  as the release date moves.

## 2026-08-16

- `53acdab` Added a real app screenshot (`img/FORC3Designer_Showcase01.jpg`,
  provided by the owner) as the background photo on the "Your car, your
  canvas." card on `forc3designer.html`, same `.about__card--photo` pattern
  `gt3forc3.html` already used. Also dropped "unofficial" from all 5 places
  it described FORC3MOD/FORC3 Designer (meta descriptions + hero copy on
  `index.html`, `forc3designer.html`, `SupportUs.html`).
- Hit two real CSS bugs wiring the photo in — both now documented in
  `CLAUDE.md` under "Photo cards" so they don't get rediscovered the hard
  way: (1) `.theme-designer .about__card::before` was silently overriding
  the photo with a flat gradient because it out-specifies the generic
  `--photo` rule — needed a matching `.theme-designer .about__card--photo::before`
  override, same as `.theme-gt3` already had; (2) the inline
  `--about-photo: url(...)` must be a root-absolute path (`/img/...`), since
  `url()` inside a custom property resolves relative to where it's *used*
  (`css/style.css`, i.e. `/css/`) not where it's declared.
- `be1d041` The app icon (`img/icon.png`, blue-to-lime "FD" mark) landed and
  is now placed inline in the hero on `forc3designer.html` — a 64px badge
  above the eyebrow/title, per the owner's choice to show it inline rather
  than as a favicon. Pending item closed.

## 2026-08-10 (evening)

- `036195e` All "Support Us" nav/footer links (all 4 pages, 8 occurrences)
  now go straight to `https://www.patreon.com/cw/forc3mod/membership`
  instead of routing through `SupportUs.html`. **`SupportUs.html` is now
  orphaned** — nothing on the site links to it anymore, but the file itself
  is untouched and still fully functional if visited directly. If it should
  be removed entirely (or relinked somewhere), that's a separate decision —
  don't assume it's dead code to delete without checking with the owner
  first, since it wasn't explicitly deprecated, just unlinked.
- `f803caa` Added a dark/slim custom scrollbar site-wide (was the unstyled
  native OS one) and a baseline `<button>` reset — the modal close (×)
  button was rendering as a rounded square instead of a circle because nothing
  reset native button chrome. Also fixed the Changelog modal's scroll-lock to
  freeze `<html>` as well as `<body>`, since some browsers scroll the root
  element and the page could still scroll (showing its scrollbar) behind an
  open modal.

## 2026-08-10 (later)

- **Site reopened — Coming Soon mode retired.** The owner said the team is
  close to releasing FORC3 Designer, so gating the site no longer made
  sense. `index.html` is the real homepage again (restored from `home.html`,
  which was then deleted — no longer needed as a separate backup since
  `index.html` itself is now that content and git history has everything
  before this point anyway). Removed the `location.replace('index.html')`
  redirect-guard script from `forc3designer.html`, `gt3forc3.html`, and
  `SupportUs.html`, and deleted the now-dead `.coming-soon` CSS block from
  `style.css`.
- If a maintenance page is ever needed again, don't rebuild it from scratch
  — the previous implementation is fully recoverable from git history around
  commit `f991fc5` (see `CLAUDE.md` "Current status" for the pointer).

## 2026-08-10

- `a6de88c` **Logo shadow saga, concluded**: `drop-shadow()` softened/jaggied
  the SVG's edges (offscreen compositing) → switched to `box-shadow` → that
  drew a visible hard-edged rectangle under the logo instead of hugging the
  letters (the SVG's box has empty space at the bottom) → removed the shadow
  entirely. Both `filter: drop-shadow()` and `box-shadow` on `.logo__img` are
  now confirmed dead ends — see `CLAUDE.md` "Logo system" before retrying
  either one.
- `cdf1f85` Re-applied the `box-shadow` vs `filter: drop-shadow()` fix on the
  logo mark (see 2026-08-09 entry — this had been reverted once, then
  confirmed and redone after further discussion about SVG rendering quality).
  *(Superseded same-day by the shadow removal above.)*
- `7f3560d` / `411e16a` — the box-shadow swap was tried, then reverted once
  before being redone above (owner wanted to see it live before committing).
- `7dff5b0` Increased the "Under construction" text size on the Coming Soon
  page (13px → 16px, scoped to that page only).
- `b6e6109` Removed the Discord button from the Coming Soon page — it's now
  just the logo + "Under construction" + copyright line, nothing else.
- Created `CLAUDE.md` and this file (`MEMORY.md`) so future sessions have
  full project context without rediscovery.

## 2026-08-09

- Put the site into **Coming Soon mode** (`f991fc5`) while FORC3 Designer is
  still in development — this is the current live state. Full details and
  the reopen procedure are in `CLAUDE.md`. Nothing was deleted: the real
  homepage was preserved in `home.html`, and the other three pages only got
  one redirect line added.
- Iterated on the Coming Soon page: dropped the big "Coming soon." headline
  and lead paragraph per owner request (`53b835b`), fixed the logo/tagline
  size ratio and right-alignment to match the header exactly (`7aa7b35`,
  `3599177`).
- Fixed a real bug in the nav scroll-spy (`037e288`): it was wiping out the
  correct page's nav highlight on load for every page except the one the
  scroll-spy's section-matching happened to fire for. Root cause and fix are
  documented in `CLAUDE.md` under "Nav active-state" — don't reintroduce this.
- Removed the FORC3 Designer nav dropdown entirely — "FORC3 Designer" nav
  item is now a plain link, no Changelog submenu (`b24f4eb`).
- Stopped showing the literal support email address in the contact form's
  success message — introduced a single `FORC3_EMAIL` constant in
  `main.js` instead (`b24f4eb`).
- Found and fixed a real gap: the contact form had name/email/topic fields
  but **no actual message textarea** — added one, wired into validation and
  the mailto body (`1b658d8`).
- Added a Changelog button + modal to `forc3designer.html` (`4c63078`) using
  a new generic modal pattern in `main.js` (`data-modal-target` /
  `data-modal-close`) — reuse this for any future popup.
- Removed the primary blue CTA button from the header on all pages
  (`4cd590d`) — header now shows only the hamburger + Discord button (except
  Support Us, see below).
- Removed the Discord button from the Support Us page entirely — both the
  header one and the hero's ghost "FORC3MOD Discord" button (`80051d5`).
  This was a judgment call after an unanswered clarifying question; revisit
  if the owner wants the hero one back.
- Footer visual pass: recolored the footer logo to plain gray via a CSS
  mask instead of the header's blue `<img>` (`adb2663`), matched the
  tagline's size/alignment/position to the header exactly (`7664553`),
  locked footer logo size to always derive from the header's `--logo-h`
  (`f0e6ae7`), then shrunk the whole footer text scale down further
  (`0b67435`) and darkened the footer's text/logo tone — but **not** its
  background, which was explicitly reverted back to `var(--bg-alt)` after
  the owner said not to change it (`fda5c32` reverts part of `485e9d7`).
- Added a subtle drop shadow to the logo mark (later switched to
  `box-shadow`, see above) and shrank the about-page image/icon blocks'
  aspect ratio, which had grown taller than intended after a spacing pass
  (`e6fa4b6`).
- Site-wide compact pass: reduced section/hero vertical padding and the
  hero lead paragraph's font size (`8608a84`, `505d2b9`).
- Fixed the "What's this about?" `<select>` placeholder-option rendering
  full-brightness instead of matching the dimmed input placeholders —
  `<select>` has no `::placeholder`, so used `:invalid` instead (`ad93685`).

## 2026-08-08 and earlier

- Font pass: Rajdhani for headings/nav, Roboto specifically for button
  labels (`ecb686e`).
- Removed dead CSS left over from an earlier hero-CTA-arrow removal
  (`9f5fa34`).
- Fixed the header logo's tagline ("AC EVO DEVELOPMENT") not being
  vertically centered — was a `line-height` issue (`fc897e4`).
- GT3 FORC3 hero copy updated twice per owner feedback (`c6c4315`,
  `07e283c`).
- *(Earlier history: initial site build, GitHub Pages + custom domain setup,
  the three-theme system (blue/lime/red), the Discord-guild-ID footer link,
  and many rounds of copy/button/spacing feedback predate this log — see
  `git log` for the full history if needed.)*
