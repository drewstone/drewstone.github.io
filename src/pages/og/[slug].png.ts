import type { APIRoute, GetStaticPaths } from 'astro'
import { getCollection } from 'astro:content'
import { renderOgPng, type OgInput } from '../../../tools/og-render'
import { essayArt, pageCovers } from '../../lib/social-images'

export const getStaticPaths: GetStaticPaths = async () => {
  const [posts, research] = await Promise.all([
    getCollection('posts', ({ data }) => !data.draft), getCollection('research'),
  ])
  const researchArt = { bcww: 'bcww', ghz: 'ghz', 'linden-winter': 'linden-winter' } as const
  const covers: { slug: string; cover: OgInput }[] = [
    ...posts.map(post => ({ slug: post.id, cover: {
      title: post.data.title, section: 'Essay', art: essayArt(post.id), original: !!post.data.original,
      figure: post.data.figure?.src,
    } })),
    ...research.map(entry => ({ slug: `research-${entry.id}`, cover: {
      title: entry.data.title, section: entry.id in researchArt ? 'Quantum information' : 'Research',
      figure: entry.data.figure?.src,
      art: researchArt[entry.id as keyof typeof researchArt] ?? 'text',
    } })),
    ...Object.entries(pageCovers).map(([slug, cover]) => ({ slug, cover })),
  ]
  if (new Set(covers.map(c => c.slug)).size !== covers.length) throw new Error('Duplicate social cover slug')
  return covers.map(({ slug, cover }) => ({ params: { slug }, props: { cover } }))
}

export const GET: APIRoute = async ({ props }) => {
  const { cover } = props as { cover: OgInput }
  return new Response(new Uint8Array(await renderOgPng(cover)), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' },
  })
}
