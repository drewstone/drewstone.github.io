# Agent conversation interface evidence

Before: deployed main `87754eb7d700128dadb647fb5911514c6b0f5cff`.
After: this change, built on GTR and served through `http://127.0.0.1:14327`.
`source-hashes.json` binds the checked source files and public records.
Desktop: 1440 × 1000; phone: 390 × 844; tablet: 800 × 1000.

## Visible changes

| Surface | Before | After |
| --- | --- | --- |
| Desktop workspace | [Before](before-desktop.png) | [After](after-desktop.png) |
| Phone workspace | [Before](before-phone.png) | [After](after-phone.png) |
| Tool content | [Empty placeholder](before-empty-tool.png) | [Paired input and output](after-tool.png) |
| Home navigation | [Before](before-home-desktop.png) | [After](after-home-desktop.png) |

[Dark workspace](after-dark.png) · [Phone home](after-home-phone.png).
[Uncut interaction recording, normal speed](walkthrough.webm).
The recording shows Essays navigation, command expansion, source reopening, worker selection, token metrics, command hover, and phone tool expansion.
Screenshots were opened for visual review; the video was played through in Chromium.

## Consumer proof

[Browser receipt](browser-receipt.json): 44 checked behaviors, no browser exceptions.
The complete static site build produced 120 pages.
Every retained August 5 call is rendered: 400 inputs, 399 paired results, one explicitly missing result.
Inputs and results use reviewed text, with labeled path redactions and long-output excerpts.
Source IDs, physical lines, hashes, native session IDs, and measured counters remain intact.

An independent frontend review found false attribution for unresolved identities, stale withheld-content tooltips, and future output in the source inspector.
All three were fixed and exercised through the browser.
Automation selectors were corrected for multiple prompts, two plot widgets, and records without an agent graph.
Individual completed checks were retained; unchanged behavior was not rerun for those instrumentation corrections.

This is an archived research viewer, not a new research execution or evidence of scientific novelty.
Full original discovery capture remains incomplete.
The qLTC final search has no retained result.
A returned tool result does not establish a successful shell pipeline or scientific claim.

Rollback: revert this commit and use the existing Pages deployment workflow.
