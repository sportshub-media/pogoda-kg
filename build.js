const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const OUT_DIR = path.join(__dirname, 'out');

// 1. Extract Translations
const i18nContent = fs.readFileSync(path.join(SRC_DIR, 'js', 'i18n.js'), 'utf8');
const translationsMatch = i18nContent.match(/export const TRANSLATIONS = (\{[\s\S]*?\n\});/);
let TRANSLATIONS;
if (translationsMatch) {
    TRANSLATIONS = eval('(' + translationsMatch[1] + ')');
} else {
    throw new Error('Could not find TRANSLATIONS in i18n.js');
}

// 2. Extract Cities
const configContent = fs.readFileSync(path.join(SRC_DIR, 'js', 'config.js'), 'utf8');
const citiesMatch = configContent.match(/export const KYRGYZSTAN_CITIES = (\[[\s\S]*?\]);/);
let CITIES;
if (citiesMatch) {
    CITIES = eval('(' + citiesMatch[1] + ')');
} else {
    throw new Error('Could not find KYRGYZSTAN_CITIES in config.js');
}

// 2b. Extract Blog Posts (drives the homepage "Latest Weather Forecast News" grid,
// so it renders in the correct language instead of the hardcoded English it used
// to be — see renderNewsGridHTML() below)
const blogJsContent = fs.readFileSync(path.join(SRC_DIR, 'js', 'blog-posts-data.js'), 'utf8');
const blogPostsMatch = blogJsContent.match(/export const BLOG_POSTS = (\[[\s\S]*?\n\]);/);
let BLOG_POSTS;
if (blogPostsMatch) {
    BLOG_POSTS = eval('(' + blogPostsMatch[1] + ')');
} else {
    throw new Error('Could not find BLOG_POSTS in blog.js');
}

// 2c. Extract Weather FAQ content (homepage + per-city sections — SSR content
// plus FAQPage JSON-LD, see renderFAQHTML/renderFAQSchema below)
const faqJsContent = fs.readFileSync(path.join(SRC_DIR, 'js', 'faq-data.js'), 'utf8');
const homeFaqMatch = faqJsContent.match(/export const HOME_FAQ = (\{[\s\S]*?\n\});/);
const moreGeneralFaqMatch = faqJsContent.match(/export const MORE_GENERAL_FAQ = (\{[\s\S]*?\n\});/);
const cityFaqMatch = faqJsContent.match(/export const CITY_FAQ = (\{[\s\S]*?\n\});/);
let HOME_FAQ, MORE_GENERAL_FAQ, CITY_FAQ;
if (homeFaqMatch && moreGeneralFaqMatch && cityFaqMatch) {
    HOME_FAQ = eval('(' + homeFaqMatch[1] + ')');
    MORE_GENERAL_FAQ = eval('(' + moreGeneralFaqMatch[1] + ')');
    CITY_FAQ = eval('(' + cityFaqMatch[1] + ')');
} else {
    throw new Error('Could not find HOME_FAQ/MORE_GENERAL_FAQ/CITY_FAQ in faq-data.js');
}

// 3. Define Languages and their mapping
const LANGS = ['KG', 'RU', 'EN'];
const LANG_CODES = { KG: 'ky', RU: 'ru', EN: 'en' };
const LANG_PREFIXES = { KG: '', RU: '/ru', EN: '/en' };

// <title> / meta description per static page per language (50-60 / 150-160 chars).
// EN isn't listed — the source file's own English copy is used as-is for the EN build.
const PAGE_META = {
    'index.html': {
        RU: { title: "Погода в Бишкеке сегодня, на неделю и месяц | Pogoda Kg", description: "Прогноз погоды в Бишкеке и по всей Киргизии: температура сейчас, почасовой прогноз, на завтра, на неделю, на 10 дней и на месяц. Ош, Каракол, Нарын и другие." },
        KG: { title: "Кыргызстан: Бишкектеги күндөлүк аба ырайы | Pogoda Kg", description: "Кыргызстандын Бишкек, Ош, Жалал-Абад, Каракол, Токмок, Өзгөн жана Нарын сыяктуу шаарлары үчүн так күндөлүк, сааттык жана айлык аба ырайы божомолдору тизмеси." }
    },
    'contact.html': {
        RU: { title: "Связаться с командой Pogoda Kg — вопросы и поддержка", description: "Свяжитесь с командой Pogoda Kg по вопросам данных о погоде, предложениям о сотрудничестве, отзывам или другим вопросам о нашем прогнозе погоды Кыргызстана." },
        KG: { title: "Pogoda Kg тобу менен байланышуу — суроолор жана колдоо", description: "Аба ырайы маалыматтары, кызматташтык сунуштары, пикирлер же Кыргызстандын аба ырайы божомолу тууралуу суроо-талаптарыңыз боюнча Pogoda Kg тобуна кайрылыңыз." }
    },
    'map.html': {
        RU: { title: "Интерактивная карта погоды Кыргызстана | Pogoda Kg", description: "Изучите интерактивную карту погоды Кыргызстана с живыми отметками температуры, данными о ветре и прогнозами для Бишкека, Оша, Каракола, Нарына и других городов." },
        KG: { title: "Кыргызстандын интерактивдүү аба ырайы картасы | Pogoda Kg", description: "Бишкек, Ош, Каракол, Нарын жана башка шаарлардын температура белгилери, шамал маалыматтары жана божомолдору менен интерактивдүү картадан таанышып чыгыңыз." }
    },
    'blog.html': {
        RU: { title: "Все новости и блог о погоде в Кыргызстане | Pogoda.kg", description: "Читайте последние новости о погоде в Кыргызстане, состоянии горных перевалов, отчёты по озеру Иссык-Куль и сезонные климатические обновления от Pogoda Kg." },
        KG: { title: "Кыргызстандын аба ырайы жаңылыктары | Pogoda.kg сайты", description: "Кыргызстандын аба ырайы боюнча акыркы жаңылыктарды, тоо ашууларынын абалын, Ысык-Көл жөнүндөгү отчётторду жана мезгилдик климаттык жаңылыктарды окуңуз." }
    },
    'terms.html': {
        RU: { title: "Условия использования сайта Pogoda Kg — прочитайте", description: "Ознакомьтесь с Условиями использования Pogoda Kg, погодного портала Кыргызстана, включая отказ от ответственности за данные и правила использования сайта." },
        KG: { title: "Колдонуу шарттары | Pogoda Kg аба ырайы порталы сайты", description: "Кыргызстандын аба ырайы порталы Pogoda Kg сайтынын Колдонуу шарттары менен таанышыңыз: маалыматтардын тактыгы жана сайтты колдонуу эрежелери жөнүндө маалымат." }
    },
    'privacy.html': {
        RU: { title: "Политика конфиденциальности сайта Pogoda Kg — читать", description: "Ознакомьтесь с Политикой конфиденциальности Pogoda Kg: какие данные мы собираем, как их используем и как хранятся ваши настройки языка и города в браузере." },
        KG: { title: "Купуялык саясаты | Pogoda Kg аба ырайы порталы сайты", description: "Pogoda Kg кандай маалыматтарды чогултарын, аны кантип колдонорун жана тил менен шаар тандооңуз браузериңизде кантип сакталарын Купуялык саясатыбыздан билиңиз." }
    },
    '404.html': {
        RU: { title: "404 — Такая страница не найдена на сайте Pogoda Kg", description: "Страница погоды, которую вы ищете, не существует на сайте Pogoda Kg. Вернитесь на главную страницу, чтобы увидеть последний прогноз погоды по Кыргызстану." },
        KG: { title: "404 — Суралган барак табылган жок | Pogoda.kg сайты", description: "Сиз издеген аба ырайы барагы Pogoda Kg сайтында такыр эле табылган жок. Кыргызстандын акыркы күндөлүк аба ырайы божомолун көрүү үчүн башкы бетке кайтыңыз." }
    },
    'faq.html': {
        RU: { title: "Часто задаваемые вопросы о погоде в Кыргызстане: климат", description: "Ответы о погоде и климате Кыргызстана: общие вопросы, погода по каждому из 10 крупных городов, а также о том, как работают прогнозы Pogoda.kg." },
        KG: { title: "Кыргызстандын аба ырайы жана климаты боюнча суроо-жооптор", description: "Кыргызстандын аба ырайы жана климаты тууралуу жооптор: жалпы суроолор, 10 ири шаар боюнча аба ырайы, ошондой эле Pogoda.kg божомолдору кантип иштээри." }
    }
};

// Russian city names in nominative + prepositional case. config.js's nativeName is
// the Kyrgyz spelling (Өзгөн, Жалал-Абад), which shouldn't appear on Russian pages.
// The prepositional form matters for SEO: people search "погода в бишкеке", not
// "погода город бишкек" — see docs/seo-keywords.md.
const RU_CITY_FORMS = {
    'bishkek':    { nom: 'Бишкек',     prep: 'Бишкеке' },
    'osh':        { nom: 'Ош',         prep: 'Оше' },
    'jalal-abad': { nom: 'Джалал-Абад', prep: 'Джалал-Абаде' },
    'karakol':    { nom: 'Каракол',    prep: 'Караколе' },
    'tokmok':     { nom: 'Токмок',     prep: 'Токмоке' },
    'uzgen':      { nom: 'Узген',      prep: 'Узгене' },
    'kara-balta': { nom: 'Кара-Балта', prep: 'Кара-Балте' },
    'balykchy':   { nom: 'Балыкчы',    prep: 'Балыкчы' },
    'naryn':      { nom: 'Нарын',      prep: 'Нарыне' },
    'talas':      { nom: 'Талас',      prep: 'Таласе' }
};

function ruCity(city) {
    return RU_CITY_FORMS[city.id] || { nom: city.nativeName || city.name, prep: city.nativeName || city.name };
}

// Per-city, per-language <title> and meta description (kept within 50-60 / 150-160 chars)
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
    // KG
    return {
        title: `${native} аба ырайы бүгүн жана 7 күндүк божомол | Pogoda.kg`,
        description: `${native} шаары үчүн азыркы аба ырайынын божомолу: температура, шамал, нымдуулук жана 7 күндүк, 14 күндүк божомолдор ар 15 мүнөт сайын автоматтык жаңыртылат.`
    };
}

// Unique, visible on-page hero heading/intro for each city page (not just meta tags),
// so each city page is genuinely distinct content rather than a shared template with
// only the URL/meta swapped. Kept in sync with the identical logic in app.js so the
// text stays consistent whether it's server-rendered or updated client-side.
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
    // KG
    return {
        title: `${native} аба ырайынын божомолу`,
        desc: `${native} үчүн азыркы аба ырайынын божомолу: температура, жаан-чачын, шамал ылдамдыгы жана 7 күндүк так божомол, ар 15 мүнөт сайын жаңыртылат.`
    };
}

// Adds the city name to the "Hourly Update" / "Today Weather Details" / "Weekly Weather
// Forecast" section headings AND the description paragraph under each one, on city
// pages — the paragraphs used to be the same generic sentence on every city page,
// which is exactly the kind of thin/duplicate content Google flags across templated
// pages. Kept in sync with the identical function in app.js so it stays correct after
// a client-side language switch.
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
    // KG — "${native} үчүн" (for {city}) sidesteps Kyrgyz vowel-harmony suffix
    // agreement, which a single hardcoded case ending can't get right across
    // every city name.
    return {
        hourly: `Сааттык божомол — ${native}`,
        hourlyDesc: `${native} үчүн сааттык божомолду көзөмөлдөңүз: температура, жамгыр ыктымалдыгы жана шамал ар 15 мүнөт сайын жаңыртылат.`,
        todayDetails: `Бүгүнкү аба ырайы чоо-жайы — ${native}`,
        todayDetailsDesc: `${native} үчүн азыркы шарттардын толук сереби: шамал ылдамдыгы, нымдуулук, көрүнүү аралыгы жана бүгүнкү күндүн узактыгы.`,
        weekly: `Бир жумалык божомол — ${native}`,
        weeklyDesc: `${native} үчүн алдыдагы жуманы билиңиз: күндүзгү жана түнкү температуралар, аба ырайы шарттары жана 7 күндүк шамал көрсөткүчтөрү.`
    };
}

// Renders the homepage "Latest Weather Forecast News" bento grid (top 5 posts,
// newest first — post[0] is the featured card) in the given language. Used at
// build time here, and mirrored client-side in app.js's renderNewsGrid() so a
// language switch re-renders it correctly instead of leaving it in whichever
// language index.html was originally served in.
function renderNewsGridHTML(lang, posts) {
    return posts.slice(0, 5).map((post, i) => {
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

// Renders the visible FAQ list (homepage: HOME_FAQ, dedicated city pages:
// CITY_FAQ[city.id]). Mirrored client-side in app.js's renderFAQ() for a
// language switch.
function renderFAQHTML(faqList) {
    return faqList.map(item => `
      <details class="faq-item">
        <summary class="faq-question">${item.q}</summary>
        <div class="faq-answer">${item.a}</div>
      </details>`).join('\n');
}

// FAQPage structured data matching the visible FAQ content above — Google
// requires FAQ rich-result markup to reflect what's actually shown on the
// page, so this is generated from the exact same faqList as renderFAQHTML().
function renderFAQSchema(faqList) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqList.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": { "@type": "Answer", "text": item.a }
        }))
    };
    return `<script type="application/ld+json">\n  ${JSON.stringify(schema)}\n  </script>`;
}

// Fills #faqContainer and injects FAQPage schema for a given faqList, against
// a page HTML string whose #faqContainer is still the pristine (comment-only)
// placeholder from the template. Must run on template-derived HTML BEFORE any
// other FAQ fill — the rendered .faq-item markup contains nested <div>s, so a
// non-greedy regex can't safely re-match an already-filled container on a
// second pass (this is why the homepage's HOME_FAQ fill and each city page's
// CITY_FAQ fill both branch from the same pristine `translated`, rather than
// the city branch overwriting an already-filled homepage copy).
function withFAQ(html, faqList) {
    let out = html.replace(
        /<div id="faqContainer" class="faq-list">[\s\S]*?<\/div>/,
        `<div id="faqContainer" class="faq-list">${renderFAQHTML(faqList)}\n    </div>`
    );
    return out.replace('</body>', `  ${renderFAQSchema(faqList)}\n</body>`);
}

// Same city-heading logic as cityHeadingName() in faq.js — RU uses the
// prepositional-case table (not the Kyrgyz nativeName), KG/EN use their own
// name fields directly.
function faqCityHeadingName(lang, city) {
    if (lang === 'RU') return ruCity(city).nom;
    if (lang === 'KG') return city.nativeName || city.name;
    return city.name;
}

// Fills the dedicated /faq page's two dynamic sections (#faqGeneralContainer,
// #faqCitiesContainer) and injects one combined FAQPage schema covering every
// question actually visible on the page — the general ones, all 10 cities',
// and the 5 "About Pogoda.kg" ones already baked into the template via
// data-i18n (siteFaqList is read from the same TRANSLATIONS dict as those).
function withFullFAQPage(html, lang, siteFaqList) {
    const generalList = [...(HOME_FAQ[lang] || HOME_FAQ.EN), ...(MORE_GENERAL_FAQ[lang] || MORE_GENERAL_FAQ.EN)];
    let out = html.replace(
        /<div id="faqGeneralContainer" class="faq-list">[\s\S]*?<\/div>/,
        `<div id="faqGeneralContainer" class="faq-list">${renderFAQHTML(generalList)}\n    </div>`
    );

    const citiesHTML = CITIES.map(city => {
        const cityFaq = CITY_FAQ[city.id];
        if (!cityFaq) return '';
        const list = cityFaq[lang] || cityFaq.EN;
        return `
      <div style="margin-bottom: 28px;">
        <h3 style="font-size:18px; font-weight:700; margin-bottom:12px; text-align:center;">${faqCityHeadingName(lang, city)}</h3>
        <div class="faq-list">${renderFAQHTML(list)}</div>
      </div>`;
    }).join('\n');
    out = out.replace(
        /<div id="faqCitiesContainer">[\s\S]*?<\/div>\s*<\/section>/,
        `<div id="faqCitiesContainer">${citiesHTML}\n    </div>\n  </section>`
    );

    const allFaq = [...generalList, ...CITIES.flatMap(city => (CITY_FAQ[city.id] && (CITY_FAQ[city.id][lang] || CITY_FAQ[city.id].EN)) || []), ...siteFaqList];
    return out.replace('</body>', `  ${renderFAQSchema(allFaq)}\n</body>`);
}

// 4. Utility: copy folder recursively
function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        } else {
            copyFolderSync(path.join(from, element), path.join(to, element));
        }
    });
}

// Start fresh
if (fs.existsSync(OUT_DIR)) {
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUT_DIR);

// Copy static assets
console.log('Copying static assets...');
['css', 'js', 'assets'].forEach(folder => {
    const fromPath = path.join(SRC_DIR, folder);
    if (fs.existsSync(fromPath)) {
        copyFolderSync(fromPath, path.join(OUT_DIR, folder));
    }
});

// Blog posts need copying too (we might need to process blog html files, let's copy them first)
if (fs.existsSync(path.join(SRC_DIR, 'blog'))) {
    copyFolderSync(path.join(SRC_DIR, 'blog'), path.join(OUT_DIR, 'blog'));
}

// Helper to translate HTML string
function translateHTML(html, lang, dict, currentUrl) {
    let result = html;
    
    // 1. Replace <html lang="...">
    result = result.replace(/<html\s+lang="[^"]+"/i, `<html lang="${LANG_CODES[lang]}"`);
    
    // 2. Replace data-i18n attributes with text
    result = result.replace(/data-i18n="([^"]+)">([^<]*)</g, (match, key, currentText) => {
        if (dict[key]) {
            return `data-i18n="${key}">${dict[key]}<`;
        }
        return match;
    });
    
    // 3. Replace data-i18n-placeholder
    result = result.replace(/data-i18n-placeholder="([^"]+)"/g, (match, key) => {
        if (dict[key]) {
            return `data-i18n-placeholder="${key}" placeholder="${dict[key]}"`;
        }
        return match;
    });
    
    // 4. Fix Canonical Link
    result = result.replace(/<link rel="canonical" href="[^"]+">/, `<link rel="canonical" href="https://pogoda.kg${currentUrl}">`);
    
    // 5. Fix Hreflang Tags (rebuild them)
    // Remove existing
    result = result.replace(/<link rel="alternate" hreflang="[^"]+" href="[^"]+"\s*\/>\n?/g, '');
    
    // Create new hreflang block
    const baseCleanUrl = currentUrl.replace(/^\/(ru|en)/, '');
    let hreflangBlock = `
  <link rel="alternate" hreflang="ru" href="https://pogoda.kg/ru${baseCleanUrl}" />
  <link rel="alternate" hreflang="ky" href="https://pogoda.kg${baseCleanUrl}" />
  <link rel="alternate" hreflang="en" href="https://pogoda.kg/en${baseCleanUrl}" />
  <link rel="alternate" hreflang="x-default" href="https://pogoda.kg${baseCleanUrl}" />`;
    
    // Inject before </head> or after canonical
    result = result.replace(/(<link rel="canonical" href="[^"]+">)/, `$1${hreflangBlock}`);
    
    // 6. Fix Relative Asset Paths
    result = result.replace(/(href|src)="css\//g, '$1="/css/');
    result = result.replace(/(href|src)="js\//g, '$1="/js/');
    result = result.replace(/(href|src)="assets\//g, '$1="/assets/');
    // CSS url() references (e.g. the hero background-image) aren't caught by the
    // href/src fix above and were 404ing on every /en/* and /ru/* page.
    result = result.replace(/url\('assets\//g, "url('/assets/");

    return result;
}

// Collect urls for sitemap
const sitemapUrls = [];

// 5. Process HTML Files
const htmlFiles = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    const rawHtml = fs.readFileSync(path.join(SRC_DIR, file), 'utf8');
    
    LANGS.forEach(lang => {
        const dict = TRANSLATIONS[lang] || TRANSLATIONS['EN'];
        const prefix = LANG_PREFIXES[lang];
        
        // Base URL for this page
        let pageUrl = file === 'index.html' ? '' : `/${file.replace('.html', '')}`;
        let fullUrl = prefix + pageUrl;
        // Index pages are served as directories (with a trailing-slash redirect), so
        // their canonical URL must include the trailing slash to match what's actually served.
        if (file === 'index.html') fullUrl = fullUrl === '' ? '/' : `${fullUrl}/`;
        
        let translated = translateHTML(rawHtml, lang, dict, fullUrl);

        // Translate <title>/meta description (and matching og:/twitter: tags) per language.
        const pageMeta = PAGE_META[file] && PAGE_META[file][lang];
        if (pageMeta) {
            translated = translated.replace(/<title>.*?<\/title>/, `<title>${pageMeta.title}</title>`);
            translated = translated.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${pageMeta.description}">`);
            translated = translated.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${pageMeta.title}">`);
            translated = translated.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${pageMeta.description}">`);
            translated = translated.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${pageMeta.title}">`);
            translated = translated.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${pageMeta.description}">`);
        }

        // Fill in the homepage's news grid with the current top 5 blog posts, in
        // this build's language.
        if (file === 'index.html') {
            translated = translated.replace(
                /<div class="news-bento-grid" id="newsBentoGrid">[\s\S]*?<\/div>/,
                `<div class="news-bento-grid" id="newsBentoGrid">${renderNewsGridHTML(lang, BLOG_POSTS)}\n    </div>`
            );
        }

        // The homepage gets the Kyrgyzstan-wide FAQ (dedicated city pages get
        // their own city-specific one further down, from the same pristine
        // #faqContainer placeholder — see withFAQ()'s doc comment). contact.html
        // already has its own 5 site-usage FAQs baked into the template via
        // data-i18n — just add matching FAQPage schema so they're eligible for
        // rich results too, without touching the visible markup.
        let pageOutput = file === 'index.html'
            ? withFAQ(translated, HOME_FAQ[lang] || HOME_FAQ.EN)
            : translated;
        if (file === 'contact.html') {
            const contactFaqList = [1, 2, 3, 4, 5].map(n => ({
                q: (dict[`faq_q${n}`] || '').replace(/^[A-ZА-ЯЁӨҮ]:\s*/u, ''),
                a: (dict[`faq_a${n}`] || '').replace(/^[A-ZА-ЯЁӨҮ]:\s*/u, '')
            }));
            pageOutput = pageOutput.replace('</body>', `  ${renderFAQSchema(contactFaqList)}\n</body>`);
        }
        if (file === 'faq.html') {
            const siteFaqList = [1, 2, 3, 4, 5].map(n => ({
                q: dict[`faq_q${n}_clean`] || '',
                a: dict[`faq_a${n}_clean`] || ''
            }));
            pageOutput = withFullFAQPage(pageOutput, lang, siteFaqList);
        }

        // Save file
        const outFilePath = file === 'index.html'
            ? path.join(OUT_DIR, prefix, 'index.html')
            : path.join(OUT_DIR, prefix, file);

        fs.mkdirSync(path.dirname(outFilePath), { recursive: true });
        fs.writeFileSync(outFilePath, pageOutput);
        // The 404 page isn't a real, indexable page — don't submit it to Google via the sitemap.
        if (file !== '404.html') sitemapUrls.push(fullUrl);

        // Special Case: If it's index.html, generate city pages!
        if (file === 'index.html') {
            CITIES.forEach(city => {
                let cityUrl = prefix + `/${city.id}`;
                if (prefix === '') cityUrl = `/${city.id}`;
                
                let cityHtml = translated;
                // The Yandex site-verification tag only belongs on the homepage, not on
                // every generated city page.
                cityHtml = cityHtml.replace(/\s*<meta name="yandex-verification" content="[^"]*"\s*\/>\n?/, '\n');

                // Update title & meta description to be unique per city (50-60 / 150-160 chars)
                const cityMeta = getCityMeta(lang, city);
                cityHtml = cityHtml.replace(/<title>.*?<\/title>/, `<title>${cityMeta.title}</title>`);
                cityHtml = cityHtml.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${cityMeta.description}">`);
                cityHtml = cityHtml.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${cityMeta.title}">`);
                cityHtml = cityHtml.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${cityMeta.description}">`);
                cityHtml = cityHtml.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${cityMeta.title}">`);
                cityHtml = cityHtml.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${cityMeta.description}">`);

                // Replace the hero heading/intro with real, unique on-page content for this
                // city (not just meta tags) — this is what makes it a genuine dedicated page
                // rather than the homepage template with only the URL swapped. The data-i18n
                // attributes are dropped so the client-side translator can't overwrite them;
                // app.js keeps this text in sync client-side using the same wording.
                const cityHero = getCityHeroContent(lang, city);
                cityHtml = cityHtml.replace(
                    /<h1 class="hero-title" data-i18n="hero_title">[\s\S]*?<\/h1>/,
                    `<h1 class="hero-title">${cityHero.title}</h1>`
                );
                cityHtml = cityHtml.replace(
                    /<p class="hero-desc" data-i18n="hero_desc">[\s\S]*?<\/p>/,
                    `<p class="hero-desc">${cityHero.desc}</p>`
                );

                // Same treatment for the "Hourly Update" / "Today Weather Details" /
                // "Weekly Weather Forecast" section headings — name the city directly.
                const citySections = getCitySectionTitles(lang, city);
                cityHtml = cityHtml.replace(
                    /<h2 class="section-title" id="hourlyUpdateTitle" data-i18n="hourly_title">[\s\S]*?<\/h2>/,
                    `<h2 class="section-title" id="hourlyUpdateTitle">${citySections.hourly}</h2>`
                );
                cityHtml = cityHtml.replace(
                    /<p class="section-desc" id="hourlyUpdateDesc" data-i18n="hourly_desc">[\s\S]*?<\/p>/,
                    `<p class="section-desc" id="hourlyUpdateDesc">${citySections.hourlyDesc}</p>`
                );
                cityHtml = cityHtml.replace(
                    /<h2 class="section-title" id="todayDetailsTitle" data-i18n="today_details_title">[\s\S]*?<\/h2>/,
                    `<h2 class="section-title" id="todayDetailsTitle">${citySections.todayDetails}</h2>`
                );
                cityHtml = cityHtml.replace(
                    /<p class="section-desc" id="todayDetailsDesc" data-i18n="today_details_desc">[\s\S]*?<\/p>/,
                    `<p class="section-desc" id="todayDetailsDesc">${citySections.todayDetailsDesc}</p>`
                );
                cityHtml = cityHtml.replace(
                    /<h2 class="section-title" id="weeklyForecastTitle" data-i18n="weekly_title">[\s\S]*?<\/h2>/,
                    `<h2 class="section-title" id="weeklyForecastTitle">${citySections.weekly}</h2>`
                );
                cityHtml = cityHtml.replace(
                    /<p class="section-desc" id="weeklyForecastDesc" data-i18n="weekly_desc">[\s\S]*?<\/p>/,
                    `<p class="section-desc" id="weeklyForecastDesc">${citySections.weeklyDesc}</p>`
                );

                // Use the city's own dedicated photo instead of the generic homepage
                // hero image, for the background, preload hint, and social share previews.
                const cityImagePath = `/${city.image}`;
                const cityImageUrl = `https://pogoda.kg${cityImagePath}`;
                cityHtml = cityHtml.replace(/url\('\/assets\/images\/hero_mountains\.webp'\)/, `url('${cityImagePath}')`);
                cityHtml = cityHtml.replace(/<link rel="preload" as="image" href="\/assets\/images\/hero_mountains\.webp" fetchpriority="high">/, `<link rel="preload" as="image" href="${cityImagePath}" fetchpriority="high">`);
                cityHtml = cityHtml.replace(/<meta property="og:image" content="[^"]+">/, `<meta property="og:image" content="${cityImageUrl}">`);
                cityHtml = cityHtml.replace(/<meta name="twitter:image" content="[^"]+">/, `<meta name="twitter:image" content="${cityImageUrl}">`);

                // Update Canonical & Hreflang for the City Page
                cityHtml = cityHtml.replace(/<link rel="canonical" href="[^"]+">/, `<link rel="canonical" href="https://pogoda.kg${cityUrl}">`);
                
                // Rebuild hreflang block for the city
                cityHtml = cityHtml.replace(/<link rel="alternate" hreflang="[^"]+" href="[^"]+"\s*\/>\n?/g, '');
                let cityHreflangBlock = `
  <link rel="alternate" hreflang="ru" href="https://pogoda.kg/ru/${city.id}" />
  <link rel="alternate" hreflang="ky" href="https://pogoda.kg/${city.id}" />
  <link rel="alternate" hreflang="en" href="https://pogoda.kg/en/${city.id}" />
  <link rel="alternate" hreflang="x-default" href="https://pogoda.kg/${city.id}" />`;
                cityHtml = cityHtml.replace(/(<link rel="canonical" href="[^"]+">)/, `$1${cityHreflangBlock}`);

                // City-specific weather FAQ (real regional climate facts, not
                // templated stat-swapping) plus matching FAQPage schema.
                const cityFaqList = (CITY_FAQ[city.id] && (CITY_FAQ[city.id][lang] || CITY_FAQ[city.id].EN)) || HOME_FAQ.EN;
                cityHtml = withFAQ(cityHtml, cityFaqList);

                // Write city file
                const cityOutPath = path.join(OUT_DIR, prefix, `${city.id}.html`);
                fs.mkdirSync(path.dirname(cityOutPath), { recursive: true });
                fs.writeFileSync(cityOutPath, cityHtml);
                sitemapUrls.push(cityUrl);
            });
        }
    });
});

// Blog articles each live at a single unprefixed URL (no per-language copies) — include them too.
if (fs.existsSync(path.join(SRC_DIR, 'blog'))) {
    fs.readdirSync(path.join(SRC_DIR, 'blog'))
        .filter(f => f.endsWith('.html'))
        .forEach(f => sitemapUrls.push(`/blog/${f.replace('.html', '')}`));
}

// Generate Sitemap
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapUrls.map(url => `  <url>\n    <loc>https://pogoda.kg${url}</loc>\n  </url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), sitemapXml);

// Copy robots.txt into the build output
if (fs.existsSync(path.join(__dirname, 'robots.txt'))) {
    fs.copyFileSync(path.join(__dirname, 'robots.txt'), path.join(OUT_DIR, 'robots.txt'));
}

// Copy favicon.ico to the site root — some browsers/crawlers request it there
// by convention regardless of the <link rel="icon"> tag in the page head.
if (fs.existsSync(path.join(__dirname, 'favicon.ico'))) {
    fs.copyFileSync(path.join(__dirname, 'favicon.ico'), path.join(OUT_DIR, 'favicon.ico'));
}

// Copy llms.txt into the build output
if (fs.existsSync(path.join(__dirname, 'llms.txt'))) {
    fs.copyFileSync(path.join(__dirname, 'llms.txt'), path.join(OUT_DIR, 'llms.txt'));
}

// Write _redirects
const redirects = `# Clean URLs
/kg  /  301
/kg/*  /:splat  301

# Blog articles only exist at the unprefixed /blog/<slug> URL (single page,
# language switched client-side) — redirect any language-prefixed guesses
# to the canonical URL instead of 404ing.
/ru/blog/*  /blog/:splat  301
/en/blog/*  /blog/:splat  301
`;
fs.writeFileSync(path.join(OUT_DIR, '_redirects'), redirects);

// Write _headers (Cloudflare Pages). Cloudflare already sends
// x-content-type-options and referrer-policy; the rest were missing.
//
// The CSP origins below are the complete set the site actually talks to,
// captured from a real browser run: GTM/GA + Yandex Metrika (analytics),
// unpkg (Leaflet), OpenStreetMap (map tiles), Google Fonts, Open-Meteo
// (forecast API), plus the Metrika Webvisor WebSocket. 'unsafe-inline' is unavoidable here — the GTM, Metrika
// and gtag snippets are inline by design, and the markup uses inline
// styles and onclick handlers throughout.
const headers = `/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Permissions-Policy: geolocation=(self), microphone=(), camera=(), payment=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://mc.yandex.ru https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://api.open-meteo.com https://www.googletagmanager.com https://www.google-analytics.com https://mc.yandex.ru https://yandex.ru https://cm.g.doubleclick.net https://stats.g.doubleclick.net wss://mc.yandex.ru; frame-src https://www.googletagmanager.com https://mc.yandex.ru; object-src 'none'; base-uri 'self'; form-action 'self'
`;
fs.writeFileSync(path.join(OUT_DIR, '_headers'), headers);

console.log('Build complete. Output generated in out/ folder.');
