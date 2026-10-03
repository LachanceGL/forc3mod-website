# FORC3MOD Website - External dependencies and reference IDs

<!-- Split out of CLAUDE.md on 2026-10-03 to keep the auto-loaded file small.
     CLAUDE.md is read into every session; this file is read on demand.
     Content is verbatim from CLAUDE.md -- keep updating it the same way. -->

Everything on this site that depends on something outside this repo: the
contact form's Worker, the GT3FORC3 live driver feed, both products' download
links, and the Discord/community IDs. **A break in any of these is usually a
fix in another repo, not this one.**

---

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

### FORC3 Grid's two hero buttons — one of them is dead until a build ships

`forc3grid.html`'s hero has **"Download the app"** and **"Open the web version"**,
both with the same trailing arrow icon (owner, 2026-09-16 then 2026-09-21;
originally "Open FORC3 Grid" / "Paint one first", the second of which
pointed at `forc3designer.html`). The "Runs in your browser. Chrome or
Edge, on desktop." caption under them was removed 2026-09-21 on request, so
the buttons now sit in a plain `.hero__cta.hero__cta--offset` row like the
other pages — the `.hero__cta-group` wrapper only existed to keep that
caption aligned and went with it. `.hero__source` is still used by
`forc3designer.html`'s "Hosted on GitHub", so its CSS stays.

- **"Open the web version"** → `https://grid.forc3mod.com`, the browser app,
  with `target="_blank" rel="noopener"` since 2026-09-23 (owner: "should open
  in a new window"). It's a separate site on Azure Static Web Apps, so it
  matches the site's convention for every other external link. It was the
  only cross-site link on this site missing that pair.
- **"Download the app"** →
  `https://github.com/LachanceGL/forc3-grid-releases/releases/latest/download/FORC3-Grid-Setup.exe`
  — same "latest release" pattern as FORC3 Designer's button, and a
  **fourth** repo to keep straight (`forc3-grid-releases`, GitHub, built
  installers only). **Live since v0.1.0 was published on 2026-09-23** —
  verified end to end with `curl -L`: 302 → 302 → 200, ~2.96 MB. The release
  ships BOTH `FORC3-Grid-Setup.exe` (the stable name this link depends on)
  and the versioned `FORC3.Grid_0.1.0_x64-setup.exe` that Tauri's updater
  uses; keep publishing the unversioned copy or this link 404s. It returned
  404 from 2026-09-16 to 09-23, while only a draft existed — drafts don't
  resolve through `latest`, and unauthenticated API calls don't show them at
  all, which is why checks then reported "zero releases".
- **`/forc3-grid-download` exists since 2026-09-24** (owner: "make a similar
  download link but for FORC3 Grid app"), so
  `https://www.forc3mod.com/forc3-grid-download` is the shareable form of the
  Grid installer link. Built as an exact mirror of the Designer shim — same
  markup, same **site-blue** chrome. That last part is deliberate: the
  Designer shim is blue even though its product page is lime, so the Grid one
  stays blue rather than going theme-grid orange. Don't "fix" it to match the
  page's theme without deciding that for both shims at once.
  It starts on `style.css?v=72` rather than inheriting the Designer shim's
  stale `?v=32`; neither is kept in step with the real pages (see "Asset
  cache-busting"), they just need *a* version that exists.
  Neither product page links to its own shim — the on-page buttons go
  straight to GitHub. The shim exists purely to hand out a `forc3mod.com`
  URL.
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
`forc3grid.html`'s hero now opens with the same `.hero__icon-row` as
`forc3designer.html`: `img/grid-icon.png` plus a "Change Log" button that
opens a `#changelog` modal. All shared CSS and the generic modal system in
`main.js`, so there are no CSS or JS changes. Measured identical to the Designer
row at 1440px (64px icon, 16px gap, 37px button, same left edge as the title).
`forc3grid.html#changelog` deep-links like the Designer's, and entries are
`#v0-1-1` style.

- **The entry is real as of 2026-09-23**, filled from the published release
  notes (owner: "the .exe for downloading the FORC3 Grid app is now
  available"). It is **labelled v0.1.1** (owner, same day: "0.1.0 does not
  exist"), which is what `releases/latest` serves. Both tags do exist on
  GitHub — v0.1.1 is cosmetic, identical app with a restyled installer — so
  the site keeps one entry at the version people actually download rather
  than two, the second of which would say nothing useful. Id `v0-1-1`. It held a "v0.1.0 // Coming soon" placeholder until then,
  deliberately: the only notes that existed were on an unpublished draft
  whose text predated two of the Grid project's own findings and contradicted
  both the app and this page.
- **The published notes were corrected before release**, which is what made
  them safe to copy: they now say a pack carries the author's saved car (not
  "re-linked to your own"), and they state the multiplayer result outright
  rather than calling it unverified. Matches this page's own copy and
  `forc3-grid`'s docs. **Still diff the release body against the Grid repo's
  current docs before copying a future release** — that gap was real once.
- ⚠️ **The entry is now one sentence**: "This is the release of the FORC3
  Grid beta." (owner, 2026-09-24: "replace the whole FORC3 Grid 0.1.1 change
  log with simply saying this is the release of the FORC3 Grid beta"). It
  carried the full release notes for a day — three intro paragraphs, "In this
  build", "Known, and worth saying up front" — recoverable with
  `git show 0160111:grid.html`, and still on the GitHub release. **Don't
  re-expand it from the release notes**; that was deliberate, not drift.
  Consequence: the page no longer warns about the "Unknown publisher"
  installer prompt or the seven cars AC EVO never builds liveries for. Those
  live only on the GitHub release now.
- ⚠️ **v0.2.0 (Oct 1, 2026) says only "Overall improvements." — that is the
  entire published release body, not an abbreviation of it.** Don't "finish"
  it from the Grid repo's commit log: ~55 commits shipped between v0.1.1 and
  v0.2.0 with real user-facing changes (a takedown can be lifted from the app,
  a pack with no preview picture can't be uploaded, equal votes break on
  download count, the app checks for updates at launch, the download count
  joined the title line, plus a long run of Community Grid card/button
  polish), and none of it was written up. Writing it up here would mean
  publishing notes the owner chose not to write — some of those are Community
  Grid moderation behaviour, which may be deliberately quiet. It was flagged
  to the owner instead; expand the entry only from release notes that actually
  say it. **General rule for both changelogs: the site's entry can be shorter
  than the release, never longer.**
- **Dates follow the owner's local (Eastern) day, not UTC.** v0.1.1 published
  2026-09-23T23:15Z is "Sep 23"; v0.2.0 published 2026-10-02T03:33Z is
  "Oct 1, 2026". A late-evening Eastern release lands on the *next* UTC day,
  so converting from the API timestamp without shifting it dates the entry a
  day late — v0.2.0 would have read "Oct 2" the day before it existed.
- **[`docs/GRID-CHANGELOG.md`](docs/GRID-CHANGELOG.md) is the authoritative
  source for this modal** (created 2026-09-23, on request), the same handoff
  as the Designer's. Edit it and the modal together, in one commit. It
  carries the v0.1.0 entry verbatim, so the two start in sync; a script
  cross-checked all 14 bullets against the rendered modal. Both were
  relabelled v0.1.0 → v0.1.1 together later that day.
- **It deliberately differs from the Designer's doc in one rule**: that one
  forbids an opening summary paragraph, Grid's *keeps* them. Grid releases
  open by explaining why a `.grid` exists at all (the car-binding problem,
  and being seen online), which is the most useful part of the entry for
  someone meeting the app for the first time. v0.1.0 has three such
  paragraphs. The Grid doc also records the draft-vs-published trap and
  which line to strip as boilerplate.
