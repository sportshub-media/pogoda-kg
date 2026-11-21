// Pogoda Kg - Weather News & Blog Manager (Multilingual Support: EN, KG, RU)
import { initTheme } from './theme.js';
import { initLangSwitcher, getCurrentLang } from './i18n.js';

import { BLOG_POSTS } from './blog-posts-data.js';
import { initMiniWeather } from './mini-weather.js';
export { BLOG_POSTS };

// Articles and the /blog list are rendered by build.js; only the search filter
// below redraws the list in the browser.
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMiniWeather();
  initLangSwitcher();
});

function renderBlogPosts(posts, lang = 'KG') {
  const container = document.getElementById('blogCardsGrid');
  if (!container) return;

  if (posts.length === 0) {
    const noResultsText = lang === 'KG' ? 'Сиздин издөөңүзгө дал келген макалалар табылган жок.' : (lang === 'RU' ? 'Статьи по вашему запросу не найдены.' : 'No weather articles found matching your filter.');
    container.innerHTML = `<p style="grid-column: 1 / -1; text-align:center; padding:40px; color:var(--text-sub);">${noResultsText}</p>`;
    return;
  }

  container.innerHTML = posts.map(post => {
    const data = post.translations[lang] || post.translations.EN;
    return `
      <a href="/blog/${post.slug}" style="text-decoration: none; color: inherit;">
        <div class="news-card" style="min-height: 220px;">
          <img src="${post.image}" alt="${data.title}" class="news-card-img" loading="lazy">
          <div class="news-card-overlay">
            <span class="news-tag">${data.category}</span>
            <h3 class="news-title" style="font-size:18px;">${data.title}</h3>
            <p style="font-size:13px; opacity:0.85; margin-bottom:10px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${data.excerpt}</p>
            <div class="news-meta">
              <span><svg class="icon"><use href="#icon-user"></use></svg> ${data.author}</span>
              <span><svg class="icon"><use href="#icon-calendar"></use></svg> ${data.date}</span>
            </div>
          </div>
        </div>
      </a>
    `;
  }).join('');
}

// Search input handler on blog.html
const searchInput = document.getElementById('blogSearchInput');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    const lang = getCurrentLang() || 'KG';
    const filtered = BLOG_POSTS.filter(post => {
      const data = post.translations[lang] || post.translations.EN;
      return data.title.toLowerCase().includes(query) || data.excerpt.toLowerCase().includes(query);
    });
    renderBlogPosts(filtered, lang);
  });
}
