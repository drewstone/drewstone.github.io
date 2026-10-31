// @ts-check
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { unified } from '@astrojs/markdown-remark'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeParagraphIds from './src/lib/rehype-paragraph-ids.ts'

/** Old /posts/<slug> URLs for pieces that now live under /slop/. */
function slopRedirects() {
  const dir = (name) => fileURLToPath(new URL(`./src/content/${name}/`, import.meta.url))
  const slugs = (name) => readdirSync(dir(name))
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.slice(0, -4))
  const human = new Set(slugs('posts'))
  /** @type {Record<string, string>} */
  const redirects = {}
  for (const slug of slugs('slop')) {
    if (human.has(slug)) continue
    redirects[`/posts/${slug}`] = `/slop/${slug}`
  }
  return redirects
}

export default defineConfig({
  site: 'https://drewstone.github.io',
  redirects: slopRedirects(),
  integrations: [mdx(), react(), sitemap()],
  // Astro 7 defaults to JSX whitespace rules, which drop spaces between inline elements.
  compressHTML: true,
  markdown: {
    // Astro 7 defaults to Satteri; the math and paragraph-id plugins need remark/rehype.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeParagraphIds, rehypeKatex],
    }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
})
