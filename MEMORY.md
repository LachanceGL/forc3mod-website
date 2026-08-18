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
