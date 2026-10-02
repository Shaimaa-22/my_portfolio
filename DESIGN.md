# Portfolio design and maintenance

Static HTML, CSS and JavaScript; no runtime dependencies or build step.
Serve the repository with `python -m http.server 8765` and open localhost:8765.

## Content

Update English and Arabic copy in `translations/en.json` and `translations/ar.json`.
Keep English HTML fallback content synchronized so the page remains readable if scripts or translations fail.
Featured projects are Power, Inverter Control, Ideas Tracker and Pizza Go. Technical claims come from the repositories and the owner's project descriptions. Case studies describe implemented capabilities rather than invented performance or business metrics.

## Design

Warm white, charcoal and rose. Light and dark themes; Arabic RTL and English LTR.
Short entrance and interaction transitions respect `prefers-reduced-motion`.
Native details elements provide keyboard-accessible case studies; the native dialog provides the CV focus boundary and Escape support.

## Validation

Checked widths 360, 390, 768, 1024 and 1440 in Arabic and English without horizontal overflow. Checked mobile menu, language switching, case-study expansion, CV dialog, theme switching, translation coverage, local assets and anchor targets. No browser console errors observed during these checks.

## Publishing

This is the existing GitHub Pages repository. Publish its root files through the repository's configured Pages source. No additional hosting provider is required.
