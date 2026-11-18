// The n = 109 counterexample to Li and Yuan's Conjecture 4.2 (arXiv:2607.02239v1), and the arithmetic that checks it.
// The codeword is the one the frozen checker verified on release rc2 of the 17 November 2026 run.

export const n = 109
export const p = 3

export const codeword: readonly number[] = [
  1, 2, 2, 2, 2, 1, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 2, 2, 1,
  1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2,
]

/** The 3-cyclotomic coset of s modulo n: s, 3s, 9s, ... */
export function coset(s: number): Set<number> {
  const out = new Set<number>()
  for (let x = s % n; !out.has(x); x = (x * p) % n) out.add(x)
  return out
}

/** The four nonzero cosets, named by their least element as the paper does: C_1, C_2, C_4, C_8. */
export const cosets = { 1: coset(1), 2: coset(2), 4: coset(4), 8: coset(8) } as const

// Polynomials over F_3 as coefficient lists, lowest degree first.
const trim = (a: number[]) => {
  const b = a.map((x) => ((x % p) + p) % p)
  while (b.length && b[b.length - 1] === 0) b.pop()
  return b
}
const inverse = (x: number) => x % p // in F_3 every nonzero element is its own inverse

function remainder(a: number[], b: number[]): number[] {
  let r = trim(a)
  const d = trim(b)
  const lead = inverse(d[d.length - 1])
  while (r.length >= d.length) {
    const q = (r[r.length - 1] * lead) % p
    const shift = r.length - d.length
    r = trim(r.map((x, i) => (i >= shift ? x - q * d[i - shift] : x)))
  }
  return r
}

export function gcd(a: number[], b: number[]): number[] {
  let [x, y] = [trim(a), trim(b)]
  while (y.length) [x, y] = [y, remainder(x, y)]
  const lead = inverse(x[x.length - 1])
  return x.map((c) => (c * lead) % p)
}

/** Every line the check prints, from the codeword alone. */
export function runCheck(): string[] {
  const order = Array.from({ length: n - 1 }, (_, k) => k + 1).find((k) => {
    let x = 1
    for (let i = 0; i < k; i++) x = (x * p) % n
    return x === 1
  })
  const xn1 = [p - 1, ...Array(n - 1).fill(0), 1]
  const g = gcd([...codeword], xn1)
  const reversed = [...g].reverse()
  const monic = reversed.map((c) => (c * inverse(reversed[reversed.length - 1])) % p)
  const mirrored = (a: Set<number>, b: Set<number>) => [...a].every((j) => b.has((n - j) % n))
  const ones = codeword.filter((x) => x === 1).length
  return [
    `length ${codeword.length}, entries in {1, 2}: ${codeword.every((x) => x === 1 || x === 2)} (${ones} ones, ${codeword.length - ones} twos)`,
    `ord_109(3) = ${order}, so r = ${(n - 1) / (order ?? 1)} nonzero cosets of size ${order}`,
    `sum of entries mod 3 = ${codeword.reduce((s, x) => s + x, 0) % p}`,
    `deg gcd(c(x), x^109 - 1) = ${g.length - 1}  (55 = 1 + 27 + 27: the zeros are 0 and two cosets)`,
    `gcd is self-reciprocal (zeros closed under j -> -j): ${monic.every((c, i) => c === g[i])}`,
    `-C_1 = C_4: ${mirrored(cosets[1], cosets[4])}, -C_2 = C_8: ${mirrored(cosets[2], cosets[8])}`,
    'so the spectrum vanishes on 0 and one mirror pair and is supported on the other pair: t = 2 = r/2, 0 outside, weight 109',
  ]
}
