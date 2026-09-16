import { KYRGYZSTAN_PASSES, OFFICIAL_CAMERAS_URL, OFFICIAL_ROAD_STATUS_URL } from './passes-data.js';
import { fetchWeatherData } from './api.js';
import { initTheme } from './theme.js';
import { getCurrentLang, initLangSwitcher } from './i18n.js';
import { initMiniWeather, refreshMiniWeather } from './mini-weather.js';

const copy = {
  EN: { kicker: 'Travel weather', title: 'Mountain passes: weather and road information', intro: 'Weather at major Kyrgyz mountain passes. Road access is confirmed only by the Ministry of Transport.', source: 'Official road status', cameras: 'Official road cameras', weather: 'Current temperature', visibility: 'Visibility', high: 'Today', wind: 'Wind', precipitation: 'Rain chance', unavailable: 'Weather is temporarily unavailable.', safety: 'Conditions in mountain areas can change quickly. Check official road information before departure and carry seasonal equipment.' },
  RU: { kicker: 'Погода для поездки', title: 'Горные перевалы: погода и информация о дорогах', intro: 'Погода на главных перевалах Кыргызстана. Проезд подтверждает только Министерство транспорта.', source: 'Официальная проезжаемость', cameras: 'Официальные дорожные камеры', weather: 'Температура сейчас', visibility: 'Видимость', high: 'Сегодня', wind: 'Ветер', precipitation: 'Вероятность осадков', unavailable: 'Погода временно недоступна.', safety: 'В горах условия меняются быстро. Перед выездом проверьте официальную информацию и возьмите сезонное снаряжение.' },
  KG: { kicker: 'Сапарга аба ырайы', title: 'Тоо ашуулары: аба ырайы жана жол маалыматы', intro: 'Кыргызстандын негизги ашууларындагы аба ырайы. Жолдун ачыктыгын Транспорт министрлиги гана ырастайт.', source: 'Расмий өтүү маалыматы', cameras: 'Расмий жол камералары', weather: 'Учурдагы температура', visibility: 'Көрүнүү', high: 'Бүгүн', wind: 'Шамал', precipitation: 'Жаан-чачын ыктымалдыгы', unavailable: 'Аба ырайы убактылуу жеткиликсиз.', safety: 'Тоолордо шарт тез өзгөрөт. Жолго чыгардан мурун расмий маалыматты текшерип, мезгилге ылайык жабдык алыңыз.' }
};

function text() { return copy[getCurrentLang()] || copy.KG; }

async function renderPasses() {
  const container = document.getElementById('passesGrid');
  if (!container) return;
  const t = text();
  document.getElementById('passesTitle').textContent = t.title;
  document.getElementById('passesIntro').textContent = t.intro;
  document.getElementById('passesSafety').textContent = t.safety;
  document.getElementById('roadStatusLink').textContent = t.source;
  document.getElementById('cameraLink').textContent = t.cameras;
  document.getElementById('passesKicker').textContent = t.kicker;
  container.replaceChildren();
  const results = await Promise.all(KYRGYZSTAN_PASSES.map(async pass => {
    try { return [pass, await fetchWeatherData(pass.lat, pass.lon)]; }
    catch { return [pass, null]; }
  }));
  results.forEach(([pass, data]) => {
    const card = document.createElement('article');
    card.className = 'travel-card';
    const heading = document.createElement('h2');
    heading.textContent = getCurrentLang() === 'EN' ? pass.en : getCurrentLang() === 'RU' ? pass.ru : pass.name;
    const route = document.createElement('p');
    route.className = 'travel-meta'; route.textContent = `${pass.route} · ${pass.elevation}`;
    const details = document.createElement('div');
    details.className = 'pass-weather-details';
    details.innerHTML = data ? `<p><strong>${t.weather}</strong><br>${data.current.temp}°C</p><p><strong>${t.visibility}</strong><br>${data.current.visibility} km</p><p><strong>${t.wind}</strong><br>${data.current.windSpeed} km/h</p>` : `<p>${t.unavailable}</p>`;
    const today = document.createElement('p');
    if (data) today.textContent = `${t.high}: ${data.weekly[0].maxTemp}° / ${data.weekly[0].minTemp}° · ${t.precipitation}: ${data.weekly[0].precip}%`;
    card.append(heading, route, details, today);
    container.append(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme(); initMiniWeather();
  initLangSwitcher(lang => { refreshMiniWeather(lang); renderPasses(); });
  document.getElementById('roadStatusLink').href = OFFICIAL_ROAD_STATUS_URL;
  document.getElementById('cameraLink').href = OFFICIAL_CAMERAS_URL;
  renderPasses();
});
