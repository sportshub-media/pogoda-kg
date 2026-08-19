// Pogoda Kg - FAQ Page Controller
import { initTheme } from './theme.js';
import { initLangSwitcher, getCurrentLang } from './i18n.js';
import { KYRGYZSTAN_CITIES } from './config.js';
import { HOME_FAQ, MORE_GENERAL_FAQ, CITY_FAQ } from './faq-data.js';
import { initMiniWeather, refreshMiniWeather } from './mini-weather.js';

// Same map as RU_CITY_FORMS in build.js/app.js — Russian city names with the
// prepositional case, so RU city headings here don't show the Kyrgyz spelling.
const RU_CITY_FORMS = {
  'bishkek':    { nom: 'Бишкек',      prep: 'Бишкеке' },
  'osh':        { nom: 'Ош',          prep: 'Оше' },
  'jalal-abad': { nom: 'Джалал-Абад', prep: 'Джалал-Абаде' },
  'karakol':    { nom: 'Каракол',     prep: 'Караколе' },
  'tokmok':     { nom: 'Токмок',      prep: 'Токмоке' },
  'uzgen':      { nom: 'Узген',       prep: 'Узгене' },
  'kara-balta': { nom: 'Кара-Балта',  prep: 'Кара-Балте' },
  'balykchy':   { nom: 'Балыкчы',     prep: 'Балыкчы' },
  'naryn':      { nom: 'Нарын',       prep: 'Нарыне' },
  'talas':      { nom: 'Талас',       prep: 'Таласе' }
};

function cityHeadingName(lang, city) {
  if (lang === 'RU') return RU_CITY_FORMS[city.id] ? RU_CITY_FORMS[city.id].nom : (city.nativeName || city.name);
  if (lang === 'KG') return city.nativeName || city.name;
  return city.name;
}

function faqItemsHTML(faqList) {
  return faqList.map(item => `
      <details class="faq-item">
        <summary class="faq-question">${item.q}</summary>
        <div class="faq-answer">${item.a}</div>
      </details>`).join('\n');
}

function renderGeneralFAQ(lang) {
  const container = document.getElementById('faqGeneralContainer');
  if (!container) return;
  const list = [...(HOME_FAQ[lang] || HOME_FAQ.EN), ...(MORE_GENERAL_FAQ[lang] || MORE_GENERAL_FAQ.EN)];
  container.innerHTML = faqItemsHTML(list);
}

function renderCitiesFAQ(lang) {
  const container = document.getElementById('faqCitiesContainer');
  if (!container) return;
  container.innerHTML = KYRGYZSTAN_CITIES.map(city => {
    const cityFaq = CITY_FAQ[city.id];
    if (!cityFaq) return '';
    const list = cityFaq[lang] || cityFaq.EN;
    return `
      <div style="margin-bottom: 28px;">
        <h3 style="font-size:18px; font-weight:700; margin-bottom:12px; text-align:center;">${cityHeadingName(lang, city)}</h3>
        <div class="faq-list">${faqItemsHTML(list)}</div>
      </div>`;
  }).join('\n');
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMiniWeather();
  initLangSwitcher((lang) => {
    renderGeneralFAQ(lang);
    renderCitiesFAQ(lang);
    refreshMiniWeather(lang);
  });
  renderGeneralFAQ(getCurrentLang());
  renderCitiesFAQ(getCurrentLang());
});
