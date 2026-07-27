// Pogoda Kg - Weather News & Blog Manager
import { initTheme } from './theme.js';
import { initLangSwitcher } from './i18n.js';

export const BLOG_POSTS = [
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
});

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function renderBlogPosts(posts) {
  const container = document.getElementById('blogCardsGrid');
  if (!container) return;

  if (posts.length === 0) {
    container.innerHTML = `<p style="grid-column: 1 / -1; text-align:center; padding:40px; color:var(--text-sub);">No weather articles found matching your filter.</p>`;
    return;
  }

  container.innerHTML = posts.map(post => {
    const slug = slugify(post.title);
    return `
      <a href="/blog/${slug}.html" style="text-decoration: none; color: inherit;">
        <div class="news-card" style="height: 380px;">
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
      </a>
    `;
  }).join('');
}

// Search logic only
const searchInput = document.getElementById('blogSearchInput');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = BLOG_POSTS.filter(post => {
      return post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query);
    });
    renderBlogPosts(filtered);
  });
}
