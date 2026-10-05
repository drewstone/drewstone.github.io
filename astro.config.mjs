// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { unified } from '@astrojs/markdown-remark'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeParagraphIds from './src/lib/rehype-paragraph-ids.ts'

export default defineConfig({
  site: 'https://drewstone.github.io',
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
