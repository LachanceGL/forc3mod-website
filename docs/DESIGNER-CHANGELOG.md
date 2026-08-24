# FORC3 Designer — Changelog source

This file is the **authoritative source** for the "Changelog" modal on
`forc3designer.html` (opens via the "Change Log" button next to the hero app
icon). Edit entries here — Claude reads this file and updates the modal's
HTML to match, the same handoff pattern as `forc3-designer`'s
`docs/TooltipsTexts_Bindkeys`.

## Source of truth: check the releases repo

**From now on (owner request, 2026-08-21), check
[`forc3-designer-releases`](https://github.com/LachanceGL/forc3-designer-releases/releases)
for new releases/changelog content** — don't wait to be handed the text.
Each GitHub release's body has a "What's new in X.Y.Z" section (fetch via
`https://api.github.com/repos/LachanceGL/forc3-designer-releases/releases` —
no auth needed, public repo) — that's the real changelog. The rest of the
release body (Download link, the "Windows protected your PC" note, the
footer blurb) is release-page boilerplate, not changelog content — strip it
out when copying into an entry here.

## Entry format

Newest entry first. Each entry is a `## vVERSION — Mon D, YYYY` heading,
followed by:
1. A **one-line summary** (own paragraph, right after the heading) — this
   becomes the collapsed dropdown's title line on the site
   (`vVERSION — summary // date`). No trailing period, terse style.
2. The **full changelog body** — plain paragraphs, and optional `###`
   subheadings with bullet lists for grouped changes (Fixes / Layers /
   Elsewhere, etc., matching however the release itself grouped them). This
   becomes the expanded dropdown content.

Version should match the actual GitHub release tag. Date format is
`Mon D, YYYY` (e.g. `Aug 23, 2026`).

On the site, entries render as `<details>/<summary>` accordions, **all
collapsed by default**. See `CLAUDE.md`'s "Changelog modal content" section
for the exact markup shape to propagate this into.

---

## v0.1.2 — Aug 23, 2026

Performance improvements and fixes

Mostly speed, plus a batch of fixes. Placing a decal is around 1.5x quicker
and gradients almost 2x. Switching or reordering layers no longer stalls on
a document with a lot of layers, and the app holds considerably less memory
while you work.

### Fixes
- Applying a decal no longer creates a "Decals" folder, and decal layers are
  named the same whether you place them in the 2D or 3D view.
- In Orthographic view, zooming in from the front or back no longer cuts
  into the car.
- Launching AC EVO no longer shows Windows' "open Steam?" prompt.
- A long report can no longer trap the app: Escape or a click outside closes
  it, and it scrolls if it does not fit.

### Layers
- Folders can be reordered, including empty ones.
- Layers inside a folder are marked with a rail so groups read clearly, and
  empty folders are dimmed.
- The visibility eye now sits beside the lock.

### Elsewhere
- Gradient and Bezier swapped places on the tool bar, and their shortcuts
  swapped with them: Q is Gradient, W is Bezier.
- The colour picker gained an "Add to Swatches" button and shows the five
  most recently saved colours.
- An "Update available" badge appears in the header when there is one, and
  Check for Updates moved to the Settings menu.

## v0.1.1 — Aug 21, 2026

Installer improvement

Fixes the installer's final page, where the "Run FORC3 Designer" and
"Create desktop shortcut" checkboxes were almost invisible — dark text on a
dark background.

The app itself is unchanged from 0.1.0.

## v0.1.0 — Aug 21, 2026

Initial release

Initial beta release of FORC3 Designer.
