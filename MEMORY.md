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
