# FORC3MOD Website - Routine procedures

<!-- Split out of CLAUDE.md on 2026-10-03 to keep the auto-loaded file small.
     CLAUDE.md is read into every session; this file is read on demand.
     Content is verbatim from CLAUDE.md -- keep updating it the same way. -->

The multi-edit routines that have to be done as a set, or something breaks
silently. **Follow the checklist rather than doing it from memory** - every one
of these has been shipped half-done at least once.

---

## How to gate it again (live → Coming Soon)

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

## How to reopen it (Coming Soon → live)

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

## Showing / hiding a product page — four edits, they go together

**Current state (2026-09-23): `forc3grid.html` shown, `gt3forc3.html` hidden.**
Grid has flipped six times; **check the live markup, never this line.**
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
| About / Designer / Grid / Get support | 1035px | 1100px / 1120px + the 1800px step |
| About / Designer / Get support | 933px | 1100px / 1120px + the 1800px step — unchanged, 167px of slack |

**The 1100 / 1120 pair covers every set except the five-link one.** Only a
nav carrying both Grid and GT3FORC3 (1131px) needs 1200 / 1220. The two
2026-09-23 flips needed no CSS change at all — measure first, and don't
touch the pair out of habit.

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

## The Grid page is `forc3grid.html`, not `grid.html`

Renamed 2026-09-24. The owner asked for changelog deep links at
`https://www.forc3mod.com/forc3grid.html#v0-1-1` — a URL that 404'd, because
the page was `grid.html`. The deep-link machinery already worked; only the
filename was off, and `forc3grid.html` is what matches `forc3designer.html`
and `gt3forc3.html`. Renamed with `git mv`, all 11 internal links repointed
(nav × 5, footer × 5, the homepage hero's "Get FORC3 Grid" button), sitemap
updated, and `grid.html` left behind as a redirect shim copying
`designer.html`'s. **Use `forc3grid.html` everywhere from now on**; the shim
is for links already in the wild, not for new ones.

## Asset cache-busting — bump `?v=` when you edit CSS or JS

Every page loads `css/style.css?v=N` and `js/main.js?v=N`. **When you change
either file, bump `N` in all five pages in the same commit** — otherwise the
version query is worse than useless, because it looks like it's handling
cache invalidation while doing nothing. "All five" means `index.html`,
`forc3designer.html`, `forc3grid.html`, `gt3forc3.html`, `SupportUs.html`. An
older "all four pages" phrasing here left `forc3grid.html` on `style.css?v=34`
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
