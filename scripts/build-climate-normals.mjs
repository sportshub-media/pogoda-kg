// One-off (re-run yearly at most): monthly climate averages for every city page,
// from Open-Meteo's historical weather API (ERA5 / ERA5-Land reanalysis).
// Writes src/data/climate-normals.json, which build.js renders into each city page.
//   node scripts/build-climate-normals.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import { KYRGYZSTAN_CITIES } from '../src/js/config.js';

const START = '2016-01-01';
const END = '2025-12-31';
const YEARS = 10;
const round1 = value => Math.round(value * 10) / 10;

async function fetchCity(city) {
  const params = new URLSearchParams({
    latitude: city.lat, longitude: city.lon, start_date: START, end_date: END,
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,snowfall_sum',
    timezone: 'Asia/Bishkek'
  });
  for (let attempt = 1; attempt <= 4; attempt++) {
    const response = await fetch(`https://archive-api.open-meteo.com/v1/archive?${params}`);
    if (response.ok) return response.json();
    if (attempt === 4) throw new Error(`${city.id}: Open-Meteo returned ${response.status}`);
    await new Promise(resolve => setTimeout(resolve, 15000 * attempt));
  }
}

const cities = {};
for (const city of KYRGYZSTAN_CITIES) {
  const { daily, elevation } = await fetchCity(city);
  const months = Array.from({ length: 12 }, () => ({ max: [], min: [], precip: 0, snow: 0, wetDays: 0 }));
  daily.time.forEach((date, i) => {
    const month = months[Number(date.slice(5, 7)) - 1];
    if (daily.temperature_2m_max[i] != null) month.max.push(daily.temperature_2m_max[i]);
    if (daily.temperature_2m_min[i] != null) month.min.push(daily.temperature_2m_min[i]);
    month.precip += daily.precipitation_sum[i] || 0;
    month.snow += daily.snowfall_sum[i] || 0;
    if ((daily.precipitation_sum[i] || 0) >= 1) month.wetDays++;
  });
  const mean = list => list.reduce((sum, value) => sum + value, 0) / list.length;
  cities[city.id] = {
    gridElevation: Math.round(elevation),
    months: months.map(month => ({
      max: round1(mean(month.max)), min: round1(mean(month.min)),
      precip: Math.round(month.precip / YEARS), snowCm: Math.round(month.snow / YEARS),
      wetDays: Math.round(month.wetDays / YEARS)
    }))
  };
  console.log(`${city.id}: done`);
  await new Promise(resolve => setTimeout(resolve, 1500));
}

await mkdir(new URL('../src/data/', import.meta.url), { recursive: true });
await writeFile(new URL('../src/data/climate-normals.json', import.meta.url), `${JSON.stringify({
  source: 'Open-Meteo historical weather API (ERA5 / ERA5-Land reanalysis)',
  period: `${START.slice(0, 4)}–${END.slice(0, 4)}`,
  generatedAt: new Date().toISOString(),
  cities
}, null, 1)}\n`);
