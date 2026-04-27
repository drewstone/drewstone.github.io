/**
 * og-render — programmatic OG image renderer (Satori → Resvg → PNG).
 *
 * Produces 1200×630 PNGs with a monochrome design that matches the site:
 * big serif title, mono caption strip with date · tags · author, a single
 * violet accent dot. Deterministic; runs at build time once per post.
 */
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))
const CACHE = join(ROOT, '.cache/fonts')

type FontSpec = { name: string; weight: 400 | 600 | 700; style?: 'normal' | 'italic'; url: string }

const FONTS: FontSpec[] = [
  // EB Garamond stands in for the body's CMU Serif stack — academic feel, ttf available.
  { name: 'Garamond', weight: 400, url: 'https://github.com/octaviopardo/EBGaramond12/raw/master/fonts/ttf/EBGaramond-Regular.ttf' },
  { name: 'Garamond', weight: 700, url: 'https://github.com/octaviopardo/EBGaramond12/raw/master/fonts/ttf/EBGaramond-Bold.ttf' },
  { name: 'JetBrainsMono', weight: 400, url: 'https://github.com/JetBrains/JetBrainsMono/raw/master/fonts/ttf/JetBrainsMono-Regular.ttf' },
  { name: 'JetBrainsMono', weight: 700, url: 'https://github.com/JetBrains/JetBrainsMono/raw/master/fonts/ttf/JetBrainsMono-Bold.ttf' },
]

let fontCache: { name: string; weight: 400 | 600 | 700; data: Buffer; style: 'normal' | 'italic' }[] | null = null

async function loadFonts() {
  if (fontCache) return fontCache
  if (!existsSync(CACHE)) await mkdir(CACHE, { recursive: true })
  const out = []
  for (const f of FONTS) {
    const file = join(CACHE, `${f.name}-${f.weight}.ttf`)
    let data: Buffer
    if (existsSync(file)) {
      data = await readFile(file)
    } else {
      const res = await fetch(f.url)
      if (!res.ok) throw new Error(`failed to fetch font ${f.url}: ${res.status}`)
      data = Buffer.from(await res.arrayBuffer())
      await writeFile(file, data)
    }
    out.push({ name: f.name, weight: f.weight, data, style: f.style ?? 'normal' as const })
  }
  fontCache = out
  return out
}

export type OgInput = {
  title: string
  description?: string
  date?: Date | string
  tags?: string[]
  author?: string
  original?: boolean
}

function fmtDate(d: Date | string | undefined) {
  if (!d) return ''
  const dt = d instanceof Date ? d : new Date(d)
  return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()
}

export async function renderOgPng(input: OgInput): Promise<Buffer> {
  const fonts = await loadFonts()

  const accent = input.original ? '#15803d' : '#6d28d9'
  const dateStr = fmtDate(input.date)
  const tagStr = (input.tags ?? []).filter((t) => t !== 'original').slice(0, 4).map((t) => t.toLowerCase()).join('  ·  ')
  const authorStr = input.original ? 'DREW STONE' : 'DREW STONE  ·  WITH AGENTS'

  const node = {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        padding: '70px 80px',
        fontFamily: 'Garamond',
        color: '#111111',
        position: 'relative',
      },
      children: [
        // top eyebrow: dot + site
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontFamily: 'JetBrainsMono',
              fontSize: '20px',
              letterSpacing: '4px',
              color: '#7a7a7a',
              textTransform: 'uppercase',
              fontWeight: 700,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: accent,
                  },
                },
              },
              { type: 'span', props: { children: 'drewstone.github.io' } },
            ],
          },
        },
        // title
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontFamily: 'Garamond',
              fontSize: input.title.length > 48 ? '78px' : '96px',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: '#111111',
              maxWidth: '1040px',
            },
            children: input.title,
          },
        },
        // bottom strip: meta
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              fontFamily: 'JetBrainsMono',
            },
            children: [
              ...(input.description
                ? [{
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        fontFamily: 'Garamond',
                        fontSize: '28px',
                        lineHeight: 1.4,
                        color: '#4a4a4a',
                        maxWidth: '1040px',
                      },
                      children: input.description.length > 180 ? input.description.slice(0, 177) + '…' : input.description,
                    },
                  }]
                : []),
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    fontFamily: 'JetBrainsMono',
                    fontSize: '18px',
                    color: '#7a7a7a',
                    fontWeight: 400,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginTop: '12px',
                  },
                  children: [
                    ...(dateStr ? [{ type: 'span', props: { children: dateStr } }] : []),
                    ...(tagStr ? [
                      { type: 'span', props: { style: { color: '#d4d4d4' }, children: '·' } },
                      { type: 'span', props: { children: tagStr } },
                    ] : []),
                    { type: 'span', props: { style: { marginLeft: 'auto', color: accent, fontWeight: 700 }, children: authorStr } },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  } as any

  const svg = await satori(node, {
    width: 1200,
    height: 630,
    fonts: fonts.map((f) => ({ name: f.name, data: f.data, weight: f.weight, style: f.style })),
  })

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
  return png
}
