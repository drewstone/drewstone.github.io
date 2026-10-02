import { z } from 'astro:content'

// A publication projection over retained evidence, never an execution record.
export const evidenceSchema = z.object({
  schema: z.literal('research-publication.events.v1'), runId: z.string(), title: z.string(),
  nodes: z.array(z.object({
    id: z.string(), label: z.string(), parent: z.string().nullable(),
    kind: z.enum(['runtime', 'native', 'finding']), model: z.string().nullable(),
    start: z.string().optional(), end: z.string().optional(), status: z.string().optional(),
    nativeSessionId: z.string().optional(), runtimeJoin: z.string().optional(),
    modelSource: z.string().optional(), servedModel: z.string().nullable().optional(),
  })),
  events: z.array(z.object({
    id: z.string(), node: z.string(), at: z.string(), kind: z.string(),
    category: z.enum(['coordination', 'infrastructure', 'verification', 'literature', 'computation', 'other']),
    label: z.string(),
    source: z.object({path:z.string(),sha256:z.string().regex(/^[0-9a-f]{64}$/),line:z.number().int().positive()}),
    detail: z.record(z.string(), z.unknown()),
  })),
  sources: z.array(z.object({path:z.string(),sha256:z.string(),bytes:z.number()})),
  assignment: z.object({objective:z.string(),suppliedKnowledge:z.string(),deliverables:z.string(),constraints:z.string(),source:z.object({path:z.string(),sha256:z.string(),bytes:z.number()}).nullable()}),
  terminal: z.object({kind:z.string().nullable(),reason:z.string().nullable()}).nullable(),
  coverage: z.object({runtimeNodes:z.number(),nativeFiles:z.number(),nativeRuntimeJoins:z.number(),completeOriginalCapture:z.boolean(),publicContent:z.string(),categoryMethod:z.string(),cost:z.string()}),
})
export type EvidenceRecord = z.infer<typeof evidenceSchema>
