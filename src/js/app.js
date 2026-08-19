// Pogoda Kg - Main Application Logic
import { KYRGYZSTAN_CITIES, DEFAULT_CITY } from './config.js';
import { fetchWeatherData } from './api.js';
import { initTheme } from './theme.js';
import { TRANSLATIONS, getCurrentLang, initLangSwitcher, getRegionName } from './i18n.js';
import { BLOG_POSTS } from './blog-posts-data.js';
import { initScrollReveal } from './reveal.js';
import { HOME_FAQ, CITY_FAQ } from './faq-data.js';

let currentCity = DEFAULT_CITY;
let weatherCache = {};
// True only on a real dedicated city page (e.g. /bishkek, /en/karakol). The homepage
// itself always shows the generic Kyrgyzstan-wide heading and Bishkek's weather.
let isDedicatedCityPage = false;

document.addEventListener('DOMContentLoaded', () => {
  // Legacy ?city= links now have real pages (e.g. /bishkek, /en/bishkek) — send
  // anyone still landing on the old query-param URL straight to the real page.
  const legacyCityParam = new URLSearchParams(window.location.search).get('city');
  if (legacyCityParam) {
    const legacyCity = KYRGYZSTAN_CITIES.find(c => c.id === legacyCityParam.toLowerCase());
    if (legacyCity) {
      const path = window.location.pathname;
      const prefix = path.startsWith('/en') ? '/en' : (path.startsWith('/ru') ? '/ru' : '');
      window.location.replace(`${prefix}/${legacyCity.id}`);
      return;
    }
  }

  initTheme();
  // initLangSwitcher() calls initMobileMenu() itself (same as every other page's
  // controller) — calling it again here double-attaches the toggle's click
  // listener, which opens then immediately closes the drawer on every click.

  // Read city from URL if passed from map
  const urlParams = new URLSearchParams(window.location.search);
  const cityParam = urlParams.get('city');

  const pathParts = window.location.pathname.split('/').filter(p => p.length > 0 && p !== 'en' && p !== 'ru' && p !== 'kg');
  const pathCity = pathParts[0] ? pathParts[0].replace('.html', '') : null;

  if (cityParam) {
    const found = KYRGYZSTAN_CITIES.find(c => c.id === cityParam);
    if (found) currentCity = found;
  } else if (pathCity) {
    const found = KYRGYZSTAN_CITIES.find(c => c.id === pathCity);
    if (found) {
      currentCity = found;
      isDedicatedCityPage = true;
    }
  }

  initLangSwitcher((lang) => {
    updateCityInfoDisplay(currentCity);
    renderNewsGrid(lang);
    renderFAQ(lang);
    if (weatherCache[currentCity.id]) {
      const data = weatherCache[currentCity.id];
      renderHeroCard(currentCity, data);
      renderHourlyForecast(data.hourly);
      renderTodayDetails(currentCity, data.current);
      renderWeeklyForecast(data.weekly);
      renderRecentSearches();
    }
  });
  renderNewsGrid(getCurrentLang());
  renderFAQ(getCurrentLang());
  setupSearch();
  setupHourlySlider();
  setupOtherCitiesScroll();
  renderOtherCities();
  loadCityWeather(currentCity);
  initScrollReveal();
});

function getCityName(city) {
  const lang = getCurrentLang();
  return (lang === 'RU' || lang === 'KG') ? city.nativeName : city.name;
}

function getConditionStr(conditionKey) {
  const lang = getCurrentLang();
  return TRANSLATIONS[lang] ? TRANSLATIONS[lang][conditionKey] : conditionKey;
}

// Every city has its own dedicated, statically-generated page — switching cities from
// search, recent searches, or the "Other Cities" list should navigate there for real
// instead of swapping content in place, which left the URL/heading out of sync with
// what was actually displayed.
function navigateToCityPage(city) {
  const lang = getCurrentLang();
  const prefix = lang === 'KG' ? '' : `/${lang.toLowerCase()}`;
  window.location.href = `${prefix}/${city.id}`;
}

// 2. Load and render weather for a selected city
export async function loadCityWeather(city) {
  currentCity = city;
  updateCityInfoDisplay(city);
  saveRecentSearch(city);

  // Check cache first or fetch live
  const data = await fetchWeatherData(city.lat, city.lon);
  weatherCache[city.id] = data;

  renderHeroCard(city, data);
  renderHourlyForecast(data.hourly);
  renderTodayDetails(city, data.current);
  renderWeeklyForecast(data.weekly);
  renderRecentSearches();
}

// Same map as RU_CITY_FORMS in build.js — Russian city names with the prepositional
// case, so RU pages don't show the Kyrgyz spelling and match how people search.
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

function ruCity(city) {
  return RU_CITY_FORMS[city.id] || { nom: city.nativeName || city.name, prep: city.nativeName || city.name };
}

// config.js stores image paths relative ("assets/images/x.webp"). On the
// language-prefixed pages (/ru/…, /en/…) a relative URL resolves to
// /ru/assets/… and 404s, so always resolve it from the site root.
function cityImageUrl(city) {
  if (!city || !city.image) return '';
  return city.image.startsWith('/') ? city.image : `/${city.image}`;
}

// Same wording as getCityMeta() in build.js, kept in sync so a client-side language
// switch on a city page updates <title>/description to match, instead of leaving
// them stuck in whichever language the page was originally served in.
function getCityMeta(lang, city) {
  const en = city.name;
  const native = city.nativeName || city.name;

  if (lang === 'EN') {
    return {
      title: `${en} Weather Forecast Today & This Week | Pogoda.kg`,
      description: `Get today's live weather forecast for ${en}, Kyrgyzstan — current temperature, wind, humidity, and a detailed 7-day outlook, refreshed every 15 minutes.`
    };
  }
  if (lang === 'RU') {
    const ru = ruCity(city);
    return {
      title: `Погода в ${ru.prep} сегодня, на неделю и месяц | Pogoda.kg`,
      description: `Прогноз погоды в ${ru.prep}, Киргизия: температура сейчас, почасовой прогноз, погода на завтра, на неделю, на 10 дней и на месяц. Обновляется каждые 15 минут.`
    };
  }
  return {
    title: `${native} аба ырайы бүгүн жана 7 күндүк божомол | Pogoda.kg`,
    description: `${native} шаары үчүн азыркы аба ырайынын божомолу: температура, шамал, нымдуулук жана 7 күндүк, 14 күндүк божомолдор ар 15 мүнөт сайын автоматтык жаңыртылат.`
  };
}

// Same wording as getCityHeroContent() in build.js, kept in sync so the hero heading/intro
// baked into each static city page still matches after a client-side language or city switch.
function getCityHeroContent(lang, city) {
  const en = city.name;
  const native = city.nativeName || city.name;

  if (lang === 'EN') {
    return {
      title: `${en} Weather Forecast`,
      desc: `Get the latest real-time weather forecast for ${en}, Kyrgyzstan — current temperature, precipitation, wind speed, and a detailed 7-day outlook, updated every 15 minutes.`
    };
  }
  if (lang === 'RU') {
    const ru = ruCity(city);
    return {
      title: `Погода в ${ru.prep}`,
      desc: `Актуальный прогноз погоды в ${ru.prep}, Киргизия: температура, осадки, скорость ветра, почасовой прогноз и подробный прогноз на неделю, обновляется каждые 15 минут.`
    };
  }
  return {
    title: `${native} аба ырайынын божомолу`,
    desc: `${native} үчүн азыркы аба ырайынын божомолу: температура, жаан-чачын, шамал ылдамдыгы жана 7 күндүк так божомол, ар 15 мүнөт сайын жаңыртылат.`
  };
}

// Same wording as getCitySectionTitles() in build.js — including the description
// paragraphs, not just the headings, so a client-side language switch doesn't fall
// back to the generic (non-city-specific) sentence baked into the static HTML.
function getCitySectionTitles(lang, city) {
  const en = city.name;
  const native = city.nativeName || city.name;

  if (lang === 'EN') {
    return {
      hourly: `Hourly Update for ${en}`,
      hourlyDesc: `Track ${en}'s hour-by-hour forecast — temperature, precipitation chance, and wind, updated every 15 minutes.`,
      todayDetails: `Today Weather Details for ${en}`,
      todayDetailsDesc: `A closer look at current conditions in ${en} — wind speed, humidity, visibility, and today's daylight hours.`,
      weekly: `Weekly Weather Forecast for ${en}`,
      weeklyDesc: `See how the week ahead looks in ${en} — daily highs and lows, conditions, and wind for the next 7 days.`
    };
  }
  if (lang === 'RU') {
    const ru = ruCity(city);
    return {
      hourly: `Почасовой прогноз погоды в ${ru.prep}`,
      hourlyDesc: `Следите за почасовым прогнозом в ${ru.prep}: температура, вероятность осадков и ветер — обновляется каждые 15 минут.`,
      todayDetails: `Погода в ${ru.prep} сегодня — подробности`,
      todayDetailsDesc: `Подробный обзор текущих условий в ${ru.prep}: скорость ветра, влажность, видимость и продолжительность светового дня.`,
      weekly: `Прогноз погоды в ${ru.prep} на неделю`,
      weeklyDesc: `Узнайте, какой будет неделя в ${ru.prep}: дневные температуры, погодные условия и ветер на ближайшие 7 дней.`
    };
  }
  return {
    hourly: `Сааттык божомол — ${native}`,
    hourlyDesc: `${native} үчүн сааттык божомолду көзөмөлдөңүз: температура, жамгыр ыктымалдыгы жана шамал ар 15 мүнөт сайын жаңыртылат.`,
    todayDetails: `Бүгүнкү аба ырайы чоо-жайы — ${native}`,
    todayDetailsDesc: `${native} үчүн азыркы шарттардын толук сереби: шамал ылдамдыгы, нымдуулук, көрүнүү аралыгы жана бүгүнкү күндүн узактыгы.`,
    weekly: `Бир жумалык божомол — ${native}`,
    weeklyDesc: `${native} үчүн алдыдагы жуманы билиңиз: күндүзгү жана түнкү температуралар, аба ырайы шарттары жана 7 күндүк шамал көрсөткүчтөрү.`
  };
}

// Same rendering as renderNewsGridHTML() in build.js — the homepage's "Latest
// Weather Forecast News" grid used to be 5 hardcoded English cards that never
// changed language on a client-side switch. Re-rendering it here from
// BLOG_POSTS keeps it correct after a switch, matching what build.js already
// server-renders on first load.
function renderNewsGrid(lang) {
  const grid = document.getElementById('newsBentoGrid');
  if (!grid) return;

  grid.innerHTML = BLOG_POSTS.slice(0, 5).map((post, i) => {
    const data = post.translations[lang] || post.translations.EN;
    const isFeatured = i === 0;
    return `
      <div class="news-card${isFeatured ? ' news-card-featured' : ''}" onclick="window.location.href='/blog/${post.slug}.html'">
        <img src="${post.image}" alt="${data.title}" class="news-card-img" loading="lazy" width="1536" height="1024">
        <div class="news-card-overlay">
          <h3 class="news-title">${data.title}</h3>
          ${isFeatured ? `<p style="font-size:14px; margin-bottom:12px; opacity:0.9; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">${data.excerpt}</p>` : ''}
          <div class="news-meta">
            <span><svg class="icon"><use href="#icon-user"></use></svg> ${data.author}</span>
            <span><svg class="icon"><use href="#icon-${isFeatured ? 'clock' : 'calendar'}"></use></svg> ${data.date}</span>
          </div>
        </div>
      </div>`;
  }).join('\n');
}

// Same rendering as renderFAQHTML() in build.js — shows the Kyrgyzstan-wide
// FAQ on the homepage, or the current city's own FAQ on a dedicated city
// page. Re-rendered here so a language switch updates it correctly instead
// of leaving it in whichever language the page was originally served in.
function renderFAQ(lang) {
  const container = document.getElementById('faqContainer');
  if (!container) return;

  const cityFaq = isDedicatedCityPage && CITY_FAQ[currentCity.id];
  const faqList = cityFaq ? (cityFaq[lang] || cityFaq.EN) : (HOME_FAQ[lang] || HOME_FAQ.EN);

  container.innerHTML = faqList.map(item => `
      <details class="faq-item">
        <summary class="faq-question">${item.q}</summary>
        <div class="faq-answer">${item.a}</div>
      </details>`).join('\n');
}

// Update city titles across sections
function updateCityInfoDisplay(city) {
  document.querySelectorAll('.current-city-name').forEach(el => {
    el.textContent = getCityName(city);
  });
  document.querySelectorAll('.current-city-region').forEach(el => {
    const lang = getCurrentLang();
    el.textContent = `${getRegionName(city, lang)}, ${TRANSLATIONS[lang].kyrgyzstan_label}`;
  });

  // The homepage keeps its generic, translated Kyrgyzstan-wide heading and always
  // shows Bishkek — only a real dedicated city page gets city-named headings.
  if (!isDedicatedCityPage) return;

  const lang = getCurrentLang();

  const hero = getCityHeroContent(lang, city);
  const heroTitleEl = document.querySelector('.hero-title');
  if (heroTitleEl) heroTitleEl.textContent = hero.title;
  const heroDescEl = document.querySelector('.hero-desc');
  if (heroDescEl) heroDescEl.textContent = hero.desc;

  // <title>/meta description are baked in for whichever language the page was
  // originally served in — a client-side language switch needs to update them
  // too, or they stay stuck (e.g. an English-built page switched to Russian
  // keeps showing the English <title> in the browser tab and search snippets).
  const cityMeta = getCityMeta(lang, city);
  document.title = cityMeta.title;
  const setMetaContent = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute('content', value);
  };
  setMetaContent('meta[name="description"]', cityMeta.description);
  setMetaContent('meta[property="og:title"]', cityMeta.title);
  setMetaContent('meta[property="og:description"]', cityMeta.description);
  setMetaContent('meta[name="twitter:title"]', cityMeta.title);
  setMetaContent('meta[name="twitter:description"]', cityMeta.description);

  const sections = getCitySectionTitles(lang, city);
  const hourlyTitleEl = document.getElementById('hourlyUpdateTitle');
  if (hourlyTitleEl) hourlyTitleEl.textContent = sections.hourly;
  const hourlyDescEl = document.getElementById('hourlyUpdateDesc');
  if (hourlyDescEl) hourlyDescEl.textContent = sections.hourlyDesc;
  const todayDetailsTitleEl = document.getElementById('todayDetailsTitle');
  if (todayDetailsTitleEl) todayDetailsTitleEl.textContent = sections.todayDetails;
  const todayDetailsDescEl = document.getElementById('todayDetailsDesc');
  if (todayDetailsDescEl) todayDetailsDescEl.textContent = sections.todayDetailsDesc;
  const weeklyTitleEl = document.getElementById('weeklyForecastTitle');
  if (weeklyTitleEl) weeklyTitleEl.textContent = sections.weekly;
  const weeklyDescEl = document.getElementById('weeklyForecastDesc');
  if (weeklyDescEl) weeklyDescEl.textContent = sections.weeklyDesc;
}

// Render Hero Section Weather Card
function renderHeroCard(city, data) {
  const current = data.current;
  const today = data.weekly[0]; // Assuming weekly[0] is today to get Min/Max and Precip
  
  const heroCard = document.getElementById('heroWeatherCard');
  if (!heroCard) return;

  const lang = getCurrentLang();
  const t = TRANSLATIONS[lang];

  heroCard.innerHTML = `
    <div class="card-top-row">
      <div class="city-title-new">${getCityName(city)}</div>
    </div>
    
    <div class="card-main-row">
      <div class="weather-icon-new">
        ${current.svg}
      </div>
      <div class="card-temp-col">
        <div class="big-temp-new">${current.temp > 0 ? '+' : ''}${current.temp}°</div>
        <div class="feels-like-new">${t.feels_like || 'Feels like'} &approx; ${current.feelsLike > 0 ? '+' : ''}${current.feelsLike}°</div>
      </div>
    </div>

    <div class="card-divider"></div>

    <div class="card-minmax-row">
      <div class="minmax-col">
        <div class="minmax-label"><svg class="icon" style="color:#93C5FD; margin-right:4px;"><use href="#icon-moon"></use></svg>${t.min_temp || 'MIN'}</div>
        <div class="minmax-value">${today.minTemp > 0 ? '+' : ''}${today.minTemp}°</div>
      </div>
      <div class="minmax-vert-divider"></div>
      <div class="minmax-col">
        <div class="minmax-label"><svg class="icon" style="color:#FF9F43; margin-right:4px;"><use href="#icon-sun"></use></svg>${t.max_temp || 'MAX'}</div>
        <div class="minmax-value">${today.maxTemp > 0 ? '+' : ''}${today.maxTemp}°</div>
      </div>
    </div>

    <div class="card-divider"></div>

    <div class="card-metrics-row">
      <div class="metric-left">
        <svg class="icon" style="color:#00A2FF;"><use href="#icon-droplet"></use></svg> 
        <span>${t.precip_label || 'Precipitation'}</span>
      </div>
      <div class="metric-right">${today.precip}%</div>
    </div>

    <div class="card-divider"></div>

    <div class="card-metrics-row">
      <div class="metric-left">
        <svg class="icon" style="color:#94A3B8;"><use href="#icon-wind"></use></svg> 
        <span>${t.wind_label || 'Wind'}</span>
      </div>
      <div class="metric-right">${t.wind_prefix || 'up to'} ${current.windSpeed} ${t.wind_unit || 'm/s'}</div>
    </div>
  `;
}

// Render Hourly Forecast Cards into Slider
function renderHourlyForecast(hourlyList) {
  const container = document.getElementById('hourlyCardsContainer');
  if (!container) return;

  container.innerHTML = '';
  hourlyList.forEach(item => {
    const card = document.createElement('div');
    card.className = 'hourly-card';
    card.innerHTML = `
      <div class="hourly-icon">${item.svg}</div>
      <div class="hourly-temp">${item.temp}°</div>
      <div class="hourly-condition">${getConditionStr(item.conditionKey)}</div>
      <div class="hourly-details">
        <span>💧 ${item.precip}%</span>
        <span>💨 ${item.wind}km</span>
      </div>
      <div class="hourly-time">${item.time}</div>
    `;
    container.appendChild(card);
  });
}

// Render Today Weather Details Grid (Wind, Humidity, Visibility, Sun Arc)
function renderTodayDetails(city, current) {
  // Update Wind Card
  const windValue = document.getElementById('detailWindValue');
  if (windValue) windValue.textContent = `${current.windSpeed} km/h`;

  // Update Humidity Card
  const humValue = document.getElementById('detailHumidityValue');
  if (humValue) humValue.textContent = `${current.humidity}%`;

  // Update Visibility Card
  const visValue = document.getElementById('detailVisibilityValue');
  if (visValue) visValue.textContent = current.visibility;

  // Render Sun Arc Gauge
  renderSunArcGauge(current.sunrise, current.sunset, current.sunProgress);
}

// Render SVG Sun Arc Meter
function renderSunArcGauge(sunrise, sunset, progressPercent) {
  const container = document.getElementById('sunArcContainer');
  if (!container) return;

  // Arc math calculations
  const angle = (progressPercent / 100) * 180;
  const rad = (180 - angle) * (Math.PI / 180);
  const r = 80;
  const cx = 100;
  const cy = 90;
  const sunX = cx + r * Math.cos(rad);
  const sunY = cy - r * Math.sin(rad);

  const lang = getCurrentLang();
  const sunriseLabel = TRANSLATIONS[lang] && TRANSLATIONS[lang].sunrise_label ? TRANSLATIONS[lang].sunrise_label : 'Sunrise';
  const sunsetLabel = TRANSLATIONS[lang] && TRANSLATIONS[lang].sunset_label ? TRANSLATIONS[lang].sunset_label : 'Sunset';

  container.innerHTML = `
    <div class="sun-arc-wrapper">
      <svg class="sun-arc-svg" viewBox="0 0 200 110">
        <!-- Background Track Arc -->
        <path d="M 20 90 A 80 80 0 0 1 180 90" fill="none" stroke="var(--border)" stroke-width="6" stroke-linecap="round" />
        <!-- Progress Colored Arc -->
        <path d="M 20 90 A 80 80 0 0 1 180 90" fill="none" stroke="#FF9F43" stroke-width="6" stroke-dasharray="251" stroke-dashoffset="${251 - (251 * progressPercent / 100)}" stroke-linecap="round" />
        <!-- Sun Marker Circle -->
        <circle cx="${sunX}" cy="${sunY}" r="9" fill="#FF9F43" stroke="#FFFFFF" stroke-width="2" />
      </svg>
      <div class="sun-times">
        <div class="sun-time-item">
          <span>${sunriseLabel}</span>
          <strong>${sunrise}</strong>
        </div>
        <div class="sun-time-item" style="text-align:right;">
          <span>${sunsetLabel}</span>
          <strong>${sunset}</strong>
        </div>
      </div>
    </div>
  `;
}

// Render 10 Day Forecast (Pills)
function renderWeeklyForecast(weeklyList) {
  const container = document.getElementById('weeklyForecastContainer');
  if (!container) return;

  container.innerHTML = '';
  weeklyList.forEach((item, index) => {
    const pill = document.createElement('div');
    pill.className = 'ten-day-pill';
    
    // Add little raindrops if precipitation probability is high
    let precipHtml = '';
    if (item.precip > 20) {
      precipHtml = `<div style="color:#00c6ff; font-size:10px; margin-top:-10px; margin-bottom:5px;">💧 ${item.precip}%</div>`;
    }

    const lang = getCurrentLang();
    const todayStr = TRANSLATIONS[lang]?.today || "Today";
    const dayName = index === 0 ? todayStr : item.day;

    pill.innerHTML = `
      <div class="ten-day-day">${dayName}</div>
      <div class="ten-day-divider"></div>
      <div class="ten-day-icon">${item.svg}</div>
      ${precipHtml}
      <div class="ten-day-temp">${item.maxTemp}°C</div>
    `;
    container.appendChild(pill);
  });
}

// Render Other Cities Section
async function renderOtherCities() {
  const container = document.getElementById('otherCountriesContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Pick some other cities from Kyrgyzstan (e.g., skip current city)
  const otherCities = KYRGYZSTAN_CITIES.filter(c => c.id !== currentCity.id).slice(0, 8);
  const lang = getCurrentLang();

  // Fetch all cities' weather in parallel instead of one-at-a-time —
  // sequential awaits here multiplied page load time by up to 8x.
  const results = await Promise.all(otherCities.map(async (city) => {
    try {
      return { city, data: await fetchWeatherData(city.lat, city.lon) };
    } catch (error) {
      console.error('Error loading city weather:', error);
      return { city, data: null };
    }
  }));

  for (const { city, data } of results) {
    if (!data || !data.current) continue;

    const card = document.createElement('div');
    card.className = 'other-country-card';
    card.onclick = () => navigateToCityPage(city);

    const conditionName = getConditionStr(data.current.conditionKey);

    card.innerHTML = `
      <div class="other-country-info">
        <div class="other-country-name">${TRANSLATIONS[lang].kyrgyzstan_label}</div>
        <div class="other-country-city">${getCityName(city)}</div>
        <div class="other-country-cond">${conditionName}</div>
      </div>
      <div class="other-country-weather">
        <div class="other-country-icon">${data.current.svg}</div>
        <div style="text-align:right;">
          <div class="other-country-temp">${data.current.temp}°</div>
          <div class="other-country-min">${data.weekly[0].minTemp}°</div>
        </div>
      </div>
    `;

    container.appendChild(card);
  }
}

// 3. Search Bar logic for 10 Kyrgyzstan locations
function setupSearch() {
  const searchInput = document.getElementById('locationSearchInput');
  const dropdown = document.getElementById('searchResultsDropdown');

  if (!searchInput || !dropdown) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (!query) {
      dropdown.classList.remove('active');
      return;
    }

    const matches = KYRGYZSTAN_CITIES.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.nativeName.toLowerCase().includes(query) ||
      c.region.toLowerCase().includes(query) ||
      getRegionName(c).toLowerCase().includes(query)
    );

    const lang = getCurrentLang();
    if (matches.length === 0) {
      dropdown.innerHTML = `<div class="search-result-item" style="cursor:default;">${TRANSLATIONS[lang].search_no_results}</div>`;
    } else {
      dropdown.innerHTML = matches.map(city => `
        <div class="search-result-item" data-city-id="${city.id}">
          <div>
            <strong>${getCityName(city)}</strong> <small>(${lang === 'EN' ? city.nativeName : city.name})</small>
            <div style="font-size:12px; color:var(--text-sub);">${getRegionName(city, lang)}</div>
          </div>
          <span style="font-size:12px; font-weight:600; color:var(--primary);">${TRANSLATIONS[lang].select_label}</span>
        </div>
      `).join('');
    }

    dropdown.classList.add('active');
  });

  dropdown.addEventListener('click', (e) => {
    const item = e.target.closest('.search-result-item');
    if (item && item.dataset.cityId) {
      const selected = KYRGYZSTAN_CITIES.find(c => c.id === item.dataset.cityId);
      if (selected) navigateToCityPage(selected);
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
      dropdown.innerHTML = '';
    }
  });
}

// 4. Hourly Forecast Slider Scroll Buttons
function setupHourlySlider() {
  const container = document.getElementById('hourlyCardsContainer');
  const btnLeft = document.getElementById('scrollLeftBtn');
  const btnRight = document.getElementById('scrollRightBtn');

  if (btnLeft && container) {
    btnLeft.addEventListener('click', () => {
      container.scrollBy({ left: -280, behavior: 'smooth' });
    });
  }

  if (btnRight && container) {
    btnRight.addEventListener('click', () => {
      container.scrollBy({ left: 280, behavior: 'smooth' });
    });
  }
}

// 5. Manage Recent Searches LocalStorage
function saveRecentSearch(city) {
  let recents = JSON.parse(localStorage.getItem('pogoda_recents') || '[]');
  recents = recents.filter(c => c.id !== city.id);
  recents.unshift(city);
  if (recents.length > 4) recents = recents.slice(0, 4);
  localStorage.setItem('pogoda_recents', JSON.stringify(recents));
}

function renderRecentSearches() {
  const container = document.getElementById('recentSearchContainer');
  if (!container) return;

  const recents = JSON.parse(localStorage.getItem('pogoda_recents') || '[]');
  if (recents.length === 0) {
    container.innerHTML = `<p style="color:var(--text-sub); text-align:center;">No recent searches yet.</p>`;
    return;
  }

  container.innerHTML = '';
  recents.forEach(city => {
    const data = weatherCache[city.id];
    const card = document.createElement('div');
    card.className = 'hourly-card';
    card.style.cssText = `
      cursor: pointer;
      position: relative;
      overflow: hidden;
      min-width: 160px;
      background: linear-gradient(to top, rgba(15,23,42,0.9), rgba(15,23,42,0.4)), url('${cityImageUrl(city)}') center/cover no-repeat;
      color: white;
      border-color: rgba(255,255,255,0.2);
    `;
    card.innerHTML = `
      <div style="font-size:16px; font-weight:700;">${getCityName(city)}</div>
      <div style="font-size:11px; opacity:0.85;">${getRegionName(city)}</div>
      <div style="font-size:26px; font-weight:800; margin:6px 0; color:#FF9F43;">${data ? data.current.temp + '°' : '--'}</div>
      <div style="font-size:12px; font-weight:600; background:rgba(0,0,0,0.5); padding:2px 8px; border-radius:10px;">${data ? getConditionStr(data.current.conditionKey) : TRANSLATIONS[getCurrentLang()].view_forecast_short}</div>
    `;
    card.addEventListener('click', () => navigateToCityPage(city));
    container.appendChild(card);
  });
}

// Horizontal Scrolling for Other Cities
function setupOtherCitiesScroll() {
  const container = document.getElementById('otherCountriesContainer');
  const btnLeft = document.getElementById('btnOtherLeft');
  const btnRight = document.getElementById('btnOtherRight');
  
  if (btnLeft && container) {
    btnLeft.addEventListener('click', (e) => {
      e.preventDefault();
      container.scrollBy({ left: -360, behavior: 'smooth' });
    });
  }
  
  if (btnRight && container) {
    btnRight.addEventListener('click', (e) => {
      e.preventDefault();
      container.scrollBy({ left: 360, behavior: 'smooth' });
    });
  }
}

