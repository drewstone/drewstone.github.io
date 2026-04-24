#!/usr/bin/env node
/**
 * feedback-eval — reads reactions + giscus comments + git revision log,
 * produces a content scorecard. Output goes to stdout as JSON or (with --md)
 * as a markdown brief suitable for dropping into a planning doc.
 *
 * Sources (each optional; skip silently if unconfigured):
 *   - Reactions: D1 events table via `wrangler d1 execute`
 *   - Comments:  GitHub Discussions API (via gh CLI; giscus writes discussions)
 *   - Revisions: post frontmatter (./src/content/posts/ *.mdx)
 *   - Traffic:   Plausible / Cloudflare Web Analytics — noted but not fetched here
 *
 * Usage:
 *   pnpm tsx tools/feedback-eval.ts              # JSON scorecard
 *   pnpm tsx tools/feedback-eval.ts --md         # markdown brief
 *   pnpm tsx tools/feedback-eval.ts --post=slug  # focus one post
 */

import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const POSTS_DIR = 'src/content/posts'
const ARGS = new Set(process.argv.slice(2))
const POST_FLAG = process.argv.find((a) => a.startsWith('--post='))?.slice(7)
const AS_MD = ARGS.has('--md')

type PostMeta = {
  slug: string
  title: string
  date: string
  tags: string[]
  revisionCount: number
  authorModels: string[]
}

type ReactionCounts = Record<string, Record<string, number>> // slug → { like, insight, meh }
type CommentSummary = { slug: string; count: number; topics: string[] }

async function readPosts(): Promise<PostMeta[]> {
  const files = (await readdir(POSTS_DIR)).filter((f) => f.endsWith('.mdx'))
  const out: PostMeta[] = []
  for (const f of files) {
    const body = await readFile(join(POSTS_DIR, f), 'utf8')
    const slug = f.replace(/\.mdx$/, '')
    const fm = body.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ''
    const title = fm.match(/^title:\s*['"]?(.+?)['"]?\s*$/m)?.[1] ?? slug
    const date = fm.match(/^date:\s*(.+)$/m)?.[1]?.trim() ?? ''
    const tags = Array.from(fm.matchAll(/-\s*['"]?([\w\-]+)['"]?/g)).map((m) => m[1])
    const revisionCount = (fm.match(/-\s*\{\s*date:/g) ?? []).length
    const authorModels = Array.from(new Set(
      Array.from(fm.matchAll(/model:\s*['"]?([\w\-\.]+)['"]?/g)).map((m) => m[1])
    ))
    out.push({ slug, title, date, tags, revisionCount, authorModels })
  }
  return out.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}

async function readReactions(): Promise<ReactionCounts> {
  const dbName = process.env.BLOG_D1_DB ?? 'blog-reactions'
  try {
    const cmd = `wrangler d1 execute ${dbName} --remote --command "SELECT slug, kind, count FROM counts WHERE paragraph IS NULL" --json`
    const raw = execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString()
    const rows = JSON.parse(raw)?.[0]?.results ?? []
    const out: ReactionCounts = {}
    for (const r of rows) {
      out[r.slug] = out[r.slug] ?? { like: 0, insight: 0, meh: 0 }
      out[r.slug][r.kind] = r.count
    }
    return out
  } catch {
    return {}
  }
}

async function readComments(): Promise<CommentSummary[]> {
  const repo = process.env.BLOG_GISCUS_REPO
  if (!repo) return []
  try {
    const raw = execSync(
      `gh api graphql -f query='
        query($repo:String!,$owner:String!) {
          repository(owner:$owner, name:$repo) {
            discussions(first:50, orderBy:{field:UPDATED_AT,direction:DESC}) {
              nodes { title body comments { totalCount } }
            }
          }
        }' -f owner='${repo.split('/')[0]}' -f repo='${repo.split('/')[1]}'`,
      { stdio: ['ignore', 'pipe', 'ignore'] }
    ).toString()
    const nodes = JSON.parse(raw)?.data?.repository?.discussions?.nodes ?? []
    return nodes.map((n: any) => ({
      slug: n.title.replace(/^.*\//, ''),
      count: n.comments.totalCount,
      topics: extractTopics(n.body ?? ''),
    }))
  } catch {
    return []
  }
}

function extractTopics(text: string): string[] {
  // Cheap topic extraction — grab capitalized multi-word phrases and code spans.
  const codes = Array.from(text.matchAll(/`([^`]{2,30})`/g)).map((m) => m[1])
  const caps = Array.from(text.matchAll(/\b[A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,}){0,3}\b/g)).map((m) => m[0])
  return Array.from(new Set([...codes, ...caps])).slice(0, 8)
}

function score(post: PostMeta, reactions: Record<string, number> | undefined, comments: CommentSummary | undefined) {
  const r = reactions ?? { like: 0, insight: 0, meh: 0 }
  const positive = (r.like ?? 0) + 2 * (r.insight ?? 0)
  const negative = r.meh ?? 0
  const engagement = positive - negative
  const commentCount = comments?.count ?? 0
  // Weighted score: reactions + 3× comment count (comments are much rarer)
  const aggregate = engagement + 3 * commentCount
  return { positive, negative, engagement, commentCount, aggregate, reactions: r, topics: comments?.topics ?? [] }
}

async function main() {
  const posts = await readPosts()
  const reactions = await readReactions()
  const comments = await readComments()
  const byPostComment = Object.fromEntries(comments.map((c) => [c.slug, c]))

  let rows = posts.map((p) => ({
    post: p,
    s: score(p, reactions[p.slug], byPostComment[p.slug]),
  }))
  if (POST_FLAG) rows = rows.filter((r) => r.post.slug === POST_FLAG)
  rows.sort((a, b) => b.s.aggregate - a.s.aggregate)

  if (AS_MD) {
    console.log('# Feedback Scorecard')
    console.log(`_generated ${new Date().toISOString()}_`)
    console.log('')
    console.log('| Post | Likes | Insight | Meh | Comments | Aggregate |')
    console.log('|---|---:|---:|---:|---:|---:|')
    for (const { post, s } of rows) {
      console.log(
        `| [${post.title}](/posts/${post.slug}) | ${s.reactions.like ?? 0} | ${s.reactions.insight ?? 0} | ${s.reactions.meh ?? 0} | ${s.commentCount} | ${s.aggregate} |`
      )
    }
    console.log('')
    const top = rows.slice(0, 3)
    console.log('## Top performers')
    for (const { post, s } of top) {
      console.log(`- **${post.title}** — ${s.aggregate} points. Topics mentioned: ${s.topics.join(', ') || '—'}`)
    }
    const cold = rows.slice(-3).reverse()
    console.log('')
    console.log('## Cold posts (little engagement)')
    for (const { post } of cold) {
      console.log(`- ${post.title}`)
    }
    return
  }

  const out = rows.map(({ post, s }) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    authors: post.authorModels,
    revisions: post.revisionCount,
    reactions: s.reactions,
    comments: s.commentCount,
    engagement: s.engagement,
    aggregate: s.aggregate,
    topics: s.topics,
  }))
  console.log(JSON.stringify({ generated: new Date().toISOString(), posts: out }, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
