import type { OgArtKind } from '../../tools/og-art'

/** Increment when the cover design changes so shared-link caches see a new image URL. */
const DESIGN_VERSION = '2'
export const coverUrl = (slug: string) => `/og/${slug}.png?v=${DESIGN_VERSION}`

export const pageCovers = {
  home: { title: 'Systems, agents, and mathematics', section: 'Essays & research', art: 'topology' },
  research: { title: 'Proofs & counterexamples', section: 'Mathematics · Computer science', art: 'bcww' },
  essays: { title: 'Essays', section: 'AI systems · Mathematics', art: 'text' },
  about: { title: 'Drew Stone', section: 'About', art: 'text' },
  experiment: { title: 'Writing with agents', section: 'Authorship & revision history', art: 'traces' },
  traces: { title: 'The work behind the writing', section: 'Agent records', art: 'traces' },
} satisfies Record<string, { title: string; section: string; art: OgArtKind }>

export function pageCoverUrl(pathname: string): string {
  const path = pathname.replace(/^\/+|\/+$/g, '')
  if (path.startsWith('posts/')) return coverUrl(path.slice(6))
  if (path.startsWith('research/')) return coverUrl(`research-${path.slice(9)}`)
  if (path.startsWith('traces/')) return coverUrl('traces')
  const key = path === '' ? 'home' : path === 'posts' ? 'essays' : path
  return coverUrl(Object.hasOwn(pageCovers, key) ? key : 'home')
}

// Curated illustration choices; a new essay gets typography until its figure is chosen.
const essayFigures: Record<string, OgArtKind> = {
  'agentic-eval-improvement': 'search',
  'browser-agent-stuck-detection': 'traces',
  'convergence-as-eval-primitive': 'traces',
  'convergence-loops': 'traces',
  'deepwork-orchestrator': 'topology',
  'exploit-or-disprove': 'topology',
  'lifting-auto-research': 'search',
  'redteam-architecture': 'topology',
  'self-improving-agents': 'search',
  'the-ensemble-and-the-edit': 'traces',
  'the-self-improving-stack': 'topology',
  'vibecoding-a-browser-agent': 'search',
  'self-improving-stack-agent-runtime-topology': 'topology',
  'self-improving-stack-evaluation-gates': 'search',
  'self-improving-stack-harness-evolution': 'search',
  'self-improving-stack-memory-flywheels': 'traces',
  'self-improving-stack-multi-agent-coordination': 'topology',
  'self-improving-stack-optimization-theory': 'search',
  'self-improving-stack-post-training': 'search',
  'self-improving-stack-prompt-optimization': 'search',
  'self-improving-stack-skill-optimization': 'search',
  'self-improving-stack-test-time-compute': 'search',
  'self-improving-stack-trace-systems': 'traces',
}
export const essayArt = (slug: string): OgArtKind => essayFigures[slug] ?? 'text'
