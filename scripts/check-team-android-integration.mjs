import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const target = resolve(process.argv[2] || '');
const temporaryRoot = resolve('tmp') + '\\';
if (!target.startsWith(temporaryRoot) && !target.startsWith(resolve('tmp') + '/')) throw new Error('Use a prepared temporary checkout under tmp/');
const guide = await readFile('docs/team/CODE_INTEGRATION.md', 'utf8');
const code = guide.match(/```kotlin\n([\s\S]*?)\n```/)?.[1];
if (!code) throw new Error('Integration snippet not found');
const path = resolve(target, 'mobile-app/app/src/main/java/za/co/cfjlifestylefitness/app/MainActivity.kt');
let activity = (await readFile(path, 'utf8')).replaceAll('\r\n', '\n');
const original = /            "classes" -> findViewById<Button>\(R.id.timetable\).setOnClickListener \{\n                openSite\("https:\/\/cfjlifestylefitness.co.za\/timetable\/"\)\n            \}/;
if (!original.test(activity)) throw new Error('Expected original classes branch not found; inspect before replacing');
activity = activity.replace(original, code.split('\n').map(line => '            ' + line).join('\n'));
await writeFile(path, activity);
console.log('Applied the exact documented Android screen snippet in the temporary checkout.');
