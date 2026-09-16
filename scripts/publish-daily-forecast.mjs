import { mkdir, readFile, writeFile } from 'node:fs/promises';

const cities = [
  ['bishkek', 'Bishkek', 'Бишкек', 42.8746, 74.5698], ['osh', 'Osh', 'Ош', 40.514, 72.8161],
  ['karakol', 'Karakol', 'Каракол', 42.4907, 78.3936], ['naryn', 'Naryn', 'Нарын', 41.4287, 75.9911],
  ['jalal-abad', 'Jalal-Abad', 'Жалал-Абад', 40.9333, 72.9833]
];
const marker = '  // AUTO_DAILY_FORECASTS_START — maintained by scripts/publish-daily-forecast.mjs.';
const dataFile = new URL('../src/js/blog-posts-data.js', import.meta.url);
const blogDirectory = new URL('../src/blog/', import.meta.url);
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bishkek' }).format(new Date());
const slug = `daily-weather-forecast-kyrgyzstan-${today}`;
const condition = {
  EN: { 0: 'clear', 1: 'mostly clear', 2: 'partly cloudy', 3: 'overcast', 45: 'foggy', 48: 'foggy', 51: 'drizzly', 53: 'drizzly', 55: 'drizzly', 61: 'rainy', 63: 'rainy', 65: 'rainy', 71: 'snowy', 73: 'snowy', 75: 'snowy', 80: 'showery', 81: 'showery', 82: 'showery', 95: 'stormy' },
  RU: { 0: 'ясно', 1: 'в основном ясно', 2: 'переменная облачность', 3: 'пасмурно', 45: 'туман', 48: 'туман', 51: 'морось', 53: 'морось', 55: 'морось', 61: 'дождь', 63: 'дождь', 65: 'дождь', 71: 'снег', 73: 'снег', 75: 'снег', 80: 'ливни', 81: 'ливни', 82: 'ливни', 95: 'гроза' },
  KG: { 0: 'ачык', 1: 'негизинен ачык', 2: 'ала булуттуу', 3: 'булуттуу', 45: 'туман', 48: 'туман', 51: 'майда жамгыр', 53: 'майда жамгыр', 55: 'майда жамгыр', 61: 'жамгыр', 63: 'жамгыр', 65: 'жамгыр', 71: 'кар', 73: 'кар', 75: 'кар', 80: 'нөшөр', 81: 'нөшөр', 82: 'нөшөр', 95: 'күн күркүрөө' }
};
const weatherWord = (lang, code) => condition[lang][code] || (lang === 'RU' ? 'нет данных' : lang === 'KG' ? 'маалымат жок' : 'unavailable');
const sign = value => `${value > 0 ? '+' : ''}${value}°C`;
const dateFor = lang => new Intl.DateTimeFormat(lang === 'KG' ? 'ky-KG' : lang === 'RU' ? 'ru-RU' : 'en-GB', { dateStyle: 'long', timeZone: 'Asia/Bishkek' }).format(new Date(`${today}T12:00:00+06:00`));
const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const params = new URLSearchParams({ latitude: cities.map(city => city[3]).join(','), longitude: cities.map(city => city[4]).join(','), current: 'weather_code', daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code', forecast_days: '1', timezone: 'Asia/Bishkek' });
const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
if (!response.ok) throw new Error(`Open-Meteo returned ${response.status}`);
const payload = await response.json();
const forecasts = Array.isArray(payload) ? payload : [payload];
if (forecasts.length !== cities.length || forecasts.some(record => !record.daily)) throw new Error('Incomplete forecast response');
const rows = cities.map((city, index) => ({ id: city[0], en: city[1], local: city[2], high: Math.round(forecasts[index].daily.temperature_2m_max[0]), low: Math.round(forecasts[index].daily.temperature_2m_min[0]), rain: forecasts[index].daily.precipitation_probability_max[0], code: forecasts[index].daily.weather_code[0] }));
function translation(lang) {
  const date = dateFor(lang), names = row => lang === 'EN' ? row.en : row.local;
  const rainLabel = lang === 'RU' ? 'вероятность осадков' : lang === 'KG' ? 'жаан-чачын ыктымалдыгы' : 'rain chance';
  const lines = rows.map(row => `<li><strong>${esc(names(row))}:</strong> ${sign(row.high)} / ${sign(row.low)}, ${rainLabel} ${row.rain}%, ${weatherWord(lang, row.code)}.</li>`).join('');
  if (lang === 'RU') { const title = `Погода в Кыргызстане на ${date}`; return { title, seoTitle: title, seoDesc: `Прогноз погоды по Кыргызстану на ${date}: температура и вероятность осадков для Бишкека, Оша, Каракола, Нарына и Джалал-Абада.`, category: 'Прогноз погоды', date, author: 'Pogoda Weather Team', excerpt: `Ежедневный прогноз для пяти городов Кыргызстана на ${date}.`, content: `<p>Ежедневная сводка прогноза для Бишкека, Оша, Каракола, Нарына и Джалал-Абада на ${date}. Значения основаны на прогнозе Open-Meteo, полученном утром по времени Бишкека.</p><h3>Прогноз по городам</h3><ul>${lines}</ul><h3>Перед поездкой</h3><p>Прогноз меняется в течение дня. Для поездок через горные перевалы проверьте официальную дорожную информацию перед выездом.</p>` }; }
  if (lang === 'KG') { const title = `${date} үчүн Кыргызстандагы аба ырайы`; return { title, seoTitle: title, seoDesc: `${date} күнүнө Кыргызстан боюнча аба ырайы: Бишкек, Ош, Каракол, Нарын жана Жалал-Абад үчүн температура жана жаан-чачын ыктымалдыгы.`, category: 'Аба ырайы божомолу', date, author: 'Pogoda Weather Team', excerpt: `${date} үчүн Кыргызстандын беш шаары боюнча күнүмдүк аба ырайы божомолу.`, content: `<p>${date} үчүн Бишкек, Ош, Каракол, Нарын жана Жалал-Абад боюнча күнүмдүк божомол. Маалымат Бишкек убактысы менен эртең менен алынган Open-Meteo божомолуна негизделет.</p><h3>Шаарлар боюнча божомол</h3><ul>${lines}</ul><h3>Жолго чыгаарда</h3><p>Божомол күн ичинде өзгөрүшү мүмкүн. Тоо ашуулары аркылуу сапарга чыгардан мурун расмий жол маалыматын текшериңиз.</p>` }; }
  const title = `Kyrgyzstan weather forecast for ${date}`;
  return { title, seoTitle: title, seoDesc: `Kyrgyzstan weather forecast for ${date}: temperatures and rain chances for Bishkek, Osh, Karakol, Naryn and Jalal-Abad.`, category: 'Weather Forecast', date, author: 'Pogoda Weather Team', excerpt: `Daily forecast for five major Kyrgyzstan cities on ${date}.`, content: `<p>A daily forecast for Bishkek, Osh, Karakol, Naryn and Jalal-Abad on ${date}. Figures are based on the Open-Meteo forecast collected in the morning, Bishkek time.</p><h3>City forecast</h3><ul>${lines}</ul><h3>Before travelling</h3><p>Forecasts can change during the day. Before travelling through a mountain pass, check official road information.</p>` };
}
const translations = Object.fromEntries(['EN', 'RU', 'KG'].map(lang => [lang, translation(lang)]));
const post = { id: `daily-forecast-${today}`, slug, image: '/assets/images/hero_mountains.webp', translations };
const source = await readFile(dataFile, 'utf8');
if (!source.includes(marker)) throw new Error('Daily forecast marker is missing from blog-posts-data.js');
if (source.includes(`\"slug\": \"${slug}\"`)) { console.log(`Daily forecast already exists for ${today}; no post created.`); process.exit(0); }
await writeFile(dataFile, source.replace(marker, `${marker}\n  ${JSON.stringify(post, null, 2).replace(/\n/g, '\n  ')},`));
const en = translations.EN;
const articleSchema = JSON.stringify({ '@context': 'https://schema.org', '@type': 'NewsArticle', headline: en.title, description: en.seoDesc, image: [`https://pogoda.kg${post.image}`], datePublished: today, dateModified: today, inLanguage: 'en', mainEntityOfPage: { '@type': 'WebPage', '@id': `https://pogoda.kg/blog/${slug}` }, author: { '@type': 'Organization', name: en.author }, publisher: { '@type': 'Organization', name: 'Pogoda Kg', logo: { '@type': 'ImageObject', url: 'https://pogoda.kg/assets/favicon.svg' } } });
const article = `<!DOCTYPE html>\n<html lang="en" data-theme="light"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(en.seoTitle)} | Pogoda.kg</title><meta name="description" content="${esc(en.seoDesc)}"><link rel="canonical" href="https://pogoda.kg/blog/${slug}"><link rel="alternate" hreflang="en" href="https://pogoda.kg/blog/${slug}"><link rel="alternate" hreflang="ru" href="https://pogoda.kg/blog/${slug}"><link rel="alternate" hreflang="ky" href="https://pogoda.kg/blog/${slug}"><link rel="alternate" hreflang="x-default" href="https://pogoda.kg/blog/${slug}"><link rel="stylesheet" href="/css/style.css"><script type="application/ld+json">${articleSchema}</script><script type="module" src="/js/blog.js" defer></script></head><body><header class="site-header"><div class="header-container"><a href="/" class="brand-logo"><img src="/assets/logo-dark.png" alt="Pogoda.kg" class="brand-logo-img logo-light-theme" width="575" height="79"><img src="/assets/logo.png" alt="Pogoda.kg" class="brand-logo-img logo-dark-theme" width="575" height="79"></a><nav class="main-nav" aria-label="Primary"><ul><li><a href="/" data-i18n="nav_home">Home</a></li><li><a href="/map" data-i18n="nav_map">Map</a></li><li><a href="/blog" data-i18n="nav_news">News</a></li></ul></nav><div class="header-actions"><div class="lang-selector"><button class="lang-btn" data-lang="EN">EN</button><button class="lang-btn" data-lang="KG">KG</button><button class="lang-btn" data-lang="RU">RU</button></div></div></div></header><main class="section-wrapper"><div class="breadcrumbs-container"><a href="/">Home</a> / <a href="/blog">News</a> / <span>${esc(en.title)}</span></div><article class="post-article"><span class="news-tag">${esc(en.category)}</span><h1 class="post-title">${esc(en.title)}</h1><div class="post-meta"><span>${esc(en.author)}</span><span>${esc(en.date)}</span></div><img src="${post.image}" alt="Kyrgyzstan mountain weather" class="post-hero-image"><div class="post-content">${en.content}</div></article></main><footer class="site-footer"><div class="copyright-bar"><div>© 2026 Pogoda Kg (pogoda.kg)</div></div></footer></body></html>\n`;
await mkdir(blogDirectory, { recursive: true });
await writeFile(new URL(`${slug}.html`, blogDirectory), article);
console.log(`Published forecast article source for ${today}.`);
