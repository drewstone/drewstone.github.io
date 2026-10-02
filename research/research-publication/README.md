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

`src/components/EvidenceExplorer.astro` renders `research-publication.events.v1`, validated by `src/lib/research-evidence.ts`.
The same viewer accepts Runtime nodes, native sessions, and run-attributed findings from any harness.
It does not infer native-to-Runtime joins or execute research.
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

Build on GTR, then exercise the static output through a browser.
Retain matching before/after screenshots and the uncut interaction recording outside application bundles.
Check no-JavaScript reading, both themes, mobile overflow, direct event links, filters, empty results, downloads, keyboard controls, and LaTeX.
Verify the deployed GitHub Pages revision and its actual URLs after merge.
Rollback by reverting the publication commit and redeploying through the existing workflow.
