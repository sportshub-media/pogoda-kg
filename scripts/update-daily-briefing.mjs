import { writeFile } from 'node:fs/promises';

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
