# Blog

Personal blog. Astro + MDX, static output, GitHub Pages.

## Stack

- Astro with MDX for content
- KaTeX (CDN) for math rendering via remark-math + rehype-katex
- Shiki (github-light / github-dark) for syntax highlighting
- Computer Modern (body), JetBrains Mono (code)
- No framework JS — only component islands for interactive content

## Design

- **Black and white.** No color accents. Let syntax highlighting be the only color on the page.
- **Bigger is better.** 19px base font. When unsure, size up.
- **Whitespace over dividers.** Don't use horizontal rules to create structure — use spacing. Too many lines = noisy and confusing.
- **Click targets must be obvious.** Full-width hover states (background + padding shift), not subtle underline-color changes.
- **Vertical hierarchy over grids.** Grids look empty with few items. A vertical list scales from 2 posts to 200.
- **No template mastheads.** Personal voice > generic branding. "I'm Drew" > big "DREW" banner.
- **Code blocks: full-bleed.** Break out of the reading column on wide screens. Larger font than body. Language label top-right at low opacity.
- **Academic serif for prose, mono for metadata.** Dates, tags, labels use mono. Body and headings use serif.

## Content

- Posts live in `src/content/posts/` as `.mdx` files
- Frontmatter: `title`, `description`, `date`, `updated?`, `tags[]`, `draft?`
- Interactive components: `<Chart>` (inline canvas JS), `<AnimatedCanvas>` (particle system with IntersectionObserver pause/resume), `<Tweet id="..." />` (embedded X posts)
- **Two content styles**: math/technical deep-dives (formulas, data viz, Canvas charts) and architectural/vision/product narratives (engineering problems, system design, no forced math)
- Content comes from real projects Drew is building. Don't invent fictional projects.
- Article length: concise introductions, not exhaustive references. Current posts are the right length.

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
- Read CSS variables (`--fg`, `--bg`, `--faint`, `--ornament`) for theme-aware rendering.
- Give diagrams generous padding (80px+ top offset for labels).
- Prefer clean geometric shapes and typography over decoration.

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

- Don't add colored accents or branded elements
- Don't use grids for post listings unless there are 6+ items
- Don't add borders/rules between list items — hover state is enough separation
- Don't use small font sizes for code — match or exceed body size
- Don't justify paragraph text — left-align
