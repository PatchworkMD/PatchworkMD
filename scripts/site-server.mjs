import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

export async function waitForSite(
  url,
  { attemptMs = 5000, deadlineMs = 120000, describe = () => '' } = {},
) {
  const deadline = Date.now() + deadlineMs;
  let last = 'no attempt finished';
  while (Date.now() < deadline) {
    const remaining = deadline - Date.now();
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(Math.min(attemptMs, remaining)),
      });
      if (response.ok) return;
      last = `HTTP ${response.status}`;
    } catch (error) {
      last = error.cause?.code ?? error.name ?? String(error);
    }
    await sleep(Math.min(500, Math.max(0, deadline - Date.now())));
  }
  throw new Error(
    `Site at ${url} was not ready within ${deadlineMs}ms (last: ${last}).${describe()}`,
  );
}

export async function assertNothingServing(url) {
  try {
    await fetch(url, { signal: AbortSignal.timeout(1000) });
  } catch {
    return;
  }
  throw new Error(
    `Something is already serving ${url}. Stop it, or set SITE_CHECK_URL to test that server on purpose.`,
  );
}

export function startSite(command, args) {
  const child = spawn(command, args, {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  const capture = (chunk) => {
    output = (output + chunk).slice(-4000);
  };
  child.stdout.on('data', capture);
  child.stderr.on('data', capture);
  const exited = new Promise((_, reject) => {
    child.on('exit', (code, signal) =>
      reject(
        new Error(
          `${command} ${args.join(' ')} exited early (${signal ?? code}).\n${output}`,
        ),
      ),
    );
  });
  exited.catch(() => {});
  return {
    exited,
    describe: () => (output ? `\nServer output:\n${output}` : ''),
    stop() {
      child.removeAllListeners('exit');
      try {
        process.kill(-child.pid);
      } catch (error) {
        if (error.code !== 'ESRCH') throw error;
      }
    },
  };
}
