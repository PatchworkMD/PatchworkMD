import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const hook = new URL(
  '../.claude/hooks/block-dangerous-git.sh',
  import.meta.url,
);
const exitCode = (command) =>
  spawnSync(hook.pathname, {
    input: JSON.stringify({ tool_input: { command } }),
  }).status;

test('agents cannot force-push, push main, merge, or discard work', () => {
  for (const command of [
    'git push --force',
    'git push -f origin feature',
    'git push origin main',
    'git push origin HEAD:main',
    'gh pr merge 5',
    'git reset --hard',
    'git clean -fd',
    'git branch -D feature',
  ]) {
    assert.equal(exitCode(command), 2, command);
  }
});

test('agents can push feature branches and inspect state', () => {
  for (const command of [
    'git push -u origin push/20261105-quality',
    'git push origin push/20261105-main-fix',
    'git status',
  ]) {
    assert.equal(exitCode(command), 0, command);
  }
});
