#!/usr/bin/env node
/**
 * blog-loop — lowest-friction lifecycle commands for traced blog work.
 *
 * Usage:
 *   pnpm blog research <post> [--harness=codex|claude-code]
 *   pnpm blog write <post> [--harness=codex|claude-code] [--role=draft|rewrite|polish|outline|review|publish] [--marker=<token>]
 *   pnpm blog finish <post> --research --harness=codex --note="source scan"
 *   pnpm blog finish <post> --write --harness=codex --marker=<token> --note="drafted section"
 */
import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = resolve(fileURLToPath(new URL('..', import.meta.url)))
const POSTS_DIR = join(REPO, 'src', 'content', 'posts')

function parse(argv) {
  const [cmd, ...rest] = argv
  const flags = {}
  const pos = []
  for (const a of rest) {
    if (a.startsWith('--')) {
      const eq = a.indexOf('=')
      if (eq > -1) flags[a.slice(2, eq)] = a.slice(eq + 1)
      else flags[a.slice(2)] = true
    } else {
      pos.push(a)
    }
  }
  return { cmd, post: pos.join(' ').trim(), flags }
}

function field(fm, name) {
  const m = fm.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))
  if (!m) return null
  return m[1].trim().replace(/^['"]|['"]$/g, '').replace(/''/g, "'")
}

async function posts() {
  const files = (await readdir(POSTS_DIR)).filter((f) => f.endsWith('.mdx')).sort()
  const out = []
  for (const file of files) {
    const path = join(POSTS_DIR, file)
    const raw = await readFile(path, 'utf8')
    const m = raw.match(/^---\n([\s\S]*?)\n---\n/)
    if (!m) continue
    out.push({
      slug: file.replace(/\.mdx$/, ''),
      title: field(m[1], 'title') ?? file.replace(/\.mdx$/, ''),
      draft: field(m[1], 'draft') !== 'false',
      original: field(m[1], 'original') === 'true',
    })
  }
  return out
}

function resolvePost(all, query) {
  if (!query) return null
  const q = query.toLowerCase()
  const exact = all.find((p) => p.slug === q)
  if (exact) return exact
  const hits = all.filter((p) => p.slug.includes(q) || p.title.toLowerCase().includes(q))
  if (hits.length === 1) return hits[0]
  if (hits.length > 1) return { ambiguous: hits }
  return null
}

function defaultMarker(post, role) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `BLOGTRACE-${post.slug}-${role}-${stamp}`
}

function shellEscapeDoubleQuoted(value) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\$/g, '\\$').replace(/`/g, '\\`')
}

function printPrompt(mode, post, harness, role, marker) {
  const finish = mode === 'research'
    ? `pnpm blog finish ${post.slug} --research --harness=${harness} --note="<what this research covered>"`
    : `pnpm blog finish ${post.slug} --write --harness=${harness} --role=${role} --note="<what changed>"${marker ? ` --marker="${marker}"` : ''}`

  const prompt = mode === 'research'
    ? [
        `This is supporting research for the blog post "${post.title}" (${post.slug}).`,
        'Do not edit the post. Do not write prose for publication. Do not append to revisions[].',
        'Mine dated sources, claims, open questions, counterarguments, and useful Q/A. Prefer primary sources for technical claims and record source dates when claims are temporal.',
        `At the end, run: ${finish}`,
      ].join('\n\n')
    : [
        `This is authorship work for the blog post "${post.title}" (${post.slug}).`,
        `Trace marker: ${marker}`,
        `Start your first visible assistant update with exactly: TRACE_MARKER ${marker}`,
        `Include exactly this marker in the final response before finishing: TRACE_MARKER ${marker}`,
        `Before editing, read AGENTS.md, VOICE.md, and SECONDARY_VOICE.md. Treat VOICE.md as the primary author voice and SECONDARY_VOICE.md as a rigor layer, not an imitation target.`,
        `You may edit src/content/posts/${post.slug}.mdx unless it has original: true. If original: true, stop. Preserve frontmatter provenance fields except for the revision entry created by the finish command.`,
        'Voice target: start from Drew\'s concrete agent-work pressure, then climb into the formal object. Keep the math, source trail, and technical vocabulary. Remove research-wiki cadence, repeated scaffold headings, note-to-self prose, generic writing advice, ornamental math, and process labels.',
        'Hard prose rules: no em dashes in new prose, no placeholders, no "first post", no "reader hook", no "target audience", no repeated "not X, it is Y" cadence unless the contrast is doing real work.',
        'For rewrite or polish roles, do not only synonym-swap. Change the entry vector, add falsification pressure, preserve dated claims, and make the post answer what a builder can decide next.',
        'Before finishing, run an anti-pattern scan and `pnpm build`. If either fails, fix the issue before trace capture.',
        `At the end, run: ${finish}`,
      ].join('\n\n')

  const markerLine = marker
    ? `\n\nTrace boundary: the finish command must include --marker="${marker}". Do not run an unmarked write finish for this authorship pass.`
    : ''

  if (marker) {
    const shellToken = shellEscapeDoubleQuoted(marker)
    const shellNote = shellEscapeDoubleQuoted(`session ${role} marker`)
    const directive = [
      `BLOG_TRACE_POSTS=${post.slug}`,
      `BLOG_TRACE_HARNESS=${harness}`,
      `BLOG_TRACE_ROLE=${role}`,
      `BLOG_TRACE_MARKER="${shellToken}"`,
      'BLOG_TRACE_KIND=post',
      `BLOG_TRACE_NOTE="${shellNote}"`,
    ].join(' ')
    const directiveLine = `\nHook directive for commit-based capture: ${directive}`
    console.log(prompt + markerLine + directiveLine)
    return
  }

  console.log(prompt + markerLine)
}

function run(args) {
  const res = spawnSync(args[0], args.slice(1), { cwd: REPO, stdio: 'inherit' })
  if (res.status !== 0) process.exit(res.status ?? 1)
}

async function main() {
  const { cmd, post: query, flags } = parse(process.argv.slice(2))
  const all = await posts()

  if (!cmd || cmd === 'list') {
    for (const p of all) console.log(`${p.slug.padEnd(36)} ${p.draft ? 'draft' : 'live'} ${p.original ? 'original' : 'ai'}  ${p.title}`)
    return
  }

  const post = resolvePost(all, query)
  if (!post) {
    console.error('usage: pnpm blog research|write|finish <post> [--harness=codex|claude-code] [--note="..."]')
    process.exit(2)
  }
  if (post.ambiguous) {
    console.error('ambiguous post. Matches:')
    for (const p of post.ambiguous) console.error(`  ${p.slug} — ${p.title}`)
    process.exit(2)
  }

  const harness = flags.harness || 'codex'
  const role = flags.role || (cmd === 'write' ? 'draft' : 'research')

  if (cmd === 'research' || cmd === 'write') {
    const marker = cmd === 'write' ? (flags.marker || defaultMarker(post, role)) : flags.marker
    printPrompt(cmd, post, harness, role, marker)
    return
  }

  if (cmd !== 'finish') {
    console.error(`unknown command: ${cmd}`)
    process.exit(2)
  }
  if (!flags.note) {
    console.error('--note="<what happened>" is required')
    process.exit(2)
  }
  if (!existsSync(join(REPO, 'tools', 'trace-capture.ts'))) {
    console.error('tools/trace-capture.ts missing')
    process.exit(1)
  }

  if (flags.research) {
    run([
      'pnpm', 'tsx', 'tools/trace-capture.ts', 'capture',
      `--post=${post.slug}`,
      `--harness=${harness}`,
      '--latest',
      '--role=research',
      '--kind=supporting-research',
      '--attach=supporting',
      `--note=${flags.note}`,
    ])
    return
  }

  if (flags.write) {
    if (post.original) {
      console.error(`${post.slug} is original: true. AI authorship work is forbidden by CLAUDE.md/AGENTS.md.`)
      process.exit(1)
    }
    if (!flags.marker && !flags.session && !flags['allow-unmarked']) {
      console.error('finish --write requires --marker from `pnpm blog write`, --session=<id>, or --allow-unmarked for an audited recovery capture')
      process.exit(2)
    }
    run([
      'pnpm', 'tsx', 'tools/trace-capture.ts', 'capture',
      `--post=${post.slug}`,
      `--harness=${harness}`,
      `--role=${role}`,
      '--kind=post',
      '--attach=revision',
      flags.marker ? `--marker=${flags.marker}` : '',
      flags.session ? `--session=${flags.session}` : '',
      `--note=${flags.note}`,
    ].filter(Boolean))
    return
  }

  console.error('finish requires --research or --write')
  process.exit(2)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
