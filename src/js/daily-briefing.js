import { DAILY_BRIEFING } from './daily-briefing-data.js';
import { initTheme } from './theme.js';
import { getCurrentLang, initLangSwitcher } from './i18n.js';
import { initMiniWeather, refreshMiniWeather } from './mini-weather.js';

const copy = {
  EN: { title: 'Kyrgyzstan weather today', intro: 'A daily snapshot for five major cities. This page is updated once each morning; live city pages refresh during the day.', updated: 'Daily briefing updated', empty: 'Today’s briefing is being prepared. Open a city page for the latest live forecast.', high: 'High', low: 'Low', rain: 'Rain chance', live: 'Open live forecast', source: 'Forecast data: Open-Meteo. For weather warnings, check the Ministry of Emergency Situations.' },
  RU: { title: 'Погода в Кыргызстане сегодня', intro: 'Ежедневная сводка по пяти крупным городам. Страница обновляется утром, а прогнозы городов — в течение дня.', updated: 'Ежедневная сводка обновлена', empty: 'Сегодняшняя сводка готовится. Откройте страницу города для актуального прогноза.', high: 'Днём', low: 'Ночью', rain: 'Вероятность осадков', live: 'Открыть прогноз', source: 'Данные прогноза: Open-Meteo. Предупреждения о погоде проверяйте на сайте МЧС.' },
  KG: { title: 'Бүгүн Кыргызстандагы аба ырайы', intro: 'Беш ири шаар боюнча күнүмдүк кыскача маалымат. Бул барак эртең менен жаңыланат, шаарлардын божомолу күн ичинде да жаңыланат.', updated: 'Күндөлүк маалымат жаңыртылды', empty: 'Бүгүнкү маалымат даярдалууда. Акыркы божомолду көрүү үчүн шаар барагын ачыңыз.', high: 'Күндүз', low: 'Түнкүсүн', rain: 'Жаан-чачын ыктымалдыгы', live: 'Божомолду ачуу', source: 'Божомол маалыматы: Open-Meteo. Аба ырайы боюнча эскертүүлөрдү Өзгөчө кырдаалдар министрлигинен текшериңиз.' }
};
const conditions = {
  0: ['Clear', 'Ясно', 'Ачык'], 1: ['Mainly clear', 'Преимущественно ясно', 'Негизинен ачык'],
  2: ['Partly cloudy', 'Переменная облачность', 'Ала булуттуу'], 3: ['Overcast', 'Пасмурно', 'Булуттуу'],
  45: ['Fog', 'Туман', 'Туман'], 48: ['Fog', 'Туман', 'Туман'],
  51: ['Drizzle', 'Морось', 'Майда жамгыр'], 53: ['Drizzle', 'Морось', 'Майда жамгыр'], 55: ['Drizzle', 'Морось', 'Майда жамгыр'],
  61: ['Rain', 'Дождь', 'Жамгыр'], 63: ['Rain', 'Дождь', 'Жамгыр'], 65: ['Heavy rain', 'Сильный дождь', 'Катуу жамгыр'],
  71: ['Snow', 'Снег', 'Кар'], 73: ['Snow', 'Снег', 'Кар'], 75: ['Heavy snow', 'Сильный снег', 'Катуу кар'],
  80: ['Showers', 'Ливни', 'Нөшөр'], 81: ['Showers', 'Ливни', 'Нөшөр'], 82: ['Heavy showers', 'Сильные ливни', 'Катуу нөшөр'], 95: ['Thunderstorm', 'Гроза', 'Күн күркүрөө']
};
function t() { return copy[getCurrentLang()] || copy.KG; }
function condition(code) { const index = { EN: 0, RU: 1, KG: 2 }[getCurrentLang()] ?? 2; return (conditions[code] || ['Unknown', 'Нет данных', 'Белгисиз'])[index]; }
function render() {
  const strings = t();
  document.getElementById('briefingTitle').textContent = strings.title;
  document.getElementById('briefingIntro').textContent = strings.intro;
  document.getElementById('briefingSource').textContent = strings.source;
  const status = document.getElementById('briefingStatus');
  const grid = document.getElementById('briefingGrid');
  grid.replaceChildren();
  if (!DAILY_BRIEFING.generatedAt || !DAILY_BRIEFING.cities.length) { status.textContent = strings.empty; return; }
  status.textContent = `${strings.updated}: ${new Intl.DateTimeFormat({ EN: 'en-GB', RU: 'ru-RU', KG: 'ky-KG' }[getCurrentLang()], { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Bishkek' }).format(new Date(DAILY_BRIEFING.generatedAt))} (UTC+6)`;
  DAILY_BRIEFING.cities.forEach(city => {
    const card = document.createElement('article'); card.className = 'travel-card';
    const cityName = getCurrentLang() === 'EN' ? city.en : getCurrentLang() === 'RU' ? city.ru : city.kg;
    card.innerHTML = `<h2>${cityName}</h2><p class="travel-weather">${city.temp > 0 ? '+' : ''}${city.temp}° · ${condition(city.code)}</p><p>${strings.high}: ${city.high}° · ${strings.low}: ${city.low}°</p><p>${strings.rain}: ${city.precip}%</p>`;
    const link = document.createElement('a'); link.className = 'btn-primary';
    link.href = `${getCurrentLang() === 'KG' ? '' : '/' + getCurrentLang().toLowerCase()}/${city.id}`;
    link.textContent = strings.live; card.append(link); grid.append(card);
  });
}
document.addEventListener('DOMContentLoaded', () => { initTheme(); initMiniWeather(); initLangSwitcher(lang => { refreshMiniWeather(lang); render(); }); render(); });
