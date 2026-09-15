# Pogoda.kg

Static weather website for ten Kyrgyzstan cities, in Kyrgyz, Russian, and English.

## Build and verify

Use Node.js 22.7+ (tested with Node.js 24). No npm dependencies are required.

```sh
npm test
npm run build
```

Publish the generated `out/` folder to Cloudflare Pages. The build generates 80 HTML documents, clean-URL redirects, sitemap, and security headers. Source files belong in `src/`; do not manually edit `out/`.

## Weather

`src/js/api.js` requests seven forecast days from Open-Meteo. Coordinates are in `config.js`. Times use Asia/Bishkek and wind uses km/h throughout. Requests made together are batched; identical requests are deduplicated. In-memory caching lasts 15 minutes. On request failure, previously fetched data under one hour old may be displayed with a stale label. Without usable data, visitors see an unavailable message and retry control on the main forecast.

The main forecast refreshes every 15 minutes while the page is visible and on return to the page. No placeholder or invented weather is returned. Current-condition timestamps and provider attribution appear in the main card.

## Contact

The form opens a prefilled email draft addressed to `info.pogoda.kg@gmail.com`. The visitor must send it in their mail app. Fields remain available if no mail app is configured. There is no server-side message delivery service in this repository.

## Translations and navigation

Language-prefixed pages are statically built; switching languages navigates to the matching page. Individual blog articles keep their existing single URL and switch article content using the saved language preference. Mobile search opens the translated homepage with search results. Saved preferences and recent searches are optional and tolerate disabled or corrupted storage.

## Deployment status

Local changes and the generated build do not publish automatically from this workspace. Use the site's established Cloudflare Pages deployment process after reviewing the build.
