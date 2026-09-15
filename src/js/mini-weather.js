import { showWeatherError, weatherStatus } from './weather-status.js';
// Pogoda Kg - Compact live-weather badge for pages with no forecast display of
// their own (FAQ, blog, contact, map, legal pages, 404). Always shows Bishkek,
// the site's default city, in the page's top-right corner.
import { REFRESH_MS, fetchWeatherData } from './api.js';
import { DEFAULT_CITY } from './config.js';
import { TRANSLATIONS, getCurrentLang } from './i18n.js';

let currentData = null;
let refreshStarted = false;

function render(lang) {
  const el = document.getElementById('miniWeatherWidget');
  if (!el || !currentData) return;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;
  const current = currentData.current;
  el.innerHTML = `
    <div class="mini-weather-icon">${current.svg}</div>
    <div class="mini-weather-col">
      <div class="mini-weather-temp">${current.temp > 0 ? '+' : ''}${current.temp}°</div>
      <div class="mini-weather-feels">${t.feels_like} &approx; ${current.feelsLike > 0 ? '+' : ''}${current.feelsLike}°</div>
    </div>`;
  el.title = weatherStatus(currentData);
  el.classList.add('is-loaded');
}

export async function initMiniWeather() {
  const el = document.getElementById('miniWeatherWidget');
  if (!el) return;
  if (!refreshStarted) {
    refreshStarted = true;
    setInterval(() => { if (!document.hidden) initMiniWeather(); }, REFRESH_MS);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) initMiniWeather(); });
  }
  try {
    currentData = await fetchWeatherData(DEFAULT_CITY.lat, DEFAULT_CITY.lon);
    render(getCurrentLang());
  } catch { currentData = null; showWeatherError(el, initMiniWeather); }
}

export function refreshMiniWeather(lang) {
  render(lang);
}
