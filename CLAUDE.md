# FORC3MOD Website — Project Notes for Claude

This file is loaded into **every** session, so it is deliberately short: it
covers what the project is, the rules that cause silent breakage if missed,
and where everything else is written down. The detail lives in `docs/` and is
read on demand.

**Keep this split going forward.** When you make a structural decision, fix a
non-obvious bug, ship a feature, or flag something for later, write it in the
matching `docs/` file — not here. Only add to this file if a future session
would get something *wrong* in the first five minutes without it. These docs
are a living record; treat them as the source of truth over any memory.

## Where things are documented

**Read the relevant file before touching that area.** Each one opens with the
traps that area has already produced; most were found the hard way.

| Doc | Covers |
|---|---|
| [`docs/LAYOUT.md`](docs/LAYOUT.md) | Theming, logo, photo cards, hero, design conventions, nav width, and the **header breakpoint ladder**. Read before changing any width, breakpoint, nav item or header element. |
| [`docs/COMPONENTS.md`](docs/COMPONENTS.md) | Modal system + deep links, changelog markup, both nav dropdowns, scroll-spy. Reuse these; don't build a second mechanism. |
| [`docs/INTEGRATIONS.md`](docs/INTEGRATIONS.md) | Contact form Worker, GT3FORC3 live driver feed, both download buttons, Discord/community IDs. Breakage here is usually another repo's fix. |
| [`docs/PLAYBOOKS.md`](docs/PLAYBOOKS.md) | Multi-edit routines: gating the site, showing/hiding a product page, cache-busting, working conventions. Follow the checklists. |
| [`docs/SEO.md`](docs/SEO.md) | Favicon, Google Search Console, `sitemap.xml`, `robots.txt`. Mostly already-answered questions. |
| [`docs/DESIGNER-CHANGELOG.md`](docs/DESIGNER-CHANGELOG.md) · [`docs/GRID-CHANGELOG.md`](docs/GRID-CHANGELOG.md) | Authoritative sources for each product's changelog modal. Edit the doc and the modal in one commit. |
| [`docs/BOT-HANDOFF.md`](docs/BOT-HANDOFF.md) | The Cloudflare Worker behind the contact form. |
| [`MEMORY.md`](MEMORY.md) | Dated log of what happened and why, newest first. **Not auto-loaded** — read it when you need history, and add an entry every session. |

## What this is

Static marketing site for FORC3MOD — an unofficial modding/livery-tool studio
for Assetto Corsa EVO. Products: **FORC3 Designer** (livery painting app, in
beta), **FORC3 Grid** (livery manager/sharing tool, in beta, also a browser
app at `grid.forc3mod.com`), the **GT3FORC3** sim racing community, and a
Patreon support page.

No framework, no build step. Plain HTML/CSS/JS, hand-edited and pushed
directly.

## Deploy

- Repo `LachanceGL/forc3mod-website` → **GitHub Pages** from `main` →
  `www.forc3mod.com` (see `CNAME`). **Pushing to `main` is the deploy.** No
  CI, no staging, no PR workflow.
- A push can fail *after* a green build — watch the Actions run rather than
  assuming. A silently-failed deploy has left the site stale before.
- Local testing: `python -m http.server <port>`, verify in the Browser tool,
  **always kill the server before finishing**.

## Current status

⚠️ **Never trust a status line in a doc — check the markup.** Two things flip
often enough that any written state goes stale immediately:

- **Site gating**: if `index.html` has `<section class="coming-soon">` it's
  gated; if it has `<header class="header">` with full nav it's live.
- **Which product pages are public**: check for
  `<meta name="robots" content="noindex, nofollow">` on the page itself.

Both flips are scripted in [`docs/PLAYBOOKS.md`](docs/PLAYBOOKS.md). Expect
them to keep happening; neither state is permanent.

## File map

**Pages** — all five share identical header/footer markup:
`index.html` (homepage) · `forc3designer.html` (lime) · `forc3grid.html`
(orange) · `gt3forc3.html` (red) · `SupportUs.html` (blue).

**Redirect shims** — leave alone; they serve links already in the wild:
`designer.html` → `forc3designer.html` · `grid.html` → `forc3grid.html` ·
`forc3-designer-download/` and `forc3-grid-download/` → each product's
GitHub "latest release" installer.

**Shared assets**: `css/style.css` and `js/main.js` (one each, site-wide),
`favicon.ico` (multi-size, hand-drawn frames — see `docs/SEO.md` before
rebuilding), `sitemap.xml` and `robots.txt` (hand-maintained),
`img/forc3mod-logo.svg`, `img/designer-icon.png`, `img/grid-icon.png`.

**Owner-provided media is never deleted, only superseded.** Screenshots and
demo videos come from the owner, so superseded ones (`img/icon.png`,
`img/FORC3Designer_Showcase01.jpg`, `video/forc3designer-demo.mp4`,
`video/forc3designer-demo-02.mp4`) stay in place. New assets go in under
**new filenames** rather than overwriting — images carry no `?v=`
cache-buster, so reusing a name leaves some browsers on the old file.
Currently live: `img/FD_SitePreview.jpg`, `img/FG_SitePreview.jpg`,
`video/forc3designer-demo-03.mp4`.

## Rules that cause silent breakage

Each of these has actually bitten. Detail is in the linked doc.

1. **Bump `?v=` on all five pages when you edit `css/style.css` or
   `js/main.js`** — same commit, every page. Otherwise the version query
   looks like it's handling cache invalidation while doing nothing. A stale
   `main.js` once sent contact-form messages to email instead of Discord.
   ([playbooks](docs/PLAYBOOKS.md))
2. **Bump `?v=` *before* loading a page to measure**, or measure on a fresh
   port — otherwise you cache the old CSS and the next edit reads as a no-op.
3. **Keep header and footer identical across all five pages.** Mirror any
   change to the other four in the same turn; `forc3grid.html` has drifted
   before. ([layout](docs/LAYOUT.md))
4. **Never put a Discord webhook URL in `js/main.js`.** This repo is public;
   the bot token stays server-side in the Worker.
   ([integrations](docs/INTEGRATIONS.md))
5. **Measure before adding any nav or header item.** The header's four
   breakpoints and the nav/`--container` pair are coupled, and each threshold
   must clear the configuration *above* it, not its own. Budget 17px for the
   scrollbar a media query counts but content can't use.
   ([layout](docs/LAYOUT.md))
6. **No em dashes in visible copy — use `//`.** Site-wide rule; `//` is also
   a deliberate clause separator, so preserve it when editing.
7. **Remove dead CSS/JS/markup in the same commit** that orphans it.
8. **Commit and push straight to `main` after each change**, one at a time.

## Verifying your work

**Screenshots in this environment are unreliable**, and the preview browser
has real rendering gaps (it skips the `details:not([open])` UA rule, and
mishandles block media after inline text). So:

- Verify with `getBoundingClientRect()` / `getComputedStyle()` via JS, not by
  looking. A geometry sweep is the standard of proof here.
- **Check `innerWidth` first** — a hidden pane reports `0` and then every
  rect is garbage (it once "found" elements both inside and outside a modal
  at the same time).
- Prefer semantic checks over layout-derived ones (an element's own `.open`
  property, not whether the engine gave it a layout box).
- If a Browser-pane result contradicts `curl` against the same URL, trust
  `curl` — it's almost certainly the pane's HTTP cache.
- When a styling fix appears to do nothing across attempts, stop tuning
  values and check whether the element paints where you think:
  `elementFromPoint()` at its own centre should return that element.

## Cross-repo map — don't confuse these

| Repo | What it is |
|---|---|
| `forc3mod-website` | **This repo.** The marketing site. |
| `forc3-designer` (Azure DevOps) | FORC3 Designer app source. |
| `forc3-designer-releases` (GitHub) | Built Designer installers only. |
| `forc3-grid` (`G:\FORC3MOD\forc3-grid`) | FORC3 Grid app source — **the source of truth for what Grid does**. Re-read its docs before writing Grid copy here. |
| `forc3-grid-releases` (GitHub) | Built Grid installers only. |
| `gt3forc3-website` | Owns the Cloudflare Worker behind the GT3 live driver pill. Don't edit it from here. |

Proactively check both releases repos for new versions when doing changelog
work — don't wait to be handed release notes.

## Pending / open items

*(Nothing open right now.)*
