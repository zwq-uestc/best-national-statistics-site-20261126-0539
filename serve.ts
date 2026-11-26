// Local preview server for the statistics site (development convenience only).
//
//   node serve.ts            -> http://localhost:8080
//   node serve.ts --port 9000
//
// Serves the app/ folder next to this file as the web root, the same way the
// grader's static hosting does. Node 22 standard library only. It refuses
// paths that escape app/, answers index.html for directory URLs, and sends
// no-store so edits show up on reload. Not meant for the public internet.

import { readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB_ROOT = resolve(fileURLToPath(new URL('./app', import.meta.url)));

const CONTENT_TYPES = new Map<string, string>([
  ['.html', 'text/html; charset=utf-8'],
  ['.htm', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon'],
  ['.woff2', 'font/woff2'],
  ['.txt', 'text/plain; charset=utf-8'],
]);

function pickPort(argv: string[]): number {
  const flag = argv.indexOf('--port');
  const value = flag === -1 ? NaN : Number(argv[flag + 1]);
  return Number.isInteger(value) && value > 0 && value < 65536 ? value : 8080;
}

function resolveRequestPath(rawUrl: string): string | null {
  let pathname: string;
  try {
    pathname = decodeURIComponent(new URL(rawUrl, 'http://localhost').pathname);
  } catch {
    return null;
  }
  if (pathname.endsWith('/')) pathname += 'index.html';
  const candidate = resolve(join(WEB_ROOT, '.' + pathname));
  if (candidate !== WEB_ROOT && !candidate.startsWith(WEB_ROOT + sep)) return null;
  return candidate;
}

const server = createServer((req, res) => {
  const file = resolveRequestPath(req.url ?? '/');
  if (file === null) {
    res.writeHead(403, { 'content-type': 'text/plain' }).end('forbidden');
    return;
  }
  let body: Buffer;
  try {
    if (!statSync(file).isFile()) throw new Error('not a file');
    body = readFileSync(file);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('not found');
    return;
  }
  res.writeHead(200, {
    'content-type': CONTENT_TYPES.get(extname(file).toLowerCase()) ?? 'application/octet-stream',
    'content-length': body.length,
    'cache-control': 'no-store',
  });
  res.end(body);
});

const port = pickPort(process.argv.slice(2));
server.listen(port, '127.0.0.1', () => {
  console.log(`statistics site preview: http://localhost:${port}`);
});
