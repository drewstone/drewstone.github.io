# Shared article figures

Source implementation: `552acee10e8bbb22e7761d0807565eaac2c8d5a2`, built on beelink1-wsl.
Base: `2c76826d0ebdd16a7fc3239c19f58164fe3a864d`.

One optional `figure` in essay or research frontmatter supplies the article image and the generated sharing image.
The Software 3.0 figure is based on [Karpathy’s 2025 talk](https://www.youtube.com/watch?v=LCEmiRjPEtQ&t=85s).
It is a conceptual comparison of program representations, not an experimental result.
The essay prose and human originals are unchanged.

## Visible result

[Before, phone](before-phone.png) · [Desktop](after-1280-light.png) · [Phone](after-390-light.png) · [Dark theme](after-390-dark.png).
[Sharing image](software-3-cover.png) uses the same SVG as the article.
[Existing raster image](raster-proof.png) exercises the same renderer with a real, wider image already in the blog.
Both fit without cropping or stretching.
All attached screenshots were opened and inspected.

[Browser receipt](browser.json) records actual image loading, descriptions, figure bounds, the full-size link, and removal of stale copy.
The first check ran against a build started before file copying finished; it found no figure.
A rebuild after copying completed corrected that verification error.
A later page-width assertion exposed existing overflow (715 px at a 390 px viewport) on the production essay.
The changed figure fits within the viewport; the existing overflow is outside this change.
No new JavaScript interaction is introduced.

## Build and metadata

Frozen install, focused renderer TypeScript checks, and the complete production build passed.
[Metadata audit](metadata.json): all 121 HTML pages point to valid 1200×630 PNG images; 38 distinct previews.
A missing figure file rejected rendering with ENOENT, without silently substituting another image.
Draft routes retain their generic preview.
The preexisting repository-wide typecheck parse failure in `tools/install-hooks.mjs` is unchanged.

The existing blog capture command needed its missing `tsx` dependency; it is now declared.
The diagram revision has a Codex session excerpt attached through the maintained capture command.
It records the implementation commit and explicitly identifies its limited coverage; the original session remains private and unchanged.
