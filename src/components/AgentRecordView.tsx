import { useEffect, useState } from 'react'
import { AgentRecord, type RecordSelection, type RunRecord } from '@drewstone/agent-record'

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

/** URL ownership stays with the site; the shared viewer has no routing side effects. */
export default function AgentRecordView({ records, idmap = {} }: { records: RunRecord[]; idmap?: EventIdMap }) {
  const [selection, setSelection] = useState<RecordSelection>({ runId: records[0]?.runId ?? '' })
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
      const linked = records.find((record) => record.runId === runId)?.events.find((event) => event.id === eventId)
      setSelection({
        runId,
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
  return <AgentRecord records={records} selection={selection} onSelectionChange={select} className="research-agent-record" />
}
