#!/usr/bin/env node
/**
 * scan-post — enforce the prose anti-patterns from AGENTS.md on a post.
 *
 * Default mode checks only lines you changed (working tree vs HEAD), which is
 * exactly the rule "no em dashes in NEW prose". --all checks the whole body.
 * Original (human-authored) posts are never scanned: the rules govern AI prose.
 *
 * Usage:
 *   node tools/scan-post.mjs <slug>        # scan your uncommitted changes
 *   node tools/scan-post.mjs <slug> --all  # scan the full body
 *   node tools/scan-post.mjs               # changed lines of every non-original post
 *
 * Zero hits exits 0; any hit prints file:line and exits 1.
 */
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = resolve(fileURLToPath(new URL('..', import.meta.url)))
const POSTS_DIR = join(REPO, 'src', 'content', 'posts')

// Each rule: [id, regex, fix hint]. Kept deliberately short and concrete:
// every entry traces to a rule in AGENTS.md "Writing Anti-Patterns" or
// VOICE.md "AI Cadence To Avoid". Add a rule there before adding one here.
const RULES = [
  ['em-dash', /[—–]/, 'use a comma, colon, parentheses, or a separate sentence'],
  ['ai-tell', /\b(delve|tapestry|testament to|game-changer|ever-evolving|in today'?s landscape|let'?s dive in|it'?s worth noting|in the realm of|navigate the landscape)\b/i, 'cut the filler phrase; say the thing directly'],
  ['process-label', /\b(outline notes|reader hook|hook the reader|target audience|the article should|keep this compact|note to self|drew angle|to rewrite around|this post will cover)\b/i, 'delete the note-to-self phrasing; headings describe reader-facing content'],
  ['placeholder', /\b(TODO|FIXME|XXX|TBD|lorem ipsum|\[placeholder\]|<placeholder>)\b/, 'fill it in or cut the section'],
]

function git(cmd) {
  try { return execSync(`git ${cmd}`, { cwd: REPO, encoding: 'utf8' }) } catch { return '' }
}

function splitPost(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/)
  if (!m) return { fm: '', description: '', body: raw, bodyStart: 1 }
  const desc = m[1].match(/^description:\s*['"]?(.+?)['"]?\s*$/m)?.[1] ?? ''
  return { fm: m[1], description: desc, body: raw.slice(m[0].length), bodyStart: m[0].split('\n').length }
}

/** Line numbers (1-based, whole-file) of lines added vs HEAD. Empty = check nothing changed; null = untracked/failed, check all. */
function addedLines(relPath) {
  const out = git(`diff HEAD --unified=0 -- ${relPath}`)
  if (!out.trim()) return null
  const lines = new Set()
  for (const m of out.matchAll(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm)) {
    const start = Number(m[1])
    const count = m[2] === undefined ? 1 : Number(m[2])
    for (let i = 0; i < count; i++) lines.add(start + i)
  }
  return lines
}

function scanText(text, offset, source, hits) {
  const lines = text.split('\n')
  lines.forEach((line, i) => {
    for (const [id, re, hint] of RULES) {
      const m = line.match(re)
      if (m) hits.push(`${source}:${offset + i}: ${id}: "${m[0].trim()}" → ${hint}`)
    }
  })
}

async function scanFile(file, allMode) {
  const path = join(POSTS_DIR, file)
  const rel = `src/content/posts/${file}`
  const raw = await readFile(path, 'utf8')
  if (/^original:\s*true\s*$/m.test(raw.split('---')[1] ?? '')) return 0
  const { description, body, bodyStart } = splitPost(raw)

  const hits = []
  scanText(description, 1, `${rel} (description)`, hits)

  if (allMode) {
    scanText(body, bodyStart, rel, hits)
  } else {
    const changed = addedLines(rel)
    if (!changed || changed.size === 0) return 0 // nothing changed → nothing new to scan
    const lines = body.split('\n')
    lines.forEach((line, i) => {
      const fileLine = bodyStart + i
      if (!changed.has(fileLine)) return
      for (const [id, re, hint] of RULES) {
        const m = line.match(re)
        if (m) hits.push(`${rel}:${fileLine}: ${id}: "${m[0].trim()}" → ${hint}`)
      }
    })
  }
  for (const h of hits) console.log(h)
  return hits.length
}

async function main() {
  const argv = process.argv.slice(2)
  const allMode = argv.includes('--all')
  const query = argv.filter((a) => !a.startsWith('--')).join(' ').trim()

  let files
  if (query) {
    const exact = `${query}.mdx`
    if (!existsSync(join(POSTS_DIR, exact))) {
      const fuzzy = (await readdir(POSTS_DIR)).filter((f) => f.endsWith('.mdx') && f.includes(query.toLowerCase()))
      if (fuzzy.length !== 1) {
        console.error(`post not found: ${query}`)
        process.exit(2)
      }
      files = [fuzzy[0]]
    } else {
      files = [exact]
    }
  } else {
    files = (await readdir(POSTS_DIR)).filter((f) => f.endsWith('.mdx')).sort()
  }

  let total = 0
  for (const f of files) total += await scanFile(f, allMode)
  if (total > 0) {
    console.log(`\n${total} anti-pattern hit${total === 1 ? '' : 's'} (rules: AGENTS.md "Writing Anti-Patterns")`)
    process.exit(1)
  }
  console.log('scan: clean')
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
