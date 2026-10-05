# Link preview evidence

Checked October 2, 2026 against the built site, starting from `6d14b9d75527cbc1a1525929384b621fbd7462ef`.
This change covers sharing images only.

[Before / after, desktop](comparison-desktop.png) · [Before / after, phone](comparison-phone.png).
The original research preview was the generic site SVG; essays used the previous text-heavy generator.

## Coverage

The build generated 38 distinct 1200×630 PNGs: 29 essays, three research results, and six main-page covers.
[Metadata audit](metadata.json) records all 120 HTML pages, their image URLs, dimensions, byte counts, and image hashes.
All image references exist, use the new URL version, and match between Open Graph and Twitter metadata.
Existing draft preview routes use the generic essay image.
No new draft-specific images are generated.

[Browser receipt](browser.json) covers eight representative routes, actual image responses, phone width, and the embedded Agent Record.
The six attributed agents still render; no browser exceptions occurred.

## Visual inspection

All 38 previews were opened and inspected at half size.
The desktop comparison uses 600px-wide previews; the phone comparison uses 390px-wide previews.
The longest published title fits without clipping.
An initial render dropped embedded SVG text; the renderer now rasterizes each figure with the pinned local fonts before composition.

[1](sheet-1.png) · [2](sheet-2.png) · [3](sheet-3.png) · [4](sheet-4.png) · [5](sheet-5.png) · [6](sheet-6.png) · [7](sheet-7.png).

The three research diagrams reproduce their article’s construction, weights, and asymptotic statement.
Essay diagrams are labeled conceptual structures; they contain no invented measurements.
Independent review checked the scientific figures, metadata mapping, draft fallback, and renderer callers.

## Build

Frozen install, focused TypeScript checks for the renderer and metadata helpers, and the Astro production build passed on beelink1-wsl.
The repository’s preexisting full-typecheck error in `tools/install-hooks.mjs` remains outside this change.
No article text or historical records changed.
This static-asset change adds no interactions, so there is no interaction video.
