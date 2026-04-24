/**
 * rehype plugin — stamp every <p>, <li>, and heading inside the post prose
 * with a deterministic `data-pid` attribute derived from the normalized text.
 *
 * IDs are stable across builds as long as the text is stable. That's what lets
 * the reactions backend key paragraph-level aggregates without us having to
 * maintain an authorial index.
 */
import type { Root, Element, ElementContent } from 'hast'
import { visit } from 'unist-util-visit'
import crypto from 'node:crypto'

const REACT_TAGS = new Set(['p', 'li', 'h2', 'h3'])

function textOf(node: ElementContent | Root): string {
  if ((node as any).type === 'text') return (node as any).value as string
  if ((node as any).type === 'element' || (node as any).type === 'root') {
    const kids = (node as Element | Root).children ?? []
    return kids.map((c) => textOf(c)).join(' ')
  }
  return ''
}

function normalize(s: string): string {
  return s.replace(/\s+/g, ' ').trim().toLowerCase()
}

function pid(text: string): string {
  const norm = normalize(text)
  if (!norm) return ''
  return crypto.createHash('sha1').update(norm).digest('hex').slice(0, 10)
}

export default function rehypeParagraphIds() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (!REACT_TAGS.has(node.tagName)) return
      if (!node.properties) node.properties = {}
      if (node.properties.dataPid || node.properties['data-pid']) return
      const id = pid(textOf(node))
      if (!id) return
      node.properties['data-pid'] = id
    })
  }
}
