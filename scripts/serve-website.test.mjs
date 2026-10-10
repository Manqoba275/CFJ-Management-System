import test from 'node:test';
import assert from 'node:assert/strict';
import { createWebsiteServer } from './serve-website.mjs';

test('preview serves the website while rejecting private paths and writes', async () => {
  const server = createWebsiteServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const home = await fetch(base);
    assert.equal(home.status, 200);
    assert.match(await home.text(), /CFJ Lifestyle Fitness/);
    assert.equal((await fetch(`${base}/app.js`)).headers.get('content-type'), 'text/javascript; charset=utf-8');
    for (const path of ['/.git/config', '/%2e%2e%2fREADME.md', '/missing.html', '/%5c..%5c.env']) {
      assert.equal((await fetch(base + path)).status, 404, path);
    }
    assert.equal((await fetch(base, { method: 'POST' })).status, 405);
    const head = await fetch(base, { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');
  } finally { await new Promise(resolve => server.close(resolve)); }
});
