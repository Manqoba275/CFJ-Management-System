import { readFile, writeFile } from 'node:fs/promises';

const members = ['Manqoba', 'Nyito', 'Tshifhiwa', 'Nonhlanhla'];
const start = new Date('2026-09-30T12:00:00Z');
const dayLabel = n => {
  const date = new Date(start);
  date.setUTCDate(date.getUTCDate() + n - 1);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${n}: ${weekdays[date.getUTCDay()]} ${String(date.getUTCDate()).padStart(2, '0')} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
};
for (const member of members) {
  for (const file of ['TWO_WEEK_PLAN.md', 'OPEN_PLAN.html']) {
    const path = `docs/team/${member}/${file}`;
    let text = await readFile(path, 'utf8');
    text = text.replace(/\b(\d{1,2}): (?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) \d{2} (?:Sep|Oct) 2026/g, (_, day) => dayLabel(Number(day)));
    text = text.replaceAll('28 September - 11 October 2026', '30 September - 13 October 2026');
    await writeFile(path, text);
  }
}
for (const path of ['docs/team/README.md', 'docs/team/START_HERE.html', 'docs/PROGRESS_TRACKER.md']) {
  let text = await readFile(path, 'utf8');
  text = text.replaceAll('28 September - 11 October 2026', '30 September - 13 October 2026')
    .replaceAll('28 September – 11 October 2026', '30 September – 13 October 2026')
    .replaceAll('28 September to 11 October 2026', '30 September to 13 October 2026')
    .replaceAll('Day 1 is today.', 'Day 1 is Wednesday, 30 September 2026.')
    .replaceAll('28/30 September and 2/5/7/9 October', '30 September and 2/5/7/9/12 October')
    .replaceAll('28/30 September, 2/5/7/9 October', '30 September, 2/5/7/9/12 October');
  await writeFile(path, text);
}
console.log('Shifted all 56 daily assignments to 30 September–13 October 2026.');
