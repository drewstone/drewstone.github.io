/**
 * One locator for human posts and agent posts.
 *
 * Human writing lives in src/content/posts and is served at /posts.
 * Agent writing lives in src/content/slop and is served at /slop.
 * A slug is looked up in posts first. Git history may still name the posts
 * path for a file that now lives in slop, so diff lookup tries both.
 */
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

/** @typedef {'posts' | 'slop'} ContentCollection */

/**
 * @typedef {object} LocatedPost
 * @property {ContentCollection} collection
 * @property {string} slug
 * @property {string} rel
 * @property {string} abs
 * @property {string} href
 */

export const COLLECTIONS = /** @type {const} */ (['posts', 'slop'])

/**
 * @param {string} path
 * @returns {LocatedPost | null}
 */
export function parseContentPath(path) {
  const match = String(path).trim().match(/^src\/content\/(posts|slop)\/(.+)\.mdx$/)
  if (!match) return null
  const collection = /** @type {ContentCollection} */ (match[1])
  const slug = match[2]
  const rel = `src/content/${collection}/${slug}.mdx`
  return { collection, slug, rel, abs: rel, href: `/${collection}/${slug}` }
}

/**
 * @param {string} repo
 * @param {string} slug
 * @returns {LocatedPost | null}
 */
export function locatePost(repo, slug) {
  for (const collection of COLLECTIONS) {
    const rel = `src/content/${collection}/${slug}.mdx`
    const abs = join(repo, rel)
    if (existsSync(abs)) return { collection, slug, rel, abs, href: `/${collection}/${slug}` }
  }
  return null
}

/**
 * Current file first, then the other collection. Empty when the slug is not
 * on disk yet: both paths, posts then slop.
 * @param {string} repo
 * @param {string} slug
 * @returns {string[]}
 */
export function candidatePaths(repo, slug) {
  const all = COLLECTIONS.map((collection) => `src/content/${collection}/${slug}.mdx`)
  const located = locatePost(repo, slug)
  if (!located) return all
  return [located.rel, ...all.filter((rel) => rel !== located.rel)]
}

/**
 * The other collection's path for a posts or slop MDX path.
 * @param {string} path
 * @returns {string | null}
 */
export function otherContentPath(path) {
  const parsed = parseContentPath(path)
  if (!parsed) return null
  const collection = parsed.collection === 'posts' ? 'slop' : 'posts'
  return `src/content/${collection}/${parsed.slug}.mdx`
}

/**
 * @param {string} repo
 * @returns {Array<LocatedPost & { file: string }>}
 */
export function listContentFiles(repo) {
  /** @type {Array<LocatedPost & { file: string }>} */
  const out = []
  for (const collection of COLLECTIONS) {
    const dir = join(repo, 'src', 'content', collection)
    /** @type {string[]} */
    let names = []
    try { names = readdirSync(dir).filter((name) => name.endsWith('.mdx')).sort() }
    catch { continue }
    for (const file of names) {
      const slug = file.slice(0, -4)
      const rel = `src/content/${collection}/${file}`
      out.push({ collection, slug, file, rel, abs: join(repo, rel), href: `/${collection}/${slug}` })
    }
  }
  return out
}

/**
 * Slugs changed in a `git show --name-only` listing. Either collection counts.
 * @param {string} text
 * @returns {string[]}
 */
export function slugsFromGitNames(text) {
  /** @type {string[]} */
  const slugs = []
  for (const line of String(text).split('\n')) {
    const parsed = parseContentPath(line)
    if (parsed) slugs.push(parsed.slug)
  }
  return [...new Set(slugs)]
}
