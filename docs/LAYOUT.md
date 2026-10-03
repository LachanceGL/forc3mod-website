# FORC3MOD Website - Layout, theming and responsive rules

<!-- Split out of CLAUDE.md on 2026-10-03 to keep the auto-loaded file small.
     CLAUDE.md is read into every session; this file is read on demand.
     Content is verbatim from CLAUDE.md -- keep updating it the same way. -->

Everything about how the site is laid out and themed: colours, the logo, the
photo cards, the hero, and the measured breakpoint ladder that the header and
nav depend on. **Read this before changing any width, breakpoint, nav item or
header element** - several of these numbers were derived from overflow bugs
that took a full sweep to find.

---

## Theming system

- `:root` defines the default **blue** theme via CSS vars (`--accent`,
  `--accent-2`, `--accent-soft`, etc.).
- `forc3designer.html` → `body.theme-designer` → **lime** accent.
- `forc3grid.html` → `body.theme-grid` → **orange** accent (added 2026-09-16,
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
  anything; change it on every page at once, including `forc3grid.html`.
- Keep the header and footer markup/behavior **identical** across all five
  content pages (`index.html`, `forc3designer.html`, `forc3grid.html`,
  `gt3forc3.html`, `SupportUs.html`). When you change one page's
  header/footer, mirror the change to the other four in the same turn.
  - `forc3grid.html` was synced into this set on 2026-09-14 (owner: "sync the
    grid.html header with the other pages", then "sync the footer too") after
    drifting to old copies (plain "Support us" links, an extra tab) whose
    header ran 22px past a 1280px window. **Keep mirroring header/footer
    changes into it whichever state it's in** — that drift is exactly what
    happened the first time it sat unlinked. While hidden its header carries
    no active nav item and nothing links to it; while shown it's a normal
    page with its own tab `is-active`.

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

## Homepage hero — two products, not one

Rewritten 2026-09-22 (owner marked the lead + button row: "change this to
reflect better FORC3 Grid addition"). It had described FORC3 Designer only,
from before FORC3 Grid existed.

- **Lead** now covers both: the studio line, Designer's beta, then
  "// FORC3 Grid, our new livery manager and sharing tool, has just entered
  beta too." Four lines on desktop instead of three. Also fixed a missing
  comma after "livery painting application" while rewriting.
  The Grid clause was rephrased 2026-09-24 (owner: "say it's new also") to
  mirror the Designer clause's shape — *product, our description, beta
  status* — rather than only describing what Grid does. ⚠️ **"new" and "has
  just entered beta" both go stale.** Grid's beta shipped 2026-09-23; revisit
  this wording once it isn't news, the same way Designer's "now open for
  beta testing" will need revisiting at 1.0.
- **Buttons are one per product**: "Get FORC3 Designer" (primary →
  `forc3designer.html`) and "Get FORC3 Grid" (ghost → `forc3grid.html`), each
  ending in **its own app icon** since 2026-09-25 (owner: "replace these
  arrows with the respective app icons") — `img/designer-icon.png` and
  `img/grid-icon.png` via `.btn__app-icon`, 20px with 5px rounding rather
  than `.btn .ico`'s 16px, which muddies artwork. `alt=""` on both: the
  label already names the product, so the icon is decorative. Every other
  button on the site keeps the arrow — this is a per-button choice, not a new
  default. Measured after: icons load, 20×20, after the label, no overflow,
  and the buttons still wrap to a column between 560 and 480px exactly as
  before. It shipped as "Meet FORC3 Grid" for a few
  minutes — reasoning being that it links to a page, not a file, and Grid's
  installer isn't published — and the owner overruled it the same day
  ("meet? Should be Get also"). The pair reads as one set now; keep both on
  "Get" unless told otherwise.
- ⚠️ **The second button tracks whichever product is visible.** It was
  "See what it does" (→ the Designer demo) originally; became "Get FORC3
  Grid" on 2026-09-22 when the hero was rebalanced; went **back to "See what
  it does"** on 2026-09-23 when Grid was hidden again, because a hero button
  is not covered by the hide checklist's nav/footer sweep and would have been
  the only remaining path into a hidden page — then back to **"Get FORC3
  Grid"** hours later when Grid returned. Decide it explicitly on every flip:
  the owner's preference while Grid is visible is the two-"Get" pair, so
  restore that on a show and fall back to the demo link on a hide.
- The `<h1>` "Design liveries. Own the grid." was already a fit for both
  products and was left alone.
- **The hero is a fifth edit the hide/show checklist doesn't cover.** A
  hidden page is unlinked from nav and footer, but a hero button pointing at
  it survives that sweep and becomes the only path in. This caught 2026-09-23
  only because the note was here; keep checking it.
- **The lead still names FORC3 Grid** even while that page is hidden
  ("// FORC3 Grid, our new livery manager and sharing tool..."). Left deliberately
  on 2026-09-23 and flagged to the owner: it describes what the studio
  makes rather than linking anywhere, so it isn't a dead end. Trim it if the
  owner would rather the homepage not mention an unreachable product.
- Checked 321-1440px: no overflow, buttons wrap to a stacked column below
  ~560px.

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
