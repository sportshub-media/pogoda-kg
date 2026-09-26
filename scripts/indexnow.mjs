// Tells IndexNow search engines (Bing, Yandex, Seznam, Naver...) that URLs are new or changed.
// Google does not support IndexNow; it relies on sitemap.xml / Search Console.
//
// Usage: node scripts/indexnow.mjs [--ready <path-or-url>] <path-or-url> [...]
//   --ready X  wait (up to 8 min) until X returns HTTP 200 before submitting, so engines
//              don't fetch the pre-deploy version. If it never appears, nothing is submitted.
import { readdir } from 'node:fs/promises';

const HOST = 'pogoda.kg';
const ORIGIN = `https://${HOST}`;
const keyFile = (await readdir(new URL('../', import.meta.url))).find(name => /^[0-9a-f]{32}\.txt$/.test(name));
if (!keyFile) throw new Error('IndexNow key file (<32-hex>.txt) not found in the repository root');
const KEY = keyFile.replace('.txt', '');

const toUrl = value => (value.startsWith('http') ? value : `${ORIGIN}${value.startsWith('/') ? '' : '/'}${value}`);
const args = process.argv.slice(2);
let ready = null;
const paths = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--ready') ready = toUrl(args[++i] ?? '');
  else paths.push(args[i]);
}
const urlList = [...new Set(paths.map(toUrl))];
if (!urlList.length) { console.log('No URLs given; nothing to submit.'); process.exit(0); }
if (urlList.some(url => new URL(url).host !== HOST)) throw new Error(`Only ${HOST} URLs can be submitted`);

if (ready) {
  const deadline = Date.now() + 8 * 60 * 1000;
  let live = false;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${ready}${ready.includes('?') ? '&' : '?'}cb=${Date.now()}`, { redirect: 'follow' });
      if (response.ok) { live = true; break; }
    } catch { /* keep polling */ }
    await new Promise(resolve => setTimeout(resolve, 15000));
  }
  if (!live) { console.warn(`${ready} was not live within 8 minutes; skipping submission so engines don't fetch stale pages.`); process.exit(0); }
  console.log(`${ready} is live.`);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${keyFile}`, urlList })
});
console.log(`IndexNow responded ${response.status} ${response.statusText} for ${urlList.length} URL(s):`);
urlList.forEach(url => console.log(`  ${url}`));
// 200 = accepted, 202 = accepted (key validation pending). Anything else is a real problem.
if (![200, 202].includes(response.status)) {
  console.error(await response.text().catch(() => ''));
  process.exit(1);
}
