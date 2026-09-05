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

A patch release's "What's new" section can also **recap the prior release**
(e.g. v0.3.1's body repeated all of v0.3.0's content under "Coming from
0.2.1? Everything below shipped in 0.3.0 as well") — that's for visitors
landing on the release page who skipped a version. On the site, only
include what's genuinely new to that version; the earlier release already
has its own entry, so repeating it would duplicate content across two
accordion rows.

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

   ⚠ **No opening summary paragraph.** The body starts at its first `###`
   heading. Item 1's summary already says what the release is, and repeating
   it as a sentence above the sections is preamble. The app's own notes
   dropped theirs for the same reason (owner request, 2026-09-05; recorded in
   `forc3-designer`'s `docs/CHANGELOG.md` rule 3, which is also where the
   release body's own format now lives). Entries older than v0.5.0 keep the
   paragraph they shipped with rather than being rewritten.

Version should match the actual GitHub release tag. Date format is
`Mon D, YYYY` (e.g. `Aug 23, 2026`).

On the site, entries render as `<details>/<summary>` accordions, **all
collapsed by default**. See `CLAUDE.md`'s "Changelog modal content" section
for the exact markup shape to propagate this into.

Each entry also gets its own `id` (e.g. `v0-3-0`, dashes not dots) so it's
individually linkable — `forc3designer.html#v0-3-0` opens the changelog and
jumps straight to that version. Give every new entry a matching id when you
propagate it into the modal.

**If the release body embeds screenshots/clips inline** (owner request,
2026-09-05 — "do something similar to what forc3-designer is doing... we
must add those markers and their content also"), embed them here too,
right after the bullet they illustrate, same as the release itself does —
a markdown `![alt](url)` for an image, `[Video: description](url)` for a
video. Don't drop them just because they're not plain text. See
`CLAUDE.md`'s "Embedded release media inside a changelog entry" section
for the exact HTML this maps to in the modal (hotlink the release's own
asset URL, don't re-host it in this repo).

---

## v0.5.0 — Sep 5, 2026

72 cars, manufacturer decals, and a custom theme color

> Note, not body copy: skipped the "Coming from an older version" recap at
> the end of the release body (33 more cars and two new categories in 0.4.0,
> the Layers panel dropping to icons), since the v0.4.0 entry below already
> covers it.

### Cars
72 now, up from 69. Audi R8 LMS GT2, Audi R8 V10 Performance Quattro,
Mazda RX-7 FD Spirit R.

### Decals
- Decals for car manufacturers, picked from a searchable list of brands.
  [Video: the new decal libraries](https://github.com/LachanceGL/forc3-designer-releases/releases/download/v0.5.0/Preview_DecalsLib.mp4)
- Two new Cyberpunk kits: H4X and JDM.
  ![The H4X Cyberpunk decal kit](https://github.com/LachanceGL/forc3-designer-releases/releases/download/v0.5.0/Kits_H4X.jpg)
  ![The JDM Cyberpunk decal kit](https://github.com/LachanceGL/forc3-designer-releases/releases/download/v0.5.0/Kits_JDM.jpg)
- Align guides on the Decal tool: a dotted crosshair through the decal's
  center that stops at the artwork rather than the placement box, so one
  decal can be lined up against another. Off by default, toggled from
  Guides.
  [Video: align guides on the Decal tool](https://github.com/LachanceGL/forc3-designer-releases/releases/download/v0.5.0/Upcoming_AlignGuides.mp4)
- The Decal tool's Outline is gone. Use Stroke in the Effects panel
  instead.
- A decal applied off the car now stays loaded instead of disappearing, so
  it can be moved and applied again.

### Appearance
- Main Theme Color, in Settings > Preferences. Pick the accent color the
  whole app uses, keep up to four presets, and Default Yellow puts it back.
  ![Setting the app's theme color in Preferences](https://github.com/LachanceGL/forc3-designer-releases/releases/download/v0.5.0/ColorTheme01.jpg)
- The yellow blur behind the Apply buttons is gone.

### Other
- Shift+Space shows and hides the Decals Libraries shelf.

## v0.4.0 — Sep 2, 2026

69 cars now, including the first mod car

Every car in Assetto Corsa EVO is now in the app, plus a first mod car.
Skipped the "Coming from a previous version?" recap at the end of the
release body (opacity slider, car-picker search, decal outline, effects
panel rework, shadow/stroke fixes, performance) — all already covered by
the v0.3.0/v0.3.1 entries below.

### Cars
69 now, up from 36. Two new categories, Track Specials and MODS.

### Track Specials
- Dallara EXP, Ferrari F40 LM, Porsche 935.

### Classic & Historic
- Alfa Romeo 75 Turbo Evo, Alfa Romeo Giulia Sprint GTA, Audi Sport Quattro,
  BMW M3 E30 Sport Evo, BMW M3 E46 CSL, Ford Escort RS Cosworth,
  Lamborghini Countach LP5000 QV, Lancia Delta HF Integrale Evo II,
  Mercedes-Benz 190E 2.5-16 Evolution II, Mini John Cooper Works Mk IV,
  Nissan Datsun 240Z, Peugeot 205 T16, Porsche 964 Turbo 3.6,
  Renault 5 GT Turbo, Toyota Sprinter Trueno Apex AE86, Toyota Supra MKIV,
  Volkswagen Golf GTI Mk1.

### Sports & Performance
- Alfa Romeo Giulia GTAm, Alpine A110 S, BMW M2 Coupe, BMW M4 CSL,
  BMW M8 Competition, Caterham Seven 485 CSR, Chevrolet Camaro ZL1,
  Lotus Emira, Lotus Exige V6 Cup.

### Road & Hot Hatches
- Abarth 695 Biposto, Alfa Romeo Junior Veloce, Hyundai i30 N Hatchback.

### MODS
- Mazda 787B — the first mod car.

### Other
- The Layers panel drops to icons when you make it narrow, instead of
  cutting the button labels in half.
- Fixed the Frame View and Turntable tooltips being covered by the Decals
  shelf.

## v0.3.1 — Aug 31, 2026

Opacity slider for Brush & Eraser

The release body also recaps everything from 0.3.0 ("Coming from 0.2.1?
Everything below shipped in 0.3.0 as well") — that's for people who skipped
straight to 0.3.1 on the releases page. Skip it here: 0.3.0 is already its
own entry directly below, so only the genuinely new part goes in this one.

### Brush and Eraser
- New Opacity slider, shared by both tools.
- It is per stroke: crossing a stroke over itself will not build past the
  value you set. Go over an area again with a second stroke to build it up.
- Works with a soft brush, with the PBR channels, and when painting a mask.

## v0.3.0 — Aug 31, 2026

More cars, refined shadows and strokes

### Cars
36 now.
- New categories: Sports & Performance, Classic & Historic.
- New cars: Ferrari 288 GTO, Ferrari Daytona SP3, Honda NSX-R, Honda S2000
  AP1, Lamborghini Huracan STO, Mazda MX-5 NA, Toyota GR86, Volkswagen Golf
  Mk8 GTI Clubsport, Volkswagen Golf Mk8 R.
- Search box in the car picker. "mx5" finds the MX-5, "golf r" finds only
  the R.

### Drop Shadow
- Falls the same way on both sides of the car. It used to point toward the
  back on one door and the front on the other.
- Fixed the transparent gap between a layer and its own shadow.
- Fixed the missing pixels in inner corners.
- Fixed the shadow showing through translucent artwork.

### Stroke
- Cleaner edge, computed from real coverage.
- Antialiasing matched to the artwork it wraps, per layer.
- Fixed the stepping along the outline at every width.

### Decal
- Outline control, applied to the artwork before it is projected.
- Switch under Apply: paint onto the current layer, or make a new one.
- Picking the Decal tool opens the Decals shelf.

### Layers and Effects
- Each effect has its own titled settings block.
- The Effects header names the layer it is editing.
- FX opens the Effects panel from either layer menu.
- A new layer lands directly above the selected one.
- Undo and Redo move into the toolbar when the 2D view is collapsed.

### Other
- FORC3 Designer wordmark in the header.
- Straight lines can be clicked point to point, not only dragged.
- Opacity, blur, stroke and shadow adjust much faster on a big livery.

## v0.2.1 — Aug 29, 2026

More cars and a reworked Decals Libraries

Five more cars, two new classes, and the Decals Libraries reworked.

### Cars
27 now, across seven classes.
- Two new categories: Road & Hot Hatches, and Supercars & Hypercars.
- New: Alpine A290 Beta Concept, Audi RS 3 Sportback, Audi RS 6 Avant,
  Ferrari 296 GTB, Dallara Stradale.

### Decals Libraries
- The tabs are proper file tabs now: the selected one joins the sheet below
  it and the outline runs around it.
- The strip behind the tabs is see-through, so the car shows through it.
- Add moved to the left of the tabs.
- Less space between the decal thumbnails, and more above them.

### Elsewhere
- The top bar is a little shorter, which gives the 3D view more room.

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
