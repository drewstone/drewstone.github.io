#!/usr/bin/env node
/**
 * scan-post — enforce the prose anti-patterns from AGENTS.md on a post.
 *
 * Default mode checks only lines you changed (working tree vs HEAD), which is
 * exactly the rule "no em dashes in NEW prose"; a post Git does not track yet is
 * all new prose and is checked in full. --all checks the whole body.
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
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { listContentFiles, locatePost } from './content-paths.mjs'

const REPO = resolve(fileURLToPath(new URL('..', import.meta.url)))

// Each rule: [id, regex, fix hint]. Kept deliberately short and concrete:
// every entry traces to a rule in AGENTS.md "Writing Anti-Patterns" or
// VOICE.md "AI Cadence To Avoid". Add a rule there before adding one here.
const RULES = [
  ['em-dash', /[—–]/, 'use a comma, colon, parentheses, or a separate sentence'],
  ['ai-tell', /\b(delve|tapestry|testament to|game-changer|ever-evolving|in today'?s landscape|let'?s dive in|it'?s worth noting|in the realm of|navigate the landscape)\b/i, 'cut the filler phrase; say the thing directly'],
  ['process-label', /\b(outline notes|reader hook|hook the reader|target audience|the article should|keep this compact|note to self|drew angle|to rewrite around|this post will cover)\b/i, 'delete the note-to-self phrasing; headings describe reader-facing content'],
  ['placeholder', /\b(TODO|FIXME|XXX|TBD|lorem ipsum|\[placeholder\]|<placeholder>)\b/, 'fill it in or cut the section'],
  ['scaffold', /\b(will be (expanded|added|filled in|covered|written|updated) (later|soon|in a (later|future) (post|section|update))|to be (expanded|added|written|filled in) later|coming soon|more on this later)\b/i, 'finish the thought or cut the section'],
]

function git(cmd) {
  try { return execSync(`git ${cmd}`, { cwd: REPO, encoding: 'utf8' }) } catch { return '' }
}

function splitPost(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/)
  if (!m) return { fm: '', description: '', descriptionLine: 0, body: raw, bodyStart: 1 }
  const desc = m[1].match(/^description:\s*['"]?(.+?)['"]?\s*$/m)?.[1] ?? ''
  // Frontmatter starts on file line 2, after the opening ---.
  const descriptionLine = 2 + m[1].split('\n').findIndex((l) => l.startsWith('description:'))
  return { fm: m[1], description: desc, descriptionLine, body: raw.slice(m[0].length), bodyStart: m[0].split('\n').length }
}

/** Line numbers (1-based, whole-file) of lines added vs HEAD, or 'all' for a post Git does not track yet (a new draft is all new prose). */
function addedLines(relPath) {
  if (!git(`ls-files -- ${relPath}`).trim()) return 'all'
  const out = git(`diff HEAD --unified=0 -- ${relPath}`)
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

async function scanFile(entry, allMode) {
  const rel = entry.rel
  const raw = await readFile(entry.abs, 'utf8')
  if (/^original:\s*true\s*$/m.test(raw.split('---')[1] ?? '')) return 0
  const { description, descriptionLine, body, bodyStart } = splitPost(raw)

  const hits = []
  const changed = allMode ? 'all' : addedLines(rel)
  // The description is new prose only when its frontmatter line changed; legacy descriptions do not block body edits.
  if (changed === 'all' || changed.has(descriptionLine)) scanText(description, 1, `${rel} (description)`, hits)

  if (changed === 'all') {
    scanText(body, bodyStart, rel, hits)
  } else if (changed.size > 0) {
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
    const exact = locatePost(REPO, query)
    if (exact) {
      files = [exact]
    } else {
      const needle = query.toLowerCase()
      const fuzzy = listContentFiles(REPO).filter((f) => f.slug.includes(needle) || f.file.includes(needle))
      if (fuzzy.length !== 1) {
        console.error(`post not found: ${query}`)
        process.exit(2)
      }
      files = fuzzy
    }
  } else {
    files = listContentFiles(REPO)
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
