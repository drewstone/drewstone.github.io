/**
 * Codex CLI harness adapter.
 *
 * Reads session JSONL files under ~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl.
 * Codex records events slightly differently from Claude Code but the surface
 * we care about (user messages, assistant messages with tool use, touched
 * files) is recoverable.
 *
 * Codex event shapes vary across versions; this adapter tolerates unknown
 * keys and extracts best-effort. If a session doesn't yield any turns the
 * orchestrator falls through to the next one.
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import type { FindOpts, Filter, SessionRef, ToolCallDetail, Turn, TraceHarness } from './types.js'
import { summarize } from './types.js'

const PATH_RE = /(?:\/Users\/[^\s"'`]+|\.?\/?[\w@.-]+(?:\/[\w@.-]+)+\.(?:mdx|ts|tsx|js|jsx|astro|py|rs|go|sh|yaml|yml|toml|md|json|css|mjs))/g

async function* walk(root: string): AsyncGenerator<string> {
  let entries
  try { entries = await readdir(root, { withFileTypes: true }) } catch { return }
  for (const e of entries) {
    const p = join(root, e.name)
    if (e.isDirectory()) yield* walk(p)
    else if (e.isFile() && p.endsWith('.jsonl')) yield p
  }
}

function parseJsonl(raw: string): any[] {
  const out: any[] = []
  for (const line of raw.split('\n')) {
    const s = line.trim()
    if (!s) continue
    try { out.push(JSON.parse(s)) } catch { /* skip */ }
  }
  return out
}

function extractText(value: unknown): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value
      .map((v) => {
        if (typeof v === 'string') return v
        if (typeof v?.text === 'string') return v.text
        if (typeof v?.content === 'string') return v.content
        return ''
      })
      .filter(Boolean)
      .join('\n')
  }
  if (value && typeof value === 'object') {
    const v = value as any
    if (typeof v.text === 'string') return v.text
    if (typeof v.content === 'string') return v.content
    if (Array.isArray(v.content)) return extractText(v.content)
  }
  return ''
}

function payloadOf(ev: any): any {
  return ev?.payload && typeof ev.payload === 'object' ? ev.payload : ev
}

function timestampOf(ev: any): string {
  const p = payloadOf(ev)
  const ts = ev?.timestamp ?? p?.timestamp ?? p?.ts ?? p?.created_at
  return typeof ts === 'string' ? ts : ''
}

function sessionCwd(events: any[]): string | undefined {
  for (const ev of events) {
    const p = payloadOf(ev)
    const cwd = p?.cwd ?? p?.payload?.cwd
    if (typeof cwd === 'string') return cwd
  }
  return undefined
}

function roleOf(ev: any): Turn['role'] | null {
  const p = payloadOf(ev)
  if (ev?.type === 'event_msg' && p?.type === 'user_message') return 'user'
  if (ev?.type === 'event_msg' && p?.type === 'agent_message') return 'assistant'
  if (p?.type === 'function_call' || p?.type === 'custom_tool_call') return 'assistant'
  const r = p?.role ?? p?.message?.role ?? p?.type ?? ev?.role ?? ev?.message?.role ?? ev?.type
  if (r === 'user' || r === 'assistant' || r === 'system' || r === 'tool') return r
  if (typeof r === 'string' && r.includes('user')) return 'user'
  if (typeof r === 'string' && (r.includes('assistant') || r.includes('agent'))) return 'assistant'
  return null
}

function textOf(ev: any): string {
  const p = payloadOf(ev)
  if (ev?.type === 'event_msg' && typeof p?.message === 'string') return p.message
  return extractText(p?.content ?? p?.message?.content ?? p?.text ?? ev?.content ?? ev?.message?.content ?? ev?.text ?? '')
}

function findPaths(value: unknown): string[] {
  const out = new Set<string>()
  const visit = (v: unknown) => {
    if (typeof v === 'string') {
      for (const m of v.matchAll(PATH_RE)) out.add(m[0])
      const patch = v.match(/^\*\*\* (?:Update|Add|Delete) File: (.+)$/gm)
      for (const line of patch ?? []) out.add(line.replace(/^\*\*\* (?:Update|Add|Delete) File: /, '').trim())
    } else if (Array.isArray(v)) {
      for (const item of v) visit(item)
    } else if (v && typeof v === 'object') {
      for (const item of Object.values(v)) visit(item)
    }
  }
  visit(value)
  return [...out]
}

function parseArgs(value: unknown): unknown {
  if (typeof value !== 'string') return value
  try { return JSON.parse(value) } catch { return value }
}

function toolCallInfo(ev: any): { count: number; names: string[]; files: string[]; details: ToolCallDetail[] } {
  const p = payloadOf(ev)
  const names: string[] = []
  const files: string[] = []
  const details: ToolCallDetail[] = []
  if (p?.type === 'function_call' || p?.type === 'custom_tool_call') {
    const name = String(p.name ?? 'tool')
    const input = parseArgs(p.arguments ?? p.input ?? {})
    names.push(name)
    files.push(...findPaths(input))
    details.push({
      name,
      input_preview: typeof input === 'string' ? summarize(input, 600) : summarize(JSON.stringify(input), 600),
      file_path: findPaths(input)[0],
    })
    return { count: 1, names, files: Array.from(new Set(files)), details }
  }

  const source = p?.tool_calls ?? p?.message?.tool_calls ?? p?.tools ?? ev?.tool_calls ?? ev?.message?.tool_calls ?? ev?.tools ?? null
  const arr = Array.isArray(source) ? source : []
  for (const t of arr) {
    const name = t?.name ?? t?.function?.name ?? t?.tool_name ?? ''
    if (name) names.push(String(name))
    const args = t?.arguments ?? t?.input ?? t?.args ?? {}
    const parsed = parseArgs(args)
    const maybePath = parsed?.path ?? parsed?.file ?? parsed?.file_path ?? parsed?.target
    if (typeof maybePath === 'string') files.push(maybePath)
    files.push(...findPaths(parsed))
    details.push({
      name: String(name || 'tool'),
      input_preview: typeof parsed === 'string' ? summarize(parsed, 600) : summarize(JSON.stringify(parsed), 600),
      file_path: findPaths(parsed)[0] ?? (typeof maybePath === 'string' ? maybePath : undefined),
    })
  }
  return { count: names.length, names: names.slice(0, 6), files: Array.from(new Set(files)), details }
}

export class CodexHarness implements TraceHarness {
  name = 'codex'

  async findSessions(opts: FindOpts): Promise<SessionRef[]> {
    const root = join(homedir(), '.codex', 'sessions')
    const out: SessionRef[] = []
    for await (const path of walk(root)) {
      const s = await stat(path)
      if (opts.since && s.mtime < opts.since) continue
      if (opts.until && s.mtime > opts.until) continue
      const raw = await readFile(path, 'utf8')
      const events = parseJsonl(raw)
      if (!events.length) continue
      const filesTouched = new Set<string>()
      let first = ''
      let last = ''
      for (const e of events) {
        const ts = timestampOf(e)
        if (typeof ts === 'string') { if (!first) first = ts; last = ts }
        for (const f of toolCallInfo(e).files) filesTouched.add(f)
      }
      if (opts.filesTouched?.length) {
        const hit = opts.filesTouched.some((p) => [...filesTouched].some((q) => q.endsWith(p)))
        if (!hit) continue
      }
      out.push({
        id: path.split('/').pop()!.replace(/\.jsonl$/, ''),
        harness: this.name,
        path,
        started_at: first || undefined,
        ended_at: last || undefined,
        cwd: sessionCwd(events),
        files_touched: [...filesTouched],
      })
    }
    out.sort((a, b) => (b.started_at ?? '').localeCompare(a.started_at ?? ''))
    return opts.limit ? out.slice(0, opts.limit) : out
  }

  async extractTurns(ref: SessionRef, filter: Filter): Promise<Turn[]> {
    const raw = await readFile(ref.path, 'utf8')
    const events = parseJsonl(raw)
    const wanted = (filter.files ?? []).map((f) => f.replace(/^\.\//, ''))
    const turns: Turn[] = []

    for (const ev of events) {
      const role = roleOf(ev)
      if (!role) continue
      const ts = timestampOf(ev)
      if (role === 'user') {
        const text = textOf(ev)
        if (!text.trim()) continue
        turns.push({ role: 'user', text: summarize(text, 600), ts })
      } else if (role === 'assistant') {
        const text = textOf(ev)
        const tools = toolCallInfo(ev)
        if (wanted.length) {
          const hit = tools.files.some((t) => wanted.some((w) => t.endsWith(w)))
          if (!hit && tools.count > 0) continue
        }
        turns.push({
          role: 'assistant',
          text: text ? summarize(text, 8000) : undefined,
          text_summary: text ? summarize(text, 280) : undefined,
          tool_calls: tools.count || undefined,
          tool_names: tools.names.length ? tools.names : undefined,
          tool_call_details: tools.details.length ? tools.details : undefined,
          files_touched: tools.files.length ? Array.from(new Set(tools.files)) : undefined,
          ts,
        })
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
        const p = payloadOf(e)
        const m = p?.model ?? p?.message?.model ?? p?.metadata?.model ?? p?.payload?.model ?? e?.model ?? e?.message?.model ?? e?.metadata?.model
        if (typeof m === 'string') return m
      }
    } catch {
      /* ignore */
    }
    return null
  }
}

export default CodexHarness
