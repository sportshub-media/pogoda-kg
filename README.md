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

## Daily briefing and mountain passes

`/daily` is one permanent daily briefing page for Bishkek, Osh, Karakol, Naryn, and Jalal-Abad. It does not create a new blog post each day. The GitHub Action in `.github/workflows/update-daily-briefing.yml` runs daily at 09:10 Asia/Bishkek, requests numeric forecast data from Open-Meteo, and commits the refreshed briefing source file. A Cloudflare Pages deployment triggered by that commit publishes the update.

`/passes` displays current weather for Too-Ashuu, Ala-Bel, Dolon, Otmek, and Tuz-Bel. It never claims that a road is open or closed. It links visitors to the Ministry of Transport's official pass status and road cameras, since that authority controls road-access information.

## Contact

The form opens a prefilled email draft addressed to `info.pogoda.kg@gmail.com`. The visitor must send it in their mail app. Fields remain available if no mail app is configured. There is no server-side message delivery service in this repository.

## Translations and navigation

Language-prefixed pages are statically built; switching languages navigates to the matching page. Individual blog articles keep their existing single URL and switch article content using the saved language preference. Mobile search opens the translated homepage with search results. Saved preferences and recent searches are optional and tolerate disabled or corrupted storage.

## Deployment status

Local changes and the generated build do not publish automatically from this workspace. Use the site's established Cloudflare Pages deployment process after reviewing the build.
