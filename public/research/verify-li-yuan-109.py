#!/usr/bin/env python3
# Checks the n = 109 counterexample to Conjecture 4.2 of Li and Yuan, arXiv:2607.02239v1, with plain Python 3 and no libraries.
# Run: python3 verify-li-yuan-109.py
c = [1,2,2,2,2,1,2,2,1,1,1,1,2,2,1,1,1,2,2,1,1,2,2,1,2,1,2,1,1,1,1,2,2,1,2,1,2,1,1,2,2,1,1,2,1,2,1,2,2,1,2,1,2,2,2,1,2,1,2,1,2,2,2,2,2,1,2,1,1,2,1,1,2,1,1,2,2,2,2,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,2]
n, p = 109, 3

def trim(a):
    while a and a[-1] % p == 0: a = a[:-1]
    return a

def mod(a, b):  # remainder of a by b over F_p; lists are coefficients, lowest degree first
    a, b = trim([x % p for x in a]), trim([x % p for x in b])
    inv = pow(b[-1], p - 2, p)
    while len(a) >= len(b):
        q, s = a[-1] * inv % p, len(a) - len(b)
        a = trim([(a[i] - q * b[i - s]) % p if i >= s else a[i] for i in range(len(a))])
    return a

def gcd(a, b):
    a, b = trim([x % p for x in a]), trim([x % p for x in b])
    while b: a, b = b, mod(a, b)
    inv = pow(a[-1], p - 2, p)
    return [x * inv % p for x in a]

orbit = lambda s: {s * pow(3, k, n) % n for k in range(27)}
assert len(c) == n and all(x in (1, 2) for x in c)  # weight 109: every entry nonzero
xn1 = [p - 1] + [0] * (n - 1) + [1]                  # x^109 - 1
g = gcd(c, xn1)
rev = g[::-1]; rev = [x * pow(rev[-1], p - 2, p) % p for x in rev]
print('ord_109(3) =', min(k for k in range(1, n) if pow(3, k, n) == 1), '| nonzero cosets:', len({frozenset(orbit(s)) for s in range(1, n)}))
print('entries nonzero:', all(x != 0 for x in c), '| sum mod 3:', sum(c) % 3)
print('deg gcd(c(x), x^109 - 1) =', len(g) - 1, '(55 = 1 + 27 + 27: the zeros are {0} and two cosets)')
print('gcd self-reciprocal (zero set closed under j -> -j):', rev == g)
print('mirror pairs: -C_1 = C_4:', orbit(n - 1) == orbit(4), '| -C_2 = C_8:', orbit(n - 2) == orbit(8))
print('so the zeros are {0} and one mirror pair, the DFT support is the other pair: t = 2 = r/2 and 0 is not in it, yet c has weight 109')
