import { mkdir, writeFile } from 'node:fs/promises';
import { KYRGYZSTAN_CITIES } from '../src/js/config.js';
import { KYRGYZSTAN_PASSES } from '../src/js/passes-data.js';

const cities = [
  ['bishkek', 'Bishkek', 'Бишкек', 42.8746, 74.5698],
  ['osh', 'Osh', 'Ош', 40.514, 72.8161],
  ['karakol', 'Karakol', 'Каракол', 42.4907, 78.3936],
  ['naryn', 'Naryn', 'Нарын', 41.4287, 75.9911],
  ['jalal-abad', 'Jalal-Abad', 'Жалал-Абад', 40.9333, 72.9833]
];
const params = new URLSearchParams({
  latitude: cities.map(city => city[3]).join(','), longitude: cities.map(city => city[4]).join(','),
  current: 'temperature_2m,weather_code', daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
  forecast_days: '1', timezone: 'Asia/Bishkek'
});
const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
if (!response.ok) throw new Error(`Open-Meteo returned ${response.status}`);
const weather = await response.json();
const records = Array.isArray(weather) ? weather : [weather];
if (records.length !== cities.length) throw new Error('Incomplete weather data');
const brief = {
  generatedAt: new Date().toISOString(),
  cities: cities.map((city, index) => ({
    id: city[0], en: city[1], kg: city[2], ru: city[2],
    temp: Math.round(records[index].current.temperature_2m),
    high: Math.round(records[index].daily.temperature_2m_max[0]),
    low: Math.round(records[index].daily.temperature_2m_min[0]),
    precip: records[index].daily.precipitation_probability_max[0],
    code: records[index].current.weather_code
  }))
};
const output = `// Generated at ${brief.generatedAt}; do not edit by hand.\nexport const DAILY_BRIEFING = ${JSON.stringify(brief, null, 2)};\n`;
await writeFile(new URL('../src/js/daily-briefing-data.js', import.meta.url), output);

// 7-day forecast for every city page. build.js renders it into the HTML so the
// forecast can be read without JavaScript (SEO audit C2); the browser replaces it
// with live data. Best-effort: on failure the previous snapshot is kept rather
// than blocking the daily briefing.
try {
  const snapshotParams = new URLSearchParams({
    latitude: KYRGYZSTAN_CITIES.map(city => city.lat).join(','), longitude: KYRGYZSTAN_CITIES.map(city => city.lon).join(','),
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max', forecast_days: '7', timezone: 'Asia/Bishkek'
  });
  const snapshotResponse = await fetch(`https://api.open-meteo.com/v1/forecast?${snapshotParams}`);
  if (!snapshotResponse.ok) throw new Error(`Open-Meteo returned ${snapshotResponse.status}`);
  const snapshotJson = await snapshotResponse.json();
  const forecasts = Array.isArray(snapshotJson) ? snapshotJson : [snapshotJson];
  if (forecasts.length !== KYRGYZSTAN_CITIES.length || forecasts.some(record => !record.daily?.time?.length)) throw new Error('Incomplete forecast data');
  const snapshot = {
    generatedAt: brief.generatedAt,
    cities: Object.fromEntries(KYRGYZSTAN_CITIES.map((city, index) => {
      const daily = forecasts[index].daily;
      return [city.id, daily.time.map((date, day) => ({
        date, code: daily.weather_code[day],
        max: Math.round(daily.temperature_2m_max[day]), min: Math.round(daily.temperature_2m_min[day]),
        precip: daily.precipitation_probability_max[day]
      }))];
    }))
  };
  // Mountain passes: 3 days, with snowfall and wind, for /passes.
  try {
    const passParams = new URLSearchParams({
      latitude: KYRGYZSTAN_PASSES.map(pass => pass.lat).join(','), longitude: KYRGYZSTAN_PASSES.map(pass => pass.lon).join(','),
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,snowfall_sum,wind_speed_10m_max', forecast_days: '3', timezone: 'Asia/Bishkek'
    });
    const passResponse = await fetch(`https://api.open-meteo.com/v1/forecast?${passParams}`);
    if (!passResponse.ok) throw new Error(`Open-Meteo returned ${passResponse.status}`);
    const passJson = await passResponse.json();
    const passRecords = Array.isArray(passJson) ? passJson : [passJson];
    if (passRecords.length !== KYRGYZSTAN_PASSES.length) throw new Error('Incomplete pass data');
    snapshot.passes = Object.fromEntries(KYRGYZSTAN_PASSES.map((pass, index) => {
      const daily = passRecords[index].daily;
      return [pass.id, { gridElevation: Math.round(passRecords[index].elevation), days: daily.time.map((date, day) => ({
        date, code: daily.weather_code[day],
        max: Math.round(daily.temperature_2m_max[day]), min: Math.round(daily.temperature_2m_min[day]),
        precip: daily.precipitation_probability_max[day], snowCm: Math.round(daily.snowfall_sum[day] * 10) / 10,
        wind: Math.round(daily.wind_speed_10m_max[day])
      })) }];
    }));
  } catch (error) {
    console.warn(`Pass snapshot not updated: ${error.message}`);
  }
  await mkdir(new URL('../src/data/', import.meta.url), { recursive: true });
  await writeFile(new URL('../src/data/forecast-snapshot.json', import.meta.url), `${JSON.stringify(snapshot, null, 1)}\n`);
} catch (error) {
  console.warn(`Forecast snapshot not updated: ${error.message}`);
}
