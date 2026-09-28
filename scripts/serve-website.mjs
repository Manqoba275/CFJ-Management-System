import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, dirname, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const website = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'website');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

// Local preview only: serve website files, never the repository or credentials.
export function createWebsiteServer() {
  return createServer(async (request, response) => {
    const fail = (status, message) => {
      response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(message);
    };
    if (!['GET', 'HEAD'].includes(request.method)) return fail(405, 'Method not allowed');
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
    catch { return fail(400, 'Invalid path'); }
    const file = resolve(website, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!file.startsWith(website + sep) || pathname.includes('\\') || pathname.includes('\0')
      || pathname.split('/').some(segment => segment.startsWith('.'))) return fail(404, 'Not found');
    const type = types[extname(file).toLowerCase()];
    if (!type) return fail(404, 'Not found');
    try {
      const content = await readFile(file);
      response.writeHead(200, { 'Content-Type': type, 'Content-Length': content.length,
        'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch { fail(404, 'Not found'); }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createWebsiteServer();
  server.on('error', error => { console.error(`Website preview could not start: ${error.message}`); process.exitCode = 1; });
  server.listen(8765, '127.0.0.1', () => console.log('CFJ website: http://127.0.0.1:8765 — local demo only. Ctrl+C stops the preview.'));
}
