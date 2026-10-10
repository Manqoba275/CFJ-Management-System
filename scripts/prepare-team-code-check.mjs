import { cp, copyFile, mkdir, mkdtemp, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';

// Assemble a disposable checkout to test packets without pre-applying teammates' files.
await mkdir('tmp', { recursive: true });
const target = await mkdtemp(resolve('tmp/team-code-check-'));
const paths = execFileSync('git', ['ls-files', '-z', 'mobile-app', 'website', 'scripts/check-website.mjs', 'scripts/serve-website.mjs', 'scripts/booking-eligibility.test.mjs'], { encoding: 'utf8' }).split('\0').filter(Boolean);
for (const path of paths) {
  await mkdir(dirname(resolve(target, path)), { recursive: true });
  await copyFile(path, resolve(target, path));
}
try { await access('mobile-app/local.properties'); await copyFile('mobile-app/local.properties', resolve(target, 'mobile-app/local.properties')); } catch {}
// Preserve integrated source: a stale starter must never replace a member's current work.
for (const member of ['Manqoba', 'Tshifhiwa', 'Nyito', 'Nonhlanhla']) await cp(`docs/team/${member}/code`, target, { recursive: true, force: false });
execFileSync(process.execPath, ['--test', resolve(target, 'scripts/booking-packet.test.mjs'), resolve(target, 'scripts/booking-eligibility.test.mjs')], { stdio: 'inherit' });
execFileSync(process.execPath, [resolve(target, 'scripts/check-website.mjs')], { stdio: 'inherit' });
console.log(`CHECKOUT=${target}`);
