# Publishing research evidence

The research collection contains explicit results, separate from essays and their authorship traces.
Execution remains owned by Runtime; this repository publishes reviewed projections of stored run evidence.

## Add a result

1. Verify the exact source statement, witness, assumptions, sign, and scope.
2. Replay the existing artifact and distinguish that replay from an independently written checker.
3. Review novelty separately; record corpus origin, prior art, corrections, and missing evidence.
4. Add one MDX entry under `src/content/research`, with its dated assessment and applicable record IDs.
5. Review the rendered mathematics, interactions, source links, and mobile layout before delivery.

Human-original essays remain unchanged.
Each research page links to its commit history beside the assessment date.
Do not claim peer review, complete capture, or first discovery without the supporting source.

## Agent records

A record on this site is a function of three inputs: a run snapshot in the evidence store, a pinned converter, and a review.
The store is the R2 bucket `discovery-evidence`; a snapshot is a content-addressed manifest of every file in a run.
The converter is `ingest` from [`@drewstone/agent-record`](https://github.com/drewstone/agent-record), pinned by the lockfile.
Nothing in this repository is a copy of a run.

Each record has a directory under `research/publications/<record id>/`:

- `manifest.json` names the store namespace, the snapshot manifest digest, the converter version and the record digest.
- `overlay.json` is the review. It is the only path by which a message, tool input, tool result or finding body becomes public.
- `lock.json` holds the digests of the last build: record, overlay and public projection.

`public/research/records/<record id>.json` is the public projection: the converted record with only the bodies the overlay approves.
It is committed so the site builds without store credentials, and the gates below prove it matches its inputs.
A research post lists its records in `record_ids`; the content schema refuses an ID without a publication.

To publish or rebuild a record, on GTR:

```bash
node tools/research-records.mjs build <record id>   # materialize the snapshot, convert, apply the review, write
node tools/research-records.mjs verify <record id>  # reproduce it from the store and check the pins
```

`build` and `verify` read the store through discovery-lab `tools/evidence.mjs` (`EVIDENCE_CLI`) with the credentials the research tool uses.
Upload a new run with `evidence.mjs put` and pin it with `evidence.mjs pin --from research/publications` before citing it.

## Review overlay

Overlay entries are keyed by event ID and bound to the exact source bytes the reviewer read (`sourceSha256`).
A changed source line, file or JSON value invalidates its entry, and the build stops until it is reviewed again.
Bodies are withheld unless an entry publishes them in full, redacted, as an excerpt, or as a summary.
Redactions cover credentials, third-party email addresses, private paths, nonces, account names and IP addresses.
Hidden thinking, unrelated memory, system reminders and encrypted inter-agent messages are never published.
Never approve unread text mechanically to make a build pass.
Agent finding text is distinct from the curator's assessment, which the overlay carries beside it.

Session joins come from the converter, never from the overlay.
A join holds only when the evidence proves it, such as a Pi session whose first prompt hashes to the spawned task digest.
Unjoined sessions stay separate nodes with their original IDs.

## Event IDs and links

An event ID names its source bytes: the first 12 hex digits of the SHA-256 of the stored file, then the physical line or JSON Pointer.
A finding page is its file digest alone.
Joins, channel choices and converter upgrades do not change an ID, so a published link keeps its target.

`research/publications/idmap.json` maps every ID published before this scheme to its current ID; the viewer rewrites such a link on arrival.
`research/publications/published-ids.json` lists every event ID ever public, per record. It only grows.

## Gates

`pnpm build` runs `node tools/research-records.mjs check` first; it needs no network:

- each record has a valid manifest, overlay and lock, and a post cites it (or it is marked unlisted);
- the committed projection and overlay match their lock;
- every published ID, every `?event=` link under `src/content` and `research/`, and every map target resolves to an event;
- public records hold no credential, private path, unlisted email address, nonce, encrypted blob or hidden reasoning, and every published body traces to the overlay;
- no file under `public/research/records` lacks a manifest.

`verify` runs on GTR before every push that touches research records (`pnpm install:hooks` installs the hook) and nightly:

- every object of every cited snapshot exists with its length and digest;
- each cited namespace is locked against deletion, and its objects are mirrored to `/mnt/traces/evidence-pins` on GTR for backup (the mirror is checked where it lives);
- the pinned converter reproduces the manifest's record digest from the materialized snapshot;
- every overlay entry still matches its source bytes, and the regenerated projection equals the committed one.

Each failure names its gate, record and reason.

## Counts and visual meaning

Runtime nodes, native files, and findings are different units.
A native file is not an additional proven agent.
Configuration declarations and failed response metadata do not prove which model served an inference.
Reported usage counters include repeated and cached context; they do not measure unique text or billed money.
Unknown usage and legacy placeholder zeros remain unknown.

Colors classify operations by documented tool and command rules.
They do not establish independent verification, scientific value, uninterrupted activity, or wasted expenditure.
A gap between event marks is missing observation, not a measured idle interval.

## Release and evidence

Build on GTR or a beelink, then exercise the static output through a browser.
Retain matching before/after screenshots and the uncut interaction recording outside application bundles.
Check no-JavaScript reading, both themes, mobile overflow, direct event links, filters, empty results, downloads, keyboard controls, and LaTeX.
Verify the deployed GitHub Pages revision and its actual URLs after merge.
Rollback by reverting the publication commit and redeploying through the existing workflow.

## Shared interface

`src/components/EvidenceExplorer.astro` embeds the viewer from `@drewstone/agent-record`.
`AgentRecordView.tsx` owns site URLs (`?pursuit`, `?event`, `?view`, `?at`); the package owns rendering and interaction.
`src/styles/controls.css` owns fields, buttons, tabs, focus states, and disclosures across the site.
`ChoicePicker.astro` owns the searchable-by-typing, keyboard-navigable popover listbox, with a native select fallback without JavaScript.
`ResearchBibliography.astro` owns numbered references and citation targets.
`ChatBlock.astro` and `chat-icons.ts` remain shared by essay authorship traces.

Timeline marks group events within six display pixels; hover states retain exact timestamps and group size.
Repeated activation cycles a group's original events; zoom increases temporal resolution.
All events remain available through keyboard navigation and the downloadable record.
Tool return time pairs exact call and result IDs within a session; it is an observed interval, not model latency.
“Returned” means a result was recorded, not that a command or scientific claim succeeded.
Open-graph image generation uses pinned local fonts with licenses and source hashes in `tools/fonts`.
