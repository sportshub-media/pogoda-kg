// Pogoda Kg - Interactive Weather Map Controller
import { KYRGYZSTAN_CITIES } from './config.js';
import { fetchWeatherData } from './api.js';
import { initTheme } from './theme.js';
import { initLangSwitcher, TRANSLATIONS, getCurrentLang, getRegionName } from './i18n.js';

let leafletMap = null;
let markersLayer = null;

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  // Pass a callback to re-render markers when language changes
  initLangSwitcher(() => {
    if (leafletMap) renderMarkers();
  });
  initKyrgyzstanMap();
});

function getConditionStr(conditionKey) {
  const lang = getCurrentLang();
  return TRANSLATIONS[lang] && TRANSLATIONS[lang][conditionKey] ? TRANSLATIONS[lang][conditionKey] : conditionKey;
}

function getCityName(city) {
  const lang = getCurrentLang();
  return (lang === 'RU' || lang === 'KG') ? city.nativeName : city.name;
}

async function initKyrgyzstanMap() {
  const mapContainer = document.getElementById('kyrgyzstanWeatherMap');
  if (!mapContainer || typeof L === 'undefined') return;

  // Initialize Leaflet Map over Kyrgyzstan
  leafletMap = L.map('kyrgyzstanWeatherMap').setView([41.5000, 74.8000], 7);
  // Drop Leaflet's default "🇺🇦 Leaflet" branding prefix, keep only our own attribution.
  leafletMap.attributionControl.setPrefix(false);

  // Add OpenStreetMap base tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors | Pogoda Kg'
  }).addTo(leafletMap);

  markersLayer = L.layerGroup().addTo(leafletMap);
  await renderMarkers();
}

async function renderMarkers() {
  if (!markersLayer || !leafletMap) return;

  markersLayer.clearLayers();

  const lang = getCurrentLang();
  const langPrefix = lang === 'KG' ? '' : `/${lang.toLowerCase()}`;

  for (const city of KYRGYZSTAN_CITIES) {
    const data = await fetchWeatherData(city.lat, city.lon);
    const displayName = getCityName(city);
    
    // Custom HTML Marker Icon. No fixed iconSize — labels vary a lot in length
    // (city name + temperature), so the pill must size itself to its own text
    // instead of being stretched/clipped to a fixed box.
    const customIcon = L.divIcon({
      className: 'custom-weather-marker',
      html: `
        <div style="display:inline-block; background:var(--primary); color:white; padding:6px 12px; border-radius:20px; font-weight:700; font-size:13px; box-shadow:0 4px 12px rgba(0,0,0,0.3); white-space:nowrap; border:2px solid white; transform:translate(-50%, -50%);">
          ${displayName}: ${data.current.temp}°C
        </div>
      `
    });

    const marker = L.marker([city.lat, city.lon], { icon: customIcon }).addTo(markersLayer);

    marker.bindPopup(`
      <div style="padding:8px; font-family:sans-serif; text-align:center;">
        <h3 style="margin:0 0 4px 0; font-size:18px;">${displayName} <small>(${getCurrentLang() === 'EN' ? city.nativeName : city.name})</small></h3>
        <div style="font-size:12px; color:#64748B;">${getRegionName(city, lang)}</div>
        <div style="font-size:32px; font-weight:800; color:#FF9F43; margin:8px 0;">${data.current.temp}°C</div>
        <div style="font-size:14px; font-weight:600;">${getConditionStr(data.current.conditionKey)}</div>
        <div style="font-size:12px; margin-top:8px; display:flex; justify-content:space-around;">
          <span>💨 ${data.current.windSpeed} km/h</span>
          <span>💧 ${data.current.humidity}%</span>
        </div>
        <a href="${langPrefix}/${city.id}" style="display:inline-block; margin-top:12px; background:#FF9F43; color:white; padding:6px 14px; border-radius:16px; font-size:12px; text-decoration:none; font-weight:700;">${TRANSLATIONS[lang].view_forecast_btn}</a>
      </div>
    `);
  }
}
