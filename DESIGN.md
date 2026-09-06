# Blog design

Read this file for layouts, components, or visual examples inside posts.
[AGENTS.md](AGENTS.md) owns authorship and trace rules; [VOICE.md](VOICE.md) owns prose style.

## Visual language

Keep prose, headings, and page structure monochrome.
Use semantic color for meaning: success, failure, running state, actions, changed artifacts, and human authorship.
Read the existing CSS tokens and their background/border variants instead of copying color values.
Preserve the distinct treatment of human originals and revisions.

Use serif type for prose and headings, and monospace for metadata.
Keep body text readable and code at least as legible as prose.
Use whitespace for hierarchy, with a hairline divider only where spacing is ambiguous.
Keep prose left-aligned.
Full-width hover states make list items and click targets clear.

Post lists follow a vertical reading path.
Use a grid only when the content benefits from comparison and fills it well.
Keep the page free of ornamental marks, decorative borders, floating page frames, and template mastheads.
Use the existing layout's reading and wide-container modes rather than introduce another width system.
Code blocks may extend beyond the reading column on wide screens.

## Visual claims in posts

When a post explains a UI, diagram, or interactive system, render the thing being explained.
The visual must support the claim at readable, usable fidelity.
Use actual project examples; keep formulas and technical detail when they clarify the argument.
Define variables where they appear.
Real projects supply code examples; explain the relevant portion of a long excerpt.

Inspect the component's current source before using its interface:

- `src/components/Chart.astro`: data plots and custom geometry, with theme-aware colors and display scaling.
- `src/components/ChatMock.astro`: structured agent conversations, tool operations, and artifact output.
- `src/components/Sidenote.astro`: citations and asides outside the argument's main flow.
- `src/components/AnimatedCanvas.astro`: animation when motion explains the subject.
- `src/components/Tweet.astro`: embedded source posts.

Prefer HTML or an existing component for structured UI; use Canvas for plots and custom geometry.
Read theme variables rather than hardcode chart colors.
Give labels enough space and verify the result in both themes and at narrow widths.
Scoped MDX components are appropriate when existing components cannot express the example.
