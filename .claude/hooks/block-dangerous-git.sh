#!/bin/bash

COMMAND=$(python3 -c 'import json,sys; print(json.load(sys.stdin).get("tool_input",{}).get("command",""))')

DANGEROUS_PATTERNS=(
  "git push.*(--force|--force-with-lease| -f( |$))"
  "git push.*[ :+](main|master)( |$)"
  "gh pr merge"
  "git reset --hard"
  "git clean -[a-zA-Z]*f"
  "git branch -D"
  "git checkout \.( |$)"
  "git restore \.( |$)"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qE "$pattern"; then
    echo "BLOCKED: '$COMMAND' matches '$pattern'. Branches and PRs only; Austin merges." >&2
    exit 2
  fi
done

exit 0
