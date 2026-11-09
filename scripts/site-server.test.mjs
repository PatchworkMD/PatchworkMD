import assert from 'node:assert/strict';
import { createServer as createHttpServer } from 'node:http';
import { createServer } from 'node:net';
import { test } from 'node:test';
import { startSite, waitForSite } from './site-server.mjs';

const listen = (server) =>
  new Promise((resolve) =>
    server.listen(0, '127.0.0.1', () =>
      resolve(`http://127.0.0.1:${server.address().port}/`),
    ),
  );

test('a server that accepts but never answers fails at the deadline', async () => {
  const sockets = [];
  const server = createServer((socket) => sockets.push(socket));
  const url = await listen(server);
  const started = Date.now();
  await assert.rejects(
    waitForSite(url, {
      attemptMs: 200,
      deadlineMs: 900,
      describe: () => '\nServer output:\nstill booting',
    }),
    /not ready within 900ms \(last: TimeoutError\)\.\nServer output:\nstill booting/,
  );
  assert.ok(Date.now() - started < 2500, 'bounded by the deadline');
  sockets.forEach((socket) => socket.destroy());
  server.close();
});

test('a server that answers OK is ready', async () => {
  const server = createHttpServer((_, response) => response.end('ok'));
  const url = await listen(server);
  await waitForSite(url, { attemptMs: 500, deadlineMs: 2000 });
  server.close();
});

test('a server that exits before it is ready reports its output', async () => {
  const site = startSite(process.execPath, [
    '-e',
    'console.error("port in use"); process.exit(3)',
  ]);
  await assert.rejects(site.exited, /exited early \(3\)\.\nport in use/);
  site.stop();
});
