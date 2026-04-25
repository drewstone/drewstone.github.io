/**
 * rehype plugin — stamp every <p>, <li>, h2, h3 with:
 *   data-pid       deterministic text hash
 *   data-rev-color slot 0..3 derived from the pid (per-element so adjacent
 *                  siblings often differ; full adjacency-pass is done at
 *                  render time via CSS sibling selectors and JS).
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

function colorSlot(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h % 4
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
      node.properties['data-rev-color'] = String(colorSlot(id))
    })
  }
}
