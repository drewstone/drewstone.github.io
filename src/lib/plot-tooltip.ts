/** One tooltip implementation for inspectable SVG plots. All content is plain text. */
export function plotTooltip(container: HTMLElement) {
  const box = document.createElement('div')
  box.className = 'ui-plot-tooltip'
  box.role = 'tooltip'
  box.hidden = true
  container.append(box)
  const hide = () => {
    box.hidden = true
  }
  const bind = (mark: SVGElement, title: string, lines: string[]) => {
    const show = (x: number, y: number) => {
      box.replaceChildren()
      const heading = document.createElement('strong')
      heading.textContent = title
      box.append(heading)
      for (const line of lines) {
        const p = document.createElement('p')
        p.textContent = line
        box.append(p)
      }
      box.hidden = false
      box.style.left = `${Math.max(8, Math.min(x + 14, innerWidth - 360))}px`
      box.style.top = `${Math.max(8, Math.min(y + 14, innerHeight - box.offsetHeight - 8))}px`
    }
    mark.addEventListener('pointerenter', (e) => show(e.clientX, e.clientY))
    mark.addEventListener('pointermove', (e) => show(e.clientX, e.clientY))
    mark.addEventListener('pointerleave', hide)
    mark.addEventListener('focus', () => {
      const r = mark.getBoundingClientRect()
      show(r.right, r.top)
    })
    mark.addEventListener('blur', hide)
    mark.addEventListener('click', hide)
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide()
  })
  return { bind, hide }
}
