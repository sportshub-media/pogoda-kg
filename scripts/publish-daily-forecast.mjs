// Publishes the daily "Kyrgyzstan weather" post for today (Bishkek time): all 17
// cities, the day's extremes, the change since yesterday and a two-day outlook,
// in Kyrgyz, Russian and English. Run by the daily GitHub Action.
//   node scripts/publish-daily-forecast.mjs            write the post
//   node scripts/publish-daily-forecast.mjs --dry-run  print it instead
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { buildDailyArticleHtml, pickHeroForDate, shortTitleFor } from './daily-forecast-template.mjs';
import { KYRGYZSTAN_CITIES } from '../src/js/config.js';
import { TRANSLATIONS } from '../src/js/i18n.js';

const DRY_RUN = process.argv.includes('--dry-run');
const RU_NAMES = {
  bishkek: 'Бишкек', osh: 'Ош', 'jalal-abad': 'Джалал-Абад', karakol: 'Каракол', tokmok: 'Токмок', uzgen: 'Узген',
  'kara-balta': 'Кара-Балта', balykchy: 'Балыкчы', naryn: 'Нарын', talas: 'Талас', batken: 'Баткен',
  'cholpon-ata': 'Чолпон-Ата', kant: 'Кант', kemin: 'Кемин', 'kyzyl-kiya': 'Кызыл-Кия', toktogul: 'Токтогул', razzakov: 'Раззаков'
};
const marker = '  // AUTO_DAILY_FORECASTS_START — maintained by scripts/publish-daily-forecast.mjs.';
const dataFile = new URL('../src/js/blog-posts-data.js', import.meta.url);
const blogDirectory = new URL('../src/blog/', import.meta.url);
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bishkek' }).format(new Date());
const slug = `daily-weather-forecast-kyrgyzstan-${today}`;
const { file: heroFile, alt: heroAlt, image: heroImage } = pickHeroForDate(today);

const condition = {
  EN: { 0: 'clear', 1: 'mostly clear', 2: 'partly cloudy', 3: 'overcast', 45: 'fog', 48: 'fog', 51: 'drizzle', 53: 'drizzle', 55: 'drizzle', 56: 'freezing drizzle', 57: 'freezing drizzle', 61: 'rain', 63: 'rain', 65: 'heavy rain', 66: 'freezing rain', 67: 'freezing rain', 71: 'snow', 73: 'snow', 75: 'heavy snow', 77: 'snow grains', 80: 'showers', 81: 'showers', 82: 'heavy showers', 85: 'snow showers', 86: 'snow showers', 95: 'thunderstorm', 96: 'thunderstorm, hail', 99: 'thunderstorm, hail' },
  RU: { 0: 'ясно', 1: 'в основном ясно', 2: 'переменная облачность', 3: 'пасмурно', 45: 'туман', 48: 'туман', 51: 'морось', 53: 'морось', 55: 'морось', 56: 'ледяная морось', 57: 'ледяная морось', 61: 'дождь', 63: 'дождь', 65: 'сильный дождь', 66: 'ледяной дождь', 67: 'ледяной дождь', 71: 'снег', 73: 'снег', 75: 'сильный снег', 77: 'снежная крупа', 80: 'ливни', 81: 'ливни', 82: 'сильные ливни', 85: 'снегопад', 86: 'снегопад', 95: 'гроза', 96: 'гроза с градом', 99: 'гроза с градом' },
  KG: { 0: 'ачык', 1: 'негизинен ачык', 2: 'ала булуттуу', 3: 'бүркөк', 45: 'туман', 48: 'туман', 51: 'майда жамгыр', 53: 'майда жамгыр', 55: 'майда жамгыр', 56: 'муздак майда жамгыр', 57: 'муздак майда жамгыр', 61: 'жамгыр', 63: 'жамгыр', 65: 'катуу жамгыр', 66: 'муздак жамгыр', 67: 'муздак жамгыр', 71: 'кар', 73: 'кар', 75: 'катуу кар', 77: 'кар бүртүгү', 80: 'нөшөр', 81: 'нөшөр', 82: 'катуу нөшөр', 85: 'кар жаайт', 86: 'кар жаайт', 95: 'күн күркүрөө', 96: 'мөндүр менен күн күркүрөө', 99: 'мөндүр менен күн күркүрөө' }
};
const unknown = { EN: 'no data', RU: 'нет данных', KG: 'маалымат жок' };
const weatherWord = (lang, code) => condition[lang][code] || unknown[lang];
const sign = value => `${value > 0 ? '+' : ''}${value}°C`;
const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const average = list => Math.round(list.reduce((sum, value) => sum + value, 0) / list.length);
const dateFor = lang => {
  if (lang === 'KG') {
    const months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
    return `${Number(today.slice(8))}-${months[Number(today.slice(5, 7)) - 1]}, ${today.slice(0, 4)}-ж.`;
  }
  return new Intl.DateTimeFormat(lang === 'RU' ? 'ru-RU' : 'en-GB', { dateStyle: 'long', timeZone: 'Asia/Bishkek' }).format(new Date(`${today}T12:00:00+06:00`));
};

// Index 0 = yesterday, 1 = today, 2 = tomorrow, 3 = the day after.
const params = new URLSearchParams({
  latitude: KYRGYZSTAN_CITIES.map(city => city.lat).join(','), longitude: KYRGYZSTAN_CITIES.map(city => city.lon).join(','),
  daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max',
  past_days: '1', forecast_days: '3', timezone: 'Asia/Bishkek'
});
const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
if (!response.ok) throw new Error(`Open-Meteo returned ${response.status}`);
const payload = await response.json();
const forecasts = Array.isArray(payload) ? payload : [payload];
if (forecasts.length !== KYRGYZSTAN_CITIES.length || forecasts.some(record => record.daily?.time?.[1] !== today)) throw new Error('Incomplete forecast response');

const rows = KYRGYZSTAN_CITIES.map((city, index) => {
  const d = forecasts[index].daily;
  const at = (key, day) => d[key][day];
  return {
    id: city.id, regionKey: city.regionKey,
    names: { EN: city.name, RU: RU_NAMES[city.id] || city.nativeName, KG: city.nativeName },
    yesterdayHigh: Math.round(at('temperature_2m_max', 0)),
    high: Math.round(at('temperature_2m_max', 1)), low: Math.round(at('temperature_2m_min', 1)),
    rain: at('precipitation_probability_max', 1) ?? 0, precipMm: Math.round((at('precipitation_sum', 1) ?? 0) * 10) / 10,
    wind: Math.round(at('wind_speed_10m_max', 1)), code: at('weather_code', 1),
    tomorrowHigh: Math.round(at('temperature_2m_max', 2)), tomorrowLow: Math.round(at('temperature_2m_min', 2)),
    dayAfterHigh: Math.round(at('temperature_2m_max', 3))
  };
});
const pick = (key, dir) => rows.reduce((best, row) => (dir * row[key] > dir * best[key] ? row : best));
const warmest = pick('high', 1), coldest = pick('low', -1), wettest = pick('rain', 1), windiest = pick('wind', 1);
const wetCount = rows.filter(row => row.rain >= 50).length;
const biggestChange = rows.reduce((best, row) => (Math.abs(row.high - row.yesterdayHigh) > Math.abs(best.high - best.yesterdayHigh) ? row : best));
const avgToday = average(rows.map(row => row.high)), avgYesterday = average(rows.map(row => row.yesterdayHigh));
const avgTomorrow = average(rows.map(row => row.tomorrowHigh)), avgDayAfter = average(rows.map(row => row.dayAfterHigh));
const diff = avgToday - avgYesterday;
const bishkek = rows.find(row => row.id === 'bishkek');

const COPY = {
  EN: {
    windUnit: 'km/h', category: 'Weather Forecast',
    intro: date => `Weather across Kyrgyzstan on ${date}: forecast highs, lows, rain chances and wind for all 17 cities covered by Pogoda.kg. Figures come from the Open-Meteo forecast collected at 09:20 Bishkek time and can change during the day.`,
    highlights: 'Today’s highlights',
    warmest: (c, v) => `Warmest afternoon: ${c}, up to ${v}.`,
    coldest: (c, v) => `Coldest night: ${c}, down to ${v}.`,
    wet: (c, p, n) => `Highest chance of rain or snow: ${c} (${p}%). ${n} of 17 cities have a chance of 50% or more.`,
    dry: p => `No city has more than a ${p}% chance of rain or snow, so it should be a mostly dry day.`,
    windiest: (c, v) => `Strongest wind: ${c}, up to ${v}.`,
    changeHeading: 'Compared with yesterday',
    change: (a, y, d) => `The average daytime high across the 17 cities is ${a}°C, ${d > 0 ? `${d}° warmer than` : d < 0 ? `${-d}° cooler than` : 'about the same as'} yesterday (${y}°C).`,
    biggest: (c, y, t) => `The biggest change is in ${c}: ${y} yesterday, ${t} today.`,
    tableHeading: 'All 17 cities', cols: ['City', 'Region', 'High / low', 'Rain chance', 'Wind', 'Sky'],
    outlookHeading: 'Next two days',
    outlook: (a, b, bt) => `Average daytime highs across the country: ${a}°C tomorrow and ${b}°C the day after. Bishkek tomorrow: ${bt}.`,
    travelHeading: 'Before travelling',
    travel: 'Mountain weather changes faster than city weather. Before crossing a pass, check the <a href="/passes">mountain pass forecast</a> and official road information from the Ministry of Transport.',
    seoDesc: (date, w, c) => `Kyrgyzstan weather on ${date} for 17 cities. Warmest: ${w}; coldest night: ${c}. Rain chances, wind and a two-day outlook.`,
    excerpt: (date, w, c) => `Weather in 17 Kyrgyzstan cities on ${date}. Warmest: ${w}; coldest night: ${c}.`
  },
  RU: {
    windUnit: 'км/ч', category: 'Прогноз погоды',
    intro: date => `Погода в Кыргызстане на ${date}: прогноз максимальной и минимальной температуры, вероятности осадков и ветра для всех 17 городов на Pogoda.kg. Данные — прогноз Open-Meteo, полученный в 09:20 по времени Бишкека; в течение дня он может измениться.`,
    highlights: 'Главное за день',
    warmest: (c, v) => `Самый тёплый день — ${c}: до ${v}.`,
    coldest: (c, v) => `Самая холодная ночь — ${c}: до ${v}.`,
    wet: (c, p, n) => `Наибольшая вероятность осадков — ${c} (${p}%). Вероятность 50% и выше — в ${n} из 17 городов.`,
    dry: p => `Ни в одном городе вероятность осадков не превышает ${p}% — день в основном сухой.`,
    windiest: (c, v) => `Самый сильный ветер — ${c}: до ${v}.`,
    changeHeading: 'По сравнению со вчерашним днём',
    change: (a, y, d) => `Средняя дневная температура по 17 городам — ${a}°C, ${d > 0 ? `на ${d}° теплее, чем вчера` : d < 0 ? `на ${-d}° холоднее, чем вчера` : 'почти как вчера'} (${y}°C).`,
    biggest: (c, y, t) => `Сильнее всего изменилась погода — ${c}: вчера ${y}, сегодня ${t}.`,
    tableHeading: 'Все 17 городов', cols: ['Город', 'Область', 'Макс. / мин.', 'Осадки', 'Ветер', 'Погода'],
    outlookHeading: 'Следующие два дня',
    outlook: (a, b, bt) => `Средняя дневная температура по стране: ${a}°C завтра и ${b}°C послезавтра. Бишкек завтра: ${bt}.`,
    travelHeading: 'Перед поездкой',
    travel: 'В горах погода меняется быстрее, чем в городах. Перед поездкой через перевал посмотрите <a href="/passes">прогноз для перевалов</a> и официальную информацию о проезжаемости Министерства транспорта.',
    seoDesc: (date, w, c) => `Погода в Кыргызстане на ${date} по 17 городам. Теплее всего: ${w}; самая холодная ночь: ${c}. Осадки, ветер и прогноз на два дня.`,
    excerpt: (date, w, c) => `Погода в 17 городах Кыргызстана на ${date}. Теплее всего: ${w}; самая холодная ночь: ${c}.`
  },
  KG: {
    windUnit: 'км/саат', category: 'Аба ырайы божомолу',
    intro: date => `Кыргызстандагы аба ырайы (${date}): Pogoda.kg камтыган 17 шаар боюнча эң жогорку жана эң төмөнкү температура, жаан-чачын ыктымалдыгы жана шамал. Маалымат Бишкек убактысы менен саат 09:20да алынган Open-Meteo божомолуна негизделет жана күн ичинде өзгөрүшү мүмкүн.`,
    highlights: 'Күндүн негизгилери',
    warmest: (c, v) => `Күндүз эң жылуу — ${c}: ${v}.`,
    coldest: (c, v) => `Түнкүсүн эң суук — ${c}: ${v}.`,
    wet: (c, p, n) => `Жаан-чачын ыктымалдыгы эң жогору — ${c} (${p}%). 17 шаардын ${n} шаарында ыктымалдык 50% же андан жогору.`,
    dry: p => `Бир да шаарда жаан-чачын ыктымалдыгы ${p}% ашпайт — күн негизинен кургак.`,
    windiest: (c, v) => `Шамал эң катуу — ${c}: ${v}.`,
    changeHeading: 'Кечээ менен салыштырганда',
    change: (a, y, d) => `17 шаардын орточо күндүзгү температурасы — ${a}°C, ${d > 0 ? `кечээкиден ${d}° жылуу` : d < 0 ? `кечээкиден ${-d}° суук` : 'кечээкидей эле'} (${y}°C).`,
    biggest: (c, y, t) => `Эң чоң өзгөрүү — ${c}: кечээ ${y}, бүгүн ${t}.`,
    tableHeading: '17 шаардын баары', cols: ['Шаар', 'Облус', 'Макс. / мин.', 'Жаан-чачын', 'Шамал', 'Абал'],
    outlookHeading: 'Кийинки эки күн',
    outlook: (a, b, bt) => `Өлкө боюнча орточо күндүзгү температура: эртең ${a}°C, бүрсүгүнү ${b}°C. Бишкекте эртең: ${bt}.`,
    travelHeading: 'Жолго чыгаарда',
    travel: 'Тоолордо аба ырайы шаарларга караганда тезирээк өзгөрөт. Ашуу аркылуу жолго чыгардан мурун <a href="/passes">ашуулардын божомолун</a> жана Транспорт министрлигинин расмий жол маалыматын текшериңиз.',
    seoDesc: (date, w, c) => `Кыргызстандагы аба ырайы (${date}), 17 шаар. Эң жылуу: ${w}; эң суук түн: ${c}. Жаан-чачын, шамал жана эки күндүк божомол.`,
    excerpt: (date, w, c) => `Кыргызстандын 17 шаарындагы аба ырайы (${date}). Эң жылуу: ${w}; эң суук түн: ${c}.`
  }
};

function translation(lang) {
  const t = COPY[lang], date = dateFor(lang), name = row => esc(row.names[lang]), title = shortTitleFor(lang, today);
  const cityLink = row => `<a href="/${row.id}">${name(row)}</a>`;
  const wind = value => `${value} ${t.windUnit}`;
  const rainLine = wettest.rain >= 30 ? t.wet(cityLink(wettest), wettest.rain, wetCount) : t.dry(wettest.rain);
  const tableRows = rows.map(row => `<tr><td>${cityLink(row)}</td><td>${esc(TRANSLATIONS[lang][`region_${row.regionKey}`] || '')}</td><td>${sign(row.high)} / ${sign(row.low)}</td><td>${row.rain}%${row.precipMm >= 0.5 ? ` (${row.precipMm} ${lang === 'EN' ? 'mm' : 'мм'})` : ''}</td><td>${wind(row.wind)}</td><td>${weatherWord(lang, row.code)}</td></tr>`).join('');
  const content = [
    `<p>${t.intro(date)}</p>`,
    `<h3>${t.highlights}</h3><ul>`,
    `<li>${t.warmest(cityLink(warmest), sign(warmest.high))}</li>`,
    `<li>${t.coldest(cityLink(coldest), sign(coldest.low))}</li>`,
    `<li>${rainLine}</li>`,
    `<li>${t.windiest(cityLink(windiest), wind(windiest.wind))}</li></ul>`,
    `<h3>${t.changeHeading}</h3><p>${t.change(avgToday, avgYesterday, diff)} ${t.biggest(cityLink(biggestChange), sign(biggestChange.yesterdayHigh), sign(biggestChange.high))}</p>`,
    `<h3>${t.tableHeading}</h3><div class="table-scroll"><table class="forecast-table"><thead><tr>${t.cols.map(col => `<th scope="col">${col}</th>`).join('')}</tr></thead><tbody>${tableRows}</tbody></table></div>`,
    `<h3>${t.outlookHeading}</h3><p>${t.outlook(avgTomorrow, avgDayAfter, `${sign(bishkek.tomorrowHigh)} / ${sign(bishkek.tomorrowLow)}`)}</p>`,
    `<h3>${t.travelHeading}</h3><p>${t.travel}</p>`
  ].join('');
  const w = `${warmest.names[lang]} ${sign(warmest.high)}`, c = `${coldest.names[lang]} ${sign(coldest.low)}`;
  return { title, seoTitle: title, seoDesc: t.seoDesc(date, w, c), category: t.category, date, author: 'Pogoda Weather Team', excerpt: t.excerpt(date, w, c), content };
}

const translations = Object.fromEntries(['EN', 'RU', 'KG'].map(lang => [lang, translation(lang)]));
const post = { id: `daily-forecast-${today}`, slug, image: heroImage, translations };
if (DRY_RUN) { console.log(JSON.stringify(post, null, 2)); process.exit(0); }

const source = await readFile(dataFile, 'utf8');
if (!source.includes(marker)) throw new Error('Daily forecast marker is missing from blog-posts-data.js');
if (source.includes(`"slug": "${slug}"`)) { console.log(`Daily forecast already exists for ${today}; no post created.`); process.exit(0); }
await writeFile(dataFile, source.replace(marker, `${marker}\n  ${JSON.stringify(post, null, 2).replace(/\n/g, '\n  ')},`));

const article = buildDailyArticleHtml({ slug, dateISO: today, image: heroImage, heroAlt, en: translations.EN });
await mkdir(blogDirectory, { recursive: true });
await writeFile(new URL(`${slug}.html`, blogDirectory), article);
console.log(`Published forecast article source for ${today} (hero: ${heroFile}).`);
