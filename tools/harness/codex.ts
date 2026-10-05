/**
 * Codex harness adapter: rollouts under ~/.codex/sessions, read by
 * @tangle-network/harness-sessions (see ./sessions.ts).
 */
import { detectModel, extractTurns, findSessions } from './sessions.js'
import type { FindOpts, Filter, SessionRef, Turn, TraceHarness } from './types.js'

export class CodexHarness implements TraceHarness {
  name = 'codex'

  findSessions(opts: FindOpts): Promise<SessionRef[]> {
    return findSessions(this.name, opts)
  }

  extractTurns(ref: SessionRef, filter: Filter): Promise<Turn[]> {
    return extractTurns(this.name, ref, filter)
  }

  detectModel(ref: SessionRef): Promise<string | null> {
    return detectModel(this.name, ref)
  }
}

export default CodexHarness
