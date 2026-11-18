type DatedEntry = { id: string; data: { date: Date } }
type ResearchEntry = { id: string; data: { published: Date; order: number } }

const compareId = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0)

export const byDateDesc = (a: DatedEntry, b: DatedEntry): number =>
  b.data.date.valueOf() - a.data.date.valueOf() || compareId(a.id, b.id)

export const byPublishedDesc = (a: ResearchEntry, b: ResearchEntry): number =>
  b.data.published.valueOf() - a.data.published.valueOf() ||
  a.data.order - b.data.order ||
  compareId(a.id, b.id)
