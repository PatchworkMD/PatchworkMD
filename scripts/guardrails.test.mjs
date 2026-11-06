import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const hook = new URL(
  '../.claude/hooks/block-dangerous-git.sh',
  import.meta.url,
);
const run = (input) => spawnSync(hook.pathname, { input }).status;
const exitCode = (command, cwd) =>
  run(JSON.stringify({ tool_input: { command }, cwd }));

function repoOn(branch) {
  const dir = mkdtempSync(join(tmpdir(), 'guardrail-'));
  spawnSync('git', ['init', '-q', '-b', branch, dir]);
  return dir;
}

const blocked = [
  'git push --force',
  'git push -f origin feature',
  'git push --force-with-lease origin feature',
  'git push origin +HEAD:feature',
  'git push origin main',
  'git push origin HEAD:main',
  'git push origin HEAD:refs/heads/main',
  'git push origin feature:master',
  'git -C /tmp push origin HEAD:main',
  'git -c push.default=current push --force',
  'git --no-pager push origin --delete feature',
  'git push --mirror origin',
  'git push --repo=origin HEAD:refs/heads/main',
  'git push --repo origin HEAD:main',
  'git push -fu origin feature',
  'git push -uf origin feature',
  'git push -ud origin feature',
  'git push --push-option=ci.skip origin main',
  'git push -o ci.skip origin main',
  'env GIT_TRACE=1 git push origin main',
  'cd repo && git push origin main',
  'npm test; git push origin main',
  'bash -c "git push origin main"',
  'git merge feature',
  'git -C repo merge --no-ff feature',
  'gh pr merge 5',
  'git reset --hard',
  'git reset --hard origin/main',
  'git clean -fd',
  'git clean -xfd',
  'git branch -D feature',
  'git branch --delete --force feature',
  'git checkout .',
  'git restore .',
  "git push origin 'main",
];

const allowed = [
  'git push -u origin push/20261105-quality',
  'git push origin push/20261105-main-fix',
  'git push origin HEAD:refs/heads/feature',
  'git push --repo=origin HEAD:refs/heads/feature',
  'git push -u origin feature',
  'git push -o ci.skip origin feature',
  'git push --push-option=ci.skip origin feature',
  'git status',
  'git merge-base HEAD origin/main',
  'git branch -d merged-feature',
  'git checkout -b feature',
  'git log --grep "git push --force"',
  'echo "gh pr merge is blocked"',
  "python3 -c 'print(1)' # Austin's note",
];

test('agents cannot force-push, push the default branch, merge, or discard work', () => {
  for (const command of blocked) {
    assert.equal(exitCode(command), 2, command);
  }
});

test('agents can push feature branches and inspect state', () => {
  for (const command of allowed) {
    assert.equal(exitCode(command), 0, command);
  }
});

test('a bare push is judged by the branch checked out in the working directory', () => {
  assert.equal(exitCode('git push', repoOn('main')), 2);
  assert.equal(exitCode('git push -u origin', repoOn('main')), 2);
  assert.equal(exitCode('git push', repoOn('feature')), 0);
});

test('git -C decides which checkout a bare push comes from', () => {
  const main = repoOn('main');
  const feature = repoOn('feature');
  assert.equal(exitCode(`git -C ${main} push`, feature), 2);
  assert.equal(exitCode(`git -C ${feature} push`, main), 0);
});

test('unreadable hook input fails closed', () => {
  assert.equal(run('not json'), 2);
});
