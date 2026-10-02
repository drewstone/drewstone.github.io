/**
 * og-render — programmatic OG image renderer (Satori → Resvg → PNG).
 *
 * Produces 1200×630 PNGs with a monochrome design that matches the site:
 * big serif title, mono caption strip with date · tags · author, a single
 * violet accent dot. Deterministic; runs at build time once per post.
 */
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Astro bundles this module into dist; import.meta.url would point at transient output.
// The build runs from the project root, where the licensed font assets are retained.
const FONT_DIR = join(process.cwd(), 'tools/fonts')
const FONTS = [
  { name: 'Garamond', weight: 400 as const },
  { name: 'Garamond', weight: 700 as const },
  { name: 'JetBrainsMono', weight: 400 as const },
  { name: 'JetBrainsMono', weight: 700 as const },
]
let fontCache:
  | Promise<
      { name: string; weight: 400 | 700; data: Buffer; style: 'normal' }[]
    >
  | undefined

function loadFonts() {
  return (fontCache ??= Promise.all(
    FONTS.map(async ({ name, weight }) => ({
      name,
      weight,
      style: 'normal' as const,
      data: await readFile(join(FONT_DIR, `${name}-${weight}.ttf`)),
    })),
  ))
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
  return dt
    .toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    .toUpperCase()
}

export async function renderOgPng(input: OgInput): Promise<Buffer> {
  const fonts = await loadFonts()

  const accent = input.original ? '#15803d' : '#6d28d9'
  const dateStr = fmtDate(input.date)
  const tagStr = (input.tags ?? [])
    .filter((t) => t !== 'original')
    .slice(0, 4)
    .map((t) => t.toLowerCase())
    .join('  ·  ')
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
                ? [
                    {
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
                        children:
                          input.description.length > 180
                            ? input.description.slice(0, 177) + '…'
                            : input.description,
                      },
                    },
                  ]
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
                    ...(dateStr
                      ? [{ type: 'span', props: { children: dateStr } }]
                      : []),
                    ...(tagStr
                      ? [
                          {
                            type: 'span',
                            props: {
                              style: { color: '#d4d4d4' },
                              children: '·',
                            },
                          },
                          { type: 'span', props: { children: tagStr } },
                        ]
                      : []),
                    {
                      type: 'span',
                      props: {
                        style: {
                          marginLeft: 'auto',
                          color: accent,
                          fontWeight: 700,
                        },
                        children: authorStr,
                      },
                    },
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
    fonts: fonts.map((f) => ({
      name: f.name,
      data: f.data,
      weight: f.weight,
      style: f.style,
    })),
  })

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
    .render()
    .asPng()
  return png
}
