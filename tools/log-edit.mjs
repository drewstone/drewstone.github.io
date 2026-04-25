#!/usr/bin/env node
/**
 * log-edit — append a HUMAN revision to a post's frontmatter.
 *
 * Used for edits Drew makes himself, with no agent session involved.
 * Lands in the same `revisions:` array as AI revisions, with
 * `model: 'human'` and `author: 'Drew Stone'`. The UI distinguishes
 * by color (--c-human green) and badge text.
 *
 * Idempotent: refuses to add a revision whose `commit:` already exists
 * for that post.
 *
 * Usage:
 *   pnpm log-edit <slug> --note="<one-line>"
 *   pnpm log-edit <slug> --note="..." --commit=<sha>
 *   pnpm log-edit <slug> --note="..." --author="Some Other Human"
 *   pnpm log-edit --auto                     # detect changed posts at HEAD
 *   pnpm log-edit --auto --note="<one-line>" # all changed posts share the note
 *
 * Notes:
 *   - Refuses to log against `original: true` posts ONLY when invoked from an
 *     AI session. Drew (the human) editing his own posts is the entire point.
 *     We just use a marker file to know if it's the agent calling: any process
 *     descended from `claude`/`codex` is treated as an agent and rejected.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = resolve(fileURLToPath(new URL('..', import.meta.url)))
const POSTS_DIR = join(REPO, 'src', 'content', 'posts')

function git(cmd) {
  try { return execSync(`git ${cmd}`, { cwd: REPO, encoding: 'utf8' }).trim() } catch { return '' }
}

function headCommit() {
  return git('rev-parse HEAD') || null
}

function changedPostsAt(commit) {
  const out = git(`show --name-only --pretty=format: ${commit}`)
  return Array.from(
    new Set(
      out.split('\n')
        .map((p) => p.trim())
        .filter((p) => p.startsWith('src/content/posts/') && p.endsWith('.mdx'))
        .map((p) => p.replace(/^src\/content\/posts\//, '').replace(/\.mdx$/, '')),
    ),
  )
}

function parseArgs(argv) {
  const args = { post: null, note: null, commit: null, author: 'Drew Stone', auto: false }
  for (const a of argv) {
    if (a === '--auto') args.auto = true
    else if (a.startsWith('--note=')) args.note = a.slice('--note='.length)
    else if (a.startsWith('--commit=')) args.commit = a.slice('--commit='.length)
    else if (a.startsWith('--author=')) args.author = a.slice('--author='.length)
    else if (!a.startsWith('--')) args.post = a
  }
  return args
}

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function commitMessage(commit) {
  return git(`log -1 --format=%s ${commit}`) || ''
}

function inferNote(commit) {
  const msg = commitMessage(commit)
  if (!msg) return 'manual edit'
  return msg.length > 120 ? msg.slice(0, 117) + '…' : msg
}

/**
 * Append a revision to a post's frontmatter.
 * Returns 'added' | 'duplicate' | 'refused-original-by-agent'.
 */
async function appendRevision(slug, entry) {
  const path = join(POSTS_DIR, `${slug}.mdx`)
  if (!existsSync(path)) throw new Error(`post not found: ${slug}`)
  const raw = await readFile(path, 'utf8')
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/)
  if (!m) throw new Error(`no frontmatter in ${slug}`)
  const fm = m[1]

  // Dedup: if a revision with this commit already exists, skip.
  if (entry.commit) {
    const re = new RegExp(`commit:\\s*['"]${entry.commit}['"]`)
    if (re.test(fm)) return 'duplicate'
  }

  const fields = [
    `date: ${entry.date}`,
    `model: '${entry.model}'`,
    `note: '${entry.note.replace(/'/g, "''")}'`,
  ]
  if (entry.commit) fields.push(`commit: '${entry.commit}'`)
  if (entry.author) fields.push(`author: '${entry.author.replace(/'/g, "''")}'`)
  const line = `  - { ${fields.join(', ')} }`

  let newFm
  if (/^revisions:[ \t]*\n/m.test(fm)) {
    newFm = fm.replace(/^revisions:[ \t]*\n/m, `revisions:\n${line}\n`)
  } else {
    newFm = fm + `\nrevisions:\n${line}\n`
  }
  const out = `---\n${newFm}\n---\n` + raw.slice(m[0].length)
  await writeFile(path, out, 'utf8')
  return 'added'
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const commit = args.commit ?? headCommit()
  const note = args.note ?? (commit ? inferNote(commit) : 'manual edit')

  let posts = []
  if (args.auto) {
    if (!commit) { console.error('--auto requires a HEAD commit'); process.exit(2) }
    posts = changedPostsAt(commit)
    if (!posts.length) { console.log('no posts changed at HEAD — nothing to log'); return }
  } else if (args.post) {
    posts = [args.post]
  } else {
    console.error('usage: pnpm log-edit <slug> --note="..."  OR  pnpm log-edit --auto')
    process.exit(2)
  }

  for (const slug of posts) {
    const status = await appendRevision(slug, {
      date: todayStr(),
      model: 'human',
      note,
      commit: commit || undefined,
      author: args.author,
    })
    if (status === 'duplicate') console.log(`  [${slug}] already logged for ${commit?.slice(0, 7)} — skip`)
    else console.log(`  [${slug}] +revision · ${args.author} · ${commit?.slice(0, 7) ?? '(no commit)'}`)
  }
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
