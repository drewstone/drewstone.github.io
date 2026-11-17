import { useEffect, useState } from 'react'
import { AgentRecord, RecordWorkGraph, type BehaviorReport } from '@tangle-network/sandbox-ui/record'
import type { RecordSelection, RunRecord } from '@drewstone/agent-record/record'

/** Old event ids per record, each mapped to its current id (research/publications/idmap.json). */
export type EventIdMap = Record<string, Record<string, string>>

/** Follow the map from an id that is not in the record to one that is; chains end within a few steps. */
function resolveEvent(record: RunRecord | undefined, idmap: EventIdMap, id: string): string | undefined {
  if (!record) return undefined
  const known = new Set(record.events.map((event) => event.id))
  const map = idmap[record.runId] ?? {}
  let current: string | undefined = id
  for (let step = 0; current !== undefined && step < 8; step++) {
    if (known.has(current)) return current
    current = map[current]
  }
  return undefined
}

// The viewer reveals its selected row by scrolling the window (sandbox-ui 3.0.1 VirtualList, still in @tangle-network/ui
// 11.51.29), including the default it selects on mount: a research page opened at its foot, or jumped 1,100 px when the
// record came into view. Only the viewer calls window.scrollBy here, and it may move the page only for a reader's own
// action in the record or a linked ?event=.
if (typeof window !== 'undefined') {
  let allowUntil = new URL(location.href).searchParams.has('event') ? performance.now() + 3000 : 0
  const scrollBy = window.scrollBy.bind(window) as (options: ScrollToOptions) => void
  window.scrollBy = ((options: ScrollToOptions) => {
    if (performance.now() < allowUntil) scrollBy(options)
  }) as typeof window.scrollBy
  const allow = (event: Event) => {
    if (event.target instanceof Element && event.target.closest('.research-agent-record')) allowUntil = performance.now() + 2500
  }
  window.addEventListener('pointerdown', allow, true)
  window.addEventListener('keydown', allow, true)
}

/** A record opens on its root agent, which the converter does not always list first. */
const rootOf = (record: RunRecord | undefined) => (record?.nodes.some((node) => node.id === record.runId) ? record.runId : undefined)

/** URL ownership stays with the site; the shared viewer has no routing side effects. */
export default function AgentRecordView({ records, idmap = {}, behaviors = [] }: { records: RunRecord[]; idmap?: EventIdMap; behaviors?: readonly BehaviorReport[] }) {
  const [selection, setSelection] = useState<RecordSelection>({ runId: records[0]?.runId ?? '', nodeId: rootOf(records[0]) })
  useEffect(() => {
    const read = () => {
      const url = new URL(location.href)
      const params = url.searchParams
      let runId = params.get('pursuit') ?? records[0]?.runId ?? ''
      const view = params.get('view')
      const at = params.get('at')
      const requested = params.get('event')
      let eventId = requested ?? undefined
      if (requested) {
        // A link written before the current ids resolves through the map, in its own record first.
        let resolved = resolveEvent(records.find((record) => record.runId === runId), idmap, requested)
        if (!resolved) {
          const elsewhere = records.filter((record) => resolveEvent(record, idmap, requested))
          if (elsewhere.length === 1) {
            runId = elsewhere[0]!.runId
            resolved = resolveEvent(elsewhere[0], idmap, requested)
            url.searchParams.set('pursuit', runId)
          }
        }
        if (resolved && resolved !== requested) {
          eventId = resolved
          url.searchParams.set('event', resolved)
        }
        if (url.href !== location.href) history.replaceState(history.state, '', url)
      }
      const shown = records.find((record) => record.runId === runId)
      const linked = shown?.events.find((event) => event.id === eventId)
      setSelection({
        runId,
        nodeId: eventId ? undefined : rootOf(shown),
        eventId,
        view: view === 'source' || view === 'usage' ? view : 'chat',
        at: at === 'full' ? undefined : at ?? linked?.at,
      })
    }
    read()
    window.addEventListener('popstate', read)
    return () => window.removeEventListener('popstate', read)
  }, [records, idmap])
  const select = (next: RecordSelection) => {
    setSelection(next)
    const url = new URL(location.href)
    for (const [key, value] of Object.entries({ pursuit: next.runId, event: next.eventId, view: next.view, at: next.at ?? 'full' })) {
      if (value) url.searchParams.set(key, value)
      else url.searchParams.delete(key)
    }
    history.replaceState(null, '', url)
  }
  // A record that carries claims, outside verdicts or publications also opens as one provenance graph: its agents and
  // review sessions, the claims they made or judged, and what cites them, joined only by recorded ids. `?graph=provenance` keeps the choice in the URL.
  const record = records.find((item) => item.runId === selection.runId) ?? records[0]
  const traced = !!record && ((record.claims?.length ?? 0) > 0 || (record.verdicts?.length ?? 0) > 0 || (record.publications?.length ?? 0) > 0)
  const [graph, setGraph] = useState(false)
  useEffect(() => {
    const read = () => setGraph(new URL(location.href).searchParams.get('graph') === 'provenance')
    read()
    window.addEventListener('popstate', read)
    return () => window.removeEventListener('popstate', read)
  }, [])
  const showGraph = (next: boolean) => {
    setGraph(next)
    const url = new URL(location.href)
    if (next) url.searchParams.set('graph', 'provenance')
    else url.searchParams.delete('graph')
    history.replaceState(null, '', url)
  }
  if (!traced) return <AgentRecord records={records} selection={selection} onSelectionChange={select} behaviors={behaviors} className="research-agent-record" />
  return (
    <div className="research-agent-record research-record-views">
      <div className="record-view-switch" role="group" aria-label="Record view">
        <button type="button" aria-pressed={!graph} onClick={() => showGraph(false)}>Trace</button>
        <button type="button" aria-pressed={graph} onClick={() => showGraph(true)}>Provenance</button>
      </div>
      {graph && record ? (
        <RecordWorkGraph record={record} />
      ) : (
        <AgentRecord records={records} selection={selection} onSelectionChange={select} behaviors={behaviors} className="research-agent-record" />
      )}
    </div>
  )
}
