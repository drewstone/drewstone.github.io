# Readability proof, 2026-10-02

Before: blog e5a9810, Agent Record 0.1.0. After: `fix/readable-research-layouts`, Agent Record 0.2.1, equations from content commit a68bc06. Chromium, 1440×1000 desktop, 390×1000 phone, additional 320px fit check, light and dark themes.

- First stack table: 1916px → 925px tall on desktop; second: 520px → 238px. Table width: 766px → 874px.
- Phone series directory: 771px → 101px closed. Opening it exposes the other 12 posts; previous/next links remain available.
- Horizontal scrolling stays inside tables. Only overflowing tables enter the tab order; Right Arrow moves 96px. Page width matches 320px and 390px viewports.
- Fourteen edited posts render 79 display equations and 70 inline math expressions with no KaTeX or browser errors. Long equations retain horizontal scrolling.
- The shared Agent Record 0.2.1 package displays all six published BCWW actors. Keyboard selection works; full labels and statuses fit at desktop and phone width. The private 25-agent report was checked separately, without publishing its data.
- Three protected human-original bodies are unchanged. Code and pseudocode remain code.

The uncut browser video shows opening and closing the series directory, keyboard table scrolling, opening the agent hierarchy, and selecting two agents. Screenshots and video were opened and inspected.

Luna handled three independent surfaces: library tree, article tables/navigation, and equation formatting. Root reviewed and integrated the changes. Equation edits link to the native gpt-6-luna session through the existing blog capture command. Published authorship traces are explicitly selected excerpts, not full rollouts; private reasoning is excluded. Native source remains retained locally.

Build and focused AgentRecordView TypeScript check pass. The repository-wide TypeScript command has a pre-existing parse error in tools/install-hooks.mjs; it was not changed here. The existing Astro/MDX peer-version warning remains.

Rollback: revert this change and rebuild the static site. The previous package URL remains an immutable GitHub release.
