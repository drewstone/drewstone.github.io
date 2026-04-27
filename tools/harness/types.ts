/**
 * Shared types for session trace extraction across harnesses.
 *
 * Every harness (Claude Code, Codex, manual, future) produces a list of
 * normalized {@link Turn}s. The orchestrator stitches those turns into a trace
 * file that lives alongside the post it describes.
 */

/** Detailed record of a single tool invocation inside a turn. */
export type ToolCallDetail = {
  name: string
  /** Truncated rendering of the tool input (Bash command, file path, edit args, etc). */
  input_preview?: string
  /** File the tool wrote/edited, when applicable. */
  file_path?: string
  /** Truncated rendering of the tool result, when captured. */
  result_preview?: string
}

/** A single turn of agent activity, lossy-summarized for repo storage. */
export type Turn = {
  role: 'user' | 'assistant' | 'system' | 'tool'
  /** Full text (no truncation). For very long content (>8k) the harness may still trim. */
  text?: string
  /** First ~280 chars of assistant prose — kept for compact list views. */
  text_summary?: string
  /** Rough count of tool calls issued by this turn (assistant only). */
  tool_calls?: number
  /** Names of tools invoked, truncated to first 6. */
  tool_names?: string[]
  /** Detailed per-tool records (preferred over `tool_names` going forward). */
  tool_call_details?: ToolCallDetail[]
  /** Files mutated (Edit/Write/MultiEdit) in this turn. */
  files_touched?: string[]
  /** Whether this turn contained a thinking block (for assistant). */
  had_thinking?: boolean
  ts: string
}

/** Pointer to a session file on disk; harness-specific metadata lives in meta. */
export type SessionRef = {
  id: string
  harness: string
  path: string
  started_at?: string
  ended_at?: string
  cwd?: string
  files_touched?: string[]
  meta?: Record<string, unknown>
}

export type FindOpts = {
  since?: Date
  until?: Date
  cwd?: string
  filesTouched?: string[]
  /** Prefer the most recent session whose touched files include any of these. */
  limit?: number
}

export type Filter = {
  /** Only include turns that touched these files (or surrounding turns). */
  files?: string[]
  /** Include at most this many turns; head and tail preserved. */
  maxTurns?: number
}

export interface TraceHarness {
  name: string
  findSessions(opts: FindOpts): Promise<SessionRef[]>
  extractTurns(ref: SessionRef, filter: Filter): Promise<Turn[]>
  detectModel(ref: SessionRef): Promise<string | null>
}

/** A per-file diff stat (additions/deletions) computed from `git show --numstat`. */
export type FileDiffStat = {
  path: string
  additions: number
  deletions: number
}

/** A judge/eval score attached to a trace. Schema is intentionally loose so
 *  any future scorecard producer can drop in (LLM-as-judge, human review, etc). */
export type JudgeScore = {
  judge: string                 // e.g. "human", "claude-opus-4-7-as-judge", "gepa-eval-v1"
  scored_at?: string
  overall?: number              // 0..100
  dimensions?: Record<string, number>
  notes?: string
}

/** Common envelope written to .traces/<slug>/<id>.json. */
export type TraceFile = {
  trace_id: string
  harness: string
  model: string | null
  started_at: string
  ended_at?: string
  post: string
  role: 'draft' | 'rewrite' | 'polish' | 'diagram' | 'review'
  commit?: string
  /** First line of the commit message (the commit subject). */
  commit_subject?: string
  /** Full commit message body. */
  commit_message?: string
  files_touched: string[]
  /** Per-file +/− stats for the commit, when available. */
  diffstat?: FileDiffStat[]
  summary: string
  /** Optional intent string captured at session start: "tighten the closer", etc. */
  intent?: string
  turns: Turn[]
  /** Optional judge/eval results attached after the fact. */
  scores?: JudgeScore[]
  raw_uri?: string
}

export function summarize(text: string, n = 280): string {
  const t = text.replace(/\s+/g, ' ').trim()
  return t.length <= n ? t : t.slice(0, n - 1) + '…'
}
