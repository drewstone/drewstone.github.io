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

## Shared-link images

`tools/og-render.ts` owns the 1200×630 cover layout and pinned local fonts.
`tools/og-art.ts` owns the mathematical figures and labeled conceptual illustrations.
`src/lib/social-images.ts` chooses images and versions their URLs; the OG route generates covers for published content.
Existing draft preview routes use the generic essay cover.
Keep article titles authoritative, including human-original titles.
Choose an essay illustration explicitly; uncurated essays use the typography design.
Research figures must reproduce the article’s stated construction and distinguish asymptotics from measured data.
Inspect all covers at sharing size before release, including the longest title and every research result.
Keep generated preview evidence outside `public` and the application bundle.

### Reuse an article figure

Set `figure` in an essay or research page's frontmatter:

```yaml
figure:
  src: '/images/software-3.svg'
  alt: 'Source code, learned weights, and natural-language prompts.'
  caption: 'Three representations of a program.'
  source: 'https://www.youtube.com/watch?v=LCEmiRjPEtQ'
```

Place the image in `public/images/`.
SVG, PNG, and JPEG are supported; `alt` is required, while `caption` and `source` are optional.
The shared Figure component renders it before the article body, with a link to the full-size image.
The preview renderer fits that same file beside the title, without cropping or stretching.
Use large labels; the preview's figure area is 400×400 pixels.

Every published essay and research entry gets a preview automatically during `pnpm build` and deployment.
No separate generation command, per-post route, or image service is needed.
Without `figure`, existing curated illustrations or the title template apply.
Missing files fail the build.
Draft routes retain their generic sharing image.
Changing a figure or title rebuilds its preview; bump `DESIGN_VERSION` when replacing already-shared images.

## Lists and process diagrams

Use code fences for executable code, pseudocode, schemas, and literal output.
Write ordinary lists as Markdown lists, definitions as labeled lists, and quotations as blockquotes.
Render equations with KaTeX.
For a short ordered process, use `Steps.astro` with `layout="flow"` and an `items` array of titles.
The flow wraps to the available width; the default layout supports detailed numbered procedures.
Do not draw prose lists or process diagrams inside `text` fences.
