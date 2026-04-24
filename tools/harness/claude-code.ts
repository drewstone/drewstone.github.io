/**
 * Claude Code harness adapter.
 *
 * Reads session JSONL files under ~/.claude/projects/<project-slug>/*.jsonl,
 * where <project-slug> is the URL-escaped absolute path of the repo
 * (e.g. `-Users-drew-code-blog`).
 *
 * JSONL events include types: user, assistant, summary, tool_use, tool_result.
 * Each assistant message carries a content array with text / tool_use /
 * thinking blocks. We collapse an assistant message's tool calls into a single
 * normalized Turn with counts and names — raw details stay in the source file.
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import type { FindOpts, Filter, SessionRef, Turn, TraceHarness } from './types.js'
import { summarize } from './types.js'

const EDIT_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit'])

function projectSlug(cwd: string): string {
  // `~/code/blog` → `-Users-<user>-code-blog`
  return cwd.replace(/^\//, '-').replace(/\//g, '-')
}

function parseJsonl(raw: string): any[] {
  const out: any[] = []
  for (const line of raw.split('\n')) {
    const s = line.trim()
    if (!s) continue
    try {
      out.push(JSON.parse(s))
    } catch {
      // tolerant — skip malformed lines
    }
  }
  return out
}

function touchedFiles(ev: any): string[] {
  const out = new Set<string>()
  const content = ev?.message?.content
  if (Array.isArray(content)) {
    for (const block of content) {
      if (block?.type === 'tool_use' && EDIT_TOOLS.has(block?.name) && block?.input) {
        const p = block.input.file_path || block.input.notebook_path
        if (typeof p === 'string') out.add(p)
      }
    }
  }
  return [...out]
}

function toolSummary(ev: any): { count: number; names: string[] } {
  const content = ev?.message?.content
  if (!Array.isArray(content)) return { count: 0, names: [] }
  const names: string[] = []
  for (const block of content) {
    if (block?.type === 'tool_use' && typeof block.name === 'string') names.push(block.name)
  }
  return { count: names.length, names: names.slice(0, 6) }
}

function assistantText(ev: any): string {
  const content = ev?.message?.content
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) return ''
  return content
    .filter((b: any) => b?.type === 'text' && typeof b.text === 'string')
    .map((b: any) => b.text)
    .join('\n')
}

function hadThinking(ev: any): boolean {
  const content = ev?.message?.content
  if (!Array.isArray(content)) return false
  return content.some((b: any) => b?.type === 'thinking')
}

function userText(ev: any): string {
  const c = ev?.message?.content
  if (typeof c === 'string') return c
  if (Array.isArray(c)) {
    return c
      .map((b: any) => (typeof b?.text === 'string' ? b.text : typeof b === 'string' ? b : ''))
      .join('\n')
  }
  return ''
}

async function sessionsDirFor(cwd: string): Promise<string | null> {
  const dir = join(homedir(), '.claude', 'projects', projectSlug(cwd))
  try {
    const s = await stat(dir)
    return s.isDirectory() ? dir : null
  } catch {
    return null
  }
}

export class ClaudeCodeHarness implements TraceHarness {
  name = 'claude-code'

  async findSessions(opts: FindOpts): Promise<SessionRef[]> {
    const cwd = opts.cwd ?? process.cwd()
    const dir = await sessionsDirFor(cwd)
    if (!dir) return []
    const files = (await readdir(dir)).filter((f) => f.endsWith('.jsonl'))
    const out: SessionRef[] = []
    for (const f of files) {
      const path = join(dir, f)
      const s = await stat(path)
      if (opts.since && s.mtime < opts.since) continue
      if (opts.until && s.mtime > opts.until) continue
      // Peek first + last event for timestamps; touched files require a full scan
      const raw = await readFile(path, 'utf8')
      const events = parseJsonl(raw)
      if (!events.length) continue
      const filesTouched = new Set<string>()
      let first = ''
      let last = ''
      for (const e of events) {
        if (e?.timestamp) {
          if (!first) first = e.timestamp
          last = e.timestamp
        }
        for (const p of touchedFiles(e)) filesTouched.add(p)
      }
      if (opts.filesTouched?.length) {
        const match = opts.filesTouched.some((p) => [...filesTouched].some((q) => q.endsWith(p)))
        if (!match) continue
      }
      out.push({
        id: f.replace(/\.jsonl$/, ''),
        harness: this.name,
        path,
        started_at: first || undefined,
        ended_at: last || undefined,
        cwd,
        files_touched: [...filesTouched],
      })
    }
    out.sort((a, b) => (b.started_at ?? '').localeCompare(a.started_at ?? ''))
    return opts.limit ? out.slice(0, opts.limit) : out
  }

  async extractTurns(ref: SessionRef, filter: Filter): Promise<Turn[]> {
    const raw = await readFile(ref.path, 'utf8')
    const events = parseJsonl(raw)
    const wantedFiles = (filter.files ?? []).map((f) => f.replace(/^\.\//, ''))

    // Segment the session into user-turn windows: each window starts with a
    // user message and includes all assistant activity until the next user
    // message. A window is "relevant" if any event in it touches one of the
    // wanted files. Keep only relevant windows when wantedFiles is non-empty.
    type Window = { events: any[] }
    const windows: Window[] = []
    let cur: Window | null = null
    for (const ev of events) {
      if (ev?.type === 'user') {
        if (cur) windows.push(cur)
        cur = { events: [ev] }
      } else if (cur) {
        cur.events.push(ev)
      } else {
        // events before any user turn — open an anonymous window
        cur = { events: [ev] }
      }
    }
    if (cur) windows.push(cur)

    const relevant = wantedFiles.length
      ? windows.filter((w) =>
          w.events.some((e) =>
            touchedFiles(e).some((t) => wantedFiles.some((wf) => t.endsWith(wf)))
          )
        )
      : windows

    const projectRoot = (ref.cwd ?? process.cwd()).replace(/\/$/, '') + '/'
    const relativize = (p: string) => p.startsWith(projectRoot) ? p.slice(projectRoot.length) : p

    const turns: Turn[] = []
    for (const w of relevant) {
      for (const e of w.events) {
        const ts: string = e?.timestamp ?? ''
        if (e?.type === 'user') {
          const txt = userText(e)
          if (!txt) continue
          turns.push({ role: 'user', text: summarize(txt, 600), ts })
        } else if (e?.type === 'assistant') {
          const txt = assistantText(e)
          const { count, names } = toolSummary(e)
          const files = touchedFiles(e).map(relativize)
          const hasText = !!txt
          const hasTools = count > 0
          if (!hasText && !hasTools) continue
          turns.push({
            role: 'assistant',
            text_summary: hasText ? summarize(txt, 280) : undefined,
            tool_calls: count || undefined,
            tool_names: names.length ? names : undefined,
            files_touched: files.length ? files : undefined,
            had_thinking: hadThinking(e) || undefined,
            ts,
          })
        }
      }
    }

    if (filter.maxTurns && turns.length > filter.maxTurns) {
      const head = Math.ceil(filter.maxTurns / 2)
      const tail = filter.maxTurns - head
      return [...turns.slice(0, head), ...turns.slice(-tail)]
    }
    return turns
  }

  async detectModel(ref: SessionRef): Promise<string | null> {
    try {
      const raw = await readFile(ref.path, 'utf8')
      const events = parseJsonl(raw)
      for (const e of events) {
        const m = e?.message?.model
        if (typeof m === 'string') return m
      }
    } catch {
      /* ignore */
    }
    return null
  }
}

export default ClaudeCodeHarness
