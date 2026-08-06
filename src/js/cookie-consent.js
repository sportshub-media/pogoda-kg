import { getCurrentLang, TRANSLATIONS } from './i18n.js';

export function initCookieConsent() {
  // If already consented, don't show the banner
  if (localStorage.getItem('pogoda_cookie_consent')) return;

  const lang = getCurrentLang() || 'EN';
  
  // Use translations if available, fallback to English
  const text = TRANSLATIONS[lang] && TRANSLATIONS[lang].cookie_text 
    ? TRANSLATIONS[lang].cookie_text 
    : "We use local storage to save your language and theme preferences to provide you with a better experience. By continuing to use this site, you agree to our <a href='/privacy.html'>Privacy Policy</a>.";
  const btnText = TRANSLATIONS[lang] && TRANSLATIONS[lang].cookie_btn 
    ? TRANSLATIONS[lang].cookie_btn 
    : "Got it!";

  const banner = document.createElement('div');
  banner.id = 'cookieConsentBanner';
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-banner-content">
      <div class="cookie-icon"><i class="fa-solid fa-cookie-bite"></i></div>
      <p id="cookieText">${text}</p>
    </div>
    <button id="cookieAcceptBtn" class="btn-primary cookie-btn">${btnText}</button>
  `;

  document.body.appendChild(banner);

  document.getElementById('cookieAcceptBtn').addEventListener('click', () => {
    localStorage.setItem('pogoda_cookie_consent', 'true');
    banner.classList.add('hide');
    // Remove from DOM after animation completes
    setTimeout(() => banner.remove(), 300);
  });
}
