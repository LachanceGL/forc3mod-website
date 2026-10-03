# FORC3MOD Website - Shared components (modals, nav, dropdowns)

<!-- Split out of CLAUDE.md on 2026-10-03 to keep the auto-loaded file small.
     CLAUDE.md is read into every session; this file is read on demand.
     Content is verbatim from CLAUDE.md -- keep updating it the same way. -->

The reusable JS/CSS machinery in `js/main.js` and `css/style.css`: the modal
system and its deep links, the changelog markup, and the two nav dropdowns.
**Reuse these rather than building a second mechanism** - each already handles
gotchas that are documented inline below.

---

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
- **A small inline icon is a separate thing from a screenshot.**
  `.modal__entry-icon` (added 2026-09-24, owner: "theres a line with new app
  icon, add the actual new icon next to it") renders a 30px rounded icon
  *beside* a bullet's text, for a change that IS an image — v0.7.0's "New app
  icon". `.modal__entry-media` would blow the same file up to full modal
  width. The one live use points at `img/designer-icon.png`, a repo file
  (already the page's hero icon) rather than a release asset, because the
  release didn't ship the icon as one.
  ⚠️ **The text and icon sit inside one `<span class="modal__entry-icon-row">`
  that is itself `display: flex`.** Plain inline was tried first — wrapped in
  a span, image left inline — and the icon still dropped to its own line with
  hundreds of px of room left on the text's line. That is the same class of
  inline-layout gap this environment has shown twice before, so rather than
  ship on the assumption real browsers differ, the pairing is an explicit
  flex row: correct in any engine. Measured after: icon to the right of the
  text, vertically overlapping it, 9px gap, at 1440 and 375px.
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
side by side. Same on all pages including `forc3grid.html`'s header. The
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
