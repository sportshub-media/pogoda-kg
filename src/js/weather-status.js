import { getCurrentLang } from './i18n.js';
export function weatherText(key) {
  const strings = {
    EN: { unavailable: 'Weather is temporarily unavailable. Please try again.', retry: 'Retry', updated: 'Weather data', stale: 'Saved weather — live update unavailable', source: 'Source: Open-Meteo', now: 'Now', unknown: 'Unknown conditions' },
    RU: { unavailable: 'Погода временно недоступна. Попробуйте ещё раз.', retry: 'Повторить', updated: 'Данные погоды', stale: 'Сохранённая погода — обновление недоступно', source: 'Источник: Open-Meteo', now: 'Сейчас', unknown: 'Нет данных об условиях' },
    KG: { unavailable: 'Аба ырайы убактылуу жеткиликсиз. Кайра аракет кылыңыз.', retry: 'Кайталоо', updated: 'Аба ырайы маалыматы', stale: 'Сакталган аба ырайы — жаңыртуу жеткиликсиз', source: 'Булак: Open-Meteo', now: 'Азыр', unknown: 'Аба ырайы белгисиз' }
  };
  return (strings[getCurrentLang()] || strings.KG)[key];
}
export function showWeatherError(container, retry) {
  if (!container) return;
  container.replaceChildren();
  const text = document.createElement('p');
  text.setAttribute('role', 'status'); text.textContent = weatherText('unavailable');
  container.append(text);
  if (retry) {
    const button = document.createElement('button'); button.className = 'btn-primary';
    button.textContent = weatherText('retry');
    button.addEventListener('click', async () => { button.disabled = true; try { await retry(); } finally { button.disabled = false; } });
    container.append(button);
  }
}
export function weatherStatus(data) {
  const locale = { KG: 'ky-KG', RU: 'ru-RU', EN: 'en-GB' }[getCurrentLang()];
  const stamp = new Intl.DateTimeFormat(locale, { timeZone: data.timezone, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(data.observedAt));
  return `${weatherText(data.stale ? 'stale' : 'updated')}: ${stamp} (UTC+6)`;
}
