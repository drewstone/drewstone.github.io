#!/usr/bin/env node
/**
 * Research records: every agent record on the site is a function of stored evidence, a pinned converter and a review.
 *
 *   research/publications/<id>/manifest.json  which store snapshot, which converter, which record digest
 *   research/publications/<id>/overlay.json   the review: the only path by which a body becomes public
 *   research/publications/<id>/lock.json      digests of the last build (manifest, record, overlay, public projection),
 *                                             signed by the build that reproduced them from the store
 *   research/publications/idmap.json          old event ids to current ids, so published links keep resolving
 *   research/publications/published-ids.json every event id ever public, per record (append-only)
 *   research/publications/attestation-keys.json  public keys whose lock signatures the site build accepts
 *   public/research/records/<id>.json         the public projection, a checked build output
 *
 *   node tools/research-records.mjs check            offline gates G1, G6-G10; runs before every site build, no network
 *   node tools/research-records.mjs build [<id>...]  from the store: materialize, convert, apply the review, check the
 *                                                    pins, write, and sign the lock (G10)
 *   node tools/research-records.mjs verify [<id>...] store gates G2-G5: objects present, pinned, record and projection
 *                                                    reproduced byte for byte; --run-dir uses a local copy of one
 *                                                    snapshot once every file matches its manifest;
 *                                                    --if-changed skips when no gated path changed (pre-push)
 *
 * build and verify need the evidence store: EVIDENCE_CLI (discovery-lab tools/evidence.mjs) and its credentials
 * (DISCOVERY_EVIDENCE_ENV with DOTENV_KEYS, or DISCOVERY_EVIDENCE_STORE). build signs with BLOG_RECORDS_SIGNING_KEY from
 * the same encrypted file. The site build never downloads evidence: G10 checks that signature instead, so a lock edited
 * by hand (a re-hashed overlay, a manifest naming another snapshot) fails the deployed build.
 * Every failure names its gate, record and reason; the exit code is non-zero when any gate fails.
 */
import { execFile } from 'node:child_process'
import { createHash, createPrivateKey, createPublicKey, sign as signBytes, verify as verifyBytes } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, mkdtemp, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { hostname, tmpdir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

const exec = promisify(execFile)
const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))
const PUB = join(ROOT, 'research/publications')
const PUBLIC = join(ROOT, 'public/research/records')
const POSTS = join(ROOT, 'src/content/research')
const CITATION_ROOTS = [join(ROOT, 'src/content'), join(ROOT, 'research')]
const CONVERTER = '@drewstone/agent-record'
const ID = /^[a-z0-9][a-z0-9._-]*$/
const HEX = /^[0-9a-f]{64}$/
const DIGEST = /^sha256:[0-9a-f]{64}$/

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')
const json = (value) => `${JSON.stringify(value, null, 2)}\n`
const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'))

async function writeAtomic(path, text) {
  await mkdir(dirname(path), { recursive: true })
  const temporary = `${path}.${process.pid}.tmp`
  await writeFile(temporary, text)
  await rename(temporary, path)
}

class Gate {
  failures = []
  fail(gate, record, reason) {
    this.failures.push({ gate, record, reason })
  }
  report(label) {
    for (const { gate, record, reason } of this.failures) process.stderr.write(`[research-records] ${gate} ${record ?? '-'}: ${reason}\n`)
    if (!this.failures.length) process.stderr.write(`[research-records] ${label}: pass\n`)
    return this.failures.length ? 1 : 0
  }
}

// ---------------------------------------------------------------- reading the publication

async function recordIds() {
  const entries = await readdir(PUB, { withFileTypes: true }).catch(() => [])
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()
}

async function readPublication(id) {
  const dir = join(PUB, id)
  const read = async (name) => {
    const path = join(dir, name)
    if (!existsSync(path)) return { path, missing: true }
    const bytes = await readFile(path)
    try {
      return { path, bytes, value: JSON.parse(bytes.toString('utf8')) }
    } catch (error) {
      return { path, bytes, invalid: error.message }
    }
  }
  return { id, manifest: await read('manifest.json'), overlay: await read('overlay.json'), lock: await read('lock.json') }
}

/** record_ids of every research post (front matter, inline or block list). */
async function citedRecords() {
  const cited = new Map()
  for (const name of (await readdir(POSTS)).filter((file) => /\.mdx?$/.test(file))) {
    const text = await readFile(join(POSTS, name), 'utf8')
    const front = /^---\n([\s\S]*?)\n---/.exec(text)?.[1] ?? ''
    const inline = /^record_ids:\s*\[(.*)\]\s*$/m.exec(front)?.[1]
    const block = /^record_ids:\s*\n((?:\s+-\s+.*\n?)+)/m.exec(front)?.[1]
    const ids = inline !== undefined
      ? inline.split(',').map((item) => item.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
      : (block ?? '').split('\n').map((line) => line.replace(/^\s+-\s+/, '').trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
    cited.set(name.replace(/\.mdx?$/, ''), ids)
  }
  return cited
}

async function walkFiles(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) await walkFiles(path, out)
    else if (entry.isFile()) out.push(path)
  }
  return out
}

/** Every `?event=` link in the site sources and research notes, with the record it names. */
async function eventCitations(posts) {
  const found = []
  for (const root of CITATION_ROOTS) {
    for (const path of await walkFiles(root)) {
      if (!/\.(mdx?|json|astro|html|txt)$/.test(path) || path.startsWith(PUB)) continue
      const text = await readFile(path, 'utf8')
      for (const match of text.matchAll(/(?:\/research\/([a-z0-9-]+)\/?)?\?[^\s"'<>)`]*?\bevent=([A-Za-z0-9][A-Za-z0-9:._~%-]*)[^\s"'<>)`]*/g)) {
        const query = new URLSearchParams(match[0].slice(match[0].indexOf('?') + 1))
        const runId = query.get('pursuit') ?? posts.get(match[1] ?? '')?.[0] ?? null
        found.push({ file: relative(ROOT, path), runId, event: decodeURIComponent(match[2]) })
      }
    }
  }
  return found
}

// ---------------------------------------------------------------- schemas (shape checks, no dependencies)

function checkManifest(gate, id, m) {
  const bad = (reason) => gate.fail('G1', id, `manifest.json ${reason}`)
  if (m.schema !== 'publication.manifest.v1') bad('schema is not publication.manifest.v1')
  if (m.recordId !== id) bad(`recordId ${m.recordId} differs from its directory`)
  const cited = m.snapshots ?? [{ prefix: m.store?.prefix, namespace: m.store?.namespace, snapshot: m.snapshot }]
  for (const item of cited) {
    if (!item.namespace || !ID.test(item.namespace)) bad('names no store namespace')
    if (!DIGEST.test(String(item.snapshot))) bad('names no snapshot manifest digest (sha256:<hex>)')
  }
  if (m.store?.bucket !== 'discovery-evidence') bad('names a bucket other than discovery-evidence')
  if (m.converter?.package !== CONVERTER || !m.converter?.version || !m.converter?.adapter || !m.converter?.idScheme) bad('names no pinned converter')
  if (!DIGEST.test(String(m.recordDigest))) bad('names no record digest')
  if (m.overlay !== 'overlay.json') bad('overlay must be overlay.json')
  if (m.public !== `public/research/records/${id}.json`) bad(`public must be public/research/records/${id}.json`)
}

function checkOverlay(gate, id, o) {
  const bad = (reason) => gate.fail('G1', id, `overlay.json ${reason}`)
  if (o.schema !== 'publication.overlay.v1') bad('schema is not publication.overlay.v1')
  if (o.recordId !== id) bad(`recordId ${o.recordId} differs from its directory`)
  if (o.defaults?.bodies !== 'withheld') bad('must withhold bodies by default')
  for (const [eventId, entry] of Object.entries(o.events ?? {})) {
    if (!HEX.test(String(entry.sourceSha256))) bad(`event ${eventId} has no sourceSha256`)
    if (!['full', 'redacted', 'excerpt', 'summary'].includes(entry.mode)) bad(`event ${eventId} has mode ${entry.mode}`)
  }
  for (const [eventId, entry] of Object.entries(o.findings ?? {})) {
    if (!HEX.test(String(entry.sourceSha256))) bad(`finding ${eventId} has no sourceSha256`)
  }
  if (!o.reviewer?.by || !o.reviewer?.at) bad('names no reviewer')
}

function checkLock(gate, id, l, m) {
  const bad = (reason) => gate.fail('G1', id, `lock.json ${reason}`)
  if (l.schema !== 'publication.lock.v1') bad('schema is not publication.lock.v1')
  for (const key of ['overlaySha256', 'publicSha256']) if (!HEX.test(String(l[key]))) bad(`has no ${key}`)
  if (m && l.recordDigest !== m.recordDigest) gate.fail('G6', id, 'lock.recordDigest differs from manifest.recordDigest')
  if (m && JSON.stringify(l.snapshot) !== JSON.stringify(m.snapshots ?? m.snapshot)) gate.fail('G6', id, 'lock.snapshot differs from the manifest')
  if (m && JSON.stringify(l.converter) !== JSON.stringify(m.converter)) gate.fail('G6', id, 'lock.converter differs from the manifest')
}

// ---------------------------------------------------------------- G8: what public bytes may never contain

const LEAKS = [
  ['credential', /\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{16,}/],
  ['credential', /\b(?:ghp|gho|ghs|ghu|ghr)_[A-Za-z0-9]{20,}|\bgithub_pat_[A-Za-z0-9_]{20,}/],
  ['credential', /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ['credential', /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/],
  ['credential', /\bAIza[0-9A-Za-z_-]{30,}/],
  ['credential', /\beyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/],
  ['credential', /\b[Bb]earer\s+[A-Za-z0-9._~+/-]{20,}/],
  ['credential', /\b(?:api[_-]?key|secret|token|password|passwd)\s*[=:]\s*["']?(?![\[<$])[A-Za-z0-9_\-+/]{16,}/i],
  // Also the dash-encoded form a Pi or Claude Code session directory uses for its working directory (--home-drew-code-…).
  ['private-path', /[/-](?:home|Users)[/-]drew\b|\/tmp\/claude-|\/private\/tmp\b/],
  ['encrypted-message', /\bgAAAAA[A-Za-z0-9_-]{20,}/],
  ['nonce', /\bnonce["']?\s*[:=]\s*["']?[0-9a-f]{16,}/i],
]
// The domain runs to its last label; `a@np.linalg.eigvalsh(b)` in Python is matrix multiplication, not an address.
const EMAIL = /[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,24}(?!\.?[\w(-])/g
const EMAIL_ALLOW = new Set(['noreply@anthropic.com', 'git@github.com'])
const HIDDEN_KEYS = new Set(['reasoning', 'thinking', 'reasoningText', 'encrypted_content'])

function scanPublic(gate, id, text, record, overlay) {
  // Patterns run on decoded strings, so a JSON escape (\n, \t) never joins or splits a match.
  const strings = []
  const walk = (value, path) => {
    if (typeof value === 'string') strings.push([path, value])
    if (!value || typeof value !== 'object') return
    for (const [key, inner] of Object.entries(value)) {
      strings.push([`${path}/${key}`, key])
      // Token counters named `reasoning` are numbers; reasoning text is a string or a block list.
      if (HIDDEN_KEYS.has(key) && (typeof inner === 'string' ? inner !== '' : inner !== null && typeof inner === 'object'))
        gate.fail('G8', id, `public record holds a ${key} field at ${path}/${key}`)
      if (key === 'type' && (inner === 'thinking' || inner === 'redacted_thinking')) gate.fail('G8', id, `public record holds a thinking block at ${path}`)
      walk(inner, `${path}/${key}`)
    }
  }
  walk(record, '')
  const found = new Set()
  for (const [path, value] of strings) {
    for (const [kind, pattern] of LEAKS) {
      const hit = pattern.exec(value)
      if (hit && !found.has(kind)) {
        found.add(kind)
        gate.fail('G8', id, `public record holds a ${kind} at ${path} (${hit[0].slice(0, 12)}…)`)
      }
    }
    for (const hit of value.matchAll(EMAIL)) {
      if (!found.has('email') && !EMAIL_ALLOW.has(hit[0].toLowerCase()) && !/\.(png|jpe?g|svg|js|ts|py|md|sh|rs|go|json)$/i.test(hit[0])) {
        found.add('email')
        gate.fail('G8', id, `public record holds an email address outside the allowlist at ${path} (${hit[0].replace(/^(.{2}).*@/, '$1…@')})`)
      }
    }
  }
  // Every published body traces to the review.
  for (const event of record.events ?? []) {
    const d = event.detail ?? {}
    const entry = overlay.events?.[event.id]
    if (d.publicText !== undefined && entry?.text !== d.publicText)
      gate.fail('G8', id, `event ${event.id} publishes text the overlay does not approve`)
    for (const call of d.publicToolCalls ?? []) {
      const approved = entry?.toolCalls?.find((item) => item.id === call.id)
      if (!approved || approved.input !== call.input) gate.fail('G8', id, `event ${event.id} publishes tool input ${call.id} the overlay does not approve`)
    }
    const finding = overlay.findings?.[event.id]
    if (d.recordedClaim !== undefined && !finding) gate.fail('G8', id, `finding ${event.id} is public without a review`)
    if (finding?.text !== undefined && d.recordedClaim !== finding.text) gate.fail('G8', id, `finding ${event.id} publishes text other than its reviewed excerpt`)
    if (d.assessment !== undefined && overlay.findings?.[event.id]?.assessment !== d.assessment)
      gate.fail('G8', id, `finding ${event.id} assessment differs from its review`)
  }
}

// ---------------------------------------------------------------- the review overlay

// Metadata a public record keeps. Anything else a converter adds stays private until it is listed here.
const NODE_FIELDS = ['id', 'label', 'parent', 'kind', 'role', 'model', 'modelSource', 'servedModel', 'harness', 'start', 'end', 'status',
  'nativeSessionId', 'agentId', 'joinBasis', 'joinProof', 'sandboxes', 'capture']
const DETAIL_FIELDS = ['role', 'lifecycle', 'subject', 'atBasis', 'toolCallId', 'isError', 'responseStatus', 'responseReportedModel', 'responseId',
  'usage', 'usageScope', 'durationMs', 'costListUsd', 'usdKnown', 'costScope', 'rateLimit', 'spent', 'data', 'sidechain', 'synthetic', 'recordType',
  'recordSubtype', 'nativeRecordId', 'nativeParentId', 'anchorRange', 'title', 'createdAt', 'pageKind', 'bodyLine', 'contentSha256',
  'contentCharacters']
const BODY_FIELDS = ['publicText', 'reasoning', 'publicToolCalls', 'clip', 'recordedClaim', 'body', 'content']
const NATIVE_RECORD_FIELDS = ['version', 'id', 'parentId', 'provider', 'modelId', 'thinkingLevel', 'customType']
// Prose inside a lifecycle payload is a body too: an error reason, a prompt, captured output.
const PROSE_KEYS = new Set(['reason', 'cause', 'detail', 'error', 'message', 'text', 'prompt', 'task', 'instruction', 'output', 'stdout', 'stderr', 'cwd'])
function withoutProse(value) {
  if (Array.isArray(value)) return value.map(withoutProse)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(Object.entries(value).filter(([key]) => !PROSE_KEYS.has(key)).map(([key, inner]) => [key, withoutProse(inner)]))
}
// A source path keeps its shape, but not the private home it names: a Pi session directory encodes its working directory
// (trace/pi-sessions/--home-drew-code-…), which G8 refuses like /home/drew itself.
const redactPath = (path) =>
  typeof path === 'string' ? path.replace(/\/(?:home|Users)\/drew\b/g, '[home]').replace(/-(?:home|Users)-drew\b/g, '-[home]') : path

/**
 * The public projection of a converted record: metadata, plus exactly the bodies the overlay approves.
 * Throws when an overlay entry, node or withheld id has no match in the record (G5: the review no longer fits it).
 */
export function applyOverlay(record, overlay) {
  if (overlay.recordId !== record.runId) throw new Error(`overlay is for ${overlay.recordId}, the record is ${record.runId}`)
  const events = new Map(record.events.map((event) => [event.id, event]))
  const nodes = new Map(record.nodes.map((node) => [node.id, node]))
  const unmatched = [
    ...Object.keys(overlay.events ?? {}).filter((id) => !events.has(id)).map((id) => `event ${id}`),
    ...Object.keys(overlay.findings ?? {}).filter((id) => !events.has(id)).map((id) => `finding ${id}`),
    ...Object.keys(overlay.nodes ?? {}).filter((id) => !nodes.has(id)).map((id) => `node ${id}`),
    ...(overlay.withhold ?? []).filter((w) => (w.event && !events.has(w.event)) || (w.node && !nodes.has(w.node))).map((w) => `withheld ${w.event ?? w.node}`),
    ...(overlay.withhold ?? []).filter((w) => w.recordType && !record.events.some((event) => event.detail?.recordType === w.recordType)).map((w) => `withheld record type ${w.recordType}`),
  ]
  if (unmatched.length) throw new Error(`overlay entries match nothing in the record: ${unmatched.slice(0, 5).join(', ')}${unmatched.length > 5 ? ' …' : ''}`)
  const hiddenNodes = new Set((overlay.withhold ?? []).flatMap((w) => (w.node ? [w.node] : [])))
  // Withheld: whole nodes, single events, or every native record line of one type (such as harness attachments).
  const hiddenTypes = new Set((overlay.withhold ?? []).flatMap((w) => (w.recordType ? [w.recordType] : [])))
  // Hidden thinking is never published, so an assistant entry that holds nothing else (thinking, or an encrypted
  // reasoning item with no readable content) is withheld whole. A failed request stays: its failure is the record.
  const thinkingOnly = (event) => {
    const d = event.detail ?? {}
    return event.kind === 'message' && d.role === 'assistant' && !d.publicText && !(d.publicToolCalls ?? []).length &&
      d.toolCallId === undefined && d.responseStatus !== 'error'
  }
  const withholdThinking = (overlay.withhold ?? []).some((w) => w.class === 'hidden-thinking')
  const hiddenEvents = new Set([
    ...(overlay.withhold ?? []).flatMap((w) => (w.event ? [w.event] : [])),
    ...record.events.filter((event) => !overlay.events?.[event.id] && (hiddenTypes.has(event.detail?.recordType) || (withholdThinking && thinkingOnly(event)))).map((event) => event.id),
  ])
  const pick = (value, fields) => Object.fromEntries(fields.filter((key) => value[key] !== undefined).map((key) => [key, value[key]]))

  for (const id of [...Object.keys(overlay.events ?? {}), ...Object.keys(overlay.findings ?? {})])
    if (hiddenEvents.has(id) || hiddenNodes.has(events.get(id).node)) throw new Error(`overlay both publishes and withholds ${id}`)
  const publicNodes = record.nodes.filter((node) => !hiddenNodes.has(node.id)).map((node) => {
    const review = overlay.nodes?.[node.id] ?? {}
    return { ...pick(node, NODE_FIELDS), ...pick(review, ['label', 'role', 'assignment']) }
  })
  const publicEvents = record.events.filter((event) => !hiddenEvents.has(event.id) && !hiddenNodes.has(event.node)).map((event) => {
    const detail = pick(event.detail ?? {}, DETAIL_FIELDS)
    // A native record line keeps its identifiers and settings; a lifecycle payload keeps its structure without prose.
    if (detail.data !== undefined) detail.data = detail.recordType ? pick(detail.data ?? {}, NATIVE_RECORD_FIELDS) : withoutProse(detail.data)
    const calls = event.detail?.publicToolCalls ?? []
    if (calls.length) {
      detail.toolNames = calls.map((call) => call.name)
      detail.toolCallIds = calls.map((call) => call.id)
    }
    const entry = overlay.events?.[event.id]
    if (entry) {
      if (entry.text !== undefined) detail.publicText = entry.text
      if (entry.toolCalls) {
        detail.publicToolCalls = entry.toolCalls.map((call) => ({ id: call.id, name: call.name, input: call.input, ...(call.note ? { publicationNote: call.note } : {}) }))
      }
      detail.publicationMode = entry.mode
      if (entry.text !== undefined || entry.note) detail.publicationNote = entry.note ?? null
    } else if (event.detail?.role && BODY_FIELDS.some((key) => key !== 'publicToolCalls' && event.detail[key] !== undefined && event.detail[key] !== '')) {
      // A conversation entry says its body is withheld; a lifecycle reason is withheld without comment.
      detail.contentOmitted = 'Body not published.'
    }
    const finding = overlay.findings?.[event.id]
    if (finding) {
      // A review may publish the whole finding or a marked excerpt of it.
      const claim = finding.text ?? event.detail?.recordedClaim ?? event.detail?.body ?? event.detail?.publicText
      if (claim !== undefined) detail.recordedClaim = claim
      if (finding.mode) detail.publicationMode = finding.mode
      if (finding.note) detail.publicationNote = finding.note
      if (finding.attribution) detail.authorAttribution = finding.attribution
      detail.assessment = finding.assessment
      delete detail.contentOmitted
    }
    const source = event.source ? { ...event.source, path: redactPath(event.source.path) } : null
    return { id: event.id, node: event.node, at: event.at, kind: event.kind, category: event.category, label: event.label, source, detail }
  })
  const summary = overlay.assignment?.summary ?? {}
  return {
    schema: record.schema,
    runId: record.runId,
    title: overlay.title ?? record.title,
    ...pick(record, ['producer', 'format', 'idScheme', 'input']),
    nodes: publicNodes,
    events: publicEvents,
    sources: (record.sources ?? []).map((source) => ({ ...source, path: redactPath(source.path) })),
    assignment: {
      objective: summary.objective ?? '',
      suppliedKnowledge: summary.suppliedKnowledge ?? '',
      deliverables: summary.deliverables ?? '',
      constraints: summary.constraints ?? '',
      source: overlay.assignment?.source ?? null,
    },
    terminal: record.terminal ?? null,
    coverage: { ...(record.coverage ?? {}), publicContent: overlay.coverageText ?? '' },
  }
}

/** G5: each overlay entry is bound to the source bytes it was reviewed against. `runDir` is the materialized snapshot. */
export async function checkReviewSources(record, overlay, runDir) {
  const issues = []
  const events = new Map(record.events.map((event) => [event.id, event]))
  const files = new Map()
  const bytesOf = async (path) => {
    if (!files.has(path)) files.set(path, await readFile(join(runDir, path)))
    return files.get(path)
  }
  const reviewed = [
    ...Object.entries(overlay.events ?? {}).map(([id, entry]) => ({ id, entry })),
    ...Object.entries(overlay.findings ?? {}).map(([id, entry]) => ({ id, entry })),
  ]
  for (const { id, entry } of reviewed) {
    const source = events.get(id)?.source
    if (!source?.path) {
      issues.push(`${id} has no source in the record`)
      continue
    }
    let bytes
    try {
      bytes = await bytesOf(source.path)
    } catch {
      issues.push(`${id}: ${source.path} is not in the snapshot`)
      continue
    }
    // A finding entry on a whole page reviews the page; on a line or JSON value it reviews that line or value.
    let reviewedBytes = bytes
    if (source.line) {
      const lines = bytes.toString('utf8').split('\n')
      reviewedBytes = Buffer.from((lines[source.line - 1] ?? '').replace(/\r$/, ''), 'utf8')
    } else if (source.pointer) {
      let value = JSON.parse(bytes.toString('utf8'))
      for (const raw of source.pointer.split('/').slice(1)) value = value?.[raw.replaceAll('~1', '/').replaceAll('~0', '~')]
      reviewedBytes = Buffer.from(typeof value === 'string' ? value : JSON.stringify(value), 'utf8')
    }
    if (sha256(reviewedBytes) !== entry.sourceSha256) issues.push(`${id}: the reviewed source bytes changed (${source.path}${source.line ? `:${source.line}` : source.pointer ?? ''})`)
  }
  return issues
}

// ---------------------------------------------------------------- G10: the lock is the store build's signed statement

// The site build has no store credentials, so it cannot re-read the evidence. It checks instead that every digest in the
// lock was signed by `build`, which only signs after reproducing the record from the store (G2, G4, G5) and finding
// its snapshot pinned (G3). A hand-edited lock, overlay or manifest therefore fails the deployed build.
const KEYS = join(PUB, 'attestation-keys.json')
const SIGNING_KEY = 'BLOG_RECORDS_SIGNING_KEY'
const keyIdOf = (publicKey) => sha256(publicKey.export({ type: 'spki', format: 'der' })).slice(0, 16)

/** The signed statement: the record's inputs and outputs by digest. */
function attestation(lock, manifestBytes) {
  return Buffer.from(JSON.stringify({
    schema: 'publication.attestation.v1',
    recordId: lock.recordId,
    manifestSha256: sha256(manifestBytes),
    snapshot: lock.snapshot,
    converter: lock.converter,
    recordDigest: lock.recordDigest,
    overlaySha256: lock.overlaySha256,
    publicSha256: lock.publicSha256,
  }))
}

async function trustedKeys() {
  const keys = new Map()
  if (!existsSync(KEYS)) return keys
  for (const entry of (await readJson(KEYS)).keys ?? []) {
    const key = createPublicKey({ key: Buffer.from(entry.publicKey, 'base64'), format: 'der', type: 'spki' })
    if (keyIdOf(key) === entry.id) keys.set(entry.id, key)
  }
  return keys
}

function checkSignature(gate, id, lock, manifestBytes, keys) {
  const signed = lock.attestation
  if (!signed?.keyId || !signed?.signature) {
    gate.fail('G10', id, 'lock.json is unsigned: run `research-records build` where the evidence store is reachable')
    return
  }
  const key = keys.get(signed.keyId)
  if (!key) gate.fail('G10', id, `lock.json is signed by key ${signed.keyId}, which attestation-keys.json does not list`)
  else if (!verifyBytes(null, attestation(lock, manifestBytes), key, Buffer.from(signed.signature, 'base64')))
    gate.fail('G10', id, 'the lock signature does not cover these manifest, overlay and projection digests (rebuild from the store)')
}

/** The build host's signing key (BLOG_RECORDS_SIGNING_KEY: base64 PKCS#8 DER), from the environment or the store's vault. */
async function signingKey() {
  const env = storeEnvironment()
  let value = env[SIGNING_KEY]
  if (!value && env.DISCOVERY_EVIDENCE_ENV) {
    const { stdout } = await exec('dotenvx', ['get', SIGNING_KEY, '-f', env.DISCOVERY_EVIDENCE_ENV, ...(env.DOTENV_KEYS ? ['-fk', env.DOTENV_KEYS] : [])], { env }).catch(() => ({ stdout: '' }))
    value = stdout.trim()
  }
  if (!value) throw new Error(`${SIGNING_KEY} is not available here; build signs every lock, so it runs only where the store vault is`)
  const key = createPrivateKey({ key: Buffer.from(value, 'base64'), format: 'der', type: 'pkcs8' })
  const keyId = keyIdOf(createPublicKey(key))
  if (!(await trustedKeys()).has(keyId)) throw new Error(`signing key ${keyId} is not in research/publications/attestation-keys.json`)
  return { key, keyId }
}

// ---------------------------------------------------------------- G7: links resolve

function resolveId(eventIds, map, id) {
  const seen = new Set()
  let current = id
  while (current !== undefined) {
    if (eventIds.has(current)) return { id: current }
    if (seen.has(current)) return { error: `the id map cycles at ${current}` }
    seen.add(current)
    current = map[current]
  }
  return { error: `${id} resolves to no event` }
}

// ---------------------------------------------------------------- check (offline)

let parser
async function viewerIssues(record) {
  parser ??= import(pathToFileURL(join(ROOT, 'node_modules', CONVERTER, 'dist/record.js')).href).then((module) => module.recordSchema)
  const result = (await parser).safeParse(record)
  return result.success ? null : result.error.issues.slice(0, 3).map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')
}

export async function check({ ids } = {}) {
  const gate = new Gate()
  const all = await recordIds()
  const posts = await citedRecords()
  const cited = new Set([...posts.values()].flat())
  const idmap = existsSync(join(PUB, 'idmap.json')) ? (await readJson(join(PUB, 'idmap.json'))).records ?? {} : {}
  const ledger = existsSync(join(PUB, 'published-ids.json')) ? (await readJson(join(PUB, 'published-ids.json'))).records ?? {} : {}
  const keys = await trustedKeys()
  const records = new Map()

  for (const id of ids ?? all) {
    if (!ID.test(id)) {
      gate.fail('G1', id, 'record id is not a lowercase slug')
      continue
    }
    const pub = await readPublication(id)
    for (const part of ['manifest', 'overlay', 'lock']) {
      if (pub[part].missing) gate.fail('G1', id, `${part}.json is missing`)
      if (pub[part].invalid) gate.fail('G1', id, `${part}.json is not JSON: ${pub[part].invalid}`)
    }
    const m = pub.manifest.value
    const o = pub.overlay.value
    const l = pub.lock.value
    if (m) checkManifest(gate, id, m)
    if (o) checkOverlay(gate, id, o)
    if (l) checkLock(gate, id, l, m)
    if (l && pub.manifest.bytes) checkSignature(gate, id, l, pub.manifest.bytes, keys)
    if (m && !cited.has(id) && m.unlisted !== true) gate.fail('G1', id, 'no research post cites this record and it is not marked unlisted')
    const publicPath = join(PUBLIC, `${id}.json`)
    if (!existsSync(publicPath)) {
      gate.fail('G6', id, `${relative(ROOT, publicPath)} is missing`)
      continue
    }
    const bytes = await readFile(publicPath)
    if (l && sha256(bytes) !== l.publicSha256) gate.fail('G6', id, 'public record bytes differ from lock.publicSha256')
    if (l && pub.overlay.bytes && sha256(pub.overlay.bytes) !== l.overlaySha256) gate.fail('G6', id, 'overlay.json differs from lock.overlaySha256 (rebuild after review)')
    let record
    try {
      record = JSON.parse(bytes.toString('utf8'))
    } catch (error) {
      gate.fail('G6', id, `public record is not JSON: ${error.message}`)
      continue
    }
    if (record.schema !== 'agent-record.v1' || record.runId !== id) gate.fail('G6', id, 'public record is not the agent-record.v1 projection of this id')
    // The page renders what the installed viewer accepts; a record it would refuse fails here, not mid-build.
    const issues = await viewerIssues(record)
    if (issues) gate.fail('G6', id, `the viewer refuses the public record: ${issues}`)
    if (o) scanPublic(gate, id, bytes.toString('utf8'), record, o)
    records.set(id, record)
  }

  // G9: nothing public without a manifest.
  for (const name of await readdir(PUBLIC).catch(() => [])) {
    const id = name.replace(/\.json$/, '')
    if (!existsSync(join(PUB, id, 'manifest.json'))) gate.fail('G9', id, `${relative(ROOT, join(PUBLIC, name))} has no manifest`)
  }
  // Every cited record is a publication.
  for (const [post, list] of posts) for (const id of list) if (!all.includes(id)) gate.fail('G1', id, `${post} cites a record with no publication`)

  // G7: every id ever published, every cited link and every map target resolves to a current event.
  const resolveIn = (runId, eventId, where) => {
    const record = records.get(runId)
    if (!record) {
      if (!ids || ids.includes(runId)) gate.fail('G7', runId, `${where} names event ${eventId} in a record that is not published`)
      return
    }
    const result = resolveId(new Set(record.events.map((event) => event.id)), idmap[runId] ?? {}, eventId)
    if (result.error) gate.fail('G7', runId, `${where}: ${result.error}`)
  }
  for (const [runId, list] of Object.entries(ledger)) for (const eventId of list) resolveIn(runId, eventId, 'published-ids.json')
  for (const [runId, map] of Object.entries(idmap)) for (const [from, to] of Object.entries(map)) resolveIn(runId, to, `idmap ${from}`)
  for (const citation of await eventCitations(posts)) {
    if (!citation.runId) gate.fail('G7', null, `${citation.file} links event ${citation.event} without a record`)
    else resolveIn(citation.runId, citation.event, citation.file)
  }
  for (const [id, record] of records) {
    const missing = record.events.filter((event) => !(ledger[id] ?? []).includes(event.id))
    if (missing.length) gate.fail('G7', id, `published-ids.json lacks ${missing.length} public event ids (run build)`)
  }
  return gate
}

// ---------------------------------------------------------------- the store (GTR)

// GTR defaults: the deployed discovery-lab and the encrypted store credentials the research tool also reads.
const HOME = process.env.HOME ?? ''
const STORE_ENV = {
  EVIDENCE_CLI: join(HOME, '.local/share/discovery-lab-rollup/tools/evidence.mjs'),
  DISCOVERY_EVIDENCE_ENV: join(HOME, '.local/state/fleet/discovery/evidence-store.env'),
  DOTENV_KEYS: join(HOME, 'company/devops/secrets/.env.keys'),
}
function storeEnvironment() {
  const env = { ...process.env }
  for (const [key, path] of Object.entries(STORE_ENV)) if (!env[key] && existsSync(path)) env[key] = path
  if (env.DISCOVERY_EVIDENCE_STORE) delete env.DISCOVERY_EVIDENCE_ENV
  return env
}

async function evidence(args, { allowFailure = false } = {}) {
  const env = storeEnvironment()
  const cli = env.EVIDENCE_CLI
  if (!cli || !existsSync(cli)) throw new Error('EVIDENCE_CLI must name discovery-lab tools/evidence.mjs (build and verify run on GTR)')
  try {
    const { stdout } = await exec(process.execPath, [cli, ...args], { maxBuffer: 1 << 28, cwd: dirname(dirname(cli)), env })
    return stdout.trim().split('\n').filter(Boolean).map((line) => JSON.parse(line))
  } catch (error) {
    if (allowFailure && error.stdout?.trim()) return error.stdout.trim().split('\n').filter(Boolean).map((line) => JSON.parse(line))
    // The CLI's own reason: its `[evidence] Error: …` line, or the status it printed (for example `missing`).
    const reason = (error.stderr ?? '').split('\n').find((line) => line.startsWith('[evidence] Error:'))?.replace('[evidence] Error: ', '')
      ?? (error.stdout?.trim() ? JSON.parse(error.stdout.trim().split('\n').at(-1)).status : null)
      ?? (error.stderr || error.message).trim().split('\n')[0]
    throw new Error(`evidence ${args[0]} ${args[1] ?? ''} ${args[2] ?? ''}: ${reason}`.replace(/\s+:/, ':'))
  }
}

async function converter() {
  const root = join(ROOT, 'node_modules', CONVERTER)
  const pkg = await readJson(join(root, 'package.json'))
  const adapter = await import(pathToFileURL(join(root, 'dist/agent-runtime.js')).href)
  return { root, pkg, adapter, ingest: join(root, 'tools/ingest.mjs') }
}

/** Materialize the cited snapshot, convert it with the pinned converter and apply the review. */
async function regenerate(id, manifest, overlay, work, conv, { runDir: localRun } = {}) {
  const cited = manifest.snapshots ?? [{ prefix: manifest.store.prefix, namespace: manifest.store.namespace, snapshot: manifest.snapshot }]
  if (cited.length !== 1) throw new Error('a publication cites exactly one snapshot (a bundle is one snapshot)')
  const [snapshot] = cited
  const prefix = snapshot.prefix ?? 'runs/'
  const snapshotPath = join(work, 'snapshot.json')
  await evidence(['get', snapshot.namespace, snapshot.snapshot, '--out', snapshotPath, '--prefix', prefix])
  if (`sha256:${sha256(await readFile(snapshotPath))}` !== snapshot.snapshot) throw new Error('the snapshot manifest does not hash to its digest')
  const snapshotManifest = await readJson(snapshotPath)
  let runDir = join(work, 'run')
  let materialized
  if (localRun) {
    // A local copy (the trace drive, a pin mirror) stands in for the store only when every file matches the manifest.
    runDir = localRun
    const bad = []
    for (const file of snapshotManifest.files) {
      const bytes = await readFile(join(runDir, file.path)).catch(() => null)
      if (!bytes) bad.push(`${file.path} is missing`)
      else if (`sha256:${sha256(bytes)}` !== file.sha256) bad.push(`${file.path} does not match the snapshot (sha256 ${sha256(bytes).slice(0, 12)})`)
    }
    if (bad.length) throw new Error(`${runDir}: ${bad.slice(0, 3).join('; ')}${bad.length > 3 ? ` (+${bad.length - 3})` : ''}`)
    materialized = { out: runDir, manifest: snapshot.snapshot, files: snapshotManifest.files.length, local: true }
  } else {
    ;[materialized] = await evidence(['materialize', snapshot.namespace, snapshot.snapshot, '--out', runDir, '--prefix', prefix])
  }
  const recordPath = join(work, 'record.json')
  // A bundle (several harnesses as one record) names its own record id; a run directory takes the publication's.
  const bundle = existsSync(join(runDir, 'bundle.json'))
  const { stdout } = await exec(process.execPath, [conv.ingest, runDir, ...(bundle ? [] : ['--run-id', id]), '--manifest', snapshotPath, '--out', recordPath], { maxBuffer: 1 << 26 })
  const summary = JSON.parse(stdout.trim().split('\n').at(-1))
  const recordBytes = await readFile(recordPath)
  const record = JSON.parse(recordBytes.toString('utf8'))
  if (record.runId !== id) throw new Error(`the snapshot converts to record ${record.runId}, not ${id}`)
  const projected = applyOverlay(record, overlay)
  const reviewIssues = await checkReviewSources(record, overlay, runDir)
  return { materialized, summary, record, recordDigest: `sha256:${sha256(recordBytes)}`, projected, reviewIssues, snapshotManifest }
}

function converterIdentity(conv, record) {
  return { package: CONVERTER, version: conv.pkg.version, adapter: conv.adapter.ADAPTER_VERSION, idScheme: record.idScheme ?? null }
}

export async function build({ ids } = {}) {
  const conv = await converter()
  const signer = await signingKey()
  // G3 before anything is signed: a record whose snapshot could still be deleted is not published.
  const pins = new Gate()
  await checkPins(pins)
  if (pins.failures.length) {
    pins.report('pins')
    throw new Error('the cited snapshots are not pinned; run evidence.mjs pin --from research/publications, then build')
  }
  const targets = ids?.length ? ids : await recordIds()
  const ledgerPath = join(PUB, 'published-ids.json')
  const ledger = existsSync(ledgerPath) ? await readJson(ledgerPath) : { schema: 'publication.published-ids.v1', records: {} }
  for (const id of targets) {
    const pub = await readPublication(id)
    if (!pub.manifest.value || !pub.overlay.value) throw new Error(`${id}: manifest.json and overlay.json are required`)
    const work = await mkdtemp(join(tmpdir(), `research-records-${id}-`))
    try {
      const out = await regenerate(id, pub.manifest.value, pub.overlay.value, work, conv)
      if (out.reviewIssues.length) throw new Error(`${id}: the review no longer matches its sources: ${out.reviewIssues.slice(0, 3).join('; ')}`)
      const manifest = {
        ...pub.manifest.value,
        objects: out.snapshotManifest.files.length,
        bytes: out.snapshotManifest.files.reduce((sum, file) => sum + file.bytes, 0),
        converter: converterIdentity(conv, out.record),
        recordDigest: out.recordDigest,
      }
      const publicText = json(out.projected)
      const manifestText = json(manifest)
      const lock = {
        schema: 'publication.lock.v1',
        recordId: id,
        recordDigest: out.recordDigest,
        overlaySha256: sha256(pub.overlay.bytes),
        publicSha256: sha256(publicText),
        snapshot: manifest.snapshots ?? manifest.snapshot,
        converter: manifest.converter,
        builtAt: new Date().toISOString(),
        builtOn: hostname(),
      }
      // Signed only here, after the store reproduced the record and the review matched its sources.
      lock.attestation = { keyId: signer.keyId, signature: signBytes(null, attestation(lock, Buffer.from(manifestText)), signer.key).toString('base64') }
      await writeAtomic(join(PUB, id, 'manifest.json'), manifestText)
      await writeAtomic(join(PUBLIC, `${id}.json`), publicText)
      await writeAtomic(join(PUB, id, 'lock.json'), json(lock))
      const known = new Set(ledger.records[id] ?? [])
      for (const event of out.projected.events) known.add(event.id)
      ledger.records[id] = [...known].sort()
      process.stderr.write(`[research-records] built ${id}: ${out.recordDigest} from ${manifest.store?.namespace ?? 'bundle'}@${String(manifest.snapshot ?? '').slice(0, 19)}\n`)
    } finally {
      await rm(work, { recursive: true, force: true })
    }
  }
  ledger.records = Object.fromEntries(Object.entries(ledger.records).sort(([a], [b]) => (a < b ? -1 : 1)))
  await writeAtomic(ledgerPath, json(ledger))
}

export async function verify({ ids, runDir } = {}) {
  const gate = new Gate()
  const conv = await converter()
  const targets = ids?.length ? ids : await recordIds()
  for (const id of targets) {
    const pub = await readPublication(id)
    const manifest = pub.manifest.value
    const lock = pub.lock.value
    if (!manifest || !pub.overlay.value || !lock) {
      gate.fail('G1', id, 'manifest, overlay and lock are required')
      continue
    }
    const cited = manifest.snapshots ?? [{ prefix: manifest.store?.prefix, namespace: manifest.store?.namespace, snapshot: manifest.snapshot }]
    // G2: every object of every cited snapshot is present with its length and digest.
    for (const item of cited) {
      const results = await evidence(['verify', item.namespace, item.snapshot, '--prefix', item.prefix ?? 'runs/'], { allowFailure: true }).catch((error) => [{ ok: false, error: error.message }])
      for (const result of results)
        if (!result.ok) gate.fail('G2', id, result.error ?? `${item.namespace}@${item.snapshot.slice(0, 19)}: missing ${JSON.stringify(result.missing?.slice(0, 3))}, mismatched ${JSON.stringify(result.mismatched?.slice(0, 3))}`)
    }
    // G4 and G5: the pinned converter reproduces the record; the review still matches its sources; the projection
    // equals the committed bytes. Materialize downloads and hashes every object (the full G2 read).
    const work = await mkdtemp(join(tmpdir(), `research-records-verify-${id}-`))
    try {
      const out = await regenerate(id, manifest, pub.overlay.value, work, conv, { runDir })
      const identity = converterIdentity(conv, out.record)
      if (JSON.stringify(identity) !== JSON.stringify(manifest.converter)) gate.fail('G4', id, `installed converter ${JSON.stringify(identity)} differs from the manifest's ${JSON.stringify(manifest.converter)}`)
      if (out.recordDigest !== manifest.recordDigest) gate.fail('G4', id, `regenerated record ${out.recordDigest} differs from manifest.recordDigest ${manifest.recordDigest}`)
      for (const issue of out.reviewIssues) gate.fail('G5', id, issue)
      if (sha256(json(out.projected)) !== lock.publicSha256) gate.fail('G5', id, 'the regenerated projection differs from the committed public record')
    } catch (error) {
      gate.fail('G2', id, error.message)
    } finally {
      await rm(work, { recursive: true, force: true })
    }
  }
  await checkPins(gate)
  return gate
}

/**
 * G3: pinned for every cited snapshot: a bucket lock rule, no expiring lifecycle rule, and a verified copy in the pin
 * mirror. The mirror lives on the trace drive of the host that backs it up (GTR); elsewhere only the bucket is checked.
 */
async function checkPins(gate) {
  try {
    const mirror = process.env.EVIDENCE_PIN_MIRROR ?? '/mnt/traces/evidence-pins'
    const [pin] = await evidence(['pin', '--from', PUB, '--check', '--mirror', mirror], { allowFailure: true })
    const mirrorHere = existsSync(mirror)
    const rulesOk = pin && !pin.rules?.missing?.length && !pin.lifecycle?.deleting?.length
    const mirrorOk = pin && !pin.mirrored?.missing?.length && !pin.mirrored?.mismatched?.length
    if (!rulesOk) gate.fail('G3', null, `bucket pins incomplete (run evidence.mjs pin --from research/publications): ${JSON.stringify({ rules: pin?.rules, lifecycle: pin?.lifecycle })}`)
    if (mirrorHere && !mirrorOk) gate.fail('G3', null, `pin mirror incomplete: ${JSON.stringify({ missing: pin?.mirrored?.missing?.slice(0, 3), mismatched: pin?.mirrored?.mismatched?.slice(0, 3) })}`)
    if (!mirrorHere) process.stderr.write(`[research-records] G3: ${mirror} is not on this host; bucket lock and lifecycle rules checked, the mirror is checked on its host\n`)
  } catch (error) {
    gate.fail('G3', null, error.message)
  }
}

// ---------------------------------------------------------------- command line

// Paths whose change requires the store gates before a push (.ai-agent-hooks.json runs `verify --if-changed`).
const GATED = ['research/publications', 'src/content/research', 'public/research/records', 'package.json', 'pnpm-lock.yaml']
async function changedSinceBase() {
  const git = async (...args) => (await exec('git', args, { cwd: ROOT })).stdout.trim()
  const base = await git('merge-base', 'HEAD', 'origin/main').catch(() => '')
  if (!base) return GATED
  return (await git('diff', '--name-only', base, 'HEAD', '--', ...GATED)).split('\n').filter(Boolean)
}

async function main([command, ...rest]) {
  const at = rest.indexOf('--run-dir')
  const runDir = at >= 0 ? resolve(rest.splice(at, 2)[1]) : undefined
  const ifChanged = rest.includes('--if-changed')
  const ids = rest.filter((arg) => arg !== '--if-changed')
  if (command !== 'check' && Number(process.versions.node.split('.')[0]) < 22) throw new Error(`build and verify need Node 22 or later (this is ${process.version})`)
  if (ifChanged) {
    const changed = await changedSinceBase()
    if (!changed.length) {
      process.stderr.write('[research-records] no research record, review or post changed since origin/main\n')
      return 0
    }
  }
  if (runDir && ids.length !== 1) throw new Error('--run-dir names the materialized snapshot of exactly one record')
  if (command === 'check') return (await check({ ids: ids.length ? ids : undefined })).report('check')
  if (command === 'build') {
    await build({ ids })
    return (await check()).report('build, then check')
  }
  if (command === 'verify') {
    const offline = await check()
    const store = await verify({ ids, runDir })
    return Math.max(offline.report('check'), store.report('verify'))
  }
  process.stderr.write('usage: research-records.mjs check | build [<id>...] | verify [<id>...] [--run-dir <materialized snapshot>] [--if-changed]\n')
  return 64
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main(process.argv.slice(2)).then((code) => { process.exitCode = code }, (error) => {
    process.stderr.write(`[research-records] ${error?.stack ?? error}\n`)
    process.exitCode = 2
  })
}
