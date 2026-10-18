// Builds the website demo package from the project files.
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const excluded = new Set(['website/service.html', 'website/registration.html']);
const allowed = new Set(['.html', '.css', '.js', '.mjs', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.webp', '.woff', '.woff2']);
// Package only tracked static website assets. Never include repository metadata or API stores.
const files = execFileSync('git', ['ls-files', '-z', '--', 'website'], { cwd: root, encoding: 'utf8' }).split('\0')
  .filter(path => path && !excluded.has(path) && allowed.has(extname(path)) && !path.split('/').some(segment => segment.startsWith('.')));
if (!files.includes('website/index.html')) throw new Error('Static demo entry point is missing');
await mkdir(resolve(root, 'output'), { recursive: true });
const destination = await mkdtemp(resolve(root, 'output/cfj-static-demo-'));
const manifest = { sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  note: 'Working-tree static preview; synthetic data only. No API, database or hosted sign-in.', files: [] };
for (const file of files) {
  const relative = file.slice('website/'.length);
  const content = await readFile(resolve(root, file));
  const target = resolve(destination, relative);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content);
  manifest.files.push({ path: relative, bytes: content.length, sha256: createHash('sha256').update(content).digest('hex') });
}
await writeFile(resolve(destination, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Prepared ${files.length} static demo files at ${destination}`);
console.log('Upload the contents to an approved static HTTPS host. Connected service pages are excluded; see docs/deployment.md.');
