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

// 3. Define Languages and their mapping
const LANGS = ['KG', 'RU', 'EN'];
const LANG_CODES = { KG: 'ky', RU: 'ru', EN: 'en' };
const LANG_PREFIXES = { KG: '', RU: '/ru', EN: '/en' };

// <title> / meta description per static page per language (50-60 / 150-160 chars).
// EN isn't listed — the source file's own English copy is used as-is for the EN build.
const PAGE_META = {
    'index.html': {
        RU: { title: "Кыргызстан: погода в Бишкеке сегодня и на неделю | Pogoda Kg", description: "Точный ежедневный, почасовой и месячный прогноз погоды для городов Кыргызстана: Бишкек, Ош, Джалал-Абад, Каракол, Токмок, Узген, Нарын и другие города." },
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
    }
};

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
        const word = native.length <= 3 ? 'самый точный' : 'точный';
        return {
            title: `Погода в городе ${native} сегодня и на неделю | Pogoda.kg`,
            description: `Узнайте ${word} прогноз погоды в ${native}, Кыргызстан: температура, ветер, влажность, почасовой и подробный 7-дневный прогноз, обновляется каждые 15 минут.`
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
        return {
            title: `Погода в городе ${native}`,
            desc: `Актуальный прогноз погоды для города ${native}: температура, осадки, скорость ветра и подробный прогноз на 7 дней, обновляется каждые 15 минут.`
        };
    }
    // KG
    return {
        title: `${native} аба ырайынын божомолу`,
        desc: `${native} үчүн азыркы аба ырайынын божомолу: температура, жаан-чачын, шамал ылдамдыгы жана 7 күндүк так божомол, ар 15 мүнөт сайын жаңыртылат.`
    };
}

// Adds the city name to the "Hourly Update" / "Today Weather Details" / "Weekly Weather
// Forecast" section headings on city pages. Kept in sync with the identical function in
// app.js so it stays correct after a client-side language switch.
function getCitySectionTitles(lang, city) {
    const en = city.name;
    const native = city.nativeName || city.name;

    if (lang === 'EN') {
        return {
            hourly: `Hourly Update for ${en}`,
            todayDetails: `Today Weather Details for ${en}`,
            weekly: `Weekly Weather Forecast for ${en}`
        };
    }
    if (lang === 'RU') {
        return {
            hourly: `Почасовой прогноз — ${native}`,
            todayDetails: `Подробности погоды на сегодня — ${native}`,
            weekly: `Прогноз погоды на неделю — ${native}`
        };
    }
    // KG
    return {
        hourly: `Сааттык божомол — ${native}`,
        todayDetails: `Бүгүнкү аба ырайы чоо-жайы — ${native}`,
        weekly: `Бир жумалык божомол — ${native}`
    };
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

        // Save file
        const outFilePath = file === 'index.html' 
            ? path.join(OUT_DIR, prefix, 'index.html') 
            : path.join(OUT_DIR, prefix, file);
            
        fs.mkdirSync(path.dirname(outFilePath), { recursive: true });
        fs.writeFileSync(outFilePath, translated);
        // The 404 page isn't a real, indexable page — don't submit it to Google via the sitemap.
        if (file !== '404.html') sitemapUrls.push(fullUrl);

        // Special Case: If it's index.html, generate city pages!
        if (file === 'index.html') {
            CITIES.forEach(city => {
                let cityUrl = prefix + `/${city.id}`;
                if (prefix === '') cityUrl = `/${city.id}`;
                
                let cityHtml = translated;

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
                    /<h2 class="section-title" id="todayDetailsTitle" data-i18n="today_details_title">[\s\S]*?<\/h2>/,
                    `<h2 class="section-title" id="todayDetailsTitle">${citySections.todayDetails}</h2>`
                );
                cityHtml = cityHtml.replace(
                    /<h2 class="section-title" id="weeklyForecastTitle" data-i18n="weekly_title">[\s\S]*?<\/h2>/,
                    `<h2 class="section-title" id="weeklyForecastTitle">${citySections.weekly}</h2>`
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

// Write _redirects
const redirects = `# Clean URLs
/kg  /  301
/kg/*  /:splat  301
`;
fs.writeFileSync(path.join(OUT_DIR, '_redirects'), redirects);

console.log('Build complete. Output generated in out/ folder.');
