# .traces/

Captured agent session traces, one JSON file per revision.

Each trace is a lossy, repo-friendly summary of the session that produced a specific edit. They are rendered at `/traces/<id>` using the `ChatMock` component, and linked from each post's revision timeline.

## Schema

See `tools/harness/types.ts` for the canonical `TraceFile` shape. Minimal example:

```json
{
  "trace_id": "2026-04-24T18-01-15-claude-opus-4-7",
  "harness": "claude-code",
  "model": "claude-opus-4-7",
  "started_at": "2026-04-24T18:01:15Z",
  "ended_at": "2026-04-24T18:23:40Z",
  "post": "convergence-as-eval-primitive",
  "role": "polish",
  "commit": "abc1234",
  "files_touched": ["src/content/posts/convergence-as-eval-primitive.mdx"],
  "summary": "Rewrote closing to concrete per-criterion diagnosis.",
  "turns": [
    { "role": "user", "text": "...", "ts": "2026-04-24T18:01:15Z" },
    { "role": "assistant", "text_summary": "...", "tool_calls": 2, "ts": "..." }
  ]
}
```

## Capture

```bash
# Manual capture for a specific post
pnpm tsx tools/trace-capture.ts capture --post=convergence-as-eval-primitive --role=polish

# Auto-capture from the latest commit (used by the post-commit git hook)
pnpm tsx tools/trace-capture.ts capture --auto

# Enable the hook once per machine
git config core.hooksPath .githooks
```

## Privacy note

Traces are summarized by the harness adapters: user turns are trimmed to ~600 chars, assistant turns to ~280 chars with only tool-call counts + names (not full tool inputs/outputs). Full raw JSONL stays under `~/.claude/projects/` or `~/.codex/sessions/` on the authoring machine. If you want to archive raw traces centrally, set `raw_uri` in the trace file to an object-store URL; the adapter does not upload automatically.
