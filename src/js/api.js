// Weather data stays in the forecast location's timezone. Never invent observations.
import { WMO_WEATHER_CODES } from './config.js';
const cache = new Map();
const pending = new Map();
export const REFRESH_MS = 15 * 60 * 1000;

export async function fetchWeatherData(lat, lon) {
  const key = `${lat},${lon}`;
  const saved = cache.get(key);
  if (saved && Date.now() - saved.fetchedAt < REFRESH_MS) return saved;
  if (pending.has(key)) return pending.get(key);
  const request = (async () => {
    try {
      const params = new URLSearchParams({ latitude: lat, longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m',
        hourly: 'temperature_2m,precipitation_probability,weather_code,visibility,wind_speed_10m,is_day',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max',
        forecast_days: '7', timezone: 'Asia/Bishkek', wind_speed_unit: 'kmh'
      });
      const result = formatWeatherData(await requestForecast(params));
      result.fetchedAt = Date.now();
      result.stale = false;
      cache.set(key, result);
      return result;
    } catch (error) {
      if (saved && Date.now() - saved.fetchedAt < 60 * 60 * 1000) return { ...saved, stale: true };
      throw error;
    }
  })();
  pending.set(key, request);
  try { return await request; } finally { pending.delete(key); }
}

function condition(code, isDay = true) {
  const info = WMO_WEATHER_CODES[code] || {
    labelKey: 'cond_unknown', svg: '<span aria-hidden="true">—</span>'
  };
  if (isDay || ![0, 1, 2].includes(code)) return info;
  const file = code === 0 ? 'night' : `cloudy-night-${code}`;
  return { ...info, labelKey: code === 0 ? 'cond_clear_night' : info.labelKey, svg: `<img src="/assets/animated/${file}.svg" class="weather-anim-icon" alt="">` };
}
const rounded = value => Number.isFinite(value) ? Math.round(value) : '—';

export function formatWeatherData(data) {
  const { current, daily, hourly } = data;
  if (!current || !Number.isFinite(current.temperature_2m) || !hourly?.time?.length || daily?.time?.length < 7) {
    throw new Error('Incomplete weather response');
  }
  // ISO local timestamps sort chronologically without using the visitor's timezone.
  const index = hourly.time.findIndex(time => time.slice(0, 13) === current.time.slice(0, 13));
  if (index < 0) throw new Error('Current forecast hour missing');
  const offset = data.utc_offset_seconds;
  if (!Number.isFinite(offset)) throw new Error('Forecast timezone missing');
  const epoch = time => Date.parse(`${time}Z`) - offset * 1000;
  const sunrise = epoch(daily.sunrise[0]);
  const sunset = epoch(daily.sunset[0]);
  const visibility = hourly.visibility?.[index];
  return {
    observedAt: epoch(current.time), timezone: data.timezone || 'Asia/Bishkek',
    current: {
      temp: rounded(current.temperature_2m), feelsLike: rounded(current.apparent_temperature),
      ...condition(current.weather_code, current.is_day === 1),
      conditionKey: condition(current.weather_code, current.is_day === 1).labelKey,
      humidity: rounded(current.relative_humidity_2m), windSpeed: rounded(current.wind_speed_10m),
      windDir: current.wind_direction_10m, pressure: rounded(current.pressure_msl), cloudCover: current.cloud_cover,
      visibility: Number.isFinite(visibility) ? `${(visibility / 1000).toFixed(1)} km` : '—',
      sunrise: daily.sunrise[0].slice(11, 16), sunset: daily.sunset[0].slice(11, 16),
      sunProgress: Math.min(100, Math.max(0, (Date.now() - sunrise) / (sunset - sunrise) * 100)),
      isDay: current.is_day === 1
    },
    hourly: hourly.time.slice(index, index + 24).map((time, i) => {
      const idx = index + i, info = condition(hourly.weather_code[idx], hourly.is_day?.[idx] !== 0);
      return { time: time.slice(11, 16), temp: rounded(hourly.temperature_2m[idx]),
        conditionKey: info.labelKey, svg: info.svg,
        precip: rounded(hourly.precipitation_probability[idx]), wind: rounded(hourly.wind_speed_10m[idx]) };
    }),
    weekly: daily.time.slice(0, 7).map((date, i) => {
      const info = condition(daily.weather_code[i]);
      return { date, maxTemp: rounded(daily.temperature_2m_max[i]), minTemp: rounded(daily.temperature_2m_min[i]),
        conditionKey: info.labelKey, svg: info.svg, precip: rounded(daily.precipitation_probability_max[i]) };
    })
  };
}

// Combine city requests made in the same turn into one provider request.
let queue = [];
function requestForecast(params) {
  return new Promise((resolve, reject) => {
    queue.push({ params, resolve, reject });
    if (queue.length === 1) queueMicrotask(flushRequests);
  });
}
async function flushRequests() {
  const batch = queue; queue = [];
  const params = new URLSearchParams(batch[0].params);
  params.set('latitude', batch.map(item => item.params.get('latitude')).join(','));
  params.set('longitude', batch.map(item => item.params.get('longitude')).join(','));
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal });
    if (!response.ok) throw new Error(`Weather service returned ${response.status}`);
    const json = await response.json();
    const results = Array.isArray(json) ? json : [json];
    if (results.length !== batch.length) throw new Error('Incomplete city batch');
    batch.forEach((item, index) => item.resolve(results[index]));
  } catch (error) { batch.forEach(item => item.reject(error)); }
  finally { clearTimeout(timeout); }
}
