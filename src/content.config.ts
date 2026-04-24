import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import type { Loader } from 'astro/loaders'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Author / revision schema — the "agentic experiment" metadata.
const authorSchema = z.object({
  model: z.string(),
  role: z.enum(['draft', 'rewrite', 'polish', 'diagram', 'review']),
  date: z.coerce.date(),
})

const revisionSchema = z.object({
  date: z.coerce.date(),
  model: z.string(),
  note: z.string(),
  commit: z.string().optional(),
  reconstructed: z.boolean().optional(),
  trace_id: z.string().optional(),
})

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
    featured: z.boolean().optional(),
    authors: z.array(authorSchema).optional(),
    revisions: z.array(revisionSchema).optional(),
  }),
})

const turnSchema = z.object({
  role: z.enum(['user', 'assistant', 'system', 'tool']),
  text: z.string().optional(),
  text_summary: z.string().optional(),
  tool_calls: z.number().optional(),
  tool_names: z.array(z.string()).optional(),
  files_touched: z.array(z.string()).optional(),
  had_thinking: z.boolean().optional(),
  ts: z.string().optional(),
})

/**
 * Custom loader for trace JSON files.
 * Walks traces/ recursively, loads any *.json as an entry keyed by its
 * top-level `trace_id` field.
 */
async function* walkTraces(dir: string): AsyncGenerator<string> {
  let entries
  try { entries = await readdir(dir, { withFileTypes: true }) } catch { return }
  for (const e of entries) {
    const p = join(dir, e.name)
    if (e.isDirectory()) yield* walkTraces(p)
    else if (e.isFile() && p.endsWith('.json')) yield p
  }
}

const tracesLoader: Loader = {
  name: 'traces-fs-loader',
  async load(ctx) {

    ctx.store.clear()
    for await (const path of walkTraces('./traces')) {
      try {
        const raw = await readFile(path, 'utf8')
        const data = JSON.parse(raw)
        const id: string = data.trace_id
        if (!id) continue
        const parsed = await ctx.parseData({ id, data })
        ctx.store.set({ id, data: parsed, digest: ctx.generateDigest(parsed) })
      } catch (e) {
        ctx.logger.warn(`traces-fs-loader: failed to load ${path}: ${(e as Error).message}`)
      }
    }
  },
}

const traces = defineCollection({
  loader: tracesLoader,
  schema: z.object({
    trace_id: z.string(),
    harness: z.string(),
    model: z.string().nullable().optional(),
    started_at: z.string(),
    ended_at: z.string().optional(),
    post: z.string(),
    role: z.enum(['draft', 'rewrite', 'polish', 'diagram', 'review']),
    commit: z.string().optional(),
    files_touched: z.array(z.string()).default([]),
    summary: z.string(),
    turns: z.array(turnSchema),
    raw_uri: z.string().optional(),
  }),
})

export const collections = { posts, traces }
