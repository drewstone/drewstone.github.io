export type OgArtKind = 'bcww' | 'ghz' | 'linden-winter' | 'topology' | 'traces' | 'search' | 'text'

const ink = '#25231e', quiet = '#777269', rule = '#d7d2c7', blue = '#315e77', red = '#a14032', paper = '#f6f3eb'
const text = (x: number, y: number, value: string, size = 22, color = ink, family = 'JetBrains Mono', anchor = 'start') =>
  `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${value}</text>`
const line = (x1: number, y1: number, x2: number, y2: number, color = rule, width = 2) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"/>`
const circle = (x: number, y: number, r: number, fill = paper, stroke = blue) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`
const serif = (x: number, y: number, value: string, size = 28, color = ink, anchor = 'start') =>
  text(x, y, value, size, color, 'EB Garamond', anchor)
const caption = (label: string) => text(200, 375, label, 17, quiet, 'JetBrains Mono', 'middle')

// Exact support in src/content/research/bcww.mdx; every row has probability 1/5.
function bcww() {
  const atoms = ['0001', '0010', '0011', '0111', '1000']
  return serif(200, 30, 'Five equally likely atoms', 27, ink, 'middle') +
    [...'ABCD'].map((v, i) => text(62 + i * 70, 78, v, 22, quiet, undefined, 'middle')).join('') +
    atoms.map((atom, row) => {
      const y = 108 + row * 44
      return [...atom].map((bit, col) => {
        const x = 42 + col * 70
        return `<rect x="${x}" y="${y - 22}" width="40" height="38" rx="3" fill="${bit === '1' ? red : 'none'}" stroke="${bit === '1' ? red : rule}"/>` +
          text(x + 20, y + 4, bit, 25, bit === '1' ? paper : ink, undefined, 'middle')
      }).join('') + text(350, y + 4, '1/5', 20, quiet, undefined, 'end')
    }).join('') + text(200, 345, 'F = +0.0529325 bits', 24, red, undefined, 'middle')
}

// These probabilities reproduce the proper-subsystem entropies, not the full GHZ density matrix.
// See src/content/research/ghz.mdx, "State and marginal entropies".
function ghz() {
  const rows: [string, number, string][] = [['0000', 3, '3/8'], ['1111', 3, '3/8'], ['1010', 1, '1/8'], ['1001', 1, '1/8']]
  return serif(200, 30, 'Entropy-equivalent marginals', 27, ink, 'middle') +
    rows.map(([atom, weight, probability], i) => {
      const y = 93 + i * 58
      return text(0, y + 8, atom, 21) +
        `<rect x="83" y="${y - 14}" width="${weight * 75}" height="29" fill="${blue}"/>` +
        text(390, y + 8, probability, 22, quiet, undefined, 'end')
    }).join('') + text(200, 355, 'F = +0.113302 bits', 24, red, undefined, 'middle')
}

// Analytic asymptotic from src/content/research/linden-winter.mdx; no sampled curve or invented measurements.
function lindenWinter() {
  return serif(200, 42, 'An unbounded ratio', 29, ink, 'middle') +
    serif(24, 142, 'R', 52) + serif(58, 156, 'L', 26) + serif(95, 142, '=', 45) +
    serif(253, 150, '2 / δ', 91, blue, 'middle') +
    serif(253, 206, '+ O(1)', 43, quiet, 'middle') +
    line(25, 252, 375, 252) +
    serif(70, 322, 'δ → 0', 40, quiet) + serif(260, 330, '∞', 91, blue) +
    caption('Asymptotic · L → ∞')
}

function topology() {
  const xs = [64, 200, 336]
  return xs.map(x => line(200, 90, x, 190, blue, 2)).join('') +
    xs.map(x => line(x, 210, 200, 310, blue, 2)).join('') +
    circle(200, 77, 22, blue) + xs.map(x => circle(x, 200, 22)).join('') + circle(200, 323, 22, blue) +
    text(200, 38, 'delegate', 20, quiet, undefined, 'middle') +
    text(248, 329, 'combine', 20, quiet) + caption('Fork / join · schematic')
}

function traces() {
  return line(34, 71, 34, 295, blue, 3) +
    [75, 181, 287].map(y => circle(34, y, 8, blue)).join('') +
    serif(65, 78, 'Message', 36) + text(66, 112, 'role · content', 18, quiet) +
    serif(65, 184, 'Tool call', 36) + text(66, 218, 'id · name · input', 18, quiet) +
    serif(65, 290, 'Result', 36) + text(66, 324, 'call id · output', 18, quiet) + caption('Event structure')
}

function search() {
  const level1 = [90, 310], level2 = [40, 140, 260, 360]
  return level1.map(x => line(200, 78, x, 179, rule, 2)).join('') +
    level2.map((x, i) => line(level1[Math.floor(i / 2)], 199, x, 294, rule, 2)).join('') +
    line(200, 78, 90, 179, blue, 3) + line(90, 199, 140, 294, blue, 3) +
    circle(200, 64, 18, blue) + level1.map(x => circle(x, 188, 18)).join('') +
    level2.map(x => circle(x, 307, 18, x === 140 ? blue : paper)).join('') + caption('Candidate search · schematic')
}

export function renderOgArt(kind: OgArtKind): string {
  const drawing = kind === 'bcww' ? bcww() : kind === 'ghz' ? ghz() : kind === 'linden-winter' ? lindenWinter() :
    kind === 'topology' ? topology() : kind === 'traces' ? traces() : kind === 'search' ? search() :
      serif(200, 292, '&amp;', 290, blue, 'middle')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">${drawing}</svg>`
}
