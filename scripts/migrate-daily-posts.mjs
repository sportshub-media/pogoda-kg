// One-off migration: re-renders every already-published daily forecast post
// (src/blog/daily-weather-forecast-kyrgyzstan-*.html) onto the current
// buildDailyArticleHtml() shell, and updates each entry's title/seoTitle and
// hero image in src/js/blog-posts-data.js to match. It does NOT re-fetch
// weather data — date/category/author/excerpt/content are left exactly as
// originally published, since those numbers reflect that day's real forecast
// and must not be rewritten after the fact.
//
// Safe to delete once every existing daily post has been migrated; new posts
// from scripts/publish-daily-forecast.mjs already use this template.
import { readFile, writeFile } from 'node:fs/promises';
import { buildDailyArticleHtml, pickHeroForDate, shortTitleFor } from './daily-forecast-template.mjs';

const dataFile = new URL('../src/js/blog-posts-data.js', import.meta.url);
const blogDirectory = new URL('../src/blog/', import.meta.url);
const { BLOG_POSTS } = await import(dataFile.href);

const dailyPosts = BLOG_POSTS.filter(p => /^daily-weather-forecast-kyrgyzstan-\d{4}-\d{2}-\d{2}$/.test(p.slug));
if (!dailyPosts.length) { console.log('No daily posts found; nothing to migrate.'); process.exit(0); }

// Finds the `{ ... }` object that CONTAINS `needle` (needle sits somewhere
// after that object's own opening brace, e.g. `"id": "post-x"` appears right
// after the post object's `{`): search backward from needle for the nearest
// preceding `{`, then count depth forward to find its match.
function findContainingObject(source, needle) {
  const needleIndex = source.indexOf(needle);
  if (needleIndex === -1) return null;
  const start = source.lastIndexOf('{', needleIndex);
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}') { depth--; if (depth === 0) return { start, end: i + 1 }; }
  }
  return null;
}

// Finds the `{ ... }` value of `"key": { ... }` WITHIN source.slice(from, to):
// the opening brace is the needle's own trailing `{`, so we count forward
// from there — unambiguous, no backward search needed.
function findNamedChild(source, from, to, key) {
  const scope = source.slice(from, to);
  const needle = `"${key}": {`;
  const needleIndex = scope.indexOf(needle);
  if (needleIndex === -1) return null;
  const start = needleIndex + needle.length - 1; // position of that opening `{`
  let depth = 0;
  for (let i = start; i < scope.length; i++) {
    if (scope[i] === '{') depth++;
    else if (scope[i] === '}') { depth--; if (depth === 0) return { start: from + start, end: from + i + 1 }; }
  }
  return null;
}

let source = await readFile(dataFile, 'utf8');
let migrated = 0;
for (const post of dailyPosts) {
  const dateISO = post.slug.replace('daily-weather-forecast-kyrgyzstan-', '');
  const hero = pickHeroForDate(dateISO);

  const postBlock = findContainingObject(source, `"id": "${post.id}"`);
  if (!postBlock) { console.warn(`Could not find data block for ${post.id}; skipping.`); continue; }

  // Replace the entry's own top-level "image" field (not any nested one).
  const imageNeedle = '"image": "';
  const imageStart = source.indexOf(imageNeedle, postBlock.start);
  if (imageStart !== -1 && imageStart < postBlock.end) {
    const valueStart = imageStart + imageNeedle.length;
    const valueEnd = source.indexOf('"', valueStart);
    source = source.slice(0, valueStart) + hero.image + source.slice(valueEnd);
  }

  // Replace "title" and "seoTitle" inside each language's own sub-object only.
  for (const lang of ['EN', 'RU', 'KG']) {
    const refreshedBlock = findContainingObject(source, `"id": "${post.id}"`); // positions shifted by earlier edits
    const langBlock = findNamedChild(source, refreshedBlock.start, refreshedBlock.end, lang);
    if (!langBlock) { console.warn(`  ${post.id}: no ${lang} translations block found; skipping that language.`); continue; }
    const newTitle = shortTitleFor(lang, dateISO).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    let section = source.slice(langBlock.start, langBlock.end);
    const titleRe = /"title": "(?:[^"\\]|\\.)*"/;
    const seoTitleRe = /"seoTitle": "(?:[^"\\]|\\.)*"/;
    if (!titleRe.test(section) || !seoTitleRe.test(section)) { console.warn(`  ${post.id}: ${lang} block missing title/seoTitle pattern; skipping.`); continue; }
    section = section.replace(titleRe, `"title": "${newTitle}"`).replace(seoTitleRe, `"seoTitle": "${newTitle}"`);
    source = source.slice(0, langBlock.start) + section + source.slice(langBlock.end);
  }

  // Keep the in-memory object in sync so the regenerated HTML matches.
  post.image = hero.image;
  for (const lang of ['EN', 'RU', 'KG']) {
    if (post.translations[lang]) {
      post.translations[lang].title = shortTitleFor(lang, dateISO);
      post.translations[lang].seoTitle = shortTitleFor(lang, dateISO);
    }
  }
  const html = buildDailyArticleHtml({ slug: post.slug, dateISO, image: hero.image, heroAlt: hero.alt, en: post.translations.EN });
  await writeFile(new URL(`${post.slug}.html`, blogDirectory), html);
  migrated++;
  console.log(`migrated ${post.slug} -> hero: ${hero.file}, EN: "${post.translations.EN.title}", RU: "${post.translations.RU.title}", KG: "${post.translations.KG.title}"`);
}

await writeFile(dataFile, source);
console.log(`\nMigrated ${migrated} daily post(s).`);
