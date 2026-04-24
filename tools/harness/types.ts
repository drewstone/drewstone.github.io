/**
 * Shared types for session trace extraction across harnesses.
 *
 * Every harness (Claude Code, Codex, manual, future) produces a list of
 * normalized {@link Turn}s. The orchestrator stitches those turns into a trace
 * file that lives alongside the post it describes.
 */

/** A single turn of agent activity, lossy-summarized for repo storage. */
export type Turn = {
  role: 'user' | 'assistant' | 'system' | 'tool'
  /** Full text if short; omitted for long assistant content — see text_summary. */
  text?: string
  /** First ~280 chars of assistant prose, or an LLM-generated gist later. */
  text_summary?: string
  /** Rough count of tool calls issued by this turn (assistant only). */
  tool_calls?: number
  /** Names of tools invoked, truncated to first 6. */
  tool_names?: string[]
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
  files_touched: string[]
  summary: string
  turns: Turn[]
  raw_uri?: string
}

export function summarize(text: string, n = 280): string {
  const t = text.replace(/\s+/g, ' ').trim()
  return t.length <= n ? t : t.slice(0, n - 1) + '…'
}
