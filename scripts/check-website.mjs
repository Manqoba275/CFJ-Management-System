import { readdir, readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'website');
const pages = (await readdir(root)).filter(name => name.endsWith('.html'));
if (!pages.length) throw new Error('No website HTML pages found');
const missing = [];
for (const name of pages) {
  const html = await readFile(resolve(root, name), 'utf8');
  for (const [, reference] of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(reference)) continue;
    const relative = reference.split(/[?#]/)[0];
    if (!relative) continue;
    try { await access(resolve(root, relative)); }
    catch { missing.push(`${name}: ${reference}`); }
  }
}
if (missing.length) throw new Error(`Missing local website files:\n${missing.join('\n')}`);
execFileSync(process.execPath, ['--check', resolve(root, 'app.js')], { stdio: 'inherit' });
console.log(`Validated local links/assets in ${pages.length} pages and app.js syntax. Runtime and integration testing remain pending.`);
