import { execFileSync } from 'node:child_process';

const documented = [
  'needs-triage',
  'needs-info',
  'ready-for-agent',
  'ready-for-human',
  'wontfix',
];

const live = JSON.parse(
  execFileSync('gh', ['label', 'list', '--limit', '200', '--json', 'name'], {
    encoding: 'utf8',
  }),
).map(({ name }) => name);
const missing = documented.filter((label) => !live.includes(label));

if (missing.length) {
  console.error(
    `Missing triage labels: ${missing.join(', ')}. See docs/agents/triage-labels.md.`,
  );
  process.exit(1);
}
console.log(`All ${documented.length} triage labels exist.`);
