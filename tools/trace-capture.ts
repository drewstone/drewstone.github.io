#!/usr/bin/env node
/**
 * trace-capture — harness-agnostic session capture for blog revisions.
 *
 * Usage:
 *   pnpm tsx tools/trace-capture.ts capture \
 *     [--harness=claude-code|codex|manual] \
 *     [--post=<slug>] \
 *     [--role=draft|rewrite|polish|diagram|review] \
 *     [--session=<session-id>] \
 *     [--note=<one-line>] \
 *     [--commit=<sha>] \
 *     [--input=<path>]            # manual harness only
 *
 *   pnpm tsx tools/trace-capture.ts capture --auto
 *     # detects from the latest git commit: finds changed posts, matches a
 *     # recent session via ~/.claude/projects or ~/.codex/sessions, writes a
 *     # trace per changed post, appends to frontmatter.
 *
 *   pnpm tsx tools/trace-capture.ts list
 *     # list existing traces grouped by post.
 *
 *   pnpm tsx tools/trace-capture.ts show <trace_id>
 *     # dump a trace as JSON.
 */

import { execSync } from 'node:child_process'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import ClaudeCodeHarness from './harness/claude-code.js'
import CodexHarness from './harness/codex.js'
import ManualHarness from './harness/manual.js'
import type { TraceFile, TraceHarness, Turn } from './harness/types.js'

const ROOT = process.cwd()
const POSTS_DIR = join(ROOT, 'src/content/posts')
const TRACES_DIR = join(ROOT, 'traces')

type Args = Record<string, string | boolean>

function parseArgs(argv: string[]): { cmd: string; pos: string[]; flags: Args } {
  const [cmd, ...rest] = argv
  const flags: Args = {}
  const pos: string[] = []
  for (const a of rest) {
    if (a.startsWith('--')) {
      const eq = a.indexOf('=')
      if (eq >= 0) flags[a.slice(2, eq)] = a.slice(eq + 1)
      else flags[a.slice(2)] = true
    } else pos.push(a)
  }
  return { cmd: cmd ?? 'capture', pos, flags }
}

function git(cmd: string): string {
  try {
    return execSync(`git ${cmd}`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return ''
  }
}

function headCommit(): string | null {
  const sha = git('rev-parse HEAD')
  return sha || null
}

function changedPostsAtHead(): string[] {
  const out = git('show --no-renames --name-only --format="" HEAD')
  return out
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('src/content/posts/') && l.endsWith('.mdx'))
    .map((l) => l.replace('src/content/posts/', '').replace(/\.mdx$/, ''))
}

/** True iff the only change to this post in `commit` is additions to the
 *  frontmatter `revisions:` array (a phantom edit caused by the post-commit
 *  hook's prior write being dragged in by the next `git add -A`). */
function isPhantomEdit(commit: string, slug: string): boolean {
  const path = `src/content/posts/${slug}.mdx`
  const diff = git(`show --no-renames --format= ${commit} -- ${path}`)
  if (!diff) return false
  const lines = diff.split('\n').filter((l) => /^[+-]/.test(l) && !/^[+-]{3}/.test(l))
  if (!lines.length) return false
  return lines.every((l) => /^[+-]\s*-\s*\{\s*date:/.test(l))
}

function harnessByName(name: string, input?: string): TraceHarness {
  switch (name) {
    case 'claude-code': return new ClaudeCodeHarness()
    case 'codex': return new CodexHarness()
    case 'manual': return new ManualHarness(input)
    default: throw new Error(`unknown harness: ${name}`)
  }
}

async function autoDetectHarness(postSlug: string): Promise<TraceHarness | null> {
  const postPath = join('src/content/posts', `${postSlug}.mdx`)
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000) // last 24h
  for (const h of [new ClaudeCodeHarness(), new CodexHarness()] as TraceHarness[]) {
    const sessions = await h.findSessions({ since, cwd: ROOT, filesTouched: [postPath], limit: 1 })
    if (sessions.length) return h
  }
  return null
}

async function chooseSession(harness: TraceHarness, postSlug: string, sessionId?: string) {
  const postPath = join('src/content/posts', `${postSlug}.mdx`)
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000)
  const sessions = await harness.findSessions({
    since, cwd: ROOT, filesTouched: [postPath],
  })
  if (sessionId) {
    const match = sessions.find((s) => s.id === sessionId || s.id.startsWith(sessionId))
    if (!match) throw new Error(`session ${sessionId} not found in ${harness.name}`)
    return match
  }
  if (!sessions.length) throw new Error(`no ${harness.name} sessions touching ${postPath} in the last 48h`)
  return sessions[0] // most recent
}

function buildTraceId(startedAt: string | undefined, model: string | null): string {
  const stamp = (startedAt ?? new Date().toISOString()).replace(/[:.]/g, '-').replace(/Z$/, 'Z')
  const tag = (model ?? 'unknown').replace(/[^\w.\-]/g, '-')
  return `${stamp}-${tag}`
}

async function appendFrontmatterRevision(postSlug: string, entry: { date: string; model: string | null; note: string; commit?: string; trace_id: string }) {
  const path = join(POSTS_DIR, `${postSlug}.mdx`)
  const raw = await readFile(path, 'utf8')
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/)
  if (!m) throw new Error(`no frontmatter in ${postSlug}`)
  const fm = m[1]
  if (/^original:\s*true\s*$/m.test(fm)) {
    throw new Error(`${postSlug} is an original (human-authored) post — AI trace capture refused. See CLAUDE.md hard rule.`)
  }
  // Dedup: skip if a revision with this commit OR trace_id already exists.
  if (entry.commit && new RegExp(`commit:\\s*['"]${entry.commit}['"]`).test(fm)) {
    console.log(`[${postSlug}] revision for ${entry.commit.slice(0, 7)} already logged — skip`)
    return
  }
  if (new RegExp(`trace_id:\\s*['"]${entry.trace_id}['"]`).test(fm)) {
    console.log(`[${postSlug}] trace ${entry.trace_id} already logged — skip`)
    return
  }
  const model = entry.model ?? 'unknown'
  const line = `  - { date: ${entry.date}, model: '${model}', note: '${entry.note.replace(/'/g, "''")}'${entry.commit ? `, commit: '${entry.commit}'` : ''}, trace_id: '${entry.trace_id}' }`
  let newFm: string
  if (/^revisions:[ \t]*\n/m.test(fm)) {
    // Anchor only on the `revisions:\n` line itself (do not consume the
    // existing item's leading indent).
    newFm = fm.replace(/^revisions:[ \t]*\n/m, `revisions:\n${line}\n`)
  } else {
    newFm = fm + `\nrevisions:\n${line}\n`
  }
  const out = `---\n${newFm}\n---\n` + raw.slice(m[0].length)
  await writeFile(path, out, 'utf8')
}

async function saveTrace(trace: TraceFile) {
  const dir = join(TRACES_DIR, trace.post)
  await mkdir(dir, { recursive: true })
  const path = join(dir, `${trace.trace_id}.json`)
  await writeFile(path, JSON.stringify(trace, null, 2), 'utf8')
  return path
}

async function capture(flags: Args): Promise<void> {
  const role = (flags.role as string) ?? 'polish'
  const sessionId = flags.session as string | undefined
  const noteArg = flags.note as string | undefined
  const commit = (flags.commit as string) ?? headCommit() ?? undefined

  const posts: string[] = flags.post
    ? [flags.post as string]
    : flags.auto ? changedPostsAtHead() : []

  if (!posts.length) {
    console.error('no post specified — pass --post=<slug> or --auto')
    process.exit(2)
  }

  for (const postSlug of posts) {
    if (commit && commit !== 'HEAD' && isPhantomEdit(commit, postSlug)) {
      console.log(`[${postSlug}] phantom edit (revisions-only) — skip`)
      continue
    }
    const harnessName = (flags.harness as string) ?? (await autoDetectHarness(postSlug))?.name
    if (!harnessName) {
      console.error(`[${postSlug}] no harness detected — skip`)
      continue
    }
    let input: string | undefined
    if (harnessName === 'manual' && flags.input) input = await readFile(flags.input as string, 'utf8')
    const harness = harnessByName(harnessName, input)

    let session
    try {
      session = await chooseSession(harness, postSlug, sessionId)
    } catch (e) {
      console.error(`[${postSlug}] ${(e as Error).message}`)
      continue
    }

    const turns = await harness.extractTurns(session, {
      files: [`${postSlug}.mdx`],
      maxTurns: 40,
    })
    if (!turns.length) {
      console.error(`[${postSlug}] no turns extracted — skip`)
      continue
    }
    const model = await harness.detectModel(session)
    // Use the first captured turn's timestamp (the moment this post's thread
    // began inside the session) rather than the session's overall start. A
    // long session touching many posts produces one trace per post, each with
    // a distinct timestamp derived from when work on that post actually began.
    const firstTurnTs = turns.find((t) => t.ts)?.ts
    const started_at = firstTurnTs || session.started_at || new Date().toISOString()
    const lastTurnTs = [...turns].reverse().find((t) => t.ts)?.ts
    const ended_at = lastTurnTs || session.ended_at
    const trace_id = buildTraceId(started_at, model)

    const summary = noteArg ?? (() => {
      // Use the first user prompt in a window that actually touched this post.
      // Fallback to the first user prompt in the extracted turns.
      const mentioning = turns.find((t) =>
        t.role === 'user' && t.text && (t.text.includes(postSlug) || t.text.includes('.mdx'))
      )
      const firstUser = (mentioning ?? turns.find((t) => t.role === 'user'))?.text ?? ''
      const asst = turns.filter((t) => t.role === 'assistant').length
      const toolTotal = turns.reduce((s, t) => s + (t.tool_calls ?? 0), 0)
      const gist = firstUser ? firstUser.replace(/\s+/g, ' ').slice(0, 140).trim() : 'captured session'
      return `${gist} · ${asst} asst turns · ${toolTotal} tool calls`
    })()

    // Compute files_touched from actual captured turns (not the whole session)
    const projectRoot = process.cwd().replace(/\/$/, '') + '/'
    const seen = new Set<string>()
    for (const t of turns) {
      for (const f of t.files_touched ?? []) {
        const rel = f.startsWith(projectRoot) ? f.slice(projectRoot.length) : f
        seen.add(rel)
      }
    }
    if (!seen.size) seen.add(`src/content/posts/${postSlug}.mdx`)

    // Pull commit subject + body and per-file diffstat when commit is real.
    let commit_subject: string | undefined
    let commit_message: string | undefined
    let diffstat: { path: string; additions: number; deletions: number }[] | undefined
    if (commit && commit !== 'HEAD') {
      try {
        commit_subject = execSync(`git log -1 --format=%s ${commit}`, { stdio: ['ignore', 'pipe', 'ignore'] })
          .toString().trim() || undefined
      } catch {}
      try {
        commit_message = execSync(`git log -1 --format=%B ${commit}`, { stdio: ['ignore', 'pipe', 'ignore'] })
          .toString().trim() || undefined
      } catch {}
      try {
        const out = execSync(`git show --no-renames --numstat --format='' ${commit}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString()
        const stats = out.split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
          const [a, d, p] = line.split('\t')
          return { path: p, additions: Number(a) || 0, deletions: Number(d) || 0 }
        }).filter((x) => x.path)
        if (stats.length) diffstat = stats
      } catch {}
    }

    const trace: TraceFile = {
      trace_id,
      harness: harness.name,
      model,
      started_at,
      ended_at,
      post: postSlug,
      role: role as TraceFile['role'],
      commit,
      commit_subject,
      commit_message,
      files_touched: [...seen],
      diffstat,
      summary,
      turns,
    }

    const path = await saveTrace(trace)
    console.log(`wrote ${path} (${turns.length} turns, ${trace.files_touched.length} files)`)

    await appendFrontmatterRevision(postSlug, {
      date: started_at.slice(0, 10),
      model,
      note: summary,
      commit,
      trace_id,
    })
    console.log(`appended revision entry to src/content/posts/${postSlug}.mdx`)
  }
}

async function list(): Promise<void> {
  let dirs: string[]
  try { dirs = await readdir(TRACES_DIR) } catch { dirs = [] }
  if (!dirs.length) {
    console.log('(no traces yet)')
    return
  }
  for (const post of dirs.sort()) {
    console.log(`\n${post}`)
    const files = (await readdir(join(TRACES_DIR, post))).filter((f) => f.endsWith('.json')).sort()
    for (const f of files) {
      const raw = await readFile(join(TRACES_DIR, post, f), 'utf8')
      try {
        const t: TraceFile = JSON.parse(raw)
        console.log(`  ${t.trace_id}  ${t.role.padEnd(8)} ${t.model ?? '?'}  ${t.turns.length} turns`)
      } catch {
        console.log(`  ${f}  (unreadable)`)
      }
    }
  }
}

async function show(id: string): Promise<void> {
  let dirs: string[]
  try { dirs = await readdir(TRACES_DIR) } catch { dirs = [] }
  for (const d of dirs) {
    const files = await readdir(join(TRACES_DIR, d))
    const hit = files.find((f) => f.replace(/\.json$/, '') === id || f.startsWith(id))
    if (hit) {
      const raw = await readFile(join(TRACES_DIR, d, hit), 'utf8')
      console.log(raw)
      return
    }
  }
  console.error(`no trace with id ${id}`)
  process.exit(1)
}

async function main() {
  const { cmd, pos, flags } = parseArgs(process.argv.slice(2))
  if (cmd === 'capture') await capture(flags)
  else if (cmd === 'list') await list()
  else if (cmd === 'show') {
    const id = pos[0] ?? (flags.id as string)
    if (!id) { console.error('show requires a trace id'); process.exit(2) }
    await show(id)
  } else {
    console.error(`unknown command: ${cmd}`)
    process.exit(2)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
