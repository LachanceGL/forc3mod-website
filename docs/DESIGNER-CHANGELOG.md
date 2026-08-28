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

## v0.2.0 — Aug 28, 2026

Layer masks, effects, and more cars

The biggest release so far: layer masks, layer effects, seven more cars, and
a lot less waiting.

### Masks
- Right-click a layer for Add Black Mask or Add White Mask, then paint to
  hide or reveal. The brush, eraser, fill bucket, gradient and decals all
  work on a mask.
- While you edit one, the hidden area is tinted red on the car. An eye
  button beside the MASK MODE tag turns that tint off.
- Invert Mask, and Shift+click a layer's mask chip to bypass it without
  deleting it.
- The 3D Channel View dropdown gained a Mask entry.

### Layer effects
- Stroke and Drop Shadow, both live — nothing is baked into the layer, so
  you can keep adjusting or remove them.
- The drop shadow is aimed with a dial, and now falls the same way on every
  panel of the car. It used to come out mirrored on one side.
- A stroke can outline just the silhouette, or every hole as well.
- Fill applies the current colour and material values through a layer's own
  shape, so a decal can be recoloured after it is placed.
- The Effects panel floats beside the layers, and every value can be typed
  instead of dragged.

### Layers
- Select several layers and merge them.
- Drag a whole selection at once, including out of a folder.
- Lock and Delete act on everything selected.
- Drag a row by pressing anywhere on it, not just a grip.

### Cars
22 now, across five classes.
- New: Caterham Seven Academy, Ferrari F2004, Ferrari SF-25, BMW M2 CS
  Racing, Ferrari 488 Challenge EVO, Lamborghini Huracan Super Trofeo EVO2,
  Mazda MX-5 ND Cup.
- Two new categories: Formula 1, and Single-Spec & One-Make.

### Decals
- The Decals Libraries is now a shelf across the bottom of the 3D view, and
  collapses out of the way.
- My Decals is saved per project rather than shared between all of them.
- Applying a decal paints the layer you have selected instead of adding one.

### Speed
- The first brush stroke after picking a layer no longer stalls.
- Shift+drag to select panels starts smoothly instead of hitching.
- The Effects sliders respond as you drag them.
- Saving shows a progress bar rather than appearing to hang.

### Fixes
- The brush edge is properly antialiased in the 3D view. It was a hard,
  stair-stepped circle at full hardness.
- About FORC3 Designer opens again — it did nothing in 0.1.2.
- The layer right-click menu no longer opens off the edge of the window.
- The Top orthographic view lays the car out sideways, so the whole car
  fits instead of being cut off at the nose and tail.
- Ctrl+Z now steps back through a bezier path while you are drawing it.
- M returns the 3D Channel View to Final Result; , and . cycle through the
  channels.

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
