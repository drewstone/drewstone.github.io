# Blog

Personal blog. Astro + MDX, static output, GitHub Pages.

## Stack

- Astro with MDX for content
- KaTeX (CDN) for math rendering via remark-math + rehype-katex
- Shiki (github-light / github-dark) for syntax highlighting
- Computer Modern (body), JetBrains Mono (code)
- No framework JS — only component islands for interactive content

## Design

- **Monochrome prose, semantic color for state.** Body text, headings, narrator blocks, layout chrome stay strict B&W (`#111` fg on `#fff` bg, inverted in dark mode). Color enters only to communicate meaning, never decoration. Four semantic tokens:
  - `--c-ok` (green) — success states, passed tests, "final" artifacts
  - `--c-fail` (red) — failures, errors, deleted artifacts
  - `--c-run` (amber) — running / in-progress states
  - `--c-action` (violet) — action affordances: tool badges, thinking icons, clickable tool operations
  - `--c-info` (blue) — modified/changed artifact lifecycle
  Each has a matching `-bg` (tinted surface) and `-border` variant. Use for status pills, run group accents, artifact lifecycle badges, tool/thinking icon badges. Never tint body text, prose, or section chrome.
- **No ornaments.** No `❦`, `❧`, `❀`, double rules, corner brackets, decorative drop-cap borders, manuscript chrome, small-caps-lowercase heading gimmicks. If you catch yourself reaching for a flourish, reach for whitespace instead.
- **Bigger is better.** 19px base font. When unsure, size up.
- **Whitespace over dividers.** Don't use horizontal rules to create structure. Use spacing. One hairline rule max per section break, and only when whitespace alone is ambiguous.
- **Click targets must be obvious.** Full-width hover states (background + padding shift), not subtle underline-color changes.
- **Vertical hierarchy over grids.** Grids look empty with few items. A vertical list scales from 2 posts to 200.
- **No template mastheads, no page frame.** Personal voice > generic branding. No centered-serif-banner hero. No shadowed content card floating in a colored background.
- **Code blocks: full-bleed.** Break out of the reading column on wide screens. Larger font than body. Language label top-right at low opacity.
- **Academic serif for prose, mono for metadata.** Dates, tags, labels use mono. Body and headings use serif.
- **Demonstrate, don't describe.** When a post is about UI, render the UI. When a post is about math, render the math. When a post is about a diagram, draw the diagram. Never ship a code block labeled "here's what it could look like" when you can render the real thing inline.

## Content

- Posts live in `src/content/posts/` as `.mdx` files
- Frontmatter: `title`, `description`, `date`, `updated?`, `tags[]`, `draft?`
- **Two content styles**: math/technical deep-dives (formulas, data viz, Canvas charts) and architectural/vision/product narratives (engineering problems, system design, no forced math)
- Content comes from real projects Drew is building. Don't invent fictional projects.
- Article length: concise introductions, not exhaustive references. Current posts are the right length.

### Rich in-post components (use them)

- **`<Chart>`** — inline Canvas drawing with HiDPI scaling. Reads theme CSS vars. Use for data viz, diagrams, DAGs, timelines, anything with coordinates.
- **`<ChatMock>`** — high-fidelity shadcn-style chat rendering for agent/LLM posts. Takes a `blocks` array of typed message parts: `text`, `thinking`, `tool_call`, `tool_result`, `artifact`, `narrator`, `status`. Supports `actor` for multi-agent ensemble views, collapsible thinking/result blocks, status pills, artifact file previews. Use this whenever a post discusses agent output, chat UIs, or workflow rendering.
- **`<Sidenote>`** — margin citations and asides. Use for tangents, definitions, source pointers without derailing the main prose.
- **`<AnimatedCanvas>`** — particle/animation with IntersectionObserver pause. Use sparingly.
- **`<Tweet id="..." />`** — embedded X posts.
- **KaTeX math** — `$inline$` and `$$display$$`. Use when a formula adds clarity prose can't carry alone.
- **Raw HTML in MDX** — when none of the components fit, write scoped HTML+CSS inline. The post IS allowed to ship a bespoke component. Polish it to production quality.

### The richness bar

If a post discusses a visual, rendered, or interactive thing, the post must render that thing at production fidelity. Not a sketch, not a placeholder, not a code snippet captioned "imagine this rendered." A reader who skims the post should understand the visual claim without reading a word. Expert UI/UX design in the examples themselves is the point, not decoration around them.

## Writing Style Guide

Every post should read like a senior engineer explaining something they built to a peer over coffee. Technical depth, personal voice, no fluff.

### Two content archetypes

**Type A: Math/technical deep-dive.** Has formulas, data viz, proofs-by-example. Structure: open with the problem or a specific failure, introduce the math as the tool that clarifies, show data that validates. Examples: convergence-loops, provider-fallback-chains, exploit-or-disprove.

**Type B: Engineering narrative.** Pure architecture and design. No forced math. Structure: open with a constraint or war story, walk through how the system works layer by layer, close with what you'd do differently or what it unlocked. Examples: session-multiplexing, redteam-architecture, deepwork-orchestrator.

Both types share the rules below.

### Sentence-level rules

- No em dashes. Use colons, periods, commas, or parentheses instead.
- Short sentences. If a sentence has more than one comma-separated clause, split it.
- Vary sentence length. A one-sentence paragraph is fine. So is a dense paragraph with 5 sentences. The rhythm should feel natural, not metronomic.
- Active voice by default. Passive is okay for emphasis ("The change was rejected" puts focus on the rejection).
- Concrete nouns over abstract ones. "The reaper kills idle sessions" not "The system handles lifecycle management."
- Numbers and specifics over adjectives. "81% F1" not "significantly improved." "30 seconds" not "a while."

### Opening patterns (vary these, never repeat the same structure twice in a row)

- **Constraint opener**: "If you're building X, you have a problem." (session-multiplexing)
- **Failure opener**: "Last week I was running a benchmark. The results were mediocre." (self-improving-agents)
- **Observation opener**: "Automated X has a Y problem." (exploit-or-disprove)
- **System description**: "The browser agent driver is a system that does X." (vibecoding-a-browser-agent)
- **Question opener**: "What does the outer optimization loop look like?" (agentic-eval-improvement)

### Closing patterns

- **End with implication**: what this enables or changes. No summary.
- **End mid-thought**: leave the reader with a question or unresolved tension.
- **End with a concrete fact**: a number, a result, a specific outcome. Not a sweeping thesis.
- Never end with "In conclusion" or a restated thesis paragraph.

### Section headings

- Descriptive, not generic. "The idle reaper" not "Cleanup." "Why this works for browser agents" not "Discussion."
- Never use "What I learned" or "Key takeaways" or "Conclusion."
- Okay to be terse: "In practice" or "The cost tradeoff" work fine.

### Math

- Use KaTeX only when the formula adds clarity a sentence can't.
- Always define variables immediately after introducing them.
- If a formula has more than 3 variables, consider whether a table or code block would be clearer.
- Engineering posts (session-multiplexing, building-on-tangle) should not have forced math.

### Code blocks

- Real code from real projects only. Never invent toy examples.
- Keep blocks short (under 20 lines). If longer, explain what to focus on.
- Use the language label (`typescript`, `json`, `bash`) for syntax highlighting.
- Interface/type definitions are okay as standalone blocks to show API shape.

### Charts

- Canvas charts with HiDPI scaling (handled by Chart.astro). Charts auto-fill container width.
- Read CSS variables (`--fg`, `--bg`, `--fg-muted`, `--fg-faint`, `--border`) for theme-aware rendering. Do NOT hardcode colors.
- Give diagrams generous padding (80px+ top offset for labels).
- Prefer clean geometric shapes and typography over decoration.
- When a chart would be clearer as a rendered component (a chat UI, a file tree, a state diagram), reach for HTML/`<ChatMock>` before Canvas. Canvas is for plots and custom geometry. Components are for structured UI.

### Voice and tone

- First-person, opinionated. "I" and "we" freely. The author has built these systems and has opinions.
- Include personal asides and honest assessments ("we tried X, it was terrible").
- State opinions directly. "This is a pragmatic choice" not "One might consider this a pragmatic choice."
- Okay to be blunt. "You can't trust the client to send heartbeats" reads like a person.

### Banned words and patterns

**Words**: delve, comprehensive, facilitate, utilizing, moreover, furthermore, tapestry, landscape, crucial, paradigm, cutting-edge, game-changing, groundbreaking, synergy, best practices, it's worth noting, at the end of the day, let's dive in, interestingly, surprisingly, robust (when used as filler).

**Patterns**:
- "In this post, we'll explore..." (just start)
- "Let's dive into..." (just start)
- Bold thesis statements as closers ("Structure is leverage." "The future belongs to X.")
- Lists of 3 adjectives ("powerful, flexible, and extensible")
- Rhetorical questions followed by their own answer in the same paragraph
- Generic LLM demo prompts ("find plumbers in Mumbai", "summarize this article")

### Specificity over abstraction

- "We burned a week on this" beats "this was challenging."
- "The reaper runs every 30 seconds" beats "periodic cleanup."
- Name the file, the function, the line number when relevant.
- Vague descriptions of difficulty are an AI tell.

### Examples must be real

- Never use generic LLM demo prompts.
- Use examples from the actual project or plausible tasks the author would actually run.
- If unsure, describe the category instead of inventing a specific instance.

### No false humility or wonder

- Don't express surprise at obvious things.
- Don't frame known engineering patterns as discoveries.
- "This is well-understood" is better than pretending you invented something.

## Layout

- `container` (820px) — post reading, about page
- `container-wide` (1080px) — homepage, archive
- Base layout accepts `wide` prop to toggle

## Don'ts

- Don't add color outside the semantic vocabulary (`--c-ok` / `--c-fail` / `--c-run` / `--c-action` / `--c-info`). No sepia/cream palettes, no branded color, no color-for-color's-sake, no page-frame chrome
- Don't use grids for post listings unless there are 6+ items
- Don't add borders/rules between list items. Hover state is enough separation
- Don't use small font sizes for code. Match or exceed body size
- Don't justify paragraph text. Left-align
- Don't ship a post that describes a UI without rendering the UI. Don't ship a post that describes a diagram without drawing it. "The edit, not the log" applies to our own posts too: demonstrate, don't narrate
- Don't reach for ornament when the problem is clarity. The fix for a mid-feeling page is almost always more whitespace and less decoration
