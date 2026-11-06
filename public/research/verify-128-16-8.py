#!/usr/bin/env python3
"""Standalone verifier for the [[128,16,8]] full-Clifford CSS code (albert-full-ldpc).

Standard library only: no numpy, no scipy, no network, no files beyond its input.

    python3 verifier.py <code.json>          # verify the construction (exit 0 = all gates PASS)

The input is the run's machine-readable construction (the record schema of
valbert4/two-fold-transversal plus the certificate fields "macros" and "words").
One PASS or FAIL line is printed per gate; the first FAIL stops the run.

Gates 1-12 are exact machine checks of the construction at n = 128:
  pages, css-commuting, minus-i, k, ldpc-span, self-dual, logical-basis, witness,
  distance, indecomposable, generators, words (with the fullness identities).
Gate 13 calibrates the group-generation criterion at small k (Dickson transitivity,
by exact orbit search at k = 2, 4, 6, 8). The k = 16 step is NOT machine-checked
here: it is carried by the run's retained C orbit program (orbitk.c, all 2^32 - 1
nonzero vectors of F_2^32, 65 BFS levels), by the outside critique's independent
elementary proof (GPT-6 Pro, 2026-10-11), and by the standard theorem that the
3k-1 transvections T(e_i), T(f_i), T(e_i+e_{i+1}) generate Sp(2k,2). See the
packet README for the exact machine-checked / critique-confirmed / asserted split.

Algorithms are adapted from the run's own mounted check (plays/albert-full-ldpc.md,
"albert-full-ldpc check v1"): the gate-string grammar and the depth-one two-local
rule, the logical-action and transvection conventions, the CSS distance search
structure (meet-in-the-middle over subset supports) and the indecomposability
block argument are the check's; the GF(2) linear algebra here is a bitset-only
reimplementation sharing no code with the check or with evaluate.py.
"""

import json
import re
import sys
import time

# ------------------------------------------------------------------ GF(2) bitset rows
# A vector over F_2 on 2n coordinates is one int: bit q is the X part of qubit q,
# bit n+q is the Z part (the check's (x|z) row-vector convention).


def parity(x):
    return x.bit_count() & 1


def symp(u, v, n):
    """Symplectic pairing <u, v> = u Omega v^T for (x|z) row vectors, half-width n."""
    low = (1 << n) - 1
    return parity((u & low) & (v >> n)) ^ parity((u >> n) & (v & low))


def rref(rows):
    """Row-reduce a list of int rows; returns (reduced rows, pivot columns)."""
    basis = []          # (pivot, row), each reduced against the others
    for r in rows:
        for piv, b in basis:
            if (r >> piv) & 1:
                r ^= b
        if r:
            piv = r.bit_length() - 1
            basis = [(p2, b ^ r if ((b >> piv) & 1) else b) for p2, b in basis]
            basis.append((piv, r))
            basis.sort()
    return [b for _, b in basis], [p for p, _ in basis]


def in_rowspace(v, reduced, pivots):
    """True iff v reduces to zero against the given RREF."""
    for piv, b in zip(pivots, reduced):
        if (v >> piv) & 1:
            v ^= b
    return v == 0


# ------------------------------------------------------------------ Pauli parsing
PAULI = re.compile(r"([XYZ])(\d+)")


def pauli(s, n):
    v, used = 0, 0
    for m in PAULI.finditer(s):
        used += len(m.group(0))
        q = int(m.group(2))
        if q >= n:
            raise ValueError(f"qubit {q} out of range in {s[:60]!r}")
        if m.group(1) in "XY":
            v |= 1 << q
        if m.group(1) in "ZY":
            v |= 1 << (n + q)
    if used != len(s.replace(" ", "")) or used == 0:
        raise ValueError(f"unparsed Pauli string {s[:60]!r}")
    return v


def pauli_sign(s):
    """Sign bit of the literal Hermitian operator: Y = i XZ contributes i per Y,
    so an even Y count gives sign (-1)^(Y/2); an odd Y count is not Hermitian."""
    y = s.count("Y")
    if y % 2:
        raise ValueError(f"stabilizer {s[:40]!r} has an odd number of Y factors")
    return (y // 2) & 1


def weight(v, n):
    low = (1 << n) - 1
    return (v & low).bit_count() + (v >> n).bit_count()


# ------------------------------------------------------------------ gate grammar (the check's)
TOK = re.compile(r"S(\d+)|V(\d+)|CZ<(\d+),(\d+)>|cz<(\d+),(\d+)>|CX<(\d+),(\d+)>|H(\d+)|(\^)|\((\d+(?:,\d+)*)\)")


def decode(s, n):
    """Gate string -> (list of 2n row ints, problem or None), mirroring the check:
    matrices act on row vectors (x|z) on the right, tokens left to right, a single
    SWAP 2-cycle applied after the other tokens. Depth-one two-local is enforced:
    every qubit lies in at most one two-qubit pair."""
    g = [1 << i for i in range(2 * n)]
    pairs = []
    cycles = []

    def col_xor(target, source):        # column target ^= column source
        bit = 1 << source
        for i in range(2 * n):
            if g[i] & bit:
                g[i] ^= 1 << target

    def col_swap(a, b):
        ba, bb = 1 << a, 1 << b
        for i in range(2 * n):
            x = (g[i] & ba) >> a
            y = (g[i] & bb) >> b
            if x != y:
                g[i] = (g[i] & ~ba & ~bb) | (x << b) | (y << a)

    used = 0
    for m in TOK.finditer(s or ""):
        used += len(m.group(0))
        ints = [int(x) for x in m.groups() if x is not None and x != "^" and "," not in x]
        if any(q >= n for q in ints):
            return None, f"qubit out of range in {m.group(0)}"
        if m.group(1) is not None:                     # S_q
            q = int(m.group(1))
            col_xor(n + q, q)
        elif m.group(2) is not None:                   # V_q
            q = int(m.group(2))
            col_xor(q, n + q)
        elif m.group(3) is not None:                   # CZ<i,j>
            i, j = int(m.group(3)), int(m.group(4))
            if i == j:
                col_xor(n + i, i)
            else:
                col_xor(n + j, i)
                col_xor(n + i, j)
                pairs.append((min(i, j), max(i, j)))
        elif m.group(5) is not None:                   # cz<i,j>
            i, j = int(m.group(5)), int(m.group(6))
            if i == j:
                col_xor(i, n + i)
            else:
                col_xor(j, n + i)
                col_xor(i, n + j)
                pairs.append((min(i, j), max(i, j)))
        elif m.group(7) is not None:                   # CX<c,t>
            i, j = int(m.group(7)), int(m.group(8))
            if i == j:
                return None, "CX on one qubit"
            col_xor(j, i)
            col_xor(n + i, n + j)
            pairs.append((min(i, j), max(i, j)))
        elif m.group(9) is not None:                   # H_q
            q = int(m.group(9))
            col_swap(q, n + q)
        elif m.group(11) is not None:                  # 2-cycle (SWAP), applied last
            cyc = [int(x) for x in m.group(11).split(",")]
            if any(q >= n for q in cyc) or len(set(cyc)) != len(cyc):
                return None, f"bad cycle {m.group(0)}"
            if len(cyc) > 2:
                return None, f"cycle {m.group(0)} is not a single SWAP"
            if len(cyc) == 2:
                cycles.append(tuple(cyc))
                pairs.append((min(cyc), max(cyc)))
    if used != len((s or "").replace(" ", "")):
        return None, "unparsed tokens"
    partner = {}
    for a, b in set(pairs):
        for q, o in ((a, b), (b, a)):
            if partner.setdefault(q, o) != o:
                return None, f"qubit {q} is in two pairs: not depth-one two-local"
    for a, b in cycles:                # swap columns a,b in both halves
        col_swap(a, b)
        col_swap(n + a, n + b)
    return g, None


def symplectic_matrix(g, n):
    """g Omega g^T == Omega for a row-int matrix g (row vectors on the right)."""
    omega_rows = [1 << (n + kk) for kk in range(n)] + [1 << kk for kk in range(n)]
    for i in range(2 * n):
        row, acc, kk = g[i], 0, 0
        while row:
            if row & 1:
                acc ^= omega_rows[kk]
            row >>= 1
            kk += 1
        for j in range(2 * n):
            want = 1 if (i < n and j == i + n) or (i >= n and j == i - n) else 0
            if parity(acc & g[j]) != want:
                return False
    return True


def mat_cols(g, half):
    """cols[j] = int with bit k set iff row k of g has bit j; j ranges over 2*half."""
    cols = [0] * (2 * half)
    for k, row in enumerate(g):
        r, j = row, 0
        while r:
            if r & 1:
                cols[j] |= 1 << k
            r >>= 1
            j += 1
    return cols


def vec_mat(u, cols):
    """Row vector u times a matrix given by its column bitsets: result bit j is
    the parity of u AND column j."""
    out = 0
    for j, c in enumerate(cols):
        if (u & c).bit_count() & 1:
            out |= 1 << j
    return out


# ------------------------------------------------------------------ small (logical) matrices
def mm_small(a, b):
    """Product of two 2m x 2m matrices held as lists of row ints (row-vector convention)."""
    return [vec_mat(row, mat_cols(b, len(b) // 2)) for row in a]


def eye(m):
    return [1 << i for i in range(m)]


def transvection(t, k):
    """T_t: w -> w + <w,t> t on F_2^{2k}, as a 2k x 2k row-int matrix."""
    rows = eye(2 * k)
    for i in range(2 * k):
        if symp(rows[i], t, k):
            rows[i] ^= t
    return rows


def targets(k):
    out = {}
    for i in range(k):
        out[f"e{i + 1}"] = 1 << i
        out[f"f{i + 1}"] = 1 << (k + i)
    for i in range(k - 1):
        out[f"e{i + 1}+e{i + 2}"] = (1 << i) | (1 << (i + 1))
    return out


def orbit_transitive(k, tmap):
    """Dickson criterion core: is the orbit of e_1 under the target transvections
    all of F_2^{2k} \\ {0}?"""
    tvecs = list(tmap.values())
    seen = {1}
    front = [1]
    while front:
        nxt = []
        for u in front:
            for t in tvecs:
                v = u ^ t if symp(u, t, k) else u
                if v and v not in seen:
                    seen.add(v)
                    nxt.append(v)
        front = nxt
    return len(seen) == (1 << (2 * k)) - 1, len(seen)


# ------------------------------------------------------------------ output
def say(gate, ok, detail):
    print(f"{'PASS' if ok else 'FAIL'} [{gate}] {detail}", flush=True)
    if not ok:
        raise SystemExit(1)


def main():
    t_start = time.time()
    path = sys.argv[1] if len(sys.argv) > 1 else "artifacts/code.json"
    try:
        rec = json.load(open(path))
    except (OSError, ValueError) as exc:
        say("pages", False, f"{path}: {exc}")
    for field in ("n", "isotropic_generators", "ldpc_generators", "logical_ops",
                  "min_weight_logical", "depth1_clif_generators", "words"):
        if field not in rec:
            say("pages", False, f"code.json lacks required field {field!r}")
    n = int(rec["n"])
    say("pages", True, f"code.json present and parses: n={n}, "
        f"{len(rec['isotropic_generators'])} stabilizer generators, "
        f"{len(rec['depth1_clif_generators'])} depth-one generator strings, "
        f"{len(rec['words'])} transvection words")

    # -- 2. CSS, commuting, independent ------------------------------------
    try:
        iso = [pauli(s, n) for s in rec["isotropic_generators"]]
        signs = [pauli_sign(s) for s in rec["isotropic_generators"]]
    except ValueError as exc:
        say("css-commuting", False, f"isotropic_generators: {exc}")
    low_mask = (1 << n) - 1
    for v in iso:
        if (v & low_mask) and (v >> n):
            say("css-commuting", False, "a stabilizer generator mixes X and Z: not CSS")
    S_red, S_piv = rref(iso)
    if len(S_red) != len(iso):
        say("css-commuting", False, "stabilizer generators are dependent")
    bad = next(((i, j) for i in range(len(iso)) for j in range(i + 1, len(iso))
                if symp(iso[i], iso[j], n)), None)
    say("css-commuting", bad is None, f"{len(iso)} independent pure-X/Z stabilizer "
        f"generators, all {len(iso) * (len(iso) - 1) // 2} pairs commute")

    # -- 3. -I not in the stabilizer group ---------------------------------
    # Phase-tracked elimination. op(x1,z1) op(x2,z2) = (-1)^{z1.x2} op(x1+x2,z1+z2),
    # each listed generator is Hermitian (squares to +I), so products with each
    # generator used at most once cover the whole group: -I occurs iff a zero-vector
    # elimination row carries phase 1.
    elim = []          # (pivot, vec, phase)
    minus_i = False
    for v, s in zip(iso, signs):
        ph = s
        for piv, ev, ep in elim:
            if (v >> piv) & 1:
                ph ^= ep ^ parity((v >> n) & (ev & low_mask))
                v ^= ev
        if v == 0 and ph:
            minus_i = True
        if v:
            piv = v.bit_length() - 1
            elim = [(p2, ev ^ v if ((ev >> piv) & 1) else ev, ep) for p2, ev, ep in elim]
            elim.append((piv, v, ph))
            elim.sort()
    say("minus-i", not minus_i, "phase-tracked elimination: the identity is reached "
        "only as the empty product, so -I is not in the stabilizer group")

    # -- 4. k ---------------------------------------------------------------
    k = n - len(iso)
    if "k" in rec and int(rec["k"]) != k:
        say("k", False, f"k is {k}, not the stated {rec['k']}")
    say("k", k == 16, f"k = n - rank(S) = {n} - {len(iso)} = {k}")

    # -- 5. listed checks: span, weight, degree -----------------------------
    try:
        ldpc = [pauli(s, n) for s in rec["ldpc_generators"]]
    except ValueError as exc:
        say("ldpc-span", False, f"ldpc_generators: {exc}")
    pure = all(not ((v & low_mask) and (v >> n)) for v in ldpc)
    L_red, L_piv = rref(ldpc)
    spans = (len(L_red) == n - k
             and all(in_rowspace(v, S_red, S_piv) for v in L_red)
             and all(in_rowspace(v, L_red, L_piv) for v in S_red))
    sup_rows = [(v & low_mask) | (v >> n) for v in ldpc]
    w_max = max(v.bit_count() for v in sup_rows)
    deg = [0] * n
    for v in sup_rows:
        q = 0
        while v:
            if v & 1:
                deg[q] += 1
            v >>= 1
            q += 1
    d_max = max(deg)
    say("ldpc-span", pure and spans, f"listed checks are pure X or Z and span the "
        f"stabilizer group ({len(ldpc)} checks)")
    say("ldpc-span", w_max <= 8 and d_max <= 8, f"check weight {w_max}, qubit degree "
        f"{d_max} (limit 8, 8)")

    # -- 6. self-dual check spaces ------------------------------------------
    xh = [v & low_mask for v in ldpc if v & low_mask]
    zh = [v >> n for v in ldpc if v >> n]
    XR, XP = rref(xh)
    ZR, ZP = rref(zh)
    same = (len(XR) == len(ZR)
            and all(in_rowspace(v, ZR, ZP) for v in XR)
            and all(in_rowspace(v, XR, XP) for v in ZR))
    say("self-dual", same, f"C_X and C_Z rowspaces {'coincide (self-dual CSS)' if same else 'differ'}: "
        f"rank X {len(XR)}, rank Z {len(ZR)}")

    # -- 7. logical basis ----------------------------------------------------
    try:
        B = [pauli(s, n) for s in rec["logical_ops"]]
    except ValueError as exc:
        say("logical-basis", False, f"logical_ops: {exc}")
    if len(B) != 2 * k:
        say("logical-basis", False, f"{len(B)} logical operators for k = {k}")
    if any(symp(v, s, n) for v in B for s in iso):
        say("logical-basis", False, "a logical operator anticommutes with a stabilizer")
    form_ok = all(symp(B[i], B[j], n) == (1 if (j == i + k and i < k) or (i == j + k and j < k) else 0)
                  for i in range(2 * k) for j in range(2 * k))
    independent = (all(not in_rowspace(v, S_red, S_piv) for v in B)
                   and len(rref(iso + B)[0]) == len(iso) + 2 * k)
    say("logical-basis", form_ok and independent, f"logical_ops is a symplectic basis "
        f"e_1..e_{k}, f_1..f_{k}, independent modulo the stabilizer")

    # -- 8. distance upper bound: the weight-8 witness -----------------------
    claimed = int(rec.get("d", 0))
    try:
        wit = pauli(rec["min_weight_logical"], n)
    except ValueError as exc:
        say("witness", False, f"min_weight_logical: {exc}")
    w_wit = weight(wit, n)
    commutes = not any(symp(wit, s, n) for s in iso)
    nontrivial = any(symp(wit, b, n) for b in B)
    say("witness", commutes and nontrivial and w_wit == claimed,
        f"min_weight_logical {rec['min_weight_logical']} is a nontrivial logical of "
        f"weight {w_wit} (commutes with S: {commutes}, nontrivial: {nontrivial}) "
        f"=> d <= {w_wit}")

    # -- 9. distance lower bound: exhaustive meet-in-the-middle ---------------
    # A Z-type support x with H_X x = 0 commutes with every X check; it is trivial
    # iff it also commutes with every basis logical (then x lies in rowspace(H_Z)).
    # So: nontrivial logical of weight <= W  <=>  exists x, |x| <= W, H_X x = 0,
    # pairing with some basis logical = 1. Weight <= 7 splits 3 + 4. One
    # representative per syndrome is exact: if two table entries shared a syndrome
    # their XOR would itself be a candidate, caught at insert time; and candidates
    # differing by a trivial word (rowspace(H_Z)) pair identically with the basis.
    lx_masks = [b & low_mask for b in B]     # X halves of the 2k basis logicals

    def no_logical(half_rows, W):
        cols = [0] * n
        for c, row in enumerate(half_rows):
            r, q = row, 0
            while r:
                if r & 1:
                    cols[q] |= 1 << c
                r >>= 1
                q += 1
        b = W // 2
        holder = {"found": None, "queries": 0}

        def nontriv(x):
            return x != 0 and any(parity(x & L) for L in lx_masks)

        synd = {0: 0}
        level = [0]
        for _ in range(b):
            nxt = []
            for sup in level:
                base = sup.bit_length()      # next qubit strictly greater
                for q in range(base, n):
                    s2 = sup | (1 << q)
                    y = 0
                    r, qq = s2, 0
                    while r:
                        if r & 1:
                            y ^= cols[qq]
                        r >>= 1
                        qq += 1
                    rep = synd.get(y)
                    if rep is None:
                        synd[y] = s2
                    elif nontriv(s2 ^ rep):
                        holder["found"] = s2 ^ rep
                        return holder["found"], len(synd), 0
                    nxt.append(s2)
            level = nxt
        total = len(synd)
        a = W - b

        def rec(start, depth, sup, y):
            if holder["found"] is not None:
                return
            if depth == a:
                holder["queries"] += 1
                rep = synd.get(y)
                if rep is not None and nontriv(sup ^ rep):
                    holder["found"] = sup ^ rep
                return
            for q in range(start, n - (a - depth) + 1):
                rec(q + 1, depth + 1, sup | (1 << q), y ^ cols[q])

        rec(0, 0, 0, 0)
        return holder["found"], total, holder["queries"]

    W = claimed - 1
    t0 = time.time()
    if XR == ZR:
        found, total, queries = no_logical(XR, W)
        detail = (f"H_X = H_Z as matrices, so one search covers both types: no "
                  f"nontrivial X- or Z-type logical of weight <= {W} "
                  f"({total:,} table + {queries:,} queried subsets, {time.time() - t0:.0f} s)")
        z_found = x_found = found
    else:
        z_found, total, queries = no_logical(XR, W)
        detail = (f"no nontrivial Z-type logical of weight <= {W} "
                  f"({total:,} + {queries:,} subsets, {time.time() - t0:.0f} s)")
        t0 = time.time()
        x_found, total2, queries2 = no_logical(ZR, W)
        detail += (f"; no nontrivial X-type logical of weight <= {W} "
                   f"({total2:,} + {queries2:,} subsets, {time.time() - t0:.0f} s)")
    ok = z_found is None and x_found is None
    found = z_found if z_found is not None else x_found
    say("distance", ok, detail + ("" if ok else
        f"; found logical of weight {found.bit_count()} on qubits "
        f"{[q for q in range(n) if (found >> q) & 1]}"))
    # CSS distance d = min(d_X, d_Z), and a mixed-Pauli logical contains the
    # support of a nontrivial pure component, so pure-type bounds are exact.
    say("distance", ok and w_wit == claimed, f"certified d = {claimed} exactly "
        "(the witness gives d <= 8; the exhaustive X- and Z-type search through "
        "weight 7 gives d >= 8; CSS: a mixed logical contains a nontrivial pure component)")

    # -- 10. indecomposable ---------------------------------------------------
    parent = list(range(n))

    def find(a):
        while parent[a] != a:
            parent[a] = parent[parent[a]]
            a = parent[a]
        return a

    for half_rows in (XR, ZR):
        red, piv = rref(half_rows)
        for i, p in enumerate(piv):
            r, q = red[i], 0
            while r:
                if r & 1:
                    ra, rb = find(p), find(q)
                    if ra != rb:
                        parent[ra] = rb
                r >>= 1
                q += 1
    blocks = len({find(q) for q in range(n)})
    say("indecomposable", blocks == 1, f"the join of the X- and Z-check matroid "
        f"components is {blocks} block(s) on {n} qubits: "
        f"{'indecomposable (not a direct sum)' if blocks == 1 else 'decomposable'}")

    # -- 11. depth-one generators: symplectic, code-preserving -----------------
    gens = rec["depth1_clif_generators"]
    words, macros = rec["words"], rec.get("macros", {})
    used, total_items = set(), 0
    for name, seq in list(macros.items()) + list(words.items()):
        for it in seq:
            total_items += 1
            if type(it) is int and 0 <= it < len(gens):
                used.add(it)
    lam = {}
    t0 = time.time()
    for i in sorted(used):
        g, why = decode(gens[i], n)
        if g is None:
            say("generators", False, f"generator {i}: {why}")
        if not symplectic_matrix(g, n):
            say("generators", False, f"generator {i}: not symplectic")
        cols = mat_cols(g, n)
        for s in iso:
            if not in_rowspace(vec_mat(s, cols), S_red, S_piv):
                say("generators", False, f"generator {i}: does not preserve the stabilizer group")
        wrows = [vec_mat(b, cols) for b in B]
        lam_rows = []
        for w in wrows:
            lr = 0
            for j in range(2 * k):
                # the basis is symplectic, so the coefficient of B_j in w is the
                # pairing of w with the dual basis element (e_j <-> f_j), exactly
                # the check's lam = [<w, f_j> | <w, e_j>]
                dual = B[k + j] if j < k else B[j - k]
                if symp(w, dual, n):
                    lr |= 1 << j
            lam_rows.append(lr)
        if not all(symp(lam_rows[a], lam_rows[b], k) == (1 if (b == a + k and a < k) or (a == b + k and b < k) else 0)
                   for a in range(2 * k) for b in range(2 * k)):
            say("generators", False, f"generator {i}: logical action not symplectic")
        for w, lr in zip(wrows, lam_rows):
            img = 0                    # the logical combination sum_j lr_j B_j, over qubits
            for j in range(2 * k):
                if (lr >> j) & 1:
                    img ^= B[j]
            if not in_rowspace(w ^ img, S_red, S_piv):
                say("generators", False, f"generator {i}: logical image leaves the logical span")
        lam[i] = lam_rows
    say("generators", True, f"{len(used)} used generators are depth-one two-local, "
        f"symplectic and code-preserving, with 2k x 2k logical actions "
        f"({time.time() - t0:.0f} s)")

    # -- 12. words give the 3k-1 transvections --------------------------------
    tg = targets(k)
    missing = [t for t in tg if t not in words]
    say("words", not missing, f"words for all {len(tg)} transvections"
        + (f"; missing {missing[:4]}" if missing else ""))
    defined = set()
    for name, seq in macros.items():
        for it in seq:
            if not ((type(it) is int and 0 <= it < len(gens))
                    or (isinstance(it, str) and it in defined)):
                say("words", False, f"macro {name!r}: item {it!r} is neither a "
                    "generator index nor an earlier macro")
        defined.add(name)

    def product(seq, forward, values):
        m = eye(2 * k)
        for it in (seq if forward else reversed(seq)):
            step = lam[it] if type(it) is int else values[it]
            m = [vec_mat(row, mat_cols(step, k)) for row in m]
        return m

    values = {True: {}, False: {}}
    for forward in (True, False):
        for name, seq in macros.items():
            values[forward][name] = product(seq, forward, values[forward])
    bad_words = []
    for t, vec in tg.items():
        want = transvection(vec, k)
        if not (product(words[t], True, values[True]) == want
                or product(words[t], False, values[False]) == want):
            bad_words.append(t)
    say("words", not bad_words, f"all {len(tg)} words multiply exactly to their "
        f"transvections ({total_items} items in macros and words)"
        + (f"; wrong: {bad_words[:4]}" if bad_words else ""))

    # Fullness identities at k = 16: the exact matrix facts behind the elementary
    # generation proof in the outside critique (single-logical-qubit Cliffords and
    # an entangler between adjacent logical qubits, all inside the generated group).
    ident_ok = True
    for i in range(k):
        Te = transvection(tg[f"e{i + 1}"], k)
        Tf = transvection(tg[f"f{i + 1}"], k)
        Hc = mat_cols(mm_small(mm_small(Te, Tf), Te), k)
        e_i, f_i = 1 << i, 1 << (k + i)
        if vec_mat(e_i, Hc) != f_i or vec_mat(f_i, Hc) != e_i:
            ident_ok = False
        Sc = mat_cols(Tf, k)
        if vec_mat(1 << i, Sc) != (e_i | f_i):
            ident_ok = False
    cz_ok = True
    for i in range(k - 1):
        P = mm_small(mm_small(transvection(tg[f"e{i + 1}+e{i + 2}"], k),
                              transvection(tg[f"e{i + 1}"], k)),
                     transvection(tg[f"e{i + 2}"], k))
        Pc = mat_cols(P, k)
        fi, fj = 1 << (k + i), 1 << (k + i + 1)
        if vec_mat(fi, Pc) != (fi | (1 << (i + 1))) or vec_mat(fj, Pc) != (fj | (1 << i)):
            cz_ok = False
    say("fullness", ident_ok and cz_ok, "the transvections supply per-logical-qubit "
        "phase and Hadamard maps (T_f: e->e+f; H = T_e T_f T_e swaps e,f) and an "
        "adjacent-pair entangler (T_(e_i+e_j) T_ei T_ej: f_i->f_i+e_j, f_j->f_j+e_i, "
        "e's fixed), the matrix facts behind the critique's generation proof")

    # -- 13. generation calibration (small k) ----------------------------------
    calib = []
    for kk in (2, 4, 6, 8):
        okk, seen = orbit_transitive(kk, targets(kk))
        calib.append(f"k={kk}: {'transitive' if okk else 'NOT transitive'} "
                     f"({seen:,}/{(1 << (2 * kk)) - 1:,})")
        if not okk:
            say("fullness-calibration", False, "; ".join(calib))
    say("fullness-calibration", True, "orbit of e_1 under the 3k-1 target "
        "transvections covers all nonzero vectors at " + "; ".join(calib) +
        " (Dickson: a transvection group transitive on nonzero vectors is the "
        f"full Sp). The k = {k} orbit (2^32 - 1 vectors) is not machine-checked "
        "here; it is carried by the run's retained C program and the outside "
        "critique's independent proof")

    print(f"VERDICT: [[{n},{k},{claimed}]] indecomposable self-dual CSS code, check "
        f"weight {w_max}, qubit degree {d_max}, d = {claimed} exactly (witness plus "
        f"exhaustive search through weight {W}); all {len(tg)} transvection words "
        f"verified exactly; Sp({2 * k},2) generation machine-calibrated to k=8 and "
        f"carried at k={k} by orbitk.c, the outside critique and Dickson/Lickorish "
        f"({time.time() - t_start:.0f} s total)", flush=True)


if __name__ == "__main__":
    main()
