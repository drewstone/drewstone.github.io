#!/usr/bin/env node
/**
 * install-hooks — install the post-commit hook for revision auto-logging.
 *
 * The hook runs after every commit. If MDX posts changed:
 *   - If there's a recent agent session (Claude Code / Codex), the existing
 *     trace-capture --auto path runs (records AI revision + saves trace).
 *   - Otherwise, the log-edit --auto path records a human revision.
 *
 * Idempotent: re-running the hook on the same commit dedups by SHA.
 */
import { writeFile, chmod, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = resolve(fileURLToPath(new URL('..', import.meta.url)))
const HOOK_PATH = resolve(REPO, '.git/hooks/post-commit')

const HOOK = `#!/usr/bin/env bash
# Auto-installed by tools/install-hooks.mjs — do not edit by hand.
# Re-run \`pnpm install:hooks\` to refresh.
set -e

cd "$(git rev-parse --show-toplevel)"

# Bail if HEAD didn't touch any post.
if ! git show --name-only --pretty=format: HEAD | grep -qE '^src/content/posts/.*\\.mdx$'; then
  exit 0
fi

# Decide path: agent vs human.
# Heuristic: if the env signals an active agent (CLAUDECODE, CLAUDE_PROJECT_DIR,
# CODEX_HOME, or a recent ~/.claude/projects session within 10min), prefer
# trace-capture. Otherwise, log a human revision.
AGENT=0
if [ -n "$CLAUDECODE" ] || [ -n "$CLAUDE_PROJECT_DIR" ] || [ -n "$CODEX_HOME" ]; then
  AGENT=1
fi

# Recent claude-code session within 10 minutes also counts.
if [ "$AGENT" = "0" ] && [ -d "$HOME/.claude/projects" ]; then
  if find "$HOME/.claude/projects" -name '*.jsonl' -mmin -10 2>/dev/null | grep -q .; then
    AGENT=1
  fi
fi

if [ "$AGENT" = "1" ]; then
  if command -v pnpm >/dev/null 2>&1; then
    pnpm tsx tools/trace-capture.ts capture --auto 2>/dev/null || \\
    node tools/log-edit.mjs --auto || true
  fi
else
  node tools/log-edit.mjs --auto || true
fi

exit 0
`

async function main() {
  await mkdir(resolve(REPO, '.git/hooks'), { recursive: true })
  await writeFile(HOOK_PATH, HOOK, 'utf8')
  await chmod(HOOK_PATH, 0o755)
  console.log(`installed: ${HOOK_PATH}`)
  console.log('the post-commit hook will now auto-log revisions on every commit.')
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
