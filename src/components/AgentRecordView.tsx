import { useEffect, useState } from 'react'
import { AgentRecord, type RecordSelection, type RunRecord } from '@drewstone/agent-record'

/** URL ownership stays with the site; the shared viewer has no routing side effects. */
export default function AgentRecordView({ records }: { records: RunRecord[] }) {
  const [selection, setSelection] = useState<RecordSelection>({ runId: records[0]?.runId ?? '' })
  useEffect(() => {
    const read = () => {
      const params = new URL(location.href).searchParams
      const runId = params.get('pursuit') ?? records[0]?.runId ?? ''
      const view = params.get('view')
      const at = params.get('at')
      const linked = records.find(record => record.runId === runId)?.events.find(event => event.id === params.get('event'))
      setSelection({
        runId,
        eventId: params.get('event') ?? undefined,
        view: view === 'source' || view === 'usage' ? view : 'chat',
        at: at === 'full' ? undefined : at ?? linked?.at,
      })
    }
    read()
    window.addEventListener('popstate', read)
    return () => window.removeEventListener('popstate', read)
  }, [records])
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
