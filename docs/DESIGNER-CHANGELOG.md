# FORC3 Designer — Changelog source

This file is the **authoritative source** for the "Changelog" modal on
`forc3designer.html` (opens via the "Change Log" button next to the hero app
icon). Edit entries here — Claude reads this file and updates the modal's
HTML to match, the same handoff pattern as `forc3-designer`'s
`docs/TooltipsTexts_Bindkeys`.

Newest entry first. One line per entry, this exact format:

```
vVERSION — DESCRIPTION // Mon D, YYYY
```

- `VERSION` should match the actual GitHub release tag in
  `forc3-designer-releases` where possible (see `CLAUDE.md`'s "FORC3
  Designer download button" section) — but this file is edited by hand, so
  it can go in first if the site should announce something before/without a
  matching tag.
- `DESCRIPTION` is a single short clause, no trailing period, matching the
  terse style of the existing entries.
- Date format is `Mon D, YYYY` (e.g. `Aug 21, 2026`), matching what's
  already on the site.

---

v0.1.1 — Installer improvement // Aug 21, 2026
v0.1.0 — Initial release // Aug 21, 2026
