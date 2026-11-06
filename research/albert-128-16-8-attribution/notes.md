# Run-level attribution for the [[128,16,8]] code

Provenance notes for `src/content/research/128-16-8.mdx`, moved out of the article body on 2026-10-13.
The article keeps a short factual attribution; this file holds the run-level detail.

## Timeline

- The code was not found by the run that recorded it.
- The cancelled run `albert-full-ldpc-symmetry-20261011a` built it as a two-sheet lift of the incumbent and reported 136 depth-one generators, then died in a coordination outage at 13:38 UTC on October 11, 2026.
- The operator salvaged that sandbox, ran the root's own certificate builder to produce the 47 transvection words (218 generators, 1,144 items), published the four files with SHA-256 sums, and relayed them through the search lead's mail.
- The run `albert-full-ldpc-symmetry-20261011b` verified the files, recorded them as its deliverable, and reran the unmodified mounted check itself.
- A second run, `albert-full-ldpc-lift-20261011b`, passed the check at 15:55 UTC the same day; hardened rechecks on October 12 passed all 26 gates for both runs.

## Retained records

- The verdict records of `albert-full-ldpc-symmetry-20261011b` and the byte-exact run record live in the private proof packet and the lab workspace (see the article's reference [[5]](#ref-5), VERIFICATION.md in the verification gist).
- The outside critique (GPT-6 Pro, commissioned October 11, 2026) is retained alongside the construction (reference [[3]](#ref-3)).
- The split between what the October 13 replays machine-check and what is carried by the retained C program, the critique's elementary proof, and the standard generation theorem is written out in the private proof packet.
