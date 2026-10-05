/**
 * Shared types for session trace extraction across harnesses.
 *
 * Every harness (Claude Code, Codex, manual, future) produces a list of
 * normalized {@link Turn}s. The orchestrator stitches those turns into a trace
 * file that lives alongside the post it describes.
 */

/**
 * A turn and its tool-call details are the projection @tangle-network/harness-sessions makes of a
 * normalized session (`toTurns`): role, text and its 280-character summary, tool calls with input
 * and result previews, files touched, and for an assistant turn the model that answered it, its
 * usage and the error its model call ended with.
 */
export type { Turn, TurnToolCall as ToolCallDetail } from '@tangle-network/harness-sessions'
import type { Turn } from '@tangle-network/harness-sessions'

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
  /** Optional marker that must appear in a user turn to delimit the captured block. */
  marker?: string
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
  role: 'outline' | 'draft' | 'rewrite' | 'polish' | 'diagram' | 'review' | 'publish' | 'research'
  /** `series-outline` traces can produce multiple post artifacts. */
  kind?: 'post' | 'series-outline' | 'supporting-research'
  /** Series slug when a trace belongs to a multi-post project. */
  series?: string
  /** Post slugs produced or seeded by this trace. */
  posts?: string[]
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

function stableTurnPayload(turn: Turn): string {
  return JSON.stringify({
    role: turn.role,
    text: turn.text ?? '',
    text_summary: turn.text_summary ?? '',
    tool_names: turn.tool_names ?? [],
    tool_call_details: turn.tool_call_details ?? [],
    files_touched: turn.files_touched ?? [],
    had_thinking: !!turn.had_thinking,
  })
}

function timestampMs(turn: Turn): number {
  return typeof turn.ts === 'string' ? new Date(turn.ts).valueOf() : Number.NaN
}

export function dedupeAdjacentTurns(turns: Turn[]): Turn[] {
  const out: Turn[] = []
  for (const turn of turns) {
    const prev = out[out.length - 1]
    if (prev && stableTurnPayload(prev) === stableTurnPayload(turn)) {
      const a = timestampMs(prev)
      const b = timestampMs(turn)
      if (!Number.isFinite(a) || !Number.isFinite(b) || Math.abs(a - b) <= 1000) {
        continue
      }
    }
    out.push(turn)
  }
  return out
}
