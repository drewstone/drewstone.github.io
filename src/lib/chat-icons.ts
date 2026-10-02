/** Shared semantic icons for conversation tools and observed status. */
export const toolIcon = (label?: string): string => {
  if (!label) return 'dot'
  const l = label.toLowerCase()
  if (l.includes('write') || l.includes('edit') || l.includes('patch'))
    return 'pencil'
  if (
    l.includes('read') ||
    l.includes('get') ||
    l.includes('list') ||
    l.includes('ls')
  )
    return 'doc'
  if (
    l.includes('bash') ||
    l.includes('shell') ||
    l.includes('run') ||
    l.includes('exec')
  )
    return 'terminal'
  if (l.includes('search') || l.includes('grep') || l.includes('find'))
    return 'search'
  if (l.includes('fetch') || l.includes('http') || l.includes('web'))
    return 'globe'
  if (l.includes('test')) return 'check'
  if (l.includes('build') || l.includes('compile')) return 'hammer'
  return 'dot'
}

export const statusSvg = (s?: string): string => {
  if (s === 'ok')
    return `<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true" focusable="false"><path d="M3.5 8.3l3 3 6-6.2" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  if (s === 'fail')
    return `<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true" focusable="false"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`
  if (s === 'running')
    return `<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-dasharray="3 3"/></svg>`
  return ''
}

export const toolSvg = (icon: string): string => {
  switch (icon) {
    case 'pencil':
      return `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M10.5 2.5l3 3-8 8-3.5.5.5-3.5z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/><path d="M9 4l3 3" stroke="currentColor" stroke-width="1.4"/></svg>`
    case 'terminal':
      return `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M4 7l2 1.5-2 1.5M8 10.5h4" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    case 'doc':
      return `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 2h6l3 3v9h-9z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/><path d="M9.5 2v3h3" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M5.5 8h5M5.5 10.5h5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`
    case 'search':
      return `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M10 10l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
    case 'globe':
      return `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M2.5 8h11M8 2.5c2 3 2 8 0 11c-2-3-2-8 0-11z" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>`
    case 'check':
      return `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8.3l3 3 6-6.2" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    case 'hammer':
      return `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2.5 10.5l3.5-3.5 4 4-3.5 3.5zM7.5 6.5l3-3 4 4-3 3z" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linejoin="round"/></svg>`
    default:
      return `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="2" fill="currentColor"/></svg>`
  }
}
