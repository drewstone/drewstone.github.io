#!/usr/bin/env node
/**
 * edit-post — open a post for human editing, then optionally commit it.
 *
 * Usage:
 *   pnpm edit <slug-or-title>
 *   pnpm edit <slug-or-title> --done
 *   pnpm edit <slug-or-title> --publish
 *   pnpm edit <slug-or-title> --commit --note="tighten intro"
 *   pnpm edit --list
 *
 * The post-commit hook records the human revision in green. Run
 * `pnpm install:hooks` once if commits are not creating revision entries.
 */
import { existsSync } from 'node:fs'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { spawn, spawnSync } from 'node:child_process'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = resolve(fileURLToPath(new URL('..', import.meta.url)))
const POSTS_DIR = join(REPO, 'src', 'content', 'posts')

function parse(argv) {
  const args = { query: null, list: false, open: true, done: false, publish: false, commit: false, note: null }
  const pos = []
  for (const a of argv) {
    if (a === '--list') args.list = true
    else if (a === '--no-open') args.open = false
    else if (a === '--done') args.done = true
    else if (a === '--publish') args.publish = true
    else if (a === '--commit') args.commit = true
    else if (a.startsWith('--note=')) args.note = a.slice('--note='.length)
    else if (!a.startsWith('--')) pos.push(a)
  }
  args.query = pos.join(' ').trim() || null
  return args
}

function git(args, opts = {}) {
  return spawnSync('git', args, { cwd: REPO, encoding: 'utf8', stdio: opts.stdio ?? 'pipe' })
}

function yamlString(s) {
  return `'${s.replace(/'/g, "''")}'`
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/)
  if (!m) return null
  return { raw: m[1], bodyStart: m[0].length }
}

function field(fm, name) {
  const m = fm.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))
  if (!m) return null
  return m[1].trim().replace(/^['"]|['"]$/g, '')
}

function setField(fm, name, value) {
  const line = `${name}: ${value}`
  const re = new RegExp(`^${name}:\\s*.*$`, 'm')
  if (re.test(fm)) return fm.replace(re, line)
  return `${fm}\n${line}`
}

async function loadPosts() {
  const files = (await readdir(POSTS_DIR)).filter((f) => f.endsWith('.mdx')).sort()
  const posts = []
  for (const file of files) {
    const path = join(POSTS_DIR, file)
    const raw = await readFile(path, 'utf8')
    const parsed = parseFrontmatter(raw)
    if (!parsed) continue
    const slug = file.replace(/\.mdx$/, '')
    posts.push({
      slug,
      path,
      title: field(parsed.raw, 'title') ?? slug,
      draft: field(parsed.raw, 'draft') !== 'false',
      original: field(parsed.raw, 'original') === 'true',
      takeover: field(parsed.raw, 'human_takeover'),
    })
  }
  return posts
}

function findPost(posts, query) {
  if (!query) return null
  const q = query.toLowerCase()
  const exact = posts.find((p) => p.slug === q)
  if (exact) return exact
  const slugHit = posts.filter((p) => p.slug.includes(q))
  if (slugHit.length === 1) return slugHit[0]
  const titleHit = posts.filter((p) => p.title.toLowerCase().includes(q))
  if (titleHit.length === 1) return titleHit[0]
  return { ambiguous: [...slugHit, ...titleHit] }
}

async function updatePost(path, { done, publish }) {
  const raw = await readFile(path, 'utf8')
  const parsed = parseFrontmatter(raw)
  if (!parsed) throw new Error(`no frontmatter in ${path}`)

  let fm = parsed.raw
  let changed = false
  if (/^human_takeover:/m.test(fm)) {
    const next = done || publish ? 'complete' : 'in-progress'
    const updated = setField(fm, 'human_takeover', yamlString(next))
    changed ||= updated !== fm
    fm = updated
  }
  if (publish) {
    const updated = setField(fm, 'draft', 'false')
    changed ||= updated !== fm
    fm = updated
  }
  if (!changed) return false

  await writeFile(path, `---\n${fm}\n---\n${raw.slice(parsed.bodyStart)}`, 'utf8')
  return true
}

function rel(path) {
  return path.replace(`${REPO}/`, '')
}

function hasHook() {
  return existsSync(join(REPO, '.git', 'hooks', 'post-commit'))
}

async function main() {
  const args = parse(process.argv.slice(2))
  const posts = await loadPosts()

  if (args.list) {
    for (const p of posts) {
      const flags = [p.draft ? 'draft' : 'live', p.original ? 'original' : 'ai', p.takeover].filter(Boolean).join(', ')
      console.log(`${p.slug.padEnd(36)} ${flags.padEnd(28)} ${p.title}`)
    }
    return
  }

  const hit = findPost(posts, args.query)
  if (!hit) {
    console.error('usage: pnpm edit <slug-or-title> [--done] [--publish] [--commit --note="..."]')
    process.exit(2)
  }
  if (hit.ambiguous) {
    console.error('ambiguous post. Matches:')
    for (const p of hit.ambiguous) console.error(`  ${p.slug} — ${p.title}`)
    process.exit(2)
  }

  await updatePost(hit.path, args)

  if (args.commit) {
    if (!args.note) {
      console.error('--commit requires --note="<what changed>"')
      process.exit(2)
    }
    git(['add', rel(hit.path)], { stdio: 'inherit' })
    const res = git(['commit', '-m', `edit: ${args.note}`], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status ?? 1)
    if (!hasHook()) {
      console.warn('post-commit hook not found. Run: pnpm install:hooks')
    }
    return
  }

  console.log(`editing ${rel(hit.path)}`)
  console.log(`  status: ${hit.draft ? 'draft' : 'live'}${hit.takeover ? `, human_takeover=${hit.takeover}` : ''}`)
  console.log(`  finish: pnpm write ${hit.slug} --commit --note="what changed"`)
  if (!hasHook()) console.log('  first:  pnpm install:hooks')

  if (!args.open) return
  const editor = process.env.BLOG_EDITOR || process.env.EDITOR || 'cursor'
  const child = spawn(editor, [hit.path], { stdio: 'inherit', detached: true })
  child.on('error', (err) => {
    if (err.code === 'ENOENT') {
      console.warn(`\n${editor} not found on PATH. Open manually: ${rel(hit.path)}`)
    } else {
      console.warn(`\nfailed to open ${editor}: ${err.message}`)
    }
  })
  child.unref()
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
