// Assemble the Cloudflare Pages output (`out/`) from the vinext build (`dist/`), RGE 2170.
// Pages runs `out/_worker.js/` (the vinext Worker) for every route that `_routes.json` does not exclude.
// The Worker serves pages; Pages serves the static files directly, so every built file is excluded.
// Deploy: npm run build && npm run build:pages && npx wrangler pages deploy out --project-name patchworkmd-site --no-bundle
import {
  cpSync,
  existsSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join, relative } from 'node:path';

const dist = 'dist';
const out = 'out';
if (!existsSync(join(dist, 'server', 'index.js'))) {
  throw new Error(
    'Run `npm run build` first: dist/server/index.js is missing.',
  );
}

rmSync(out, { recursive: true, force: true });
cpSync(join(dist, 'client'), out, { recursive: true });
cpSync(join(dist, 'server'), join(out, '_worker.js'), { recursive: true });
rmSync(join(out, '_worker.js', 'wrangler.json'), { force: true });

const routeDirs = new Set(readdirSync('app'));
const skip = new Set(['_worker.js', '_headers', '_routes.json']);
const exclude = [];
const files = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });

for (const name of readdirSync(out).sort()) {
  if (name.startsWith('.') || skip.has(name)) continue;
  const path = join(out, name);
  if (statSync(path).isFile()) exclude.push(`/${name}`);
  else if (name === '_next') exclude.push('/_next/static/*');
  else if (!routeDirs.has(name)) exclude.push(`/${name}/*`);
  // A folder that is also a page route: exclude its files one by one, so the route itself stays on the Worker.
  else for (const file of files(path)) exclude.push(`/${relative(out, file)}`);
}

if (exclude.length > 100) {
  throw new Error(
    `_routes.json allows 100 rules; this build needs ${exclude.length}.`,
  );
}
writeFileSync(
  join(out, '_routes.json'),
  `${JSON.stringify({ version: 1, include: ['/*'], exclude }, null, 2)}\n`,
);
console.log(`out/ ready: ${exclude.length} static rules in _routes.json`);
