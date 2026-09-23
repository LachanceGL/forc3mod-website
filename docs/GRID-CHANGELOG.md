# FORC3 Grid — Changelog source

This file is the **authoritative source** for the "Changelog" modal on
`grid.html` (opens via the "Change Log" button next to the hero app icon).
Edit entries here — Claude reads this file and updates the modal's HTML to
match. Same handoff pattern as `docs/DESIGNER-CHANGELOG.md`, which is the
file to read alongside this one; the two differ in a few places, and those
differences are called out below rather than left to be discovered.

Created 2026-09-23, on request, after v0.1.0 shipped and its entry had been
written straight from the GitHub release. That entry is reproduced below, so
this file and the modal start in sync.

## Source of truth: check the releases repo

Check
[`forc3-grid-releases`](https://github.com/LachanceGL/forc3-grid-releases/releases)
for new releases rather than waiting to be handed text — same standing
instruction as the Designer's. The API is
`https://api.github.com/repos/LachanceGL/forc3-grid-releases/releases`
(no auth needed for published releases).

⚠️ **Unauthenticated API calls do not show drafts.** A staged-but-unpublished
release reports as "zero releases", which is exactly what happened between
2026-09-17 and 09-23. Use `gh api` (authenticated) if you need to see whether
something is waiting in a draft — but do **not** copy a draft's notes onto
the site (see the warning below).

⚠️ **Diff the release body against the app's own docs before copying it.**
This is not paranoia, it happened: the v0.1.0 *draft* (2026-09-17) said
re-linking a pack to a car you already own was "the whole reason this
exists", and called multiplayer visibility "not verified". Both were
overtaken by findings in `G:\FORC3MOD\forc3-grid` — the 2026-09-18
two-machine run verified visibility, and on 2026-09-20 re-linking was demoted
to a fallback because a pack now carries the author's saved car. The notes
were corrected before publishing, so the published body was safe. Read
`forc3-grid`'s `README.md`, `CLAUDE.md` and `docs/ACEVO_LIVERIES.md` and
check the release body agrees with them before propagating anything here.

**Strip release-page boilerplate.** For Grid that means the trailing "the
website at https://grid.forc3mod.com does the same job in a browser" line —
`grid.html` has an "Open the web version" button a few hundred pixels away.
Keep the "Known, and worth saying up front" section; that is real content,
not boilerplate.

## Entry format

Newest entry first. Each entry is a `## vVERSION // Mon D, YYYY` heading,
followed by:

1. A **one-line summary** (own paragraph, right after the heading). No
   trailing period, terse style. **Doc-only** — the site's collapsed
   accordion title is date-only (`vX.Y.Z // Mon D, YYYY`), so this never
   reaches the modal. Write it anyway for anyone skimming this file.
2. The **full changelog body** — paragraphs, and optional `###` subheadings
   with bullet lists for grouped changes, matching however the release
   itself grouped them. This becomes the expanded dropdown content.

**Difference from the Designer's doc, on purpose:** that one forbids an
opening summary paragraph, because its `###` sections speak for themselves.
Grid's releases open by explaining *why a `.grid` exists at all* — the
car-binding problem, and what it means for being seen online — and that
framing is the most valuable part of the entry for someone who has never
heard of the app. **Keep those intro paragraphs.** v0.1.0 has three.

Version matches the actual GitHub release tag. Date format is `Mon D, YYYY`.

On the site, entries render as `<details>/<summary>` accordions, **all
collapsed by default** — see `CLAUDE.md`'s "Changelog modal content" section
for the markup shape. Each entry gets its own `id` (dashes, not dots:
`v0-1-0`), so `grid.html#v0-1-0` opens the changelog and jumps to it. Give
every new entry a matching id when you propagate it.

**Em dashes become `//`** when this text reaches the site — that is a
site-wide copy rule (see `CLAUDE.md`, "No em dashes in visible copy"). Write
them either way here; convert on the way into the modal.

**If a release body embeds screenshots or clips inline**, embed them here
too, right after the bullet they illustrate: `![alt](url)` for an image,
`[Video: description](url)` for a video. Hotlink the release's own asset
URL rather than re-hosting it in this repo. `CLAUDE.md`'s "Embedded release
media inside a changelog entry" section has the HTML this maps to. No Grid
release has used them yet.

---

## v0.1.0 // Sep 23, 2026

First beta build — manage, pack, share and install AC EVO liveries

First beta build of FORC3 Grid — the livery **manager and sharing** half of
the FORC3MOD toolchain for Assetto Corsa EVO. FORC3 Designer paints a livery;
this manages the ones you have, packs them into shareable `.grid` files, and
installs other people's.

**Why a `.grid` and not a zip.** AC EVO binds every external livery to one
specific car in *your own* garage, so a livery folder copied to another PC
binds to nothing and silently does not appear. A `.grid` carries the author's
own saved car and installs it alongside the paint, so both machines end up
holding the same car and the livery works the way its author sees it. That is
the whole reason this exists.

**And you can be seen in it.** Two players who both install the pack see each
other wearing the livery — tested on two machines, both driving it, both
seeing it on the other's car. That works *because* the pack carries the
author's car: a livery re-linked to a car you already owned is drivable, and
invisible to everyone else.

### In this build
- Finds `Saved Games\ACE` on its own and opens straight into your showroom
- Shows AC EVO's own render of each livery, full size from the card
- Scans every installed livery, whoever made it, and says plainly what is
  linked, unlinked, incomplete or foreign
- Exports any complete livery as a `.grid`
- Installs one by picker, drag-and-drop, double-click, or straight from
  FORC3 Designer — every route through the same confirmations
- Imports liveries that are not packs yet — a raw AC EVO folder, or a zip of
  one
- Copies a livery onto another car of the same model
- Deleting a livery can also remove the car its pack brought with it
- Browse, search, vote and upload on the Community Grid, rename your own
  listings, and withdraw them
- Warns before installing a livery for a car AC EVO does not build liveries
  on
- **Settings → Check for Updates** installs future versions in one click

### Known, and worth saying up front
- Windows will warn *"Unknown publisher"* — the installer is not code-signed
  yet. More info → Run anyway.
- **A livery does not appear until AC EVO has drawn it.** Open the car in the
  showroom, change one feature and Apply. Help → How it works has the steps.
- **Seven cars never build an external livery at all**, as far as testing has
  found: Audi R8 V10 Performance, both Dallaras, Mazda RX-7 FD, Ferrari F40
  LM, Alfa Romeo Giulia GTAm and Honda S2000 AP1. The app says so before you
  install one.

*(Dropped from the release body when propagating: the closing line pointing
at https://grid.forc3mod.com — boilerplate here, since the page has an
"Open the web version" button.)*
