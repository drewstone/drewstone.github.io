# Publishing research evidence

The research collection contains explicit results, separate from essays and their authorship traces.
Execution remains owned by Runtime; this repository presents a curated, static projection.

## Add a result

1. Verify the exact source statement, witness, assumptions, sign, and scope.
2. Replay the existing artifact and distinguish that replay from an independently written checker.
3. Review novelty separately; record corpus origin, prior art, corrections, and missing evidence.
4. Add one MDX entry under `src/content/research`, with its dated assessment and applicable record IDs.
5. Review the rendered mathematics, interactions, source links, and mobile layout before delivery.

Human-original essays remain unchanged.
Research-page curation is AI-assisted authorship and must be disclosed separately from the original research attribution.
Do not claim peer review, complete capture, or first discovery without the supporting source.

## Event records

`src/components/EvidenceExplorer.astro` embeds the React viewer from [`@drewstone/agent-record`](https://github.com/drewstone/agent-record).
Its `fromResearchPublication` adapter validates and converts `research-publication.events.v1` into the shared record format.
`AgentRecordView.tsx` owns site URLs; the package owns rendering and interaction.
The viewer accepts attributed agents, native sessions, and findings without inferring session joins or executing research.
The legacy import tool currently reads retained Runtime journals and Pi JSONL archives; it is not an all-harness capture implementation.
New harness exports must use retained source records and the same publication contract.

Every event identifies its source file by SHA-256 and line number.
The downloadable projection preserves event metadata, model identity provenance, selected provider counters, and explicit coverage gaps.
Native sessions remain separate until an exact join is available.
Agent finding text is distinct from the curator's assessment.

`tools/project-research-evidence.py PRIVATE_SOURCE_DIR` rebuilds the retained historical projections.
Run it from the repository root.
Inputs stay private and unmodified; generated files go to `public/research/records`.

Public assignment summaries live in `reviewed-assignments.json` and bind to the reviewed input hash.
Reviewed finding source hashes live in `reviewed-findings.json`.
A changed finding or input source requires a fresh content review; the importer refuses otherwise.
Never update the allowlist mechanically to make an import pass.
Unreviewed transcript bodies, tool arguments/results, private reasoning, credentials, and personal information remain outside the public projection.
Do not publish an original archive just because its metadata projection is safe.

## Counts and visual meaning

Runtime nodes, native files, and findings are different units.
A native file is not an additional proven agent.
Configuration declarations and failed response metadata do not prove which model served an inference.
Reported usage counters include repeated and cached context; they do not measure unique text or billed money.
Unknown usage and legacy placeholder zeros remain unknown.
The current inspected corpus has no duplicated response records; recheck that property when importing another archive.

Colors classify operations by documented tool and command rules.
They do not establish independent verification, scientific value, uninterrupted activity, or wasted expenditure.
A gap between event marks is missing observation, not a measured idle interval.

## Release and evidence

Build on a beelink, then exercise the static output through a browser.
Retain matching before/after screenshots and the uncut interaction recording outside application bundles.
Check no-JavaScript reading, both themes, mobile overflow, direct event links, filters, empty results, downloads, keyboard controls, and LaTeX.
Verify the deployed GitHub Pages revision and its actual URLs after merge.
Rollback by reverting the publication commit and redeploying through the existing workflow.

## Conversations and exact joins

`reviewed-messages.json` contains reviewed ordinary transcript text keyed by original content SHA-256.
The review receipt records source files, physical lines, roles, published-text hashes, and explicit redactions.
It excludes hidden thinking and unreviewed tool bodies. Do not approve unread messages mechanically.
`reviewed-native-joins.json` binds the six August 5 native sessions to Runtime nodes through unique exact task digests, with the director's matching spawn receipts as child evidence.
The importer verifies the cited source hashes before applying these joins or publishing conversation text.
Other archives retain their unresolved identities and missing conversations.

The viewer groups events by those proven identities without deleting the original native IDs.
The graph follows recorded parents recursively; time controls change the displayed execution state.
Activity labels classify recorded operations, not scientific correctness.
A missing message is shown as missing. A blank interval is not proof of idleness.

## Shared interface

`src/styles/controls.css` owns fields, buttons, tabs, focus states, and disclosures across the site.
`ChoicePicker.astro` owns the searchable-by-typing, keyboard-navigable popover listbox, with a native select fallback without JavaScript.
`ResearchBibliography.astro` owns numbered references and citation targets.
The shared Agent Record package pairs tools within the original node and call ID.
`ChatBlock.astro` and `chat-icons.ts` remain shared by essay authorship traces.
The viewer labels team roles separately from assignments: the five August 5 workers were assigned verification.
The viewer uses React and Zod; it introduces no execution service.

Timeline marks group events within six display pixels; hover states retain exact timestamps and group size.
Repeated activation cycles a group's original events; zoom increases temporal resolution.
All events remain available through keyboard navigation and the downloadable record.
The Tokens tab separates input, output, and cache counters, with cumulative or per-response values against elapsed time or recorded order.
Tool return time pairs exact call/result IDs within a native session; it is an observed interval, not model latency.
Every metric respects the selected time; incomplete counters and unmatched timings remain unknown.
Chart hover and focus details are plain text within the shared viewer.
Open-graph image generation uses pinned local fonts with licenses and source hashes in `tools/fonts`.

## Reviewed tool content

`reviewed-tools.json` binds published arguments and results to their original source file, physical line, and content hash.
The importer rejects changed sources, missing approvals, and unmatched reviewed records.
`reviewed-tools-receipt.json` records the review coverage and one missing result.

The August 5 publication includes all 400 tool inputs and all 399 retained results.
Of those results, 240 are full, 74 contain labeled redactions, and 85 contain labeled excerpts.
The final qLTC search has no retained result; its outcome remains unknown.
Original private archives remain unchanged.

The conversation pairs each input with its retained outputs, timestamps, publication notes, and source links.
Time controls hide future outputs; opened tools remain open while browsing recorded time.
“Returned” means a result was recorded, not that a command or scientific claim succeeded.
“Error” reflects the source error flag; a shell pipeline can return normally despite an inner command failing.
No state implies a currently running agent.
