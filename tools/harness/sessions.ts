/**
 * Session reading shared by the Claude Code and Codex trace harnesses.
 *
 * Sessions are parsed by @tangle-network/harness-sessions, the one reader of harness sessions
 * shared with Discovery, agent-eval, agent-record and traces; this module keeps only the blog's
 * own policy: which turns of a session belong to a post's trace (the windows that touched or
 * named the post's files, or follow a marker).
 */
import { homedir } from 'node:os'
import { claudeCodeRefForFile, codexRefForFile, primaryModel, readerFor, toTurns, type HarnessSession, type SessionRef as NativeRef, type SessionToolCall } from '@tangle-network/harness-sessions'
import type { FindOpts, Filter, SessionRef, Turn } from './types.js'
import { dedupeAdjacentTurns } from './types.js'

const PATH_RE = /(?:\/Users\/[^\s"'`]+|\.?\/?[\w@.-]+(?:\/[\w@.-]+)+\.(?:mdx|ts|tsx|js|jsx|astro|py|rs|go|sh|yaml|yml|toml|md|json|css|mjs))/g
const EDIT_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit', 'edit', 'write', 'apply_patch'])

/** Paths a tool call names: the edit target, the files a patch names, and path-like strings in its input. */
export function filesOf(call: SessionToolCall): string[] {
  const out = new Set<string>()
  const input = call.input as Record<string, unknown> | string | null
  if (input && typeof input === 'object') {
    for (const key of ['file_path', 'filePath', 'path', 'notebook_path']) {
      if (typeof input[key] === 'string' && EDIT_TOOLS.has(call.name)) out.add(input[key] as string)
    }
  }
  const visit = (value: unknown): void => {
    if (typeof value === 'string') {
      for (const m of value.matchAll(PATH_RE)) out.add(m[0])
      for (const line of value.match(/^\*\*\* (?:Update|Add|Delete) File: (.+)$/gm) ?? []) out.add(line.replace(/^\*\*\* (?:Update|Add|Delete) File: /, '').trim())
    } else if (Array.isArray(value)) {
      for (const item of value) visit(item)
    } else if (value && typeof value === 'object') {
      for (const item of Object.values(value)) visit(item)
    }
  }
  visit(call.input)
  return [...out]
}

const REF_FOR_FILE: Record<string, (path: string) => NativeRef> = {
  'claude-code': (path) => claudeCodeRefForFile(path),
  codex: (path) => codexRefForFile(path),
}

export async function readSession(harness: string, path: string): Promise<HarnessSession> {
  const refFor = REF_FOR_FILE[harness]
  if (!refFor) throw new Error(`no trace harness for ${harness}`)
  return readerFor(harness).read(refFor(path))
}

/** The harness's own sessions under this machine's HOME, newest first. */
export async function findSessions(harness: string, opts: FindOpts): Promise<SessionRef[]> {
  const reader = readerFor(harness)
  const refs = await reader.locate(homedir(), { ...(opts.cwd ? { cwd: opts.cwd } : {}), ...(opts.since ? { sinceMs: opts.since.getTime() } : {}) })
  const out: SessionRef[] = []
  for (const ref of refs) {
    // A Claude Code subagent transcript is part of its parent's session, not a session of its own.
    if (reader.harness === 'claude-code' && ref.parentNativeSessionId !== null) continue
    if (opts.until && ref.mtimeMs > opts.until.getTime()) continue
    const session = await reader.read(ref)
    const turns = toTurns(session, { filesOf })
    const files = [...new Set(turns.flatMap((turn) => turn.files_touched ?? []))]
    if (opts.filesTouched?.length && !opts.filesTouched.some((p) => files.some((q) => q.endsWith(p)))) continue
    out.push({
      id: session.nativeSessionId,
      harness: reader.harness,
      path: ref.path,
      started_at: session.startedAt ?? undefined,
      ended_at: session.endedAt ?? undefined,
      cwd: session.cwd ?? ref.cwd ?? undefined,
      files_touched: files,
    })
  }
  out.sort((a, b) => (b.started_at ?? '').localeCompare(a.started_at ?? ''))
  return opts.limit ? out.slice(0, opts.limit) : out
}

/**
 * The turns of a session that belong to a post: each user-turn window that touched one of the
 * wanted files or named it in the user's text, with its neighbours; with a marker, from the window
 * before the last one that holds it.
 */
export async function extractTurns(harness: string, ref: SessionRef, filter: Filter): Promise<Turn[]> {
  const session = await readSession(harness, ref.path)
  const turns = toTurns(session, { cwd: ref.cwd ?? session.cwd, filesOf })
  const windows: Turn[][] = []
  for (const turn of turns) {
    if (turn.role === 'user' || windows.length === 0) windows.push([])
    windows[windows.length - 1]!.push(turn)
  }
  const wantedFiles = (filter.files ?? []).map((f) => f.replace(/^\.\//, ''))
  const wantedTokens = wantedFiles.map((f) => f.replace(/\.mdx$/, '').replace(/\.tsx?$/, '').replace(/\.astro$/, ''))
  const related = (window: Turn[]): boolean =>
    window.some((turn) => (turn.files_touched ?? []).some((t) => wantedFiles.some((w) => t.endsWith(w))))
    || window.some((turn) => turn.role === 'user' && wantedTokens.some((w) => w && (turn.text ?? '').includes(w)))
  const selected = new Set<number>()
  windows.forEach((window, index) => {
    if (wantedFiles.length && !related(window)) return
    for (const i of [index - 1, index, index + 1]) if (i >= 0 && i < windows.length) selected.add(i)
  })
  let indexes = [...selected].sort((a, b) => a - b)
  const marker = (filter.marker ?? '').trim()
  if (marker) {
    const hits = windows.map((window, i) => (window.some((turn) => (turn.text ?? '').includes(marker)) ? i : -1)).filter((i) => i >= 0)
    if (hits.length === 0) return []
    const cutoff = Math.max(hits[hits.length - 1]! - 1, 0)
    indexes = indexes.filter((i) => i >= cutoff)
  }
  const picked = dedupeAdjacentTurns(indexes.flatMap((i) => windows[i]!)).map((turn, seq) => ({ ...turn, seq }))
  if (filter.maxTurns && picked.length > filter.maxTurns) {
    const head = Math.ceil(filter.maxTurns / 2)
    return [...picked.slice(0, head), ...picked.slice(-(filter.maxTurns - head))]
  }
  return picked
}

/** The model that answered most of the session's calls, as the session recorded it. */
export async function detectModel(harness: string, ref: SessionRef): Promise<string | null> {
  try {
    return primaryModel(await readSession(harness, ref.path))
  } catch {
    return null
  }
}
