// The full site header/footer/icon-sprite shell, matching every hand-written
// article (see e.g. src/blog/first-snow-watch-kyrgyzstan-high-passes-october.html)
// so auto-published posts get working mobile navigation (hamburger + drawer —
// the stylesheet hides the desktop nav below 768px and relies on this), the
// dark-mode toggle, the mini weather badge, and the full footer, instead of
// the stripped-down header/footer this script used to emit.
//
// Shared by scripts/publish-daily-forecast.mjs (today's post) and
// scripts/migrate-daily-posts.mjs (one-off: re-renders already-published
// daily posts onto this same shell without re-fetching their weather data).
const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

// Fixed-width short date (e.g. "26 Sep 2026") so the EN headline never exceeds
// build.js's 47-character <title> trim regardless of month-name length — a
// longer headline ("...for 26 September 2026") used to get cut to "...for 26
// September", silently dropping the year from the browser tab title and meta
// description on every post whose month name was long enough.
const SHORT_MONTHS = { EN: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], RU: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'], KG: ['янв', 'фев', 'март', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'] };
export function shortDateFor(lang, dateISO) {
  const d = new Date(`${dateISO}T12:00:00+06:00`);
  return `${d.getDate()} ${SHORT_MONTHS[lang][d.getMonth()]} ${d.getFullYear()}`;
}
// EN title must land in build.js's [38, 47]-char sweet spot: under 38 chars
// trips a padding rule in articleMetaFromHeading() that appends " Kyrgyzstan
// Weather" and then truncates it mid-word (e.g. "...2026 Kyrgyzstan"), over
// 47 chars gets silently cut (the original year-dropping bug this replaced).
// "Kyrgyzstan Weather Forecast: {date}" is always 39-40 chars, safely inside.
export function shortTitleFor(lang, dateISO) {
  const d = shortDateFor(lang, dateISO);
  if (lang === 'RU') return `Погода в Кыргызстане: ${d}`;
  if (lang === 'KG') return `Кыргызстандагы аба ырайы: ${d}`;
  return `Kyrgyzstan Weather Forecast: ${d}`;
}

// Rotating pool of hero photos so consecutive daily posts never repeat the
// same image two days running — these seven are otherwise unused by any
// other page. Deterministic by day-of-year, so re-running for the same date
// (e.g. the migration script) always picks the same photo.
const HERO_POOL = [
  ['daily-weather.jpg', 'A sunrise view over Bishkek with the snow-capped Tian Shan mountains behind the city'],
  ['bishkek-chuy-weather.jpg', 'Bishkek skyline at golden hour with the Chuy valley mountains in the background'],
  ['issyk-kul-weather.jpg', 'Lake Issyk-Kul with mountains reflected in the water under a clear sky'],
  ['osh-fergana-weather.jpg', 'The city of Osh in the Fergana valley beneath distant mountain ridgelines'],
  ['batken-weather.jpg', 'The hills and orchards of the Batken region in southern Kyrgyzstan'],
  ['toktogul-weather.jpg', 'Toktogul reservoir surrounded by mountains in central Kyrgyzstan'],
  ['news-weather.jpg', 'A wide mountain valley landscape in Kyrgyzstan under a changing sky']
];
export function pickHeroForDate(dateISO) {
  const dayOfYear = Math.floor((new Date(`${dateISO}T00:00:00Z`) - new Date(`${dateISO.slice(0, 4)}-01-01T00:00:00Z`)) / 86400000);
  const [file, alt] = HERO_POOL[dayOfYear % HERO_POOL.length];
  return { file, alt, image: `/assets/images/generated/${file}` };
}

export function buildDailyArticleHtml({ slug, dateISO, image, heroAlt, en }) {
  const canonical = `https://pogoda.kg/blog/${slug}`;
  const heroImageUrl = `https://pogoda.kg${image}`;
  const articleSchema = JSON.stringify({ '@context': 'https://schema.org', '@type': 'NewsArticle', headline: en.title, description: en.seoDesc, image: [heroImageUrl], datePublished: dateISO, dateModified: dateISO, inLanguage: 'en', mainEntityOfPage: { '@type': 'WebPage', '@id': canonical }, author: { '@type': 'Organization', name: en.author, url: 'https://pogoda.kg/' }, publisher: { '@type': 'Organization', name: 'Pogoda Kg', logo: { '@type': 'ImageObject', url: 'https://pogoda.kg/assets/favicon.svg' } } });
  const breadcrumbSchema = JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pogoda.kg/' }, { '@type': 'ListItem', position: 2, name: 'News', item: 'https://pogoda.kg/blog' }, { '@type': 'ListItem', position: 3, name: en.title, item: canonical }] });
  
  
    return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-NB2ZDKZ6');</script>
  <!-- End Google Tag Manager -->
  <!-- Yandex.Metrika counter -->
  <script type="text/javascript">
      (function(m,e,t,r,i,k,a){
          m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
      })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=111383934', 'ym');

      ym(111383934, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
  </script>

  <!-- /Yandex.Metrika counter -->
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-08R68KQMX4"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-08R68KQMX4');
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(en.seoTitle)} | Pogoda.kg</title>
  <meta name="description" content="${esc(en.seoDesc)}">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="en" href="${canonical}" />
  <link rel="alternate" hreflang="ru" href="${canonical}" />
  <link rel="alternate" hreflang="ky" href="${canonical}" />
  <link rel="alternate" hreflang="x-default" href="${canonical}" />
  <meta name="theme-color" content="#FF9F43">
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="48x48" href="/assets/favicon-48x48.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="preconnect" href="https://www.googletagmanager.com">
  <link rel="stylesheet" href="/css/style.css?v=19">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(en.seoTitle)}">
  <meta property="og:description" content="${esc(en.seoDesc)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${heroImageUrl}">
  <meta property="og:site_name" content="Pogoda Kg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(en.seoTitle)}">
  <meta name="twitter:description" content="${esc(en.seoDesc)}">
  <meta name="twitter:image" content="${heroImageUrl}">
  <script type="application/ld+json">
  ${articleSchema}
  </script>
  <script type="application/ld+json">
  ${breadcrumbSchema}
  </script>
</head>
<body>
<noscript><div><img src="https://mc.yandex.ru/watch/111383934" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
  <svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
  <symbol id="icon-arrow-left" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></symbol>
  <symbol id="icon-calendar" viewBox="0 0 448 512"><path d="M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z"/></symbol>
  <symbol id="icon-chevron-right" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></symbol>
  <symbol id="icon-house" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></symbol>
  <symbol id="icon-magnifying-glass" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></symbol>
  <symbol id="icon-user" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></symbol>
  <symbol id="icon-xmark" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></symbol>
  </svg>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NB2ZDKZ6"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->

  <!-- Floating Dark Mode Toggle Widget -->
  <div class="floating-dark-toggle">
    <span>Dark<br>Mode</span>
    <label class="toggle-switch">
      <input type="checkbox" id="darkModeToggle" class="theme-toggle-input" aria-label="Dark Mode">
      <span class="slider"></span>
    </label>
  </div>

  <!-- Header -->
  <header class="site-header">
    <div class="header-container">
      <a href="/index.html" class="brand-logo" aria-label="Pogoda.kg Home">
        <img src="/assets/logo-dark.png" alt="Pogoda.kg Logo" class="brand-logo-img logo-light-theme" width="575" height="79">
        <img src="/assets/logo.png" alt="Pogoda.kg Logo" class="brand-logo-img logo-dark-theme" width="575" height="79">
      </a>

      <nav class="main-nav">
        <ul>
          <li><a href="/index.html" data-i18n="nav_home">Home</a></li>
          <li><a href="/blog.html" class="active" data-i18n="nav_news">News</a></li>
          <li><a href="/map.html" data-i18n="nav_map">Map</a></li>
          <li><a href="/faq.html" data-i18n="nav_faq">FAQ</a></li>
          <li><a href="/contact.html" data-i18n="nav_contact">Contact</a></li>
        </ul>
      </nav>

      <div class="header-actions">
        <div class="lang-selector">
          <button class="lang-btn" data-lang="EN">EN</button>
          <button class="lang-btn" data-lang="KG">KG</button>
          <button class="lang-btn" data-lang="RU">RU</button>
        </div>
        <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle Navigation Menu">
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <div class="mobile-drawer" id="mobileDrawer">
      <div class="mobile-drawer-header">
        <button class="mobile-drawer-close" id="mobileDrawerClose">
          <svg class="icon"><use href="#icon-xmark"></use></svg>
          <span data-i18n="close_btn">Close</span>
        </button>
      </div>
      <div class="mobile-drawer-search">
        <input type="text" id="mobileSearchInput" placeholder="Search location in Kyrgyzstan..." data-i18n-placeholder="search_placeholder">
        <button id="mobileSearchBtn" aria-label="Search"><svg class="icon"><use href="#icon-magnifying-glass"></use></svg></button>
      </div>
      <nav class="mobile-nav">
        <ul>
          <li>
            <a href="/index.html">
              <span data-i18n="nav_home">Home</span>
              <span class="mobile-menu-arrow"><svg class="icon"><use href="#icon-chevron-right"></use></svg></span>
            </a>
          </li>
          <li>
            <a href="/blog.html" class="active">
              <span data-i18n="nav_news">News</span>
              <span class="mobile-menu-arrow"><svg class="icon"><use href="#icon-chevron-right"></use></svg></span>
            </a>
          </li>
          <li>
            <a href="/map.html">
              <span data-i18n="nav_map">Map</span>
              <span class="mobile-menu-arrow"><svg class="icon"><use href="#icon-chevron-right"></use></svg></span>
            </a>
          </li>
          <li>
            <a href="/faq.html">
              <span data-i18n="nav_faq">FAQ</span>
              <span class="mobile-menu-arrow"><svg class="icon"><use href="#icon-chevron-right"></use></svg></span>
            </a>
          </li>
          <li>
            <a href="/contact.html">
              <span data-i18n="nav_contact">Contact</span>
              <span class="mobile-menu-arrow"><svg class="icon"><use href="#icon-chevron-right"></use></svg></span>
            </a>
          </li>
        </ul>
        <div class="mobile-drawer-lang-row">
          <div class="mobile-lang-title">Language / Тил / Язык</div>
          <div class="lang-selector mobile-lang-selector">
            <button class="lang-btn" data-lang="EN">EN</button>
            <button class="lang-btn" data-lang="KG">KG</button>
            <button class="lang-btn" data-lang="RU">RU</button>
          </div>
        </div>
      </nav>
    </div>
    <div class="mobile-overlay" id="mobileOverlay"></div>
  </header>

  <!-- Main Article -->
  <main class="section-wrapper" style="max-width: 800px; margin: 40px auto; padding: 0 20px;">
    <!-- Breadcrumbs -->
    <div class="breadcrumbs-container" style="margin-bottom: 20px; font-size: 14px; color: var(--text-sub); text-align: left;">
      <a href="/index.html" style="color:var(--text-sub); text-decoration:none;"><svg class="icon"><use href="#icon-house"></use></svg> Home</a>
      <span style="margin: 0 8px;">/</span>
      <a href="/blog.html" style="color:var(--text-sub); text-decoration:none;">News</a>
      <span style="margin: 0 8px;">/</span>
      <span>${esc(en.title)}</span>
      <div class="mini-weather-widget" id="miniWeatherWidget"></div>
    </div>

    <div style="text-align: left; margin-bottom: 20px;">
      <a href="/blog.html" class="back-btn" style="display:inline-block; color:var(--text-sub); text-decoration:none;"><svg class="icon"><use href="#icon-arrow-left"></use></svg> Back to News</a>
    </div>

    <img src="${image}" alt="${esc(heroAlt)}" fetchpriority="high" style="width:100%; height:auto; aspect-ratio: 16/9; object-fit: cover; border-radius:12px; margin-bottom:20px; box-shadow:0 10px 30px rgba(0,0,0,0.1);" width="1344" height="752">

    <span class="news-tag" style="background:var(--primary); color:white; font-size:14px; padding:6px 12px; border-radius:20px;">${esc(en.category)}</span>
    <h1 class="post-title" style="font-size:32px; margin:15px 0; line-height: 1.3;">${esc(en.title)}</h1>
    <div class="post-meta" style="color:var(--text-sub); display:flex; gap:20px; margin-bottom:30px; border-bottom:1px solid var(--border); padding-bottom:20px;">
      <span><svg class="icon"><use href="#icon-user"></use></svg> ${esc(en.author)}</span>
      <span><svg class="icon"><use href="#icon-calendar"></use></svg> ${esc(en.date)}</span>
    </div>
    <div class="post-content" style="line-height:1.8; font-size:17px;">${en.content}</div>
  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-brand">
        <a href="/index.html" class="brand-logo" aria-label="Pogoda.kg Home">
          <img src="/assets/logo-dark.png" alt="Pogoda.kg Logo" class="brand-logo-img logo-light-theme" width="575" height="79">
          <img src="/assets/logo.png" alt="Pogoda.kg Logo" class="brand-logo-img logo-dark-theme" width="575" height="79">
        </a>
        <p data-i18n="footer_desc">Kyrgyzstan's official weather portal (pogoda.kg). Providing forecast news and climate data.</p>
      </div>

      <div class="footer-column">
        <h4 data-i18n="footer_nav">Navigation</h4>
        <ul>
          <li><a href="/index.html" data-i18n="nav_home">Home</a></li>
          <li><a href="/blog.html" data-i18n="nav_news">Weather News</a></li>
          <li><a href="/map.html" data-i18n="nav_map">Weather Map</a></li>
          <li><a href="/faq.html" data-i18n="nav_faq">FAQ</a></li>
          <li><a href="/contact.html" data-i18n="nav_contact">Contact Us</a></li>
        </ul>
      </div>

      <div class="footer-column">
        <h4 data-i18n="footer_locations">Top Locations</h4>
        <ul>
          <li><a href="/bishkek" class="footer-city-link" data-city-id="bishkek">Bishkek</a></li>
          <li><a href="/osh" class="footer-city-link" data-city-id="osh">Osh</a></li>
          <li><a href="/jalal-abad" class="footer-city-link" data-city-id="jalal-abad">Jalal-Abad</a></li>
          <li><a href="/karakol" class="footer-city-link" data-city-id="karakol">Karakol</a></li>
          <li><a href="/naryn" class="footer-city-link" data-city-id="naryn">Naryn</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2026 Pogoda Kg. All rights reserved.</p>
    </div>
  </footer>

  <script type="module" src="/js/blog.js?v=7"></script>
</body>
</html>
`;
}
