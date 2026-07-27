// Pogoda Kg - Theme Toggle Manager

import { initCookieConsent } from './cookie-consent.js';

export function initTheme() {
  const savedTheme = localStorage.getItem('pogoda_theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.classList.add('dark-theme');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    document.body.classList.remove('dark-theme');
  }

  // Initialize Cookie Consent Banner
  initCookieConsent();

  // Bind all theme toggles
  const themeToggles = document.querySelectorAll('.theme-toggle-input, #darkModeToggle');
  themeToggles.forEach(toggle => {
    toggle.checked = (savedTheme === 'dark');
    toggle.addEventListener('change', (e) => {
      const isDark = e.target.checked;
      toggleTheme(isDark);
    });
  });
}

export function toggleTheme(isDark) {
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.classList.add('dark-theme');
    localStorage.setItem('pogoda_theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    document.body.classList.remove('dark-theme');
    localStorage.setItem('pogoda_theme', 'light');
  }

  // Keep all toggles synced
  document.querySelectorAll('.theme-toggle-input, #darkModeToggle').forEach(toggle => {
    toggle.checked = isDark;
  });
}
