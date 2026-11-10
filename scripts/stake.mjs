import { spawn } from 'node:child_process';
import {
  appendFileSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { availableParallelism } from 'node:os';

const budgetSeconds = 60;
const ciFailSeconds = 120;
const bin = (name) => `node_modules/.bin/${name}`;
const unitTests = readdirSync('scripts')
  .filter((file) => file.endsWith('.test.mjs'))
  .sort();

const slowestFirst = [
  'test:guardrails',
  'typecheck',
  'lint',
  'knip',
  'test:ui',
];

const checks = [
  ['typecheck', bin('tsc'), ['--noEmit']],
  ['lint', bin('oxlint'), []],
  ['knip', bin('knip'), ['--reporter', 'compact']],
  ['format', bin('oxfmt'), ['--check']],
  ['private-data', process.execPath, ['scripts/private-data.mjs']],
  ...unitTests.map((file) => [
    `test:${file.replace('.test.mjs', '')}`,
    process.execPath,
    ['--experimental-strip-types', '--test', `scripts/${file}`],
  ]),
].sort(
  ([a], [b]) =>
    (slowestFirst.indexOf(a) + 1 || 99) - (slowestFirst.indexOf(b) + 1 || 99),
);

function cpuQuota() {
  try {
    const [quota, period] = readFileSync('/sys/fs/cgroup/cpu.max', 'utf8')
      .trim()
      .split(' ');
    if (quota !== 'max') return Math.ceil(Number(quota) / Number(period));
  } catch {}
  return availableParallelism();
}

const lanes = Math.max(
  1,
  Number(process.env.STAKE_JOBS) || Math.min(cpuQuota(), checks.length),
);

async function runAll() {
  const results = [];
  let next = 0;
  const worker = async () => {
    while (next < checks.length) results.push(await run(checks[next++]));
  };
  await Promise.all(Array.from({ length: lanes }, worker));
  return checks.map(([name]) => results.find((result) => result.name === name));
}

function run([name, command, args]) {
  const started = performance.now();
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      env: { ...process.env, FORCE_COLOR: '0' },
    });
    let output = '';
    child.stdout.on('data', (chunk) => (output += chunk));
    child.stderr.on('data', (chunk) => (output += chunk));
    const finish = (passed) =>
      resolve({
        name,
        passed,
        seconds: (performance.now() - started) / 1000,
        output,
      });
    child.on('error', (error) => {
      output += String(error);
      finish(false);
    });
    child.on('close', (code) => finish(code === 0));
  });
}

const started = performance.now();
const results = await runAll();
const wall = (performance.now() - started) / 1000;

const s = (seconds) => seconds.toFixed(1);
const failed = results.filter((result) => !result.passed);
const slowest = results.reduce((a, b) => (b.seconds > a.seconds ? b : a));
const width = Math.max(...results.map((result) => result.name.length));
const table = results.map(
  (result) =>
    `${result.name.padEnd(width)}  ${s(result.seconds).padStart(5)} s  ${result.passed ? 'pass' : 'FAIL'}`,
);
for (const result of failed)
  console.log(`\n--- ${result.name} ---\n${result.output.trim()}`);

const line = [
  `stake: ${s(wall)} s`,
  `${results.length - failed.length}/${results.length} pass`,
  ...(failed.length ? [`FAIL: ${failed.map((r) => r.name).join(', ')}`] : []),
  `slowest: ${slowest.name} ${s(slowest.seconds)} s`,
  ...(wall > budgetSeconds ? [`OVER ${budgetSeconds} s BUDGET`] : []),
].join(' · ');

console.log(`\n${lanes} lanes\n${table.join('\n')}\n\n${line}`);
writeFileSync('.stake-last', line + '\n');
if (process.env.GITHUB_STEP_SUMMARY)
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `### Stake\n\n\`\`\`\n${table.join('\n')}\n\`\`\`\n\n**${line}**\n`,
  );

process.exitCode =
  failed.length || (process.env.CI && wall > ciFailSeconds) ? 1 : 0;
