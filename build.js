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

// 2d. Copy and data behind /daily and /passes, so their headings and content are
// in the served HTML in the page's own language (audit H4) rather than English
// placeholders that only JavaScript replaced.
function extractFromJs(file, re) {
    const match = fs.readFileSync(path.join(SRC_DIR, 'js', file), 'utf8').match(re);
    if (!match) throw new Error(`Could not find ${re} in ${file}`);
    return eval('(' + match[1] + ')');
}
const DAILY_COPY = extractFromJs('daily-briefing.js', /const copy = (\{[\s\S]*?\n\});/);
const DAILY_CONDITIONS = extractFromJs('daily-briefing.js', /const conditions = (\{[\s\S]*?\n\});/);
const DAILY_BRIEFING = extractFromJs('daily-briefing-data.js', /export const DAILY_BRIEFING = (\{[\s\S]*?\n\});/);
const PASSES_COPY = extractFromJs('passes.js', /const copy = (\{[\s\S]*?\n\});/);
const KYRGYZSTAN_PASSES = extractFromJs('passes-data.js', /export const KYRGYZSTAN_PASSES = (\[[\s\S]*?\]);/);
const WMO_WEATHER_CODES = extractFromJs('config.js', /export const WMO_WEATHER_CODES = (\{[\s\S]*?\n\});/);
// 7-day forecast for every city, saved each morning by scripts/update-daily-briefing.mjs.
const SNAPSHOT_PATH = path.join(SRC_DIR, 'data', 'forecast-snapshot.json');
const FORECAST_SNAPSHOT = fs.existsSync(SNAPSHOT_PATH) ? JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8')) : null;
// Bishkek calendar day of an ISO timestamp (or undefined).
const isoDay = value => value && new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bishkek' }).format(new Date(value));
const { OFFICIAL_ROAD_STATUS_URL, OFFICIAL_CAMERAS_URL } = Object.fromEntries(
    [...fs.readFileSync(path.join(SRC_DIR, 'js', 'passes-data.js'), 'utf8').matchAll(/export const (OFFICIAL_\w+_URL) = '([^']+)'/g)].map(m => [m[1], m[2]]));

// 3. Define Languages and their mapping
const LANGS = ['KG', 'RU', 'EN'];
const LANG_CODES = { KG: 'ky', RU: 'ru', EN: 'en' };
const LANG_PREFIXES = { KG: '', RU: '/ru', EN: '/en' };

// <title> / meta description per static page per language. Titles are written to
// fit as-is (core <= 48 chars + " | Pogoda.kg"), so fitSeoTitle() never has to cut
// one mid-phrase. An EN entry without a description keeps the source file's own.
const PAGE_META = {
    'index.html': {
        EN: { title: 'Kyrgyzstan Bishkek Daily Weather Forecast', description: 'Accurate daily, hourly, and weekly weather forecasts for Kyrgyzstan cities including Bishkek, Osh, Jalal-Abad, Karakol, Tokmok, Uzgen, and Naryn today.' },
        RU: { title: 'Погода в Бишкеке сегодня и на неделю', description: 'Прогноз погоды в Бишкеке и по всей Киргизии: температура сейчас, почасовой прогноз, на завтра, на неделю. Ош, Каракол, Нарын и другие.' },
        KG: { title: 'Кыргызстан: Бишкектеги күндөлүк аба ырайы', description: 'Кыргызстандын Бишкек, Ош, Жалал-Абад, Каракол, Токмок, Өзгөн жана Нарын сыяктуу шаарлары үчүн так күндөлүк, сааттык жана жумалык аба ырайы божомолдору тизмеси.' }
    },
    'contact.html': {
        EN: { title: 'Contact Us: Weather Data Questions and Feedback' },
        RU: { title: 'Связаться с нами: вопросы о данных о погоде', description: 'Свяжитесь с командой Pogoda Kg по вопросам данных о погоде, предложениям о сотрудничестве, отзывам или другим вопросам о нашем прогнозе погоды Кыргызстана.' },
        KG: { title: 'Байланыш: аба ырайы маалыматы боюнча суроолор', description: 'Аба ырайы маалыматтары, кызматташтык сунуштары, пикирлер же Кыргызстандын аба ырайы божомолу тууралуу суроо-талаптарыңыз боюнча Pogoda Kg тобуна кайрылыңыз.' }
    },
    'map.html': {
        EN: { title: 'Kyrgyzstan Weather Map: Live City Temperatures' },
        RU: { title: 'Интерактивная карта погоды Кыргызстана', description: 'Изучите интерактивную карту погоды Кыргызстана с живыми отметками температуры, данными о ветре и прогнозами для Бишкека, Оша, Каракола, Нарына и других городов.' },
        KG: { title: 'Кыргызстандын интерактивдүү аба ырайы картасы', description: 'Бишкек, Ош, Каракол, Нарын жана башка шаарлардын температура белгилери, шамал маалыматтары жана божомолдору менен интерактивдүү картадан таанышып чыгыңыз.' }
    },
    'blog.html': {
        EN: { title: 'Kyrgyzstan Weather News and Climate Blog' },
        RU: { title: 'Новости погоды и климата в Кыргызстане', description: 'Читайте последние новости о погоде в Кыргызстане, состоянии горных перевалов, отчёты по озеру Иссык-Куль и сезонные климатические обновления от Pogoda Kg.' },
        KG: { title: 'Кыргызстандын аба ырайы жаңылыктары жана блогу', description: 'Кыргызстандын аба ырайы боюнча акыркы жаңылыктарды, тоо ашууларынын абалын, Ысык-Көл жөнүндөгү отчётторду жана мезгилдик климаттык жаңылыктарды окуңуз.' }
    },
    'terms.html': {
        EN: { title: 'Terms of Service' },
        RU: { title: 'Условия использования', description: 'Ознакомьтесь с Условиями использования Pogoda Kg, погодного портала Кыргызстана, включая отказ от ответственности за данные и правила использования сайта.' },
        KG: { title: 'Колдонуу шарттары', description: 'Кыргызстандын аба ырайы порталы Pogoda Kg сайтынын Колдонуу шарттары менен таанышыңыз: маалыматтардын тактыгы жана сайтты колдонуу эрежелери жөнүндө маалымат.' }
    },
    'about.html': {
        EN: { title: 'About Pogoda.kg: Data Sources and Methods', description: 'How Pogoda.kg works: forecast data from Open-Meteo, ERA5 climate averages, the automated daily briefing, the limits of mountain forecasts and how to report a mistake.' },
        RU: { title: 'О Pogoda.kg: источники данных и методы', description: 'Как работает Pogoda.kg: прогнозы Open-Meteo, климатические данные ERA5, автоматическая ежедневная сводка, ограничения прогнозов в горах и как сообщить об ошибке.' },
        KG: { title: 'Pogoda.kg жөнүндө: маалымат булактары', description: 'Pogoda.kg кантип иштейт: Open-Meteo божомолдору, ERA5 климат маалыматы, автоматтык күнүмдүк сводка, тоолордогу божомолдун чектөөлөрү жана катаны кантип кабарлоо.' }
    },
    'privacy.html': {
        EN: { title: 'Privacy Policy' },
        RU: { title: 'Политика конфиденциальности', description: 'Ознакомьтесь с Политикой конфиденциальности Pogoda Kg: какие данные мы собираем, как их используем и как хранятся ваши настройки языка и города в браузере.' },
        KG: { title: 'Купуялык саясаты', description: 'Pogoda Kg кандай маалыматтарды чогултарын, аны кантип колдонорун жана тил менен шаар тандооңуз браузериңизде кантип сакталарын Купуялык саясатыбыздан билиңиз.' }
    },
    '404.html': {
        EN: { title: 'Page Not Found (404)' },
        RU: { title: 'Страница не найдена (404)', description: 'Страница погоды, которую вы ищете, не существует на сайте Pogoda Kg. Вернитесь на главную страницу, чтобы увидеть последний прогноз погоды по Кыргызстану.' },
        KG: { title: 'Барак табылган жок (404)', description: 'Сиз издеген аба ырайы барагы Pogoda Kg сайтында такыр эле табылган жок. Кыргызстандын акыркы күндөлүк аба ырайы божомолун көрүү үчүн башкы бетке кайтыңыз.' }
    },
    'faq.html': {
        EN: { title: 'Kyrgyzstan Weather FAQ: Climate Questions', description: "Answers about Kyrgyzstan's weather and climate: general questions, weather in each of the 17 cities we cover, and how Pogoda.kg's forecasts work." },
        RU: { title: 'Вопросы о погоде и климате Кыргызстана', description: 'Ответы о погоде и климате Кыргызстана: общие вопросы, погода в каждом из 17 городов на сайте, а также о том, как работают прогнозы Pogoda.kg.' },
        KG: { title: 'Кыргызстандын аба ырайы боюнча суроо-жооптор', description: 'Кыргызстандын аба ырайы жана климаты тууралуу жооптор: жалпы суроолор, сайттагы 17 шаардын ар биринин аба ырайы, ошондой эле Pogoda.kg божомолдору кантип иштээри.' }
    },
    'passes.html': {
        EN: { title: 'Kyrgyzstan Mountain Pass Weather and Roads', description: 'Mountain pass weather for Too-Ashuu, Ala-Bel, Dolon, Otmek and Tuz-Bel with temperature, wind, visibility and official road-status links before travel.' },
        RU: { title: 'Погода на перевалах Кыргызстана и дороги', description: 'Погода на перевалах Төө-Ашуу, Ала-Бел, Долон, Өтмөк и Түз-Бел. Перед поездкой проверьте официальную проезжаемость.' },
        KG: { title: 'Кыргызстандын тоо ашууларындагы аба ырайы', description: 'Төө-Ашуу, Ала-Бел, Долон, Өтмөк жана Түз-Бел ашууларындагы аба ырайы. Жолго чыгардан мурун расмий өтүү маалыматын текшериңиз.' }
    },
    'daily.html': {
        EN: { title: 'Kyrgyzstan Weather Today: Daily Briefing', description: 'Kyrgyzstan weather today for all 17 cities: highs and lows for today and tomorrow, rain chances, and the latest daily forecast articles. Updated every morning.' },
        RU: { title: 'Погода в Кыргызстане сегодня: сводка', description: 'Погода в Кыргызстане сегодня для всех 17 городов: температура сегодня и завтра, вероятность осадков и последние ежедневные прогнозы. Обновляется каждое утро.' },
        KG: { title: 'Кыргызстандагы аба ырайы бүгүн: кыскача сереп', description: 'Кыргызстандын 17 шаарындагы бүгүнкү аба ырайы: бүгүн жана эртең үчүн температура, жаан-чачын ыктымалдыгы жана акыркы күнүмдүк божомолдор. Ар күнү эртең менен жаңыланат.' }
    }
};

const BRAND_SUFFIX_RE = /\s*[|—–-]\s*Pogoda[\s.]?kg\b.*$/i;
const TITLE_CORE_MAX = 48;
const DANGLING_WORD_RE = /\s+(?:and|or|but|of|for|in|on|at|by|to|from|with|into|through|toward|towards|the|a|жана|менен|же|үчүн|и|а|но|в|на|для|по|с|о|к|от|до)$/i;

// One template for every page: "<core> | Pogoda.kg", at most 60 characters. Any
// brand variant already in the source ("| Pogoda Kg", "— Pogoda.kg сайты") is
// dropped first. A long core is shortened without cutting a phrase in half: at its
// own ":" / "—" / "," break when that keeps enough of it, else kept whole without
// the brand if it fits in 60, and only then cut at a word.
function fitSeoTitle(title) {
    const brand = ' | Pogoda.kg';
    const core = title.replace(BRAND_SUFFIX_RE, '').trim();
    if (core.length <= TITLE_CORE_MAX) return core + brand;

    // A dash followed by a number is a date range ("26-сентябрь — 2-октябрь"), not a break.
    const breaks = [...core.matchAll(/(?::|\s[—–-](?=\s\D)|,)\s/g)].map(m => m.index).filter(i => i <= TITLE_CORE_MAX);
    const atBreak = breaks.length ? core.slice(0, breaks[breaks.length - 1]).trim() : '';
    if (atBreak.length >= 30) return atBreak + brand;
    if (core.length <= TITLE_CORE_MAX + brand.length) return core;
    if (atBreak.length >= 20) return atBreak + brand;

    let cut = trimAtWord(core, TITLE_CORE_MAX), previous;
    do { previous = cut; cut = cut.replace(/[\s,:;—–|-]+$/, '').replace(DANGLING_WORD_RE, ''); } while (cut !== previous);
    return cut + brand;
}

function fitSeoDescription(description, lang) {
    const ending = {
        EN: ' Check current conditions before planning.',
        RU: ' Данные помогут заранее спланировать поездку и день.',
        KG: ' Маалымат сапарды жана күнүңүздү алдын ала пландаштырууга жардам берет.'
    }[lang] || '';
    let result = description;
    while (result.length < 150) result += ending;
    return trimAtWord(result, 160);
}

function normaliseMeta(meta, lang) {
    return { title: fitSeoTitle(meta.title), description: meta.description && fitSeoDescription(meta.description, lang) };
}

const escAttr = value => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Writes <title>, meta description and their og:/twitter: copies.
function withHeadMeta(html, { title, description }) {
    let out = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
        .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escAttr(title)}">`)
        .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escAttr(title)}">`);
    if (description) {
        out = out.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escAttr(description)}">`)
            .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escAttr(description)}">`)
            .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escAttr(description)}">`);
    }
    return out;
}

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
    'talas':       { nom: 'Талас',       prep: 'Таласе' },
    'batken':      { nom: 'Баткен',      prep: 'Баткене' },
    'cholpon-ata': { nom: 'Чолпон-Ата',  prep: 'Чолпон-Ате' },
    'kant':        { nom: 'Кант',        prep: 'Канте' },
    'kemin':       { nom: 'Кемин',       prep: 'Кемине' },
    'kyzyl-kiya':  { nom: 'Кызыл-Кия',   prep: 'Кызыл-Кие' },
    'toktogul':    { nom: 'Токтогул',    prep: 'Токтогуле' },
    'razzakov':    { nom: 'Раззаков',    prep: 'Раззакове' }
};

function ruCity(city) {
    return RU_CITY_FORMS[city.id] || { nom: city.nativeName || city.name, prep: city.nativeName || city.name };
}

function cityDisplayName(lang, city) {
    if (lang === 'RU') return ruCity(city).nom;
    if (lang === 'KG') return city.nativeName || city.name;
    return city.name;
}

// Auto-generated daily forecast posts ("daily-weather-forecast-kyrgyzstan-YYYY-MM-DD").
// Every post is indexable; daily posts get previous/next-day and city links so they
// read as one linked series rather than isolated pages.
const DAILY_POST_RE = /^daily-weather-forecast-kyrgyzstan-(\d{4}-\d{2}-\d{2})$/;
const DAILY_SLUGS = BLOG_POSTS.map(post => post.slug).filter(slug => DAILY_POST_RE.test(slug)).sort();
const KG_MONTHS = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

const PAGE_SLUGS = new Set(fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.html') && f !== 'index.html' && f !== '404.html').map(f => f.replace('.html', '')));
const CITY_IDS = new Set(CITIES.map(city => city.id));

// "/map" -> "/ru/map", "/" -> "/ru/", "/blog/x" -> "/ru/blog/x" (KG has no prefix).
function langUrl(lang, basePath) {
    const prefix = LANG_PREFIXES[lang];
    return basePath === '/' ? `${prefix}/` : `${prefix}${basePath}`;
}

// Points an internal <a href> straight at its final clean URL in the page's own
// language: "index.html" -> "/", "blog.html" -> "/ru/blog", "/blog/x.html" ->
// "/en/blog/x". Source templates link to *.html, which 308-redirects (audit H2),
// and /ru/ and /en/ pages linked to the Kyrgyz versions (audit check 10).
function localiseHref(href, lang, baseDir) {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)) return href;
    const [, rawPath, suffix] = href.match(/^([^?#]*)(.*)$/);
    if (!rawPath) return href;
    let p = rawPath.startsWith('/') ? rawPath : baseDir + rawPath.replace(/^\.\//, '');
    p = p.replace(/^\/(?:en|ru|kg)(?=\/|$)/, '') || '/';
    p = p.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
    if (p === '/') return langUrl(lang, '/') + suffix;
    const post = p.match(/^\/blog\/([^/]+)$/);
    if (post) return langUrl(lang, `/blog/${post[1]}`) + suffix;
    const segment = p.slice(1);
    if (PAGE_SLUGS.has(segment) || CITY_IDS.has(segment)) return langUrl(lang, p) + suffix;
    return p + suffix;
}

// Everything every generated page needs once its own content is in place.
function finalisePage(html, lang, basePath, baseDir = '/') {
    let out = html.replace(/(<a\b[^>]*?\shref=")([^"]*)(")/g, (m, open, href, close) => open + localiseHref(href, lang, baseDir) + close);

    // EN / KG / RU as real links to this page in each language, so crawlers can
    // reach the /ru/ and /en/ versions (audit C1). i18n.js still saves the choice.
    out = out.replace(/<button class="lang-btn" data-lang="(EN|KG|RU)">\1<\/button>/g, (m, code) =>
        `<a class="lang-btn" data-lang="${code}" href="${langUrl(code, basePath)}" hreflang="${LANG_CODES[code]}">${code}</a>`);

    // Search boxes had only a placeholder, which screen readers don't reliably announce.
    out = out.replace(/<input\b(?![^>]*aria-label)([^>]*?)\splaceholder="([^"]*)"/g, (m, attrs, text) => `<input${attrs} placeholder="${text}" aria-label="${text}"`);

    // Every city page linked from every page (8 of 17 were linked nowhere — audit C1).
    const cityLinks = CITIES.map(city =>
        `<li><a href="${langUrl(lang, `/${city.id}`)}" class="footer-city-link" data-city-id="${city.id}">${cityDisplayName(lang, city)}</a></li>`).join('\n          ');
    out = out.replace(/<ul[^>]*>(\s*<li><a href="[^"]*" class="footer-city-link"[\s\S]*?)<\/ul>/, `<ul class="footer-city-list">\n          ${cityLinks}\n        </ul>`);

    // Cloudflare Email Obfuscation rewrites the address into a /cdn-cgi/l/email-protection
    // link that 404s (audit H2); these comments opt the page out of it.
    out = out.replace(/<body([^>]*)>/, '<body$1>\n<!--email_off-->').replace(/<\/body>/, '<!--/email_off-->\n</body>');

    // About page in every footer's navigation list (audit H3: who runs the site and how).
    const footerAt = out.indexOf('<footer');
    if (footerAt !== -1 && !out.includes('data-i18n="nav_about"')) {
        const footer = out.slice(footerAt).replace(/(\s*)(<li><a href="[^"]*" data-i18n="nav_contact">)/,
            (m, space, contact) => `${space}<li><a href="${langUrl(lang, '/about')}" data-i18n="nav_about">${TRANSLATIONS[lang].nav_about}</a></li>${space}${contact}`);
        out = out.slice(0, footerAt) + footer;
    }

    // Generated photos are served as WebP (~50% smaller, audit L1); the JPEGs stay
    // only for og:image / JSON-LD, where some social networks still expect JPEG.
    out = out.replace(/((?:src|href)="|url\(')([^"')]*\/images\/generated\/[^"')]+)\.jpg(?=["'])/g, '$1$2.webp');

    return out.replace(/"https:\/\/pogoda\.kg\/assets\/favicon\.svg"/g, '"https://pogoda.kg/assets/apple-touch-icon.png"');
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
            title: `Погода в ${ru.prep} сегодня, на неделю | Pogoda.kg`,
            description: `Прогноз погоды в ${ru.prep}, Киргизия: температура сейчас, почасовой прогноз, погода на завтра, на неделю. Обновляется каждые 15 минут.`
        };
    }
    // KG
    return {
        title: `${native} аба ырайы бүгүн жана 7 күндүк божомол | Pogoda.kg`,
        description: `${native} шаары үчүн азыркы аба ырайынын божомолу: температура, шамал, нымдуулук жана 7 күндүк божомолдор ар 15 мүнөт сайын автоматтык жаңыртылат.`
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
            weeklyDesc: `See how the week ahead looks in ${en} — daily highs and lows, conditions, and precipitation chances for the next 7 days.`
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
            weeklyDesc: `Узнайте, какой будет неделя в ${ru.prep}: дневные температуры, погодные условия и вероятность осадков на ближайшие 7 дней.`
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
      <a class="news-card${isFeatured ? ' news-card-featured' : ''}" href="/blog/${post.slug}">
        <img src="${post.image}" alt="${data.title}" class="news-card-img" loading="lazy" width="1536" height="1024">
        <div class="news-card-overlay">
          <h3 class="news-title">${data.title}</h3>
          ${isFeatured ? `<p style="font-size:14px; margin-bottom:12px; opacity:0.9; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">${data.excerpt}</p>` : ''}
          <div class="news-meta">
            <span><svg class="icon"><use href="#icon-user"></use></svg> ${data.author}</span>
            <span><svg class="icon"><use href="#icon-${isFeatured ? 'clock' : 'calendar'}"></use></svg> ${data.date}</span>
          </div>
        </div>
      </a>`;
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

// Inserts content before a marker that must occur exactly once (fails the build otherwise).
function insertBefore(html, marker, content) {
    if (html.split(marker).length !== 2) throw new Error(`insertBefore: expected one "${marker.trim()}"`);
    return html.replace(marker, () => content + marker);
}

function fillById(html, id, content) {
    return html.replace(new RegExp(`(<([a-z0-9]+)\\b[^>]*\\sid="${id}"[^>]*>)[\\s\\S]*?(</\\2>)`), (m, open, tag, close) => open + content + close);
}

// Mirrors formatUpdatedAt() in daily-briefing.js.
function formatBriefingTime(value, lang) {
    const date = new Date(value);
    const time = new Intl.DateTimeFormat(lang === 'RU' ? 'ru-RU' : 'en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bishkek' }).format(date);
    if (lang === 'KG') {
        const months = ['янв.', 'фев.', 'март', 'апр.', 'май', 'июнь', 'июль', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'];
        const [y, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bishkek' }).format(date).split('-').map(Number);
        return `${d}-${months[m - 1]} ${y}-ж., ${time}`;
    }
    return new Intl.DateTimeFormat(lang === 'RU' ? 'ru-RU' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Bishkek' }).format(date);
}

// Server-rendered /daily: the same cards daily-briefing.js draws, from the same
// morning data file, so the page has its content without JavaScript.
function renderDailyPage(html, lang) {
    const t = DAILY_COPY[lang] || DAILY_COPY.KG;
    const index = { EN: 0, RU: 1, KG: 2 }[lang];
    let out = fillById(html, 'briefingKicker', t.kicker);
    out = fillById(out, 'briefingTitle', t.title);
    out = fillById(out, 'briefingIntro', t.intro);
    out = fillById(out, 'briefingSource', t.source);
    if (!DAILY_BRIEFING.generatedAt || !DAILY_BRIEFING.cities.length) return fillById(out, 'briefingStatus', t.empty);
    out = fillById(out, 'briefingStatus', `${t.updated}: ${formatBriefingTime(DAILY_BRIEFING.generatedAt, lang)} (UTC+6)`);
    const cards = DAILY_BRIEFING.cities.map(city => {
        const name = lang === 'EN' ? city.en : lang === 'RU' ? city.ru : city.kg;
        const condition = (DAILY_CONDITIONS[city.code] || ['Unknown', 'Нет данных', 'Белгисиз'])[index];
        return `<article class="travel-card"><h2>${name}</h2><p class="travel-weather">${city.temp > 0 ? '+' : ''}${city.temp}° · ${condition}</p><p>${t.high}: ${city.high}° · ${t.low}: ${city.low}°</p><p>${t.rain}: ${city.precip}%</p><a class="btn-primary" href="/${city.id}">${t.live}</a></article>`;
    }).join('');
    return fillById(out, 'briefingGrid', cards);
}

const SNAPSHOT_NOTE = {
    EN: time => `Forecast issued ${time} (UTC+6), Open-Meteo data. Live values load in your browser.`,
    RU: time => `Прогноз от ${time} (UTC+6), данные Open-Meteo. Актуальные значения загружаются в браузере.`,
    KG: time => `Божомол ${time} (UTC+6) берилген, Open-Meteo маалыматы. Учурдагы маанилер браузерде жүктөлөт.`
};

// The city's 7-day forecast from the morning snapshot, in the same pills app.js
// draws (audit C2: the forecast was only in the page after JavaScript ran). Days
// are labelled with their date, not "Today", because the page is built once a day.
function withWeeklySnapshot(html, lang, cityId) {
    const days = FORECAST_SNAPSHOT && FORECAST_SNAPSHOT.cities[cityId];
    if (!days) return html;
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bishkek' }).format(new Date());
    const upcoming = days.filter(day => day.date >= today);
    if (upcoming.length < 3) return html;
    const locale = { KG: 'ky-KG', RU: 'ru-RU', EN: 'en-GB' }[lang];
    const pills = upcoming.map(day => {
        const label = new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${day.date}T12:00:00Z`));
        const icon = (WMO_WEATHER_CODES[day.code] || {}).svg || '';
        const precip = day.precip > 20 ? `<div style="color:#00c6ff; font-size:10px; margin-top:-10px; margin-bottom:5px;">💧 ${day.precip}%</div>` : '';
        return `<div class="ten-day-pill"><div class="ten-day-day">${label}</div><div class="ten-day-divider"></div><div class="ten-day-icon">${icon}</div>${precip}<div class="ten-day-temp">${day.max}° / ${day.min}°</div></div>`;
    }).join('');
    const note = `<p class="section-desc" id="weeklySnapshotNote" style="font-size:13px; margin-top:12px;">${SNAPSHOT_NOTE[lang](formatBriefingTime(FORECAST_SNAPSHOT.generatedAt, lang))}</p>`;
    return html.replace('<div id="weeklyForecastContainer" class="ten-day-forecast-container"></div>',
        () => `<div id="weeklyForecastContainer" class="ten-day-forecast-container">${pills}</div>\n    ${note}`);
}

// ---- Server-rendered content blocks from the morning snapshot and climate data ----
const CLIMATE_PATH = path.join(SRC_DIR, 'data', 'climate-normals.json');
const CLIMATE = fs.existsSync(CLIMATE_PATH) ? JSON.parse(fs.readFileSync(CLIMATE_PATH, 'utf8')) : null;
const MONTH_NAMES = {
    EN: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    RU: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    KG: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
};
const signedTemp = (value, lang, decimals = 0) => {
    const text = `${value > 0 ? '+' : ''}${value.toFixed(decimals)}`;
    return lang === 'EN' ? text : text.replace('.', ',');
};
const localElevation = (elevation, lang) => lang === 'EN' ? elevation : elevation.replace(',', ' ').replace(/ m$/, ' м');
const conditionLabel = (lang, code) => TRANSLATIONS[lang][(WMO_WEATHER_CODES[code] || {}).labelKey] || '';
const WIND_UNIT = { EN: 'km/h', RU: 'км/ч', KG: 'км/саат' };
// "22 November" / "22 ноября" / "22-ноябрь" for an ISO date.
function dayMonth(lang, iso) {
    if (lang === 'KG') return `${Number(iso.slice(8))}-${KG_MONTHS[Number(iso.slice(5, 7)) - 1]}`;
    return new Intl.DateTimeFormat(lang === 'RU' ? 'ru-RU' : 'en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
}
function bishkekToday() {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bishkek' }).format(new Date());
}
// The snapshot day to show as "today": today's entry if present, else the first one.
function snapshotDay(days) {
    if (!days || !days.length) return null;
    const today = bishkekToday();
    return days.find(day => day.date === today) || days.find(day => day.date > today) || null;
}

const CLIMATE_COPY = {
    EN: {
        title: city => `Climate in ${city.name}: average temperatures by month`,
        facts: f => `${f.name} lies in ${f.region} at about ${f.elev} above sea level (${f.lat}° N, ${f.lon}° E). In ${f.period} its warmest month was ${f.warm}, with an average daytime high of ${f.warmMax}°C, and its coldest was ${f.cold}, with an average night-time low of ${f.coldMin}°C.`,
        cols: ['Month', 'Average high', 'Average low'],
        source: f => `Averages of daily highs and lows for ${f.period} from the ERA5 reanalysis (Open-Meteo historical weather API), for the model grid cell around ${f.name}. That cell's average elevation is ${f.grid} m, so values can differ slightly from a local weather station.`
    },
    RU: {
        title: city => `Климат в ${ruCity(city).prep}: средняя температура по месяцам`,
        facts: f => `Город ${f.name} (${f.region}) расположен на высоте около ${f.elev} над уровнем моря (${f.lat}° с. ш., ${f.lon}° в. д.). В ${f.period} годах самым тёплым месяцем был ${f.warm.toLowerCase()} — средний дневной максимум ${f.warmMax}°C, самым холодным — ${f.cold.toLowerCase()} со средним ночным минимумом ${f.coldMin}°C.`,
        cols: ['Месяц', 'Средний максимум', 'Средний минимум'],
        source: f => `Средние за ${f.period} годы значения дневных максимумов и ночных минимумов по данным реанализа ERA5 (исторический API Open-Meteo) для ячейки модели вокруг города. Средняя высота ячейки — ${f.grid} м, поэтому значения могут немного отличаться от показаний местной метеостанции.`
    },
    KG: {
        title: city => `${city.nativeName || city.name}: климат жана айлар боюнча орточо температура`,
        facts: f => `${f.name} (${f.region}) деңиз деңгээлинен болжол менен ${f.elev} бийиктикте жайгашкан (${f.lat}° т. к., ${f.lon}° ч. у.). ${f.period}-жылдары эң жылуу ай ${f.warm.toLowerCase()} болгон — орточо күндүзгү максимум ${f.warmMax}°C, эң суук ай ${f.cold.toLowerCase()} — орточо түнкү минимум ${f.coldMin}°C.`,
        cols: ['Ай', 'Орточо максимум', 'Орточо минимум'],
        source: f => `${f.period}-жылдардагы күндүзгү максимум жана түнкү минимум температуранын орточо маанилери, ERA5 реанализи боюнча (Open-Meteo тарыхый API), шаардын тегерегиндеги модель торчосу үчүн. Торчонун орточо бийиктиги — ${f.grid} м, ошондуктан маанилер жергиликтүү метеостанциянын көрсөткүчтөрүнөн бир аз айырмаланышы мүмкүн.`
    }
};

// Monthly climate table for a city page (audit M4: unique, factual content per city).
function cityClimateSection(lang, city) {
    const data = CLIMATE && CLIMATE.cities[city.id];
    if (!data) return '';
    const t = CLIMATE_COPY[lang], months = data.months;
    const warm = months.reduce((best, m, i) => (m.max > months[best].max ? i : best), 0);
    const cold = months.reduce((best, m, i) => (m.min < months[best].min ? i : best), 0);
    const f = {
        name: cityDisplayName(lang, city), region: TRANSLATIONS[lang][`region_${city.regionKey}`],
        elev: localElevation(city.elevation, lang), lat: city.lat.toFixed(2), lon: city.lon.toFixed(2),
        period: CLIMATE.period, grid: data.gridElevation,
        warm: MONTH_NAMES[lang][warm], warmMax: signedTemp(months[warm].max, lang, 1),
        cold: MONTH_NAMES[lang][cold], coldMin: signedTemp(months[cold].min, lang, 1)
    };
    const rows = months.map((m, i) => `<tr><th scope="row">${MONTH_NAMES[lang][i]}</th><td>${signedTemp(m.max, lang, 1)}°C</td><td>${signedTemp(m.min, lang, 1)}°C</td></tr>`).join('');
    return `<section class="section-wrapper defer-render city-climate">
    <div class="section-header"><h2 class="section-title">${t.title(city)}</h2></div>
    <p class="section-desc">${t.facts(f)}</p>
    <div class="table-scroll"><table class="forecast-table"><thead><tr>${t.cols.map(c => `<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>
    <p class="section-desc table-source">${t.source(f)}</p>
  </section>

  `;
}

const MAP_COPY = {
    EN: { title: 'Forecast by region', intro: d => `Forecast highs and lows for ${d} for every city on the map, grouped by region. Open a city for its hourly and 7-day forecast.`, how: 'Each marker shows the current temperature, loaded from Open-Meteo and refreshed every 15 minutes while the page is open. Tap a marker for wind and a link to the full city forecast.' },
    RU: { title: 'Прогноз по областям', intro: d => `Прогноз максимальной и минимальной температуры на ${d} для всех городов на карте, по областям. Откройте город, чтобы посмотреть почасовой прогноз и прогноз на 7 дней.`, how: 'Каждая отметка показывает текущую температуру по данным Open-Meteo; пока страница открыта, данные обновляются каждые 15 минут. Нажмите на отметку, чтобы увидеть ветер и ссылку на полный прогноз города.' },
    KG: { title: 'Облустар боюнча божомол', intro: d => `Картадагы бардык шаарлар үчүн ${d} күнкү эң жогорку жана эң төмөнкү температура, облустар боюнча. Сааттык жана 7 күндүк божомолду көрүү үчүн шаарды ачыңыз.`, how: 'Ар бир белги Open-Meteo маалыматы боюнча учурдагы температураны көрсөтөт; барак ачык турганда маалымат ар 15 мүнөттө жаңыланат. Шамалды жана шаардын толук божомолуна шилтемени көрүү үчүн белгини басыңыз.' }
};
const REGION_ORDER = ['chuy', 'issykkul', 'naryn', 'talas', 'jalalabad', 'osh', 'batken'];

// /map: every city's forecast for today as text, grouped by region (the map itself
// is a JavaScript widget, so the page had ~110 words of HTML content).
function renderMapCityList(lang) {
    const t = MAP_COPY[lang];
    const first = FORECAST_SNAPSHOT && snapshotDay(FORECAST_SNAPSHOT.cities.bishkek);
    if (!first) return '';
    const groups = REGION_ORDER.map(key => {
        const items = CITIES.filter(city => city.regionKey === key).map(city => {
            const day = snapshotDay(FORECAST_SNAPSHOT.cities[city.id]);
            const weather = day ? `: ${signedTemp(day.max, lang)}° / ${signedTemp(day.min, lang)}°, ${conditionLabel(lang, day.code).toLowerCase()}` : '';
            return `<li><a href="${langUrl(lang, `/${city.id}`)}">${cityDisplayName(lang, city)}</a>${weather}</li>`;
        }).join('');
        return items ? `<div class="region-group"><h3>${TRANSLATIONS[lang][`region_${key}`]}</h3><ul>${items}</ul></div>` : '';
    }).join('');
    return `
    <section class="map-city-forecast">
      <h2 class="section-title">${t.title}</h2>
      <p class="section-desc">${t.intro(dayMonth(lang, first.date))}</p>
      <div class="region-groups">${groups}</div>
      <p class="section-desc table-source">${t.how}</p>
    </section>`;
}

const DAILY_TABLE_COPY = {
    EN: { title: 'All 17 cities: today and tomorrow', cols: ['City', 'Region', 'Today', 'Tomorrow', 'Rain chance today'], recent: 'Recent daily forecasts' },
    RU: { title: 'Все 17 городов: сегодня и завтра', cols: ['Город', 'Область', 'Сегодня', 'Завтра', 'Осадки сегодня'], recent: 'Последние ежедневные прогнозы' },
    KG: { title: '17 шаардын баары: бүгүн жана эртең', cols: ['Шаар', 'Облус', 'Бүгүн', 'Эртең', 'Бүгүн жаан-чачын'], recent: 'Акыркы күнүмдүк божомолдор' }
};

// /daily: a 17-city table from the morning snapshot, and links to the latest daily posts.
function renderDailyExtras(lang) {
    const t = DAILY_TABLE_COPY[lang];
    let table = '';
    if (FORECAST_SNAPSHOT) {
        const rows = CITIES.map(city => {
            const days = FORECAST_SNAPSHOT.cities[city.id] || [];
            const day = snapshotDay(days);
            if (!day) return '';
            const next = days[days.indexOf(day) + 1];
            const range = d => d ? `${signedTemp(d.max, lang)}° / ${signedTemp(d.min, lang)}°` : '—';
            return `<tr><th scope="row"><a href="${langUrl(lang, `/${city.id}`)}">${cityDisplayName(lang, city)}</a></th><td>${TRANSLATIONS[lang][`region_${city.regionKey}`]}</td><td>${range(day)}, ${conditionLabel(lang, day.code).toLowerCase()}</td><td>${range(next)}</td><td>${day.precip ?? 0}%</td></tr>`;
        }).join('');
        if (rows) table = `<h2 class="section-title">${t.title}</h2><div class="table-scroll"><table class="forecast-table"><thead><tr>${t.cols.map(c => `<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
    }
    const recent = DAILY_SLUGS.slice(-7).reverse().map(slug => {
        const date = slug.match(DAILY_POST_RE)[1];
        return `<li><a href="${langUrl(lang, `/blog/${slug}`)}">${dayMonth(lang, date)} ${date.slice(0, 4)}</a></li>`;
    }).join('');
    return `${table}<h2 class="section-title">${t.recent}</h2><ul class="recent-daily-list">${recent}</ul>`;
}

const PASS_OUTLOOK_COPY = {
    EN: { title: '3-day forecast for the passes', cols: ['Pass', 'Day', 'High / low', 'Snow', 'Wind', 'Precipitation chance'], why: 'Air cools by roughly 6.5°C for every 1,000 m of height, so a pass at 3,200 m is often around 15°C colder than Bishkek at 800 m, and snow can fall there when it rains in the valleys.', grid: (list) => `Forecasts are for the weather model's grid cell around each pass. Those cells sit lower than the passes themselves (${list}), so the real temperature at the top is often a few degrees colder than shown.`, none: '—' },
    RU: { title: 'Прогноз на 3 дня для перевалов', cols: ['Перевал', 'День', 'Макс. / мин.', 'Снег', 'Ветер', 'Вероятность осадков'], why: 'С каждой тысячей метров высоты воздух в среднем холоднее примерно на 6,5°C, поэтому на перевале высотой 3200 м часто на 15°C холоднее, чем в Бишкеке на высоте 800 м, и там может идти снег, когда в долинах дождь.', grid: (list) => `Прогноз дан для ячейки погодной модели вокруг каждого перевала. Эти ячейки ниже самих перевалов (${list}), поэтому на самом перевале обычно на несколько градусов холоднее, чем указано.`, none: '—' },
    KG: { title: 'Ашуулар үчүн 3 күндүк божомол', cols: ['Ашуу', 'Күн', 'Макс. / мин.', 'Кар', 'Шамал', 'Жаан-чачын ыктымалдыгы'], why: 'Ар бир 1000 метр бийиктикте аба орточо эсеп менен 6,5°C га суук болот, ошондуктан 3200 м бийиктиктеги ашуу 800 м бийиктиктеги Бишкекке караганда көбүнчө 15°C чамасында суук болот жана өрөөндөрдө жамгыр жааганда ал жерде кар жаашы мүмкүн.', grid: (list) => `Божомол ар бир ашуунун тегерегиндеги аба ырайы моделинин торчосу үчүн берилген. Бул торчолор ашуулардын өзүнөн төмөн жайгашкан (${list}), ошондуктан ашуунун үстүндө көрсөтүлгөндөн бир нече градус суук болушу мүмкүн.`, none: '—' }
};

// /passes: 3-day outlook per pass from the morning snapshot, plus why passes are colder.
function renderPassOutlook(lang) {
    const passes = FORECAST_SNAPSHOT && FORECAST_SNAPSHOT.passes;
    if (!passes) return '';
    const t = PASS_OUTLOOK_COPY[lang], today = bishkekToday();
    const cm = lang === 'EN' ? 'cm' : 'см';
    const rows = KYRGYZSTAN_PASSES.map(pass => {
        const entry = passes[pass.id];
        if (!entry) return '';
        const name = lang === 'EN' ? pass.en : lang === 'RU' ? pass.ru : pass.name;
        const days = entry.days.filter(day => day.date >= today);
        return days.map((day, i) => `<tr>${i === 0 ? `<th scope="rowgroup" rowspan="${days.length}">${name}</th>` : ''}<td>${dayMonth(lang, day.date)}</td><td>${signedTemp(day.max, lang)}° / ${signedTemp(day.min, lang)}°</td><td>${day.snowCm >= 0.5 ? `${String(day.snowCm).replace('.', lang === 'EN' ? '.' : ',')} ${cm}` : t.none}</td><td>${day.wind} ${WIND_UNIT[lang]}</td><td>${day.precip ?? 0}%</td></tr>`).join('');
    }).join('');
    if (!rows) return '';
    const gridList = KYRGYZSTAN_PASSES.filter(pass => passes[pass.id]).map(pass => `${lang === 'EN' ? pass.en : lang === 'RU' ? pass.ru : pass.name}: ${localElevation(pass.elevation, lang)} → ${passes[pass.id].gridElevation} ${lang === 'EN' ? 'm' : 'м'}`).join('; ');
    return `<h2 class="section-title">${t.title}</h2><div class="table-scroll"><table class="forecast-table"><thead><tr>${t.cols.map(c => `<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div><p class="safety-note">${t.why}</p><p class="safety-note table-source">${t.grid(gridList)}</p>`;
}

const ABOUT_COPY = {
    EN: {
        h1: 'About Pogoda.kg',
        body: `<p>Pogoda.kg publishes weather forecasts for 17 cities and towns in Kyrgyzstan in Kyrgyz, Russian and English: current conditions, an hourly forecast and a 7-day outlook for each city, a <a href="/daily">daily national briefing</a>, <a href="/passes">mountain pass weather</a>, a <a href="/map">weather map</a> and <a href="/blog">articles</a> about the country's weather and climate.</p>
<h2>Where the forecasts come from</h2>
<p>Forecasts come from <a href="https://open-meteo.com/" rel="noopener">Open-Meteo</a>, which combines numerical weather models run by national and international weather services, such as ECMWF, DWD (Germany) and NOAA (USA). Your browser requests the forecast for each city's coordinates and refreshes it every 15 minutes while the page is open.</p>
<p>The monthly climate tables on city pages are averages for 2016–2025 from the ERA5 reanalysis, taken from Open-Meteo's historical weather API.</p>
<h2>How the daily briefing and articles are made</h2>
<p>Every morning at 09:20 Bishkek time an automated job collects the forecast for all 17 cities. It updates the <a href="/daily">daily briefing</a> and publishes a dated forecast article built from those figures: the day's warmest and coldest places, the change since yesterday and a two-day outlook. Longer guides and seasonal articles are written by the Pogoda Weather Team from the same data.</p>
<h2>Limits of the forecasts</h2>
<p>A forecast is a model estimate, not a measurement. In the mountains the model's grid can sit several hundred metres below a pass or a high valley, so temperatures there may be colder than shown. Pogoda.kg does not issue official warnings or road closures: for severe-weather warnings follow Kyrgyzhydromet and the Ministry of Emergency Situations, and for road conditions the <a href="${OFFICIAL_ROAD_STATUS_URL}" rel="noopener">Ministry of Transport</a>.</p>
<h2>Corrections and contact</h2>
<p>If you see a mistake on a forecast page or in an article, please tell us through the <a href="/contact">contact page</a>. Answers to common questions are on the <a href="/faq">FAQ page</a>.</p>`
    },
    RU: {
        h1: 'О проекте Pogoda.kg',
        body: `<p>Pogoda.kg публикует прогноз погоды для 17 городов Кыргызстана на кыргызском, русском и английском языках: погода сейчас, почасовой прогноз и прогноз на 7 дней для каждого города, <a href="/daily">ежедневная сводка по стране</a>, <a href="/passes">погода на перевалах</a>, <a href="/map">карта погоды</a> и <a href="/blog">статьи</a> о погоде и климате страны.</p>
<h2>Откуда берутся прогнозы</h2>
<p>Прогнозы предоставляет <a href="https://open-meteo.com/" rel="noopener">Open-Meteo</a>, который объединяет численные модели погоды национальных и международных метеослужб, например ECMWF, DWD (Германия) и NOAA (США). Браузер запрашивает прогноз по координатам каждого города и обновляет его каждые 15 минут, пока страница открыта.</p>
<p>Таблицы климата на страницах городов — средние значения за 2016–2025 годы по данным реанализа ERA5 из исторического API Open-Meteo.</p>
<h2>Как готовятся сводка и статьи</h2>
<p>Каждое утро в 09:20 по времени Бишкека автоматическая задача получает прогноз для всех 17 городов. Она обновляет <a href="/daily">ежедневную сводку</a> и публикует статью с прогнозом на дату: самые тёплые и холодные места, изменение по сравнению со вчерашним днём и прогноз на два дня. Подробные руководства и сезонные статьи пишет команда Pogoda Weather Team на основе тех же данных.</p>
<h2>Ограничения прогнозов</h2>
<p>Прогноз — это оценка модели, а не измерение. В горах ячейка модели может быть на несколько сотен метров ниже перевала или высокогорной долины, поэтому там бывает холоднее, чем указано. Pogoda.kg не выпускает официальных предупреждений и не сообщает о закрытии дорог: штормовые предупреждения публикуют Кыргызгидромет и Министерство чрезвычайных ситуаций, информацию о дорогах — <a href="${OFFICIAL_ROAD_STATUS_URL}" rel="noopener">Министерство транспорта</a>.</p>
<h2>Исправления и связь</h2>
<p>Если вы заметили ошибку в прогнозе или статье, сообщите нам через <a href="/contact">страницу контактов</a>. Ответы на частые вопросы — на <a href="/faq">странице FAQ</a>.</p>`
    },
    KG: {
        h1: 'Pogoda.kg жөнүндө',
        body: `<p>Pogoda.kg Кыргызстандын 17 шаары үчүн аба ырайы божомолун кыргыз, орус жана англис тилдеринде жарыялайт: ар бир шаар үчүн учурдагы аба ырайы, сааттык жана 7 күндүк божомол, <a href="/daily">өлкө боюнча күнүмдүк сводка</a>, <a href="/passes">тоо ашууларындагы аба ырайы</a>, <a href="/map">аба ырайы картасы</a> жана өлкөнүн аба ырайы менен климаты тууралуу <a href="/blog">макалалар</a>.</p>
<h2>Божомолдор кайдан алынат</h2>
<p>Божомолдорду <a href="https://open-meteo.com/" rel="noopener">Open-Meteo</a> берет. Ал улуттук жана эл аралык метеокызматтардын, мисалы ECMWF, DWD (Германия) жана NOAA (АКШ), сандык аба ырайы моделдерин бириктирет. Браузериңиз ар бир шаардын координаттары боюнча божомолду сурайт жана барак ачык турганда аны ар 15 мүнөттө жаңылайт.</p>
<p>Шаар барактарындагы климат таблицалары — Open-Meteo тарыхый API аркылуу алынган ERA5 реанализи боюнча 2016–2025-жылдардын орточо маанилери.</p>
<h2>Сводка жана макалалар кантип даярдалат</h2>
<p>Ар күнү эртең менен Бишкек убактысы менен саат 09:20да автоматтык тапшырма 17 шаардын баары үчүн божомолду алат. Ал <a href="/daily">күнүмдүк сводканы</a> жаңылайт жана ошол сандардан түзүлгөн датасы бар макаланы жарыялайт: күндүн эң жылуу жана эң суук жерлери, кечээ менен салыштырганда өзгөрүү жана эки күндүк божомол. Кеңири колдонмолорду жана мезгилдик макалаларды ошол эле маалыматтын негизинде Pogoda Weather Team жазат.</p>
<h2>Божомолдордун чектөөлөрү</h2>
<p>Божомол — моделдин баалоосу, өлчөө эмес. Тоолордо моделдин торчосу ашуудан же бийик өрөөндөн бир нече жүз метр төмөн болушу мүмкүн, ошондуктан ал жерде көрсөтүлгөндөн суук болушу ыктымал. Pogoda.kg расмий эскертүүлөрдү чыгарбайт жана жолдордун жабылышы тууралуу кабарлабайт: катаал аба ырайы боюнча эскертүүлөрдү Кыргызгидромет жана Өзгөчө кырдаалдар министрлиги, жолдор боюнча маалыматты <a href="${OFFICIAL_ROAD_STATUS_URL}" rel="noopener">Транспорт министрлиги</a> берет.</p>
<h2>Оңдоолор жана байланыш</h2>
<p>Божомолдо же макалада ката байкасаңыз, <a href="/contact">байланыш барагы</a> аркылуу кабарлаңыз. Көп берилүүчү суроолордун жооптору — <a href="/faq">FAQ барагында</a>.</p>`
    }
};

function renderAboutPage(html, lang) {
    const t = ABOUT_COPY[lang];
    return fillById(fillById(fillById(html, 'aboutTitle', t.h1), 'aboutCrumb', t.h1), 'aboutContent', `\n${t.body}\n  `);
}

// Server-rendered /passes: names, routes, elevations and the official road-status
// links. Weather values stay live in passes.js, which redraws the cards.
function renderPassesPage(html, lang) {
    const t = PASSES_COPY[lang] || PASSES_COPY.KG;
    let out = fillById(html, 'passesKicker', t.kicker);
    out = fillById(out, 'passesTitle', t.title);
    out = fillById(out, 'passesIntro', t.intro);
    out = fillById(out, 'passesSafety', t.safety);
    out = fillById(out, 'roadStatusLink', t.source).replace('id="roadStatusLink"', `id="roadStatusLink" href="${OFFICIAL_ROAD_STATUS_URL}"`);
    out = fillById(out, 'cameraLink', t.cameras).replace('id="cameraLink"', `id="cameraLink" href="${OFFICIAL_CAMERAS_URL}"`);
    const cards = KYRGYZSTAN_PASSES.map(pass => {
        const name = lang === 'EN' ? pass.en : lang === 'RU' ? pass.ru : pass.name;
        return `<article class="travel-card"><h2>${name}</h2><p class="travel-meta">${pass.route} · ${pass.elevation}</p></article>`;
    }).join('');
    return fillById(out, 'passesGrid', cards);
}

// Server-rendered /blog list (mirrors renderBlogPosts() in blog.js) so every post
// has a crawlable link — 83 of 88 were reachable only through JavaScript (audit C1).
function renderBlogListHTML(lang) {
    return BLOG_POSTS.map(post => {
        const data = post.translations[lang] || post.translations.EN;
        return `
      <a href="/blog/${post.slug}" style="text-decoration: none; color: inherit;">
        <div class="news-card" style="min-height: 220px;">
          <img src="${post.image}" alt="${escAttr(data.title)}" class="news-card-img" loading="lazy" width="1536" height="1024">
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
      </a>`;
    }).join('');
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
    
    // 3. Replace data-i18n-placeholder (swapping the source's English placeholder,
    // not adding a second one — browsers use the first of duplicate attributes)
    result = result.replace(/<(input|textarea)\b[^>]*\sdata-i18n-placeholder="([^"]+)"[^>]*>/g, (tag, name, key) => {
        if (!dict[key]) return tag;
        const withoutOld = tag.replace(/\splaceholder="[^"]*"/g, '');
        return withoutOld.replace(/\sdata-i18n-placeholder="/, ` placeholder="${dict[key]}" data-i18n-placeholder="`);
    });
    
    // 4. Fix Canonical Link
    result = result.replace(/<link rel="canonical" href="[^"]+">/, `<link rel="canonical" href="https://pogoda.kg${currentUrl}">`);
    result = result.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="https://pogoda.kg${currentUrl}">`);

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
        const rawPageMeta = PAGE_META[file] && PAGE_META[file][lang];
        if (rawPageMeta) translated = withHeadMeta(translated, normaliseMeta(rawPageMeta, lang));

        if (file === 'daily.html') translated = renderDailyPage(translated, lang);
        if (file === 'passes.html') translated = renderPassesPage(translated, lang);
        if (file === 'daily.html') translated = insertBefore(translated, '<h2 class="section-title" data-i18n="daily_plan_title">', renderDailyExtras(lang));
        if (file === 'passes.html') translated = insertBefore(translated, '<h2 class="section-title" data-i18n="passes_before_title">', renderPassOutlook(lang));
        if (file === 'map.html') translated = insertBefore(translated, '\n  </main>', renderMapCityList(lang));
        if (file === 'about.html') translated = renderAboutPage(translated, lang);
        if (file === 'daily.html' || file === 'passes.html') {
            const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
                { '@type': 'ListItem', position: 1, name: dict.nav_home, item: `https://pogoda.kg${langUrl(lang, '/')}` },
                { '@type': 'ListItem', position: 2, name: dict[file === 'daily.html' ? 'nav_daily_briefing' : 'nav_mountain_passes'], item: `https://pogoda.kg${fullUrl}` }
            ] };
            translated = translated.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(crumbs)}</script>
</head>`);
        }
        if (file === 'blog.html') {
            translated = translated.replace('<div id="blogCardsGrid" class="blog-grid"></div>', `<div id="blogCardsGrid" class="blog-grid">${renderBlogListHTML(lang)}\n    </div>`);
            translated = translated.replace('"url": "https://pogoda.kg/blog"', `"url": "https://pogoda.kg${fullUrl}"`);
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
        // The homepage shows Bishkek, so it gets Bishkek's 7-day snapshot.
        let pageOutput = file === 'index.html'
            ? withWeeklySnapshot(withFAQ(translated, HOME_FAQ[lang] || HOME_FAQ.EN), lang, 'bishkek')
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
        fs.writeFileSync(outFilePath, finalisePage(pageOutput, lang, file === 'index.html' ? '/' : pageUrl));
        // The 404 page isn't a real, indexable page — don't submit it to Google via the sitemap.
        const pageSources = { 'daily.html': ['src/js/daily-briefing-data.js'], 'blog.html': ['src/js/blog-posts-data.js'], 'faq.html': ['src/js/faq-data.js'], 'index.html': ['src/js/faq-data.js'] };
        const contentDates = { 'daily.html': [isoDay(DAILY_BRIEFING.generatedAt)], 'index.html': [isoDay(FORECAST_SNAPSHOT && FORECAST_SNAPSHOT.generatedAt)] };
        if (file !== '404.html') sitemapUrls.push({ loc: fullUrl, sources: [`src/${file}`, ...(pageSources[file] || [])], dates: contentDates[file] || [] });

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
                cityHtml = withHeadMeta(cityHtml, normaliseMeta(getCityMeta(lang, city), lang));
                cityHtml = cityHtml.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="https://pogoda.kg${cityUrl}">`);

                // BreadcrumbList: Home > City (audit check 32).
                const breadcrumb = {
                    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
                    itemListElement: [
                        { '@type': 'ListItem', position: 1, name: dict.nav_home, item: `https://pogoda.kg${langUrl(lang, '/')}` },
                        { '@type': 'ListItem', position: 2, name: cityDisplayName(lang, city), item: `https://pogoda.kg${cityUrl}` }
                    ]
                };
                cityHtml = cityHtml.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>\n</head>`);

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
                cityHtml = withWeeklySnapshot(withFAQ(cityHtml, cityFaqList), lang, city.id);
                cityHtml = insertBefore(cityHtml, '<!-- Weather FAQ Section -->', cityClimateSection(lang, city));

                // Write city file
                const cityOutPath = path.join(OUT_DIR, prefix, `${city.id}.html`);
                fs.mkdirSync(path.dirname(cityOutPath), { recursive: true });
                fs.writeFileSync(cityOutPath, finalisePage(cityHtml, lang, `/${city.id}`));
                sitemapUrls.push({ loc: cityUrl, sources: ['src/index.html', 'src/js/faq-data.js'], dates: [isoDay(FORECAST_SNAPSHOT && FORECAST_SNAPSHOT.generatedAt)] });
            });
        }
    });
});

function trimAtWord(text, max) {
    if (text.length <= max) return text;
    const cut = text.slice(0, max + 1).replace(/\s+\S*$/, '').trim();
    return cut || text.slice(0, max).trim();
}

// Replaces everything between `<div ...>` (the first tag starting with openPrefix)
// and its matching </div>, counting nested divs.
function replaceDivInner(html, openPrefix, inner) {
    const start = html.indexOf(openPrefix);
    if (start === -1) throw new Error(`${openPrefix} not found`);
    const openEnd = html.indexOf('>', start) + 1;
    const tags = /<\/?div\b/g;
    tags.lastIndex = openEnd;
    let depth = 1, match;
    while ((match = tags.exec(html))) {
        depth += match[0] === '<div' ? 1 : -1;
        if (depth === 0) return html.slice(0, openEnd) + inner + html.slice(match.index);
    }
    throw new Error(`${openPrefix} has no closing </div>`);
}

function mustReplace(html, pattern, replacement, what, slug) {
    if (!pattern.test(html)) throw new Error(`Article ${slug}: could not find ${what}`);
    return html.replace(pattern, replacement);
}

const DAILY_SERIES_COPY = {
    KG: { heading: 'Башка күндөрдүн божомолу', prev: 'Мурунку күн', next: 'Кийинки күн', today: 'Бүгүнкү аба ырайы сводкасы', cities: 'Шаарлар боюнча 7 күндүк божомол' },
    RU: { heading: 'Прогнозы на другие дни', prev: 'Предыдущий день', next: 'Следующий день', today: 'Сводка погоды на сегодня', cities: 'Прогноз на 7 дней по городам' },
    EN: { heading: 'Forecasts for other days', prev: 'Previous day', next: 'Next day', today: "Today's weather briefing", cities: '7-day forecast by city' }
};

// Previous/next-day links, /daily and the 17 city pages under every daily post.
function dailySeriesNav(post, lang) {
    const i = DAILY_SLUGS.indexOf(post.slug);
    if (i === -1) return '';
    const t = DAILY_SERIES_COPY[lang];
    const dayLabel = slug => {
        const date = slug.match(DAILY_POST_RE)[1];
        if (lang === 'KG') return `${Number(date.slice(8))}-${KG_MONTHS[Number(date.slice(5, 7)) - 1]}`;
        return new Intl.DateTimeFormat({ RU: 'ru-RU', EN: 'en-GB' }[lang], { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
    };
    const links = [];
    if (i > 0) links.push(`<li>← ${t.prev}: <a href="${langUrl(lang, `/blog/${DAILY_SLUGS[i - 1]}`)}">${dayLabel(DAILY_SLUGS[i - 1])}</a></li>`);
    if (i < DAILY_SLUGS.length - 1) links.push(`<li>${t.next} →: <a href="${langUrl(lang, `/blog/${DAILY_SLUGS[i + 1]}`)}">${dayLabel(DAILY_SLUGS[i + 1])}</a></li>`);
    links.push(`<li><a href="${langUrl(lang, '/daily')}">${t.today}</a></li>`);
    const cities = CITIES.map(city => `<a href="${langUrl(lang, `/${city.id}`)}">${cityDisplayName(lang, city)}</a>`).join(', ');
    return `<h2>${t.heading}</h2><ul>${links.join('')}</ul><p><strong>${t.cities}:</strong> ${cities}.</p>`;
}

const BACK_TO_NEWS = { KG: 'Жаңылыктарга кайтуу', RU: 'Назад к новостям', EN: 'Back to News' };

// Each article is published in all three languages from its BLOG_POSTS translations:
// Kyrgyz at /blog/<slug>, Russian at /ru/blog/<slug>, English at /en/blog/<slug>.
// Before, /blog/<slug> served English HTML that JavaScript then swapped for the
// Kyrgyz text, and its hreflang pointed ky/ru/en all at that one URL (audit H1).
// src/blog/<slug>.html is the page shell; only its article-specific parts change.
function renderArticle(template, post, lang) {
    const data = post.translations[lang] || post.translations.EN;
    const dict = TRANSLATIONS[lang];
    const url = langUrl(lang, `/blog/${post.slug}`);
    const canonical = `https://pogoda.kg${url}`;
    const description = trimAtWord((data.seoDesc || data.excerpt).replace(/\s+/g, ' ').trim(), 160);

    const title = fitSeoTitle(data.seoTitle || data.title);
    let html = translateHTML(template, lang, dict, url);
    // Hand-written article templates never had Open Graph / Twitter tags.
    if (!/property="og:title"/.test(html)) {
        const image = `https://pogoda.kg${post.image}`;
        html = html.replace('</head>', `  <meta property="og:type" content="article">\n  <meta property="og:title" content="">\n  <meta property="og:description" content="">\n  <meta property="og:url" content="${canonical}">\n  <meta property="og:image" content="${image}">\n  <meta property="og:site_name" content="Pogoda Kg">\n  <meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:title" content="">\n  <meta name="twitter:description" content="">\n  <meta name="twitter:image" content="${image}">\n</head>`);
    }
    html = withHeadMeta(html, { title, description });
    html = html.replace(/\s*<meta name="robots" content="noindex[^"]*">/g, '');
    if (!/<meta name="robots"/.test(html)) {
        html = html.replace('</head>', '  <meta name="robots" content="max-image-preview:large">\n</head>');
    }

    html = mustReplace(html, /(<h1 class="post-title"[^>]*>)[\s\S]*?(<\/h1>)/, `$1${data.title}$2`, 'h1.post-title', post.slug);
    html = mustReplace(html, /(<span class="news-tag"[^>]*>)[^<]*(<\/span>)/, `$1${data.category}$2`, 'span.news-tag', post.slug);
    html = mustReplace(html, /(class="back-btn"[^>]*>[\s\S]*?<\/svg>)[^<]*(<\/a>)/, `$1 ${BACK_TO_NEWS[lang]}$2`, 'a.back-btn', post.slug);
    html = mustReplace(html,
        /(<div class="breadcrumbs-container"[^>]*>\s*<a [^>]*><svg[\s\S]*?<\/svg>)[^<]*(<\/a>\s*<span[^>]*>\/<\/span>\s*<a [^>]*>)[^<]*(<\/a>\s*<span[^>]*>\/<\/span>\s*<span>)[^<]*(<\/span>)/,
        (m, home, news, current, close) => `${home} ${dict.nav_home}${news}${dict.nav_news}${current}${data.title}${close}`, 'breadcrumbs', post.slug);
    html = replaceDivInner(html, '<div class="post-meta"', `\n      <span><svg class="icon"><use href="#icon-user"></use></svg> ${data.author}</span>\n      <span><svg class="icon"><use href="#icon-calendar"></use></svg> ${data.date}</span>\n    `);
    html = replaceDivInner(html, '<div class="post-content"', `\n      ${data.content}${dailySeriesNav(post, lang)}\n    `);

    html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (m, open, body, close) => {
        let schema;
        try { schema = JSON.parse(body); } catch { return m; }
        if (['NewsArticle', 'BlogPosting', 'Article'].includes(schema['@type'])) {
            // BlogPosting, not NewsArticle: these are guides and forecasts, not news reports (audit check 30).
            Object.assign(schema, { '@type': 'BlogPosting', headline: data.title, description, inLanguage: LANG_CODES[lang], mainEntityOfPage: { '@type': 'WebPage', '@id': canonical } });
        } else if (schema['@type'] === 'BreadcrumbList') {
            schema.itemListElement = [
                { '@type': 'ListItem', position: 1, name: dict.nav_home, item: `https://pogoda.kg${langUrl(lang, '/')}` },
                { '@type': 'ListItem', position: 2, name: dict.nav_news, item: `https://pogoda.kg${langUrl(lang, '/blog')}` },
                { '@type': 'ListItem', position: 3, name: data.title, item: canonical }
            ];
        } else {
            return m;
        }
        return `${open}\n  ${JSON.stringify(schema, null, 2).replace(/\n/g, '\n  ')}\n  ${close}`;
    });

    // Article templates historically jumped from their H1 directly to H3.
    // Promote content headings to H2 and keep the decorative footer labels out
    // of the document outline.
    html = html.replace(/<h3\b/g, '<h2').replace(/<\/h3>/g, '</h2>');
    html = html.replace(/<h4\b/g, '<p class="footer-heading"').replace(/<\/h4>/g, '</p>');
    return finalisePage(html, lang, `/blog/${post.slug}`, '/blog/');
}

BLOG_POSTS.forEach(post => {
    const template = fs.readFileSync(path.join(SRC_DIR, 'blog', `${post.slug}.html`), 'utf8');
    LANGS.forEach(lang => {
        const outPath = path.join(OUT_DIR, LANG_PREFIXES[lang], 'blog', `${post.slug}.html`);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, renderArticle(template, post, lang));
        sitemapUrls.push({ loc: langUrl(lang, `/blog/${post.slug}`), sources: [`src/blog/${post.slug}.html`], dates: [(template.match(/"dateModified":\s*"(\d{4}-\d{2}-\d{2})/) || [])[1]] });
    });
});

// Last commit date of every file under src/, for <lastmod>. Cloudflare Pages builds
// from a shallow clone, where every file would wrongly share the latest commit's
// date, so fetch the full history first; returns null if that isn't possible.
function gitLastModifiedDates() {
    try {
        const git = args => require('child_process').execFileSync('git', args, { cwd: __dirname, maxBuffer: 64 * 1024 * 1024, timeout: 120000, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
        if (git(['rev-parse', '--is-shallow-repository']).trim() === 'true') git(['fetch', '--unshallow', '--quiet']);
        if (git(['rev-parse', '--is-shallow-repository']).trim() === 'true') return null;
        const dates = new Map();
        let current = null;
        for (const line of git(['log', '--format=%x00%cs', '--name-only', '--', 'src']).split('\n')) {
            if (line.startsWith('\0')) current = line.slice(1);
            else if (line && current && !dates.has(line)) dates.set(line, current);
        }
        return dates;
    } catch {
        return null;
    }
}
const lastModified = gitLastModifiedDates();
if (!lastModified) console.warn('Sitemap: no full git history available, <lastmod> omitted.');

// Generate Sitemap
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(({ loc, sources, dates = [] }) => {
    const lastmod = [...(lastModified ? sources.map(source => lastModified.get(source)) : []), ...dates].filter(Boolean).sort().pop();
    return `  <url>\n    <loc>https://pogoda.kg${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`;
}).join('\n')}
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

// Copy the IndexNow ownership key file (<32-hex-key>.txt) to the site root so
// search engines can verify our submissions (see scripts/indexnow.mjs).
fs.readdirSync(__dirname).filter(f => /^[0-9a-f]{32}\.txt$/.test(f)).forEach(f => {
    fs.copyFileSync(path.join(__dirname, f), path.join(OUT_DIR, f));
});

// Write _redirects
const redirects = `# Clean URLs
/kg  /  301
/kg/*  /:splat  301
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

/js/*
  Cache-Control: public, max-age=300, must-revalidate
`;
fs.writeFileSync(path.join(OUT_DIR, '_headers'), headers);

console.log('Build complete. Output generated in out/ folder.');
