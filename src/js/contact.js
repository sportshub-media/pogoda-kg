// Pogoda Kg - Contact Page Controller
import { initTheme } from './theme.js';
import { initLangSwitcher, getCurrentLang, TRANSLATIONS } from './i18n.js';
import { initMiniWeather, refreshMiniWeather } from './mini-weather.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMiniWeather();
  initLangSwitcher((lang) => refreshMiniWeather(lang));
  setupContactForm();
});

function setupContactForm() {
  const form = document.getElementById('pogodaContactForm');
  const alertBox = document.getElementById('formSuccessAlert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate simple required fields
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) {
      const lang = getCurrentLang();
      alert(TRANSLATIONS[lang].contact_required_alert);
      return;
    }

    // Show clean success toast
    if (alertBox) {
      alertBox.style.display = 'block';
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    form.reset();
  });
}
