import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const syntheticDomain =
  /(^|\.)(patchworkmd\.dev|example\.(com|org|net)|test|invalid)$/i;
const email =
  /(?<![\w.%+-])[\w.%+-]+@([a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,})\b/gi;
const phone = /(?<![\d-])\(?[2-9]\d{2}\)?[-. ][2-9]\d{2}[-. ]\d{4}(?![\d-])/g;
const dataExport = /\.(csv|tsv|xlsx?|vcf|sqlite3?|db)$/i;

export function findPrivateData(path, text) {
  const findings = dataExport.test(path) ? [`${path}: data export file`] : [];
  const withoutUrlCredentials = text.replace(/\/\/[^\s/@]+@/g, '//');
  for (const [address, domain] of withoutUrlCredentials.matchAll(email))
    if (!syntheticDomain.test(domain))
      findings.push(`${path}: email ${address}`);
  for (const [number] of text.matchAll(phone))
    findings.push(`${path}: phone ${number}`);
  return findings;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const files = execFileSync(
    'git',
    ['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
    { encoding: 'utf8' },
  )
    .split('\0')
    .filter(Boolean);
  const findings = files.flatMap((path) => {
    const bytes = readFileSync(path);
    return bytes.includes(0)
      ? findPrivateData(path, '')
      : findPrivateData(path, bytes.toString('utf8'));
  });
  for (const finding of findings) console.error(finding);
  console.log(
    `private-data: ${files.length} tracked files, ${findings.length} findings`,
  );
  process.exitCode = findings.length ? 1 : 0;
}
