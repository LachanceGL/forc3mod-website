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

## 2026-08-29

- **Brought back "See what it does" and wired it to a real demo video**, on
  request ("bring back the button... use the video inside
  ...\forc3designervid"). Moved the owner-provided file from the top-level
  `forc3designervid/v002.mp4` into `video/forc3designer-demo.mp4` (matching
  the site's flat asset convention), read its real dimensions (1960×1080,
  ~72s) via a `<video>` element in the browser rather than guessing, and
  built a new video modal (`.modal--video`, wider and padding-stripped vs.
  the text modals, sized to the file's real aspect ratio). Button restored
  on both `forc3designer.html` (opens the modal directly) and `index.html`
  (links to `forc3designer.html#demo`, reusing the deep-link system rather
  than duplicating the modal on a second page).
- **Found and fixed two real bugs in the deep-link system while building
  this** — both only became reachable once a second modal existed on the
  same page:
  1. The original "open on load" check only fires once, at initial script
     execution. Navigating between two different modal hashes on an
     already-loaded page (confirmed with `location.hash = '#demo'` in a
     live tab) is a same-document fragment navigation — it doesn't re-run
     that check, so the second modal silently failed to open. Fixed with a
     `window.addEventListener('hashchange', ...)` that opens whichever
     modal now matches the hash and closes whichever no longer does. This
     also gives back/forward button support for free, which an earlier
     entry had explicitly scoped out as unnecessary — no longer true, so
     that note in `CLAUDE.md` was corrected rather than left stale.
  2. Clicking one modal's trigger while another was already open (only
     reachable via keyboard tab, not mouse — a mouse can't reach a trigger
     button that's covered by the other modal's fixed overlay) left both
     modals visually stacked open at once. Confirmed by simulating the
     click sequence directly rather than assuming a mouse test would catch
     it. Fixed: `openModal()` now closes any other open modal first.
  - **Testing note for next time**: the Browser pane's `navigate` tool gave
    inconsistent results for same-hash-different-fragment navigation on an
    already-loaded tab — sometimes behaving like a real reload, sometimes
    not, in a way that didn't match manually setting `location.hash` in the
    page. When testing hash-change behavior specifically, prefer
    `location.hash = '#x'` executed in-page over the `navigate` tool, and
    don't trust a single navigate-tool result as proof of a bug without
    cross-checking that way.
  - Verified end-to-end: fresh-tab load with `#demo` opens+autoplays;
    click-to-open pauses+rewinds on close and clears the hash; same-document
    hash switching between `#changelog` and `#demo` now opens/closes the
    right one each way; the click-based double-open is fixed; no horizontal
    overflow at 375px or 1280px; console clean on both pages. Bumped
    `?v=22 -> v=23` (CSS + JS changed).
  - `CLAUDE.md`'s "Modal system" section now documents the video-autoplay
    hook, the single-modal-at-a-time rule, and the corrected hashchange
    behavior; added a new "Demo video modal" subsection and a `video/` row
    in the file map.

## 2026-08-28

- **Made the modal system deep-linkable** ("make so the changelog can be
  linked to"). Extended the generic `[data-modal-target]` wiring in
  `js/main.js` rather than building anything changelog-specific: opening a
  modal now `history.pushState`s its own element `id` onto the URL hash,
  closing it `history.replaceState`s the hash back out, and a page loaded
  with a matching hash already present auto-opens that modal. Used
  pushState/replaceState instead of setting `location.hash` directly to
  avoid the browser's native scroll-to-anchor jump. Deliberately did NOT
  wire up `popstate` (back/forward button behavior) — out of scope for
  "make it linkable," and there's no other history/routing logic on this
  site to be consistent with. Shareable link:
  `forc3designer.html#changelogModal`. Verified: direct navigation to that
  URL opens the modal on load, clicking the Change Log button updates the
  address bar, closing (button/backdrop/Escape all tested via the close
  button) clears the hash back to a bare URL, console clean on both
  `forc3designer.html` and a page with no modals (`index.html`). Bumped
  `?v=21 -> v=22` (JS changed). Since this rides the existing generic
  system, any future modal gets this for free — see `CLAUDE.md`'s new
  "Every modal is deep-linkable" subsection.

- **Added the v0.2.0 changelog entry** — a big release (layer masks, layer
  effects, 22 cars now across five classes, speed work, a batch of fixes).
  Followed the standing convention: checked `forc3-designer-releases` for
  the release body first. Initially found the release published but with an
  **empty body** — flagged it to the owner rather than inventing content,
  and correctly reported "still empty" on two follow-up "check again"
  requests before the owner actually saved the release notes on GitHub's
  side (confirmed via the release's `updated_at` timestamp changing between
  checks). Once real content existed, distilled the "What's new in 0.2.0"
  section into the same summary+body format as prior entries (7 subsections
  this time: Masks, Layer effects, Layers, Cars, Decals, Speed, Fixes),
  added as a new collapsed `<details>` entry above v0.1.2 in both
  `docs/DESIGNER-CHANGELOG.md` and the modal. Verified: all 4 entries load
  collapsed, v0.2.0 expands correctly despite being by far the longest entry
  yet, no horizontal overflow at 375px or 1280px (the modal's existing
  `overflow-y: auto` handles the vertical length fine), console clean.
  HTML-only change (no CSS), no `?v=` bump needed.
- **Lesson confirmed**: when a GitHub release exists but its body is empty,
  don't guess at changelog content from the diff/assets/anything else —
  report it plainly and wait. Re-checking on request is cheap and the
  `updated_at` field is a reliable way to confirm whether anything actually
  changed between checks, rather than just re-reporting the same empty
  state without evidence it was actually re-verified.

## 2026-08-21

- **Fixed a flex layout bug in the new changelog accordions** — owner
  screenshotted a visible gap between the version number and the "—
  description" text on all three entries. Root cause: `<summary>` is
  `display:flex; justify-content:space-between` (to push the chevron
  right), and the markup had "vX.Y.Z " as a bare text node followed by
  `<span class="modal__date">` as a **sibling** — two separate flex items,
  so `space-between` shoved a gap between them instead of just pushing the
  chevron away. Fixed by wrapping the version text + date span together in
  one `.modal__version-text` span, making it a single flex item again.
  Verified: text now starts flush left (measured `getBoundingClientRect()`
  matches summary's own left edge on all 3 entries), no overflow at 375px
  or 1280px, console clean. No CSS changed, HTML-only fix, no `?v=` bump.
  `CLAUDE.md`'s markup example updated to the correct wrapped shape with an
  explicit warning not to repeat this.

- **Changelog modal reworked into accordions, and adopted a standing
  convention: proactively check `forc3-designer-releases` on GitHub for new
  releases from now on**, rather than waiting for the owner to paste
  changelog text. Fetched the repo's releases via its public API and found
  a real v0.1.2 release already published (today, 2026-08-23) that hadn't
  been reflected on the site — added it as the third entry, distilled from
  its "What's new in 0.1.2" release-body section (stripped the
  download-link/Windows-warning/footer boilerplate every release body
  carries).
  - Converted each `.modal__entry` from a flat one-line div into a native
    `<details>/<summary>` accordion — no JS needed, keyboard/AT-accessible
    for free. Newest entry (v0.1.2) ships `open` so what's new shows
    immediately; v0.1.1 and v0.1.0 start collapsed. Added
    `.modal__entry-body` styling (paragraphs, optional `<h4>` subheadings,
    bullet lists) and a CSS-only rotating chevron on the summary via
    `::after` + `[open]`.
  - `docs/DESIGNER-CHANGELOG.md` rewritten to the new two-part format (short
    summary + full body per entry) and now explicitly documents the
    "check GitHub releases" convention going forward — see its own header
    for the exact API endpoint. `CLAUDE.md`'s "Changelog modal content"
    section has the markup shape and the accordion behavior notes.
  - Verified: v0.1.2 opens by default with real content, clicking v0.1.1's
    summary expands it (native `<details>` toggling confirmed via JS
    `.click()`), no horizontal overflow at 375px or 1280px, modal's existing
    internal vertical scroll (`max-height: 80vh; overflow-y: auto`) handles
    multiple open entries at once, console clean. Bumped `?v=20 -> v=21`
    (CSS changed). Download button unaffected — already points at GitHub's
    "latest release" redirect, so it's already serving v0.1.2 with no code
    change needed.

- **Added Instagram (`https://www.instagram.com/forc3mod/`)** on request,
  mirroring exactly how X was added earlier today: footer Community column
  link on all 4 pages (below the X link), plus a header `.icon-btn` right
  after the X icon, on `index.html`, `forc3designer.html`, `gt3forc3.html`.
  **Found and fixed a real overflow bug this introduced**: with two social
  icons now in `.header__actions`, the row stopped fitting real phone
  widths (~375-400px, including the very common iPhone 12/13 at 390px) —
  measured required width ~401px, a razor-thin fit. Fixed the same way the
  site already handles this (Discord label hides at 640px, Support us hides
  at 520px): both social icons now share a `.header__social` class, hidden
  below 410px via a new media query in `css/style.css`, still reachable via
  the footer everywhere. Verified no overflow from 375px up through 1121px
  (the nav breakpoint edge) on both `index.html` and `gt3forc3.html`, console
  clean. Bumped `?v=19 -> v=20` (CSS changed). Re-measured nav's required
  width too (~1083px, was ~1033px with just X) — still fits under the
  1120px breakpoint but headroom is down to ~37px; flagged in CLAUDE.md to
  re-measure before any third header icon. See CLAUDE.md's new "Header
  social icons — an overflow gotcha" section.

- **Added an X (Twitter) icon button to the header**, next to the Discord
  button, on request (screenshot showed the intended empty spot). Used the
  existing `.icon-btn` class (same circular treatment as the hamburger/modal
  close buttons) rather than inventing a new style, placed immediately
  before the Discord button on `index.html`, `forc3designer.html`, and
  `gt3forc3.html`. Not added to `SupportUs.html`'s header — that page has no
  header Discord button by design (see CLAUDE.md), so there's no "next to
  Discord" slot to put it in. Re-measured the header's required width
  (~1033px, was ~981px) against the 1120px collapse breakpoint — still
  ~87px of headroom, verified no overflow at 1121px or 375px. Links to
  `https://x.com/forc3mod`, same URL already used for the footer's X link
  added earlier today.

- **Renamed the "Support" nav dropdown + footer heading to "Get support"**
  across all 4 pages, on request ("change any Support to Get support").
  Left "Support us" (the Patreon link/footer link) untouched — the request
  was for the standalone "Support" label specifically, and CLAUDE.md already
  documents these as two deliberately separate things. Re-measured the nav's
  required width with the longer label (~981px) against the 1120px collapse
  breakpoint — still ~139px of headroom, no breakpoint change needed.
  Verified no overflow at 1121px (right at the edge), mobile drawer shows
  "Get support" correctly. `CLAUDE.md`'s "Nav dropdown system" and "Nav
  width" sections updated to match.

- **Created `docs/DESIGNER-CHANGELOG.md`** as the editable source for the
  Changelog modal on `forc3designer.html`, on request ("make this panel as
  a file I can edit in VScode, then you look at it to update it on the
  site"). Same handoff pattern as `forc3-designer`'s
  `docs/TooltipsTexts_Bindkeys` — owner edits the doc, Claude propagates it
  into the modal's HTML. Seeded with the two entries already live (v0.1.1,
  v0.1). See `CLAUDE.md`'s "Changelog modal content" subsection under
  "Modal system" for the sync workflow.

- **Wired the FORC3 Designer download button to a real URL.** Both
  "Download for Windows" buttons on `forc3designer.html` (hero + features
  section) went from `href="#"` placeholders to
  `https://github.com/LachanceGL/forc3-designer-releases/releases/latest/download/FORC3-Designer-Setup.exe`
  — GitHub's "latest release" redirect, so it stays current automatically
  as long as future releases keep that asset filename. Added
  `target="_blank" rel="noopener"` to match every other external link on
  the site. Plain HTML attribute change, no CSS/JS touched, no `?v=` bump
  needed. See `CLAUDE.md`'s new "FORC3 Designer download button" section
  for the cross-repo naming (this site vs. `forc3-designer` on ADO vs.
  `forc3-designer-releases` on GitHub) and the caveat that this alone
  doesn't confirm the app is publicly released yet.

- **GT3 badge legibility — the real bug (`v=19`), after two wrong color
  fixes (`v=17`, `v=18`).** Owner sent a screenshot ("are you drunk")
  showing the badge nearly washed out; a hard refresh didn't help ("its
  refreshed"), ruling out cache. After `v=18` shipped, owner reported
  "literally the same" — and when I suggested a hard-reload/incognito check
  again, correctly shut that down ("it's not a refresh issue you idiot").
  That pushback was right and forced an actual structural investigation
  instead of a third color guess.
  - **The real root cause**: `.about__card::before` (the photo+gradient
    layer) is `position: absolute; inset: 0`. `h3`/`p` are explicitly given
    `position: relative` specifically so they paint *above* that layer.
    `.about__badge` never got that treatment — it used to be `position:
    absolute` itself (which incidentally also promoted it above `::before`
    for free), and when it was switched to normal flow during an earlier
    redesign, nobody replaced the lost stacking promotion. Net effect:
    **the photo was literally painting over the badge**, confirmed with
    `document.elementFromPoint()` at the badge's own center returning the
    card div, not the badge span. Every color/fill/text-shadow change made
    to the badge in the two earlier attempts was invisible underneath the
    photo the whole time — which is exactly why `v=18` looked "literally
    the same" as `v=17` despite being a completely different set of colors.
  - **Fix**: added `position: relative;` to the base `.about__badge` rule.
    Confirmed via the same `elementFromPoint()` check that the badge is now
    the actual hit target at its own center. `.about__badge` is currently
    only used on `gt3forc3.html`, so this had no other page to regress.
  - **The two earlier color attempts weren't wasted** — `v=18`'s
    near-opaque dark fill + border is still the badge's current styling,
    just was invisible until this fix let it actually render. Left as-is.
  - No overflow, no console errors. Bumped `?v=18 -> v=19`.
  - **Lesson**: when a styling fix visibly "does nothing" across multiple
    attempts with materially different values, stop iterating on values and
    check whether the element is actually painting where you think it is —
    `elementFromPoint()` at the element's own center is a fast, definitive
    check for "is something else covering this." Any element inside a
    `position: relative` container with an absolutely-positioned sibling
    (like the `::before` photo/gradient layers on `.about__card`) needs its
    own explicit `position` to guarantee it paints above that sibling —
    don't assume normal DOM order is enough once *any* sibling is taken out
    of flow.

- **Superseded below — kept for the record of what was tried and why it
  looked plausible at the time, not as current guidance.**
  - **First attempt (`v=17`, later shown insufficient by a follow-up
    screenshot — "still not fixed")**: diagnosed the badge's *photo*
    backdrop as too bright at its first-child position (corner gradient
    only ~33% strength there, worst raw photo sample 0.322 luminance), and
    gave the badge the same `text-shadow` as h3/p plus a bump from `.16` to
    `.28` on its existing translucent **green** fill
    (`rgba(34,197,94,*)`). Verified with canvas photo-luminance sampling at
    1280px/375px and declared it fixed — **but never actually screenshotted
    it**, and the photo-luminance check was the wrong measurement: it
    confirmed the photo behind the badge was dark, not that the badge's own
    pill was readable. In hindsight this measurement was irrelevant either
    way — the badge wasn't even rendering above the photo yet.
  - **First attempt (`v=17`, later shown insufficient by a follow-up
    screenshot — "still not fixed")**: diagnosed the badge's *photo*
    backdrop as too bright at its first-child position (corner gradient
    only ~33% strength there, worst raw photo sample 0.322 luminance), and
    gave the badge the same `text-shadow` as h3/p plus a bump from `.16` to
    `.28` on its existing translucent **green** fill
    (`rgba(34,197,94,*)`). Verified with canvas photo-luminance sampling at
    1280px/375px and declared it fixed — **but never actually screenshotted
    it**, and the photo-luminance check was the wrong measurement: it
    confirmed the photo behind the badge was dark, not that the badge's own
    pill was readable.
  - **Real bug**: the pill's fill color and its text color are both
    **green and similarly bright** (`rgba(34,197,94,*)` behind `#4ade80`).
    text-shadow fixes edge definition against a busy *photo*, but does
    nothing for fill-vs-text contrast when the fill sits *between* the
    photo and the text — that contrast was low regardless of the photo,
    which is exactly what the owner's second screenshot showed unchanged.
  - **Actual fix (`v=18`)**: replaced the green translucent fill with a
    near-opaque dark one — `rgba(5, 14, 9, 0.85)` — plus a
    `rgba(74,222,128,.35)` border for definition, mirroring `.live-status`'s
    border+glow pill look. At 85% opacity the pill reads as a solid dark
    chip almost independent of the photo underneath, so contrast no longer
    depends on the fill's hue matching (or clashing with) the text, or on
    how much photo shows through.
  - **Verified properly this time**: computed the actual WCAG contrast
    ratio between the composited pill color (fill blended over the
    *brightest single photo pixel* sampled directly under the badge — true
    worst case, not an average) and the text color. Result: **8.64:1 at
    1280px, 9.02:1 at 375px** — both comfortably past the 4.5:1 AA
    threshold for normal text, using the actual worst-case pixel rather
    than an average. This is the contrast-ratio check that should have run
    the first time instead of a photo-darkness check.
  - No overflow, no console errors, forc3designer.html's card (no badge)
    unaffected. Bumped `?v=16 -> v=17 -> v=18` across both attempts.
  - **Lesson for next time a translucent color fill sits over a photo**:
    verifying "the backdrop is dark" is not the same as verifying "the
    fill-plus-backdrop has enough contrast against the text color" — check
    the actual composited color against the text color's contrast ratio,
    not just backdrop luminance in isolation. And when the owner sends a
    screenshot, get an actual screenshot back before declaring it fixed —
    math alone missed this the first time.

- **Moved the GT3 badge back above the heading** — owner: "LIVE Server must
  be on top." This is the badge's *third* position in this card's history:
  originally first (before h3/p), moved to last (after p) on 2026-08-19
  because that read as "not the bottom," now moved back to first on request.
  Pure markup reorder, no CSS touched — the group as a whole stays
  bottom-anchored via the base `.about__card`'s `justify-content: flex-end`
  regardless of internal order, so this only affects order *within* the
  group. No `?v=` bump needed. `CLAUDE.md`'s note on this now points at this
  log instead of asserting a "final" position, since it's flipped twice.

- **Added a bottom-left corner gradient to the GT3 card**, on request, to
  mirror theme-designer's new bottom-right one. Had to reconcile this with a
  hard lesson from 2026-08-19: a position-tracking gradient was already
  tried and abandoned on this exact card as the *contrast* mechanism, because
  the badge's 1-3 line wrap swings h3's position by ~25 points of card
  height between breakpoints — no fixed gradient could track it, which is
  why `text-shadow` replaced it entirely.
- Resolved by keeping this new gradient purely decorative rather than
  load-bearing: `text-shadow` on h3/p is untouched, still doing the actual
  contrast work regardless of position. The new gradient is deliberately
  gentle (fades out by 50%, lower peak opacity than theme-designer's 65%/.9)
  since it doesn't need to precisely track anything — it just has to look
  like an accent, not carry legibility. Verified text-shadow is still
  applied and unchanged, and that forc3designer.html's own corner gradient
  (bottom-right) is untouched.
- `CLAUDE.md` updated to make the distinction explicit for next time:
  gradient-as-contrast-mechanism is still the dead end on this card;
  gradient-as-decoration-while-shadow-does-the-work is fine.
- Bumped `?v=14 -> v=15` (CSS changed).
- **Follow-up same day: owner said the gradient read as too weak** ("must be
  black to opacity") — fair, the .55 peak I'd picked was closer to a gray
  wash than black. Bumped the stops to match theme-designer's exactly (.9 /
  .55 / transparent at 0/30/65%), so the two pages are now genuinely
  consistent rather than GT3's being a diluted copy. The
  decorative-not-load-bearing reasoning didn't change — text-shadow is still
  untouched and still what actually keeps the text legible — only the
  gradient's own visual strength did. Re-verified text-shadow still applied
  and no overflow after the change. Bumped `?v=15 -> v=16`.

## 2026-08-20

- **Reworked the FORC3 Designer card's text and gradient**, on request:
  removed the body paragraph entirely, moved the "Your car, your canvas."
  heading from top-left to the bottom-right corner (`align-items: flex-end`
  for horizontal, `text-align: right` on the h3; vertical bottom-anchoring
  was already inherited from the base `.about__card` rule), and replaced the
  old full top-to-bottom dark band with a corner-anchored
  `linear-gradient(to top left, ...)` — dark only behind where the heading
  now sits, fading out toward the rest of the photo. Removed the now-dead
  `.theme-designer .about__card--photo p` rule along with the paragraph.
- Verified contrast the same rigorous way as before rather than eyeballing:
  computed the gradient's actual alpha at the heading's rendered position
  and sampled the real photo pixels underneath it — composited luminance
  0.049 against a 0.183 safe threshold, well clear. Checked at
  375/700/1280px (bottom-right offset a consistent ~41px at every size,
  matching the card's own padding) and confirmed `gt3forc3.html`'s card is
  untouched.
- Bumped `?v=13 -> v=14` (CSS changed).

- **The `55%` reframe (previous entry) turned out to be a dead end** — owner
  reported "I don't see any difference" after a confirmed hard refresh.
  Correctly so: the actual pixel shift at the desktop breakpoint was only
  ~5px, since the position percentage doesn't map linearly to "where the
  subject sits" the way I'd assumed — I had to re-derive the real relationship
  (it depends on how much the image overflows the card, which differs a lot
  by breakpoint) to even understand why my own fix was so subtle. Asked what
  they actually wanted rather than guess a third time: "show the whole car,
  nothing cropped" (vs. the alternative of zooming in tighter).
- **First attempt at that: cropped a derivative image**,
  `img/FD_SitePreview_Framed.jpg` — trimmed the toolbar and dead space out
  of the screenshot, switched the card to `background-size: cover, contain`
  (contain guarantees nothing is ever cropped, unlike cover). Owner then
  updated the actual `FD_SitePreview.jpg` source on disk with a new capture,
  and separately said not to use a generated derivative image at all —
  **"use the real one."** Deleted `FD_SitePreview_Framed.jpg` entirely and
  reverted `--about-photo` back to the real, owner-provided
  `FD_SitePreview.jpg`.
- **Final approach, on request ("make so the card fits it's size ratio")**:
  instead of cropping the image to fit the card, size the *card* to match
  the image. `.theme-designer .about__card--photo` now sets
  `aspect-ratio: 824 / 485` (that file's real pixel dimensions), overriding
  `.about__card`'s three responsive ratios (4/3 desktop, 16/10 tablet, auto
  mobile) at every breakpoint via specificity. With box and image the same
  shape, plain `background-size: cover` shows the whole thing with zero
  cropping and zero letterboxing — simpler than the contain approach and
  needs no generated asset.
- Bug caught while verifying, not shipped blind: `.about__card`'s mobile
  `min-height: 330px` doesn't get cancelled just because `aspect-ratio` is
  overridden (cascades per property, not per rule) — left in place, it fought
  the fixed ratio and forced the card to 561px wide, overflowing the 375px
  viewport. Fixed with `min-height: 0` in the same override rule. Confirmed
  clean (no overflow, text still fits, ratio matches image) at 375/700/1280px
  after the fix, plus that `gt3forc3.html`'s card is untouched.
- Lesson worth keeping: don't manufacture a derivative asset when the owner
  can just supply the right one and the CSS can adapt to it instead — ask
  first if genuinely unsure which they'd prefer, since it isn't always
  obvious in advance which side (image or box) should be the one that bends.
- Bumped `?v=12 -> v=13` (CSS changed).

- **Swapped the "Your car, your canvas." card image** on `forc3designer.html`
  from `img/FORC3Designer_Showcase01.jpg` to a new owner-provided screenshot,
  `img/FD_SitePreview.jpg` (already present in `img/`, just not referenced
  yet). Root-absolute path in the inline `--about-photo` style, per the
  established `url()`-resolves-against-the-stylesheet gotcha. Old image left
  on disk rather than deleted — it's owner-provided, not generated, so
  removing it felt like a bigger call than a routine dead-code cleanup.
  `CLAUDE.md`'s file map updated to match.

- **Site gated again — back into Coming Soon mode.** Standard procedure:
  `git mv index.html home.html`, restored the Coming Soon page from
  `git show cecd217:index.html`, re-appended the `.coming-soon` CSS block
  from the same commit, re-added the `location.replace('index.html')` guard
  to `home.html`, `forc3designer.html`, `gt3forc3.html`, `SupportUs.html`.
  Bumped the cache-buster `?v=8 -> v=9` in the same commit since that CSS
  re-append changes `css/style.css`.
- All of yesterday's and today's earlier work is preserved intact in
  `home.html` — the FORC3 Designer feature-list copy passes (multiple
  rounds), the reworked home hero lead, and the GT3 photo card's final
  text-shadow-based contrast fix.
- Verified all four pages redirect to the Coming Soon page, which renders
  with its stylesheet at `?v=9`. The gated `index.html` loads no
  `js/main.js`, so nothing polls the GT3FORC3 Worker and the contact form is
  unreachable while gated.

- **Site reopened again the same day.** Guards removed from all four pages,
  `git mv -f home.html index.html`, `.coming-soon` CSS block deleted, cache-
  buster bumped `?v=9 -> v=10` since that removal changes `css/style.css`.
- Verified everything preserved through the gate/reopen round-trip: all four
  pages load without redirecting, the FORC3 Designer feature list shows all
  of today's edits ("Paint directly in 3D on the car model", "Built
  specifically for EVO current pipeline", "Export directly to the game"),
  the home hero lead matches yesterday's rewrite, and the GT3 photo card
  still has no gradient / has `text-shadow` on h3/p / badge still last child.

## 2026-08-19

- **GT3 photo card badge/gradient — the full sequence, three rounds of
  owner feedback, ending on a different technique than any of the
  in-between attempts.** Recorded as one entry rather than three, since the
  middle attempts were superseded same-day and don't reflect current state:
  1. Moved `.about__badge` out of `position: absolute; top: 32px; left: 32px`
     into normal flex flow, first ordered *before* h3/p (bottom-anchored
     group, badge on top of that group). Owner: still not "the bottom" —
     it read as above the text block, not below it.
  2. Reordered badge to be the *last* child instead — below both h3 and p,
     flush against the card's bottom padding. Also fixed
     `.about__badge--wide`'s `max-width: calc(100% - 64px)` to plain `100%`
     (the `-64px` was leftover absolute-position inset math that
     over-constrained it now that it's inside the card's own
     `padding: 40px`). Owner: now it's sitting underneath a heavy black
     gradient — the fade meant for h3/p was covering the badge's new
     position too.
  3. Tried narrowing the dark fade to sit only behind h3/p and ease off
     before the badge, using percentage-of-card-height gradient stops,
     calibrated by sampling the actual photo's pixel luminance behind each
     element (not guessed) and checked against WCAG contrast math. This
     kept breaking: the badge is a long sentence that wraps 1-3 lines
     depending on card width, so h3's position swings ~25 points of card
     height between mobile and desktop (~33-52% narrow vs ~58-67% wide) —
     no fixed set of stops covered both without either leaving mobile h3
     exposed or dragging the fade back over the badge. Abandoned as
     structurally the wrong tool: a card-height-relative gradient can't
     track flex-reflowed text.
  - **Final state**: `.theme-gt3 .about__card--photo::before` has no dark
    gradient at all — just the raw photo. `h3`/`p` get a `text-shadow`
    instead (tight dark shadow + soft wide one), which works at wherever
    the text actually renders, no position math needed. The badge relies on
    its own translucent pill fill, same as when it worked fine at its
    original top-left position.
  - `forc3designer.html`'s card (no badge, own text at the top, needs the
    full base/theme-designer dark band) was reverified untouched after
    every round.
  - `CLAUDE.md`'s photo-card notes rewritten to match the final approach and
    explicitly warn against re-trying the abandoned gradient technique.
  - Bumped `?v=6 -> v=7 -> v=8` across the three rounds.

## 2026-08-18

- **Removed the dark top gradient from the GT3 photo card**, on request —
  the badge now floats over the raw photo instead of a black band. Scoped to
  `.theme-gt3 .about__card--photo::before` only: `forc3designer.html`'s
  version of the same rule was deliberately left alone, since that card has
  no badge and its own h3/p sit at the *top*, so it still needs that dark
  band for text contrast. Verified the two rules stayed independent (GT3's
  `::before` background now starts `transparent`, forc3designer's is
  unchanged at `.92`).
- Bumped `?v=5 -> v=6` (CSS changed).

- **Owner: "Support is not even centered".** They were right, and my previous
  fix caused part of it — trimming `.nav__toggle`'s right padding to 6px left
  the box asymmetric (10px left / 6px right) *and* the in-flow caret still
  pushed the label off-centre.
- Tried absolute-positioning the caret with symmetric 22px padding: that did
  centre the label perfectly (offset 0), but pushed the label-to-label gap
  before "Support" to 46px against 34px everywhere else — trading one
  unevenness for another, and the owner had *already* complained about uneven
  spacing.
- **Resolved by removing the caret entirely.** The toggle is now
  pixel-identical to a plain `.nav__link`: every item 10px padding, 10px
  leading and trailing, 14px box gaps, 34px label gaps, every label centred
  at offset 0. Dropdown still opens on click / closes on outside-click and
  Escape; `aria-haspopup`/`aria-expanded` keep it announced as a menu.
- Lesson for next time: a trailing icon inside an item whose siblings have no
  icon can't be both centred and evenly spaced. Decide which one matters
  before adding it — or use an affordance that costs no width (underline,
  colour shift). Documented in `CLAUDE.md`.
- Bumped `?v=4 -> v=5`. Nav is narrower again (959px needed).

- **Owner reported the nav "badly aligned, multiple different spacings".**
  Measured before changing anything: gaps were already uniform (6px between
  boxes, 34px label-to-label) and vertical alignment pixel-identical (every
  item top 19, height 43, text top 31.4). So there was no misalignment bug.
- The real cause was **the active pill making its own padding visible** while
  every other link's padding is invisible: the space after "Home" read as
  20px against 34px between plain labels. Fixed by shifting the separation
  from padding into `gap` — `padding: 10px` + `gap: 14px` instead of
  `10px 14px` + `6px`. Label-to-label stays 34px, leading space is now a
  uniform 10px on every item, and the gap after the pill went 20px -> 24px.
  It can never be exactly equal while the pill has any padding — that part is
  inherent, worth saying if it's raised again.
- Also trimmed `.nav__toggle` right padding to 6px: the caret is trailing
  content, so equal padding left "Support" off-centre in its own box
  (14 before / 29 after; now 10 / 21).
- Bumped `?v=3 -> v=4` since CSS changed. Nav got slightly narrower (needs
  970px now), so header headroom improved rather than regressed.

- **Site reopened again** (fourth state change in two days). Guards removed,
  `git mv -f home.html index.html`, `.coming-soon` CSS block deleted, and the
  cache-buster bumped `v=2 -> v=3` since that block's removal changes
  `css/style.css`. `CLAUDE.md` now states the bump requirement inside *both*
  flip procedures, since it's easy to skip on what feels like a mechanical
  change.
- Verified after reopening: no page redirects, nav shows the Support
  dropdown, GT3 badge and `[1090 MEMBERS]` render, driver pill correctly
  hidden with nobody on track, all assets on `?v=3`.
- Stopped tracking a flip count in `CLAUDE.md` — it went stale twice in two
  days. The dated log here is the source of truth for how often it happens.

- **Site gated again** (second gating of the same day, third state change).
  Standard procedure: `git mv index.html home.html`, restored the Coming Soon
  page from `git show cecd217:index.html`, re-appended the `.coming-soon` CSS
  block, re-added the four `location.replace` guards.
- Because that re-append **changes `css/style.css`**, bumped the cache-buster
  to `?v=2` on all pages in the same commit — the first real exercise of the
  rule added earlier today. Also added `?v=2` to the restored Coming Soon
  page, which predates versioning and would otherwise have served stale CSS.
- Verified all four pages redirect and the Coming Soon page renders with its
  stylesheet. The gated `index.html` loads no `js/main.js`, so while gated
  nothing polls the Worker and the contact form is unreachable — worth
  remembering if someone reports the form "not working" during a gate.

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
