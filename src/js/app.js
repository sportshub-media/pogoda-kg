// Pogoda Kg - Main Application Logic
import { KYRGYZSTAN_CITIES, DEFAULT_CITY } from './config.js';
import { fetchWeatherData } from './api.js';
import { initTheme } from './theme.js';
import { TRANSLATIONS, getCurrentLang, initMobileMenu, initLangSwitcher } from './i18n.js';

let currentCity = DEFAULT_CITY;
let weatherCache = {};

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  
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
    if (found) currentCity = found;
  }

  initLangSwitcher(() => {
    updateCityInfoDisplay(currentCity);
    if (weatherCache[currentCity.id]) {
      const data = weatherCache[currentCity.id];
      renderHeroCard(currentCity, data);
      renderHourlyForecast(data.hourly);
      renderTodayDetails(currentCity, data.current);
      renderWeeklyForecast(data.weekly);
      renderRecentSearches();
    }
  });
  setupSearch();
  setupHourlySlider();
  setupOtherCitiesScroll();
  setupFooterCityLinks();
  renderOtherCities();
  loadCityWeather(currentCity);
});

function getCityName(city) {
  const lang = getCurrentLang();
  return (lang === 'RU' || lang === 'KG') ? city.nativeName : city.name;
}

function getConditionStr(conditionKey) {
  const lang = getCurrentLang();
  return TRANSLATIONS[lang] ? TRANSLATIONS[lang][conditionKey] : conditionKey;
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

// Update city titles across sections
function updateCityInfoDisplay(city) {
  document.querySelectorAll('.current-city-name').forEach(el => {
    el.textContent = getCityName(city);
  });
  document.querySelectorAll('.current-city-region').forEach(el => {
    el.textContent = `${city.region}, Kyrgyzstan`;
  });
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
        <div class="minmax-label">${t.min_temp || 'MIN'}</div>
        <div class="minmax-value">${today.minTemp > 0 ? '+' : ''}${today.minTemp}°</div>
      </div>
      <div class="minmax-vert-divider"></div>
      <div class="minmax-col">
        <div class="minmax-label">${t.max_temp || 'MAX'}</div>
        <div class="minmax-value">${today.maxTemp > 0 ? '+' : ''}${today.maxTemp}°</div>
      </div>
    </div>

    <div class="card-divider"></div>

    <div class="card-metrics-row">
      <div class="metric-left">
        <i class="fa-solid fa-droplet" style="color:#00A2FF;"></i> 
        <span>${t.precip_label || 'Precipitation'}</span>
      </div>
      <div class="metric-right">${today.precip}%</div>
    </div>

    <div class="card-divider"></div>

    <div class="card-metrics-row">
      <div class="metric-left">
        <i class="fa-solid fa-wind" style="color:#94A3B8;"></i> 
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
  
  for (const city of otherCities) {
    try {
      const data = await fetchWeatherData(city.lat, city.lon);
      if (!data || !data.current) continue;
      
      const card = document.createElement('div');
      card.className = 'other-country-card';
      card.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        currentCity = city;
        
        loadCityWeather(currentCity);
        renderOtherCities(); // Re-render to exclude the new current city
      };
      
      const conditionName = getConditionStr(data.current.conditionKey);
      
      card.innerHTML = `
        <div class="other-country-info">
          <div class="other-country-name">Kyrgyzstan</div>
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
    } catch (error) {
      console.error('Error loading city weather:', error);
    }
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
      c.region.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      dropdown.innerHTML = `<div class="search-result-item" style="cursor:default;">No Kyrgyzstan location found</div>`;
    } else {
      dropdown.innerHTML = matches.map(city => `
        <div class="search-result-item" data-city-id="${city.id}">
          <div>
            <strong>${getCityName(city)}</strong> <small>(${getCurrentLang() === 'EN' ? city.nativeName : city.name})</small>
            <div style="font-size:12px; color:var(--text-sub);">${city.region}</div>
          </div>
          <span style="font-size:12px; font-weight:600; color:var(--primary);">Select</span>
        </div>
      `).join('');
    }

    dropdown.classList.add('active');
  });

  dropdown.addEventListener('click', (e) => {
    const item = e.target.closest('.search-result-item');
    if (item && item.dataset.cityId) {
      const selected = KYRGYZSTAN_CITIES.find(c => c.id === item.dataset.cityId);
      if (selected) {
        // Sync city pill
        document.querySelectorAll('.city-pill').forEach(p => {
          p.classList.toggle('active', p.dataset.cityId === selected.id);
        });
        loadCityWeather(selected);
        searchInput.value = '';
        dropdown.innerHTML = '';
        dropdown.classList.remove('active');
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
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
      background: linear-gradient(to top, rgba(15,23,42,0.9), rgba(15,23,42,0.4)), url('${city.image}') center/cover no-repeat;
      color: white;
      border-color: rgba(255,255,255,0.2);
    `;
    card.innerHTML = `
      <div style="font-size:16px; font-weight:700;">${getCityName(city)}</div>
      <div style="font-size:11px; opacity:0.85;">${city.region}</div>
      <div style="font-size:26px; font-weight:800; margin:6px 0; color:#FF9F43;">${data ? data.current.temp + '°' : '--'}</div>
      <div style="font-size:12px; font-weight:600; background:rgba(0,0,0,0.5); padding:2px 8px; border-radius:10px;">${data ? getConditionStr(data.current.conditionKey) : 'View Forecast'}</div>
    `;
    card.addEventListener('click', () => {
      document.querySelectorAll('.city-pill').forEach(p => {
        p.classList.toggle('active', p.dataset.cityId === city.id);
      });
      loadCityWeather(city);
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    container.appendChild(card);
  });
}

function setupFooterCityLinks() {
  document.querySelectorAll('.footer-city-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const cityId = link.getAttribute('data-city-id');
      if (cityId) {
        const found = KYRGYZSTAN_CITIES.find(c => c.id === cityId.toLowerCase());
        if (found) {
          if (document.getElementById('heroWeatherCard')) {
            e.preventDefault();
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('city', found.id);
            window.history.pushState(null, '', newUrl.toString());

            document.querySelectorAll('.city-pill').forEach(p => {
              p.classList.toggle('active', p.dataset.cityId === found.id);
            });

            loadCityWeather(found);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }
    });
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

