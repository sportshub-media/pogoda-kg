// Pogoda Kg - Weather News & Blog Manager
import { initTheme } from './theme.js';
import { initLangSwitcher } from './i18n.js';

const BLOG_POSTS = [
  {
    id: "post-1",
    title: "Tian-Shan Mountain Passes Weather Advisory for Drivers",
    category: "Mountain Weather",
    date: "July 22, 2026",
    author: "Meteorologist Team",
    image: "assets/images/hero_mountains.png",
    excerpt: "High altitude snow condition breakdown for Too-Ashuu and Ala-Bel mountain routes connecting Bishkek and Osh.",
    content: `
      <p>Drivers traveling between Bishkek and Osh are advised to stay updated on mountain weather conditions over the Tian-Shan range. High-altitude passes including Too-Ashuu (3,180m) and Ala-Bel (3,175m) experience swift weather shifts even during summer months.</p>
      <h3>Current Road & Temperature Status</h3>
      <p>Visibility remains clear above 2,500 meters, but sudden temperature drops in the evening can cause damp road surfaces to freeze. The Ministry of Emergency Situations recommends checking live forecast updates on Pogoda Kg before embarking on long alpine trips.</p>
      <ul>
        <li>Too-Ashuu Tunnel Pass: Clear, temp +8°C at peak.</li>
        <li>Ala-Bel Valley: Light rain showers expected after 16:00.</li>
        <li>Otmek Pass: Sunny with moderate wind speeds of 24 km/h.</li>
      </ul>
    `
  },
  {
    id: "post-2",
    title: "Heavy Rain & Mountain Runoff in Chuy Valley",
    category: "Rain Forecast",
    date: "July 21, 2026",
    author: "Pogoda Editor",
    image: "assets/images/kara_balta.png",
    excerpt: "Localized heavy rain showers expected in Bishkek, Kara-Balta, and Tokmok over the weekend.",
    content: `
      <p>An atmospheric front moving from the west brings increased humidity and evening thunderstorms across the Chuy Valley. Main urban centers including Bishkek and Kara-Balta will see short bursts of precipitation.</p>
      <p>Drainage systems in central Bishkek are monitored, and local drivers are reminded to slow down on wet tarmac during rush hours.</p>
    `
  },
  {
    id: "post-3",
    title: "Issyk-Kul Summer Lake Weather & Water Temperature Guide",
    category: "Issyk-Kul Region",
    date: "July 20, 2026",
    author: "Balykchy Bureau",
    image: "assets/images/balykchy.png",
    excerpt: "Water temperature reaches 20°C in Cholpon-Ata and Balykchy with sunny weekend forecasts.",
    content: `
      <p>Lake Issyk-Kul is experiencing prime summer resort weather. Water surface temperatures in Cholpon-Ata, Balykchy, and Karakol bay have reached 19°C - 21°C. Offshore morning breezes remain gentle at 12 km/h.</p>
      <p>Vacationers can expect up to 10 hours of direct sunshine per day with low UV index during early morning hours.</p>
    `
  },
  {
    id: "post-4",
    title: "Bishkek Air Quality & Weekly UV Index Report",
    category: "Urban Climate",
    date: "July 19, 2026",
    author: "Climate Desk",
    image: "assets/images/bishkek.png",
    excerpt: "Air quality index remains in the Good zone across Bishkek urban parks following recent rain showers.",
    content: `
      <p>Fresh mountain air currents down from Ala-Archa gorge have refreshed the atmosphere across Bishkek. The Air Quality Index (AQI) is currently reading 32 (Good), making it ideal for outdoor sports and city walks.</p>
    `
  },
  {
    id: "post-5",
    title: "Naryn Highland Snowfall & Temperature Drop Outlook",
    category: "Mountain Weather",
    date: "July 18, 2026",
    author: "Naryn Station Desk",
    image: "assets/images/naryn.png",
    excerpt: "High elevation areas in Naryn region see sub-zero night temperatures and crisp mountain sun.",
    content: `
      <p>Naryn station reports crisp clear morning skies with night temperatures dipping near freezing at high elevations. Shepherds and mountain trekkers are advised to dress in layers.</p>
    `
  },
  {
    id: "post-6",
    title: "Karakol Peak Ski & Winter Trail Forecast",
    category: "Mountain Weather",
    date: "July 17, 2026",
    author: "Karakol Alpine Team",
    image: "assets/images/karakol.png",
    excerpt: "Karakol ski slopes report excellent powder snow conditions and clear alpine visibility.",
    content: `
      <p>Alpine snow monitoring equipment at Karakol base elevation (2,300m) shows pristine winter snow cover. Peak wind speeds remain under 15 km/h with high solar radiation.</p>
    `
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLangSwitcher();
  renderBlogPosts(BLOG_POSTS);
  setupBlogFilters();
  setupModalReader();
});

function renderBlogPosts(posts) {
  const container = document.getElementById('blogCardsGrid');
  if (!container) return;

  if (posts.length === 0) {
    container.innerHTML = `<p style="grid-column: 1 / -1; text-align:center; padding:40px; color:var(--text-sub);">No weather articles found matching your filter.</p>`;
    return;
  }

  container.innerHTML = posts.map(post => `
    <div class="news-card" style="height: 380px;" data-post-id="${post.id}">
      <img src="${post.image}" alt="${post.title}" class="news-card-img">
      <div class="news-card-overlay">
        <span class="news-tag">${post.category}</span>
        <h3 class="news-title" style="font-size:18px;">${post.title}</h3>
        <p style="font-size:13px; opacity:0.85; margin-bottom:10px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${post.excerpt}</p>
        <div class="news-meta">
          <span><i class="fa-solid fa-user"></i> ${post.author}</span>
          <span><i class="fa-solid fa-calendar"></i> ${post.date}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function setupBlogFilters() {
  const searchInput = document.getElementById('blogSearchInput');
  const categoryPills = document.querySelectorAll('.category-filter-pill');

  let activeCategory = 'all';

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.dataset.category;
      filterPosts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterPosts);
  }

  function filterPosts() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const filtered = BLOG_POSTS.filter(post => {
      const matchesCat = (activeCategory === 'all' || post.category.toLowerCase().includes(activeCategory));
      const matchesQuery = post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query);
      return matchesCat && matchesQuery;
    });
    renderBlogPosts(filtered);
  }
}

function setupModalReader() {
  const modal = document.getElementById('blogReaderModal');
  const container = document.getElementById('blogCardsGrid');
  const closeBtn = document.getElementById('closeModalBtn');

  if (!container || !modal) return;

  container.addEventListener('click', (e) => {
    const card = e.target.closest('[data-post-id]');
    if (card) {
      const postId = card.dataset.postId;
      const post = BLOG_POSTS.find(p => p.id === postId);
      if (post) {
        openModal(post);
      }
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

function openModal(post) {
  const modal = document.getElementById('blogReaderModal');
  const contentBox = document.getElementById('modalArticleContent');
  if (!modal || !contentBox) return;

  contentBox.innerHTML = `
    <img src="${post.image}" alt="${post.title}" style="width:100%; height:260px; object-fit:cover; border-radius:16px; margin-bottom:20px;">
    <span class="news-tag">${post.category}</span>
    <h2 style="font-size:28px; font-weight:700; margin:12px 0;">${post.title}</h2>
    <div style="font-size:13px; color:var(--text-sub); margin-bottom:20px; display:flex; gap:20px;">
      <span><i class="fa-solid fa-user"></i> ${post.author}</span>
      <span><i class="fa-solid fa-calendar"></i> ${post.date}</span>
    </div>
    <div style="line-height:1.8; font-size:16px; color:var(--text-main);">
      ${post.content}
    </div>
  `;

  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('blogReaderModal');
  if (modal) modal.style.display = 'none';
}
