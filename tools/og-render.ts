import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { createElement as h, type CSSProperties, type ReactNode } from 'react'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { renderOgArt, type OgArtKind } from './og-art'

const FONT_DIR = join(process.cwd(), 'tools/fonts')
const FONT_SPECS = [
  { name: 'Garamond', weight: 400 as const },
  { name: 'Garamond', weight: 700 as const },
  { name: 'JetBrainsMono', weight: 400 as const },
]
let fontCache: Promise<{ name: string; weight: 400 | 700; data: Buffer; style: 'normal' }[]> | undefined
const fonts = () => fontCache ??= Promise.all(FONT_SPECS.map(async f => ({
  ...f, style: 'normal' as const, data: await readFile(join(FONT_DIR, `${f.name}-${f.weight}.ttf`)),
})))

export type OgInput = {
  title: string
  section: string
  art: OgArtKind
  original?: boolean
}

const artCache = new Map<OgArtKind, string>()
const fontOptions = { loadSystemFonts: false, defaultFontFamily: 'EB Garamond',
  fontFiles: FONT_SPECS.map(f => join(FONT_DIR, `${f.name}-${f.weight}.ttf`)),
}

const box = (style: CSSProperties, ...children: ReactNode[]) => h('div', { style: { display: 'flex', ...style } }, ...children)

/** One build-time cover system. Fonts and scientific figures are local and deterministic. */
export async function renderOgPng(input: OgInput): Promise<Buffer> {
  const loadedFonts = await fonts()
  const ink = '#25231e', quiet = '#777269', paper = '#f6f3eb'
  const size = input.title.length > 60 ? 58 : input.title.length > 32 ? 66 : 78
  // Embedded SVG images cannot inherit the parent renderer's font database.
  // Rasterize the figure with the same pinned fonts before embedding it.
  let art = artCache.get(input.art)
  if (!art) {
    art = new Resvg(renderOgArt(input.art), { font: fontOptions }).render().asPng().toString('base64')
    artCache.set(input.art, art)
  }
  const node = box({ width: 1200, height: 630, padding: '48px 60px 36px', backgroundColor: paper,
    color: ink, flexDirection: 'column', fontFamily: 'Garamond', position: 'relative' },
    box({ alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 20, borderBottom: '1px solid #d7d2c7' },
      box({ fontSize: 32 }, 'Drew Stone'),
      box({ fontFamily: 'JetBrainsMono', fontSize: 17, color: quiet }, input.section),
    ),
    box({ flex: 1, alignItems: 'center', justifyContent: 'space-between', gap: 44 },
      box({ width: 610, fontSize: size, fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.025em' }, input.title),
      h('img', { src: `data:image/png;base64,${art}`, width: 400, height: 400 }),
    ),
    box({ alignItems: 'center', justifyContent: 'space-between', fontFamily: 'JetBrainsMono', fontSize: 17, color: quiet },
      box({}, 'drewstone.github.io'),
      input.original ? box({ color: '#396747' }, 'Human original') : null,
    ),
  )
  const svg = await satori(node, { width: 1200, height: 630, fonts: loadedFonts })
  return new Resvg(svg, { font: fontOptions }).render().asPng()
}
