/**
 * Manual harness — read a JSONL or plain-text transcript from a file or stdin.
 *
 * Useful when a revision comes from a harness we don't have an adapter for
 * (web Claude, API SDK, another CLI). Supply the turns directly.
 *
 * Accepted formats (auto-detected):
 *   1) JSONL with {role, text|content, ts?} per line
 *   2) Markdown with **User:** / **Assistant:** headers
 *   3) JSON array of {role, text} objects
 */

import { readFile } from 'node:fs/promises'
import type { FindOpts, Filter, SessionRef, Turn, TraceHarness } from './types.js'
import { summarize } from './types.js'

function parseMarkdownTranscript(raw: string): Turn[] {
  const turns: Turn[] = []
  const blocks = raw.split(/\n(?=\*\*(?:User|Assistant|System)(?:\s*\([^)]+\))?:\*\*)/i)
  let seq = 0
  for (const block of blocks) {
    const m = block.match(/^\*\*(User|Assistant|System)(?:\s*\(([^)]+)\))?:\*\*\s*([\s\S]*)$/i)
    if (!m) continue
    const role = m[1].toLowerCase() as Turn['role']
    const body = m[3].trim()
    if (!body) continue
    if (role === 'user') turns.push({ role: 'user', seq, text: summarize(body, 600), ts: '' })
    else if (role === 'assistant')
      turns.push({ role: 'assistant', seq, text_summary: summarize(body, 280), text: body.length < 600 ? body : undefined, ts: '' })
    seq++
  }
  return turns
}

function parseTurns(raw: string): Turn[] {
  const trimmed = raw.trim()
  if (!trimmed) return []
  if (trimmed.startsWith('[')) {
    try {
      const arr = JSON.parse(trimmed)
      return arr
        .filter((t: any) => t?.role && (t.text || t.content))
        .map((t: any, index: number) => ({
          role: t.role,
          seq: index,
          text: summarize(String(t.text ?? t.content), 600),
          ts: String(t.ts ?? ''),
        }))
    } catch {
      /* fall through */
    }
  }
  if (trimmed.includes('\n{') || trimmed.startsWith('{')) {
    const out: Turn[] = []
    let seq = 0
    for (const line of trimmed.split('\n')) {
      const s = line.trim()
      if (!s) continue
      try {
        const ev = JSON.parse(s)
        if (!ev.role) continue
        if (ev.role === 'user' || ev.role === 'system') {
          out.push({ role: ev.role, seq, text: summarize(String(ev.text ?? ev.content ?? ''), 600), ts: String(ev.ts ?? '') })
          seq++
        } else if (ev.role === 'assistant') {
          out.push({
            role: 'assistant',
            seq,
            text_summary: summarize(String(ev.text ?? ev.content ?? ''), 280),
            ts: String(ev.ts ?? ''),
          })
          seq++
        }
      } catch {
        /* skip malformed */
      }
    }
    if (out.length) return out
  }
  return parseMarkdownTranscript(raw)
}

function selectFromMarker(turns: Turn[], marker?: string): Turn[] {
  const token = (marker ?? '').trim()
  if (!token) return turns
  const start = turns.findIndex((turn) => turn.role === 'user' && (turn.text?.includes(token) || false))
  if (start < 0) return turns
  return turns.slice(Math.max(start - 1, 0))
}

export class ManualHarness implements TraceHarness {
  name = 'manual'

  private readonly input: string

  constructor(input?: string) {
    this.input = input ?? ''
  }

  static async fromFile(path: string): Promise<ManualHarness> {
    const raw = await readFile(path, 'utf8')
    return new ManualHarness(raw)
  }

  async findSessions(_opts: FindOpts): Promise<SessionRef[]> {
    if (!this.input) return []
    return [
      {
        id: `manual-${new Date().toISOString().replace(/[:.]/g, '-')}`,
        harness: this.name,
        path: '(stdin)',
      },
    ]
  }

  async extractTurns(_ref: SessionRef, filter: Filter): Promise<Turn[]> {
    const turns = parseTurns(this.input)
    return selectFromMarker(turns, filter.marker)
  }

  async detectModel(_ref: SessionRef): Promise<string | null> {
    const m = this.input.match(/model[:=]\s*['"]?([\w\-\.]+)['"]?/i)
    return m?.[1] ?? null
  }
}

export default ManualHarness
