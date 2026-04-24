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
import type { FindOpts, Filter, SessionRef, Turn, TraceHarness } from './types.js'
import { summarize } from './types.js'

const EDIT_KEYWORDS = ['edit', 'write', 'patch', 'apply', 'modify']

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

function roleOf(ev: any): Turn['role'] | null {
  const r = ev?.role ?? ev?.message?.role ?? ev?.type
  if (r === 'user' || r === 'assistant' || r === 'system' || r === 'tool') return r
  if (typeof r === 'string' && r.includes('user')) return 'user'
  if (typeof r === 'string' && (r.includes('assistant') || r.includes('agent'))) return 'assistant'
  return null
}

function toolCallInfo(ev: any): { count: number; names: string[]; files: string[] } {
  const names: string[] = []
  const files: string[] = []
  const source = ev?.tool_calls ?? ev?.message?.tool_calls ?? ev?.tools ?? null
  const arr = Array.isArray(source) ? source : []
  for (const t of arr) {
    const name = t?.name ?? t?.function?.name ?? t?.tool_name ?? ''
    if (name) names.push(String(name))
    const args = t?.arguments ?? t?.input ?? t?.args ?? {}
    const maybePath = args?.path ?? args?.file ?? args?.file_path ?? args?.target
    if (typeof maybePath === 'string') files.push(maybePath)
    // Heuristic: look for any string arg that looks like a path
    if (typeof args === 'object' && args) {
      for (const v of Object.values(args)) {
        if (typeof v === 'string' && /[/\\][\w.\-]+\.(mdx|ts|tsx|js|jsx|astro|py|rs|go|sh|yaml|toml|md|json)$/.test(v)) {
          files.push(v)
        }
      }
    }
  }
  return { count: names.length, names: names.slice(0, 6), files }
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
        const ts = e?.timestamp ?? e?.ts ?? e?.created_at
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
      const ts = String(ev?.timestamp ?? ev?.ts ?? ev?.created_at ?? '')
      if (role === 'user') {
        const text = extractText(ev.content ?? ev.message?.content ?? ev.text ?? '')
        if (!text.trim()) continue
        turns.push({ role: 'user', text: summarize(text, 600), ts })
      } else if (role === 'assistant') {
        const text = extractText(ev.content ?? ev.message?.content ?? ev.text ?? '')
        const tools = toolCallInfo(ev)
        if (wanted.length) {
          const hit = tools.files.some((t) => wanted.some((w) => t.endsWith(w)))
          if (!hit && tools.count === 0) continue // keep only assistant turns with relevant tool calls
        }
        turns.push({
          role: 'assistant',
          text_summary: text ? summarize(text, 280) : undefined,
          tool_calls: tools.count || undefined,
          tool_names: tools.names.length ? tools.names : undefined,
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
        const m = e?.model ?? e?.message?.model ?? e?.metadata?.model
        if (typeof m === 'string') return m
      }
    } catch {
      /* ignore */
    }
    return null
  }
}

export default CodexHarness
