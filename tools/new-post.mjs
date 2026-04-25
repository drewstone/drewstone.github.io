#!/usr/bin/env node
/**
 * new-post — scaffold a new blog post and open it in your editor.
 *
 * Usage:
 *   pnpm new "Your post title"             # default: original (human-authored)
 *   pnpm new "Your post title" --ai        # AI-authored (no original flag)
 *   pnpm new "Your post title" --slug=foo  # override slug
 *   pnpm new "Your post title" --no-open   # don't launch editor
 *   pnpm new "Your post title" --tags=design,prose
 *
 * Editor selection: $BLOG_EDITOR > $EDITOR > 'cursor'.
 */
import { existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

function parse(argv) {
  const args = { title: '', open: true, ai: false, slug: null, tags: null }
  const pos = []
  for (const a of argv) {
    if (a === '--ai') args.ai = true
    else if (a === '--no-open') args.open = false
    else if (a.startsWith('--slug=')) args.slug = a.slice('--slug='.length)
    else if (a.startsWith('--tags=')) args.tags = a.slice('--tags='.length).split(',').map((t) => t.trim()).filter(Boolean)
    else pos.push(a)
  }
  args.title = pos.join(' ').trim()
  return args
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function yamlList(items) {
  return '[' + items.map((t) => `'${t.replace(/'/g, "\\'")}'`).join(', ') + ']'
}

function frontmatter({ title, date, tags, original }) {
  const lines = [
    '---',
    `title: '${title.replace(/'/g, "\\'")}'`,
    `description: ''`,
    `date: ${date}`,
    `tags: ${yamlList(tags)}`,
  ]
  if (original) lines.push('original: true')
  lines.push('draft: true', '---', '')
  return lines.join('\n')
}

function body(original) {
  if (original) {
    return [
      '{/* AI AGENTS: DO NOT EDIT. This post is human-authored. See CLAUDE.md hard rule. */}',
      '',
      'Open with the thing.',
      '',
      'Then the next thing.',
      '',
    ].join('\n')
  }
  return ['Open with the thing.', '', 'Then the next thing.', ''].join('\n')
}

async function main() {
  const args = parse(process.argv.slice(2))
  if (!args.title) {
    console.error('usage: pnpm new "<title>" [--ai] [--slug=<slug>] [--tags=a,b] [--no-open]')
    process.exit(2)
  }

  const original = !args.ai
  const slug = slugify(args.slug || args.title)
  if (!slug) {
    console.error(`could not derive a slug from "${args.title}" — pass --slug=<slug>`)
    process.exit(2)
  }

  const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
  const path = join(repoRoot, 'src', 'content', 'posts', `${slug}.mdx`)
  if (existsSync(path)) {
    console.error(`refusing to overwrite ${path}`)
    process.exit(1)
  }

  const tags = args.tags ?? (original ? ['original'] : [])
  const fm = frontmatter({ title: args.title, date: today(), tags, original })
  await writeFile(path, fm + body(original), 'utf8')

  const rel = path.replace(repoRoot + '/', '')
  console.log(`created ${rel}`)
  console.log(`  url:      /posts/${slug}`)
  console.log(`  type:     ${original ? 'original (human-authored, AI cannot edit)' : 'AI-authored'}`)
  console.log(`  draft:    true (set draft: false to publish)`)

  if (!args.open) return

  const editor = process.env.BLOG_EDITOR || process.env.EDITOR || 'cursor'
  const child = spawn(editor, [path], { stdio: 'inherit', detached: true })
  child.on('error', (err) => {
    if (err.code === 'ENOENT') {
      console.warn(`\n${editor} not found on PATH — skipping open. set $BLOG_EDITOR or use --no-open.`)
      console.warn(`open manually: ${editor} ${rel}`)
    } else {
      console.warn(`\nfailed to open ${editor}: ${err.message}`)
    }
  })
  child.unref()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
