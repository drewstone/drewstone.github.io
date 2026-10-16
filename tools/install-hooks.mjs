#!/usr/bin/env node
/**
 * install-hooks — enable the repo's checked-in git hooks.
 *
 * The canonical hook is .githooks/post-commit: on commits that touch posts it
 * captures the session trace (agent commits) or logs a human revision, then
 * amends the commit with the trace files and frontmatter. Failures never block.
 *
 * This command only points git at the checked-in hook (git config core.hooksPath).
 */
import { spawnSync } from 'node:child_process'
import { chmod } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = resolve(fileURLToPath(new URL('..', import.meta.url)))

const res = spawnSync('git', ['config', 'core.hooksPath', '.githooks'], { cwd: REPO, encoding: 'utf8' })
if (res.status !== 0) {
  console.error(`git config failed: ${res.stderr}`)
  process.exit(res.status ?? 1)
}
await chmod(resolve(REPO, '.githooks/post-commit'), 0o755)
console.log('enabled .githooks/post-commit (core.hooksPath).')
console.log('commits that touch posts now auto-capture traces or log human revisions.')
