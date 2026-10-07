/**
 * Claude Code harness adapter: sessions under ~/.claude/projects, read by
 * @tangle-network/harness-sessions (see ./sessions.ts).
 */
import { detectModel, extractTurns, findSessions } from './sessions.js'
import type { FindOpts, Filter, SessionRef, Turn, TraceHarness } from './types.js'

export class ClaudeCodeHarness implements TraceHarness {
  name = 'claude-code'

  findSessions(opts: FindOpts): Promise<SessionRef[]> {
    return findSessions(this.name, { ...opts, cwd: opts.cwd ?? process.cwd() })
  }

  extractTurns(ref: SessionRef, filter: Filter): Promise<Turn[]> {
    return extractTurns(this.name, ref, filter)
  }

  detectModel(ref: SessionRef): Promise<string | null> {
    return detectModel(this.name, ref)
  }
}

export default ClaudeCodeHarness
