#!/usr/bin/env python3
"""Exact verifier for the entangled (GHZ-mixture) counterexample to BCWW (4.6).

The candidate inequality (arXiv:1507.05650 v2 / JHEP 2015, eq. 4.6; eq. 4.16
in arXiv v1) for a 4-party quantum state:

  S(ABD)+S(ABC)+S(BCD)-2S(BD)-2S(BC)+S(CD)-S(AD)-S(AC)-S(AB)+2S(B)+S(A) <= 0

The counterexample state on qubits A, B, C, D:

  rho = (3/4)|GHZ4><GHZ4| + (1/8)|1010><1010| + (1/8)|1001><1001|,
  GHZ4 = (|0000> + |1111>)/sqrt(2).

This script proves LHS(rho) = +0.113302... > 0 with no floating-point step
on the claim path:

  1. It builds rho as an exact 16x16 rational matrix.
  2. Every term of (4.6) involves only proper subsets of {A,B,C,D}.
     For each of the 14 proper nonempty subsets the script computes the
     partial trace exactly and checks the reduced matrix is DIAGONAL and
     equals the marginal of the classical distribution
     {0000: 3/8, 1111: 3/8, 1010: 1/8, 1001: 1/8}.
     So every entropy in (4.6) is a Shannon entropy of rational probabilities.
  3. It expands LHS as q0 + q3*log2(3) + q5*log2(5) with exact rational q_i
     (every probability is a/8 with a <= 8, so only primes 2, 3, 5, 7 can
     appear; the script tracks all four and reports which survive).
  4. Sign certificate: after clearing denominators, LHS > 0 reduces to an
     exact big-integer comparison of two prime powers.

Stdlib only. Exit code 0 iff every check passes.
"""
from fractions import Fraction
from itertools import combinations
from math import log2
import sys

F = Fraction
PARTIES = "ABCD"  # bit positions: A is the leftmost bit of the 4-bit string

# The classical reduction target.
CLASSICAL = {"0000": F(3, 8), "1111": F(3, 8), "1010": F(1, 8), "1001": F(1, 8)}

# (coefficient, subset) terms of the (4.6) left-hand side.
TERMS = [
    (1, "ABD"), (1, "ABC"), (1, "BCD"),
    (-2, "BD"), (-2, "BC"), (1, "CD"), (-1, "AD"), (-1, "AC"), (-1, "AB"),
    (2, "B"), (1, "A"),
]


def build_rho():
    """rho = (3/4)|GHZ4><GHZ4| + (1/8)|1010><1010| + (1/8)|1001><1001|."""
    rho = [[F(0)] * 16 for _ in range(16)]
    # GHZ projector entries are 1/2 at the four corners {0,15} x {0,15}.
    for i in (0, 15):
        for j in (0, 15):
            rho[i][j] += F(3, 4) * F(1, 2)
    rho[0b1010][0b1010] += F(1, 8)
    rho[0b1001][0b1001] += F(1, 8)
    return rho


def partial_trace(rho, keep):
    """Exact partial trace onto qubit positions `keep` (tuple of 0..3)."""
    d = 1 << len(keep)
    out = [[F(0)] * d for _ in range(d)]
    drop = [p for p in range(4) if p not in keep]
    for i in range(16):
        for j in range(16):
            if rho[i][j] == 0:
                continue
            # Qubit p of basis index i is bit (3 - p) counting from the LSB.
            if any((i >> (3 - p)) & 1 != (j >> (3 - p)) & 1 for p in drop):
                continue  # off-diagonal on a traced-out qubit: no contribution
            ii = sum(((i >> (3 - p)) & 1) << (len(keep) - 1 - k)
                     for k, p in enumerate(keep))
            jj = sum(((j >> (3 - p)) & 1) << (len(keep) - 1 - k)
                     for k, p in enumerate(keep))
            out[ii][jj] += rho[i][j]
    return out


def classical_marginal(keep):
    """Marginal of CLASSICAL on positions `keep`, as {index: probability}."""
    marg = {}
    for atom, p in CLASSICAL.items():
        idx = int("".join(atom[k] for k in keep), 2)
        marg[idx] = marg.get(idx, F(0)) + p
    return marg


def entropy_exponents(probs):
    """H(probs) as {1: q0, 3: q3, 5: q5, 7: q7} meaning q0 + sum q_p*log2(p).

    Every probability is a/8: -p*log2(p) = (a/8)*(3 - log2(a)), and log2(a)
    for a <= 8 splits over the primes 2, 3, 5, 7.
    """
    LOG2 = {1: {}, 2: {2: 1}, 3: {3: 1}, 4: {2: 2}, 5: {5: 1},
            6: {2: 1, 3: 1}, 7: {7: 1}, 8: {2: 3}}
    q = {1: F(0), 3: F(0), 5: F(0), 7: F(0)}
    for p in probs:
        a = p * 8
        assert a.denominator == 1 and 1 <= a <= 8, f"non-eighth probability {p}"
        a = int(a)
        q[1] += p * 3
        for prime, e in LOG2[a].items():
            if prime == 2:
                q[1] -= p * e
            else:
                q[prime] -= p * e
    return q


def main():
    failures = 0
    rho = build_rho()
    assert sum(rho[i][i] for i in range(16)) == 1, "trace(rho) != 1"
    assert all(rho[i][j] == rho[j][i] for i in range(16) for j in range(16))

    # Step 2: every proper reduced state is diagonal = the classical marginal.
    for r in range(1, 4):
        for keep in combinations(range(4), r):
            red = partial_trace(rho, keep)
            d = 1 << len(keep)
            diag = all(red[i][j] == 0 for i in range(d) for j in range(d) if i != j)
            marg = classical_marginal(keep)
            match = all(red[i][i] == marg.get(i, F(0)) for i in range(d))
            label = "".join(PARTIES[k] for k in keep)
            if not (diag and match):
                failures += 1
                print(f"reduction[{label}]: FAILED (diagonal={diag}, match={match})")
    if failures == 0:
        print("reduction: all 14 proper reduced states are exactly diagonal and "
              "equal the classical marginals of {0000:3/8, 1111:3/8, 1010:1/8, 1001:1/8}")

    # Step 3: LHS as an exact combination of logs of primes.
    lhs = {1: F(0), 3: F(0), 5: F(0), 7: F(0)}
    for coef, subset in TERMS:
        keep = tuple(PARTIES.index(c) for c in subset)
        q = entropy_exponents(list(classical_marginal(keep).values()))
        for k in lhs:
            lhs[k] += coef * q[k]
    q0, q3, q5, q7 = lhs[1], lhs[3], lhs[5], lhs[7]
    val = float(q0) + float(q3) * log2(3) + float(q5) * log2(5) + float(q7) * log2(7)
    print(f"LHS = {q0} + ({q3})*log2(3) + ({q5})*log2(5) + ({q7})*log2(7)")
    print(f"LHS = {val:.6f} bits (expected +0.113302)")
    if not abs(val - 0.113302) < 5e-7:
        failures += 1
        print("LHS: FAILED (does not match the recorded value +0.113302)")

    # Step 4: exact sign certificate by big-integer comparison.
    from math import lcm
    N = lcm(q0.denominator, q3.denominator, q5.denominator, q7.denominator)
    n = {p: int(lhs[p] * N) for p in (1, 3, 5, 7)}
    # LHS > 0  <=>  2^n0 * 3^n3 * 5^n5 * 7^n7 > 1  (exponents may be negative)
    num, den = 1, 1
    for base, e in ((2, n[1]), (3, n[3]), (5, n[5]), (7, n[7])):
        if e >= 0:
            num *= base ** e
        else:
            den *= base ** (-e)
    if num > den:
        print(f"sign certificate: {N}*LHS = log2( {num} / {den} ) and "
              f"{num} > {den} -- LHS > 0 EXACTLY, (4.6) is VIOLATED")
    else:
        failures += 1
        print(f"sign certificate: FAILED ({num} <= {den})")

    print("ALL CHECKS PASSED" if failures == 0 else f"{failures} CHECKS FAILED")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
