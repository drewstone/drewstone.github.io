import type { APIRoute, GetStaticPaths } from 'astro'
import { getCollection } from 'astro:content'
import { renderOgPng } from '../../../tools/og-render.ts'

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft)
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }))
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as any
  const png = await renderOgPng({
    title: post.data.title,
    description: post.data.description || undefined,
    date: post.data.date,
    tags: post.data.tags ?? [],
    author: 'Drew Stone',
    original: !!post.data.original,
  })
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
