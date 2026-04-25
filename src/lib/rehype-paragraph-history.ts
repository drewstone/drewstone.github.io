/**
 * rehype-paragraph-history — assigns each paragraph (and other prose chunks
 * already stamped with `data-pid`) a stable color slot from a 4-color palette,
 * such that adjacent siblings never share a color. Output: `data-rev-color`
 * on every node that has a `data-pid`.
 *
 * v1: color is derived from a hash of the pid plus a greedy adjacency check.
 * Once we have real per-revision diff history, the slot can be derived from
 * the touching revision instead of from the pid hash. The CSS rendering
 * (only active when article[data-mosaic="on"]) doesn't change.
 */
import type { Root, Element, Parent } from 'hast'
import { visit } from 'unist-util-visit'

const PALETTE = ['0', '1', '2', '3'] as const

function hashSlot(pid: string): number {
  let h = 0
  for (let i = 0; i < pid.length; i++) h = (h * 31 + pid.charCodeAt(i)) >>> 0
  return h % PALETTE.length
}

export default function rehypeParagraphHistory() {
  return (tree: Root) => {
    // Walk every parent and color its children that carry a data-pid, doing a
    // single greedy pass: each child gets its hash-preferred slot if it
    // doesn't conflict with its previous sibling's slot, otherwise the next
    // available slot. With 4 slots and one sibling to avoid, this always
    // succeeds in a single pass.
    visit(tree, 'element', (node: Element) => {
      const kids = (node as Parent).children as Element[]
      if (!kids?.length) return
      let prevSlot: number | null = null
      for (const child of kids) {
        if ((child as any).type !== 'element') continue
        const props = (child as Element).properties as Record<string, unknown> | undefined
        const pid = props?.['data-pid'] as string | undefined
        if (!pid) continue
        let slot = hashSlot(pid)
        if (prevSlot !== null && slot === prevSlot) {
          slot = (slot + 1) % PALETTE.length
        }
        ;(child.properties ?? (child.properties = {}))['data-rev-color'] = String(slot)
        prevSlot = slot
      }
    })
  }
}
