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
  <link rel="alternate" hreflang="x-default" href="https://pogoda.kg/ru${baseCleanUrl}" />`;
    
    // Inject before </head> or after canonical
    result = result.replace(/(<link rel="canonical" href="[^"]+">)/, `$1${hreflangBlock}`);
    
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
        if (fullUrl === '') fullUrl = '/';
        
        let translated = translateHTML(rawHtml, lang, dict, fullUrl);
        
        // Save file
        const outFilePath = file === 'index.html' 
            ? path.join(OUT_DIR, prefix, 'index.html') 
            : path.join(OUT_DIR, prefix, file);
            
        fs.mkdirSync(path.dirname(outFilePath), { recursive: true });
        fs.writeFileSync(outFilePath, translated);
        sitemapUrls.push(fullUrl);
        
        // Special Case: If it's index.html, generate city pages!
        if (file === 'index.html') {
            CITIES.forEach(city => {
                let cityUrl = prefix + `/${city.id}`;
                if (prefix === '') cityUrl = `/${city.id}`;
                
                let cityHtml = translated;
                
                // Update title to include city
                const titleStr = dict.hero_title || 'Weather Forecast';
                const cityTitle = `${city.nativeName || city.name} - ${titleStr} | Pogoda.kg`;
                
                cityHtml = cityHtml.replace(/<title>.*?<\/title>/, `<title>${cityTitle}</title>`);
                
                // Update Canonical & Hreflang for the City Page
                cityHtml = cityHtml.replace(/<link rel="canonical" href="[^"]+">/, `<link rel="canonical" href="https://pogoda.kg${cityUrl}">`);
                
                // Rebuild hreflang block for the city
                cityHtml = cityHtml.replace(/<link rel="alternate" hreflang="[^"]+" href="[^"]+"\s*\/>\n?/g, '');
                let cityHreflangBlock = `
  <link rel="alternate" hreflang="ru" href="https://pogoda.kg/ru/${city.id}" />
  <link rel="alternate" hreflang="ky" href="https://pogoda.kg/${city.id}" />
  <link rel="alternate" hreflang="en" href="https://pogoda.kg/en/${city.id}" />
  <link rel="alternate" hreflang="x-default" href="https://pogoda.kg/ru/${city.id}" />`;
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

// Generate Sitemap
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapUrls.map(url => `  <url>\n    <loc>https://pogoda.kg${url === '/' ? '' : url}</loc>\n  </url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), sitemapXml);

// Write _redirects
const redirects = `# Legacy Query Parameters to Clean URLs
/index.html?city=:city  /:city  301
/en/index.html?city=:city  /en/:city  301
/ru/index.html?city=:city  /ru/:city  301

# Clean URLs
/kg  /  301
/kg/*  /:splat  301
`;
fs.writeFileSync(path.join(OUT_DIR, '_redirects'), redirects);

console.log('Build complete. Output generated in out/ folder.');
