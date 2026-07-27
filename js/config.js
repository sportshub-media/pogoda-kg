// Pogoda Kg - Kyrgyzstan Cities & App Configuration

export const KYRGYZSTAN_CITIES = [
  {
    id: "bishkek",
    name: "Bishkek",
    nativeName: "Бишкек",
    region: "Chuy Region",
    lat: 42.8746,
    lon: 74.5698,
    isCapital: true,
    population: "1,074,000",
    elevation: "800 m",
    image: "assets/images/bishkek.webp"
  },
  {
    id: "osh",
    name: "Osh",
    nativeName: "Ош",
    region: "Osh Region",
    lat: 40.5140,
    lon: 72.8161,
    isCapital: false,
    population: "322,000",
    elevation: "963 m",
    image: "assets/images/osh.webp"
  },
  {
    id: "jalal-abad",
    name: "Jalal-Abad",
    nativeName: "Жалал-Абад",
    region: "Jalal-Abad Region",
    lat: 40.9333,
    lon: 72.9833,
    isCapital: false,
    population: "123,000",
    elevation: "763 m",
    image: "assets/images/jalal_abad.webp"
  },
  {
    id: "karakol",
    name: "Karakol",
    nativeName: "Каракол",
    region: "Issyk-Kul Region",
    lat: 42.4907,
    lon: 78.3936,
    isCapital: false,
    population: "84,000",
    elevation: "1,760 m",
    image: "assets/images/karakol.webp"
  },
  {
    id: "tokmok",
    name: "Tokmok",
    nativeName: "Токмок",
    region: "Chuy Region",
    lat: 42.8419,
    lon: 75.3015,
    isCapital: false,
    population: "71,000",
    elevation: "816 m",
    image: "assets/images/tokmok.webp"
  },
  {
    id: "uzgen",
    name: "Uzgen",
    nativeName: "Өзгөн",
    region: "Osh Region",
    lat: 40.7699,
    lon: 73.3005,
    isCapital: false,
    population: "62,000",
    elevation: "1,025 m",
    image: "assets/images/uzgen.webp"
  },
  {
    id: "kara-balta",
    name: "Kara-Balta",
    nativeName: "Кара-Балта",
    region: "Chuy Region",
    lat: 42.8142,
    lon: 73.8481,
    isCapital: false,
    population: "54,000",
    elevation: "780 m",
    image: "assets/images/kara_balta.webp"
  },
  {
    id: "balykchy",
    name: "Balykchy",
    nativeName: "Балыкчы",
    region: "Issyk-Kul Region",
    lat: 42.4602,
    lon: 76.1871,
    isCapital: false,
    population: "51,000",
    elevation: "1,609 m",
    image: "assets/images/balykchy.webp"
  },
  {
    id: "naryn",
    name: "Naryn",
    nativeName: "Нарын",
    region: "Naryn Region",
    lat: 41.4287,
    lon: 75.9911,
    isCapital: false,
    population: "41,000",
    elevation: "2,044 m",
    image: "assets/images/naryn.webp"
  },
  {
    id: "talas",
    name: "Talas",
    nativeName: "Талас",
    region: "Talas Region",
    lat: 42.5228,
    lon: 72.2427,
    isCapital: false,
    population: "40,000",
    elevation: "1,280 m",
    image: "assets/images/talas.webp"
  }
];

export const DEFAULT_CITY = KYRGYZSTAN_CITIES[0]; // Bishkek

export const WMO_WEATHER_CODES = {
  0: { labelKey: "cond_sunny", icon: "sun", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF9F43" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>` },
  1: { labelKey: "cond_mainly_clear", icon: "sun-cloud", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFB03B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M20 12h2"/><path d="M19.07 4.93l-1.41 1.41"/><path d="M15.9 15.9A5 5 0 0 1 12 18H7a5 5 0 0 1 0-10h.5a7 7 0 0 1 8.4 7.9z"/></svg>` },
  2: { labelKey: "cond_partly_cloudy", icon: "cloud-sun", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7A889B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a5 5 0 0 1 0-10h.5a7 7 0 0 1 11.9 4 4.5 4.5 0 0 1-3.9 6z"/></svg>` },
  3: { labelKey: "cond_overcast", icon: "cloud", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6C7A89" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 3 16.3"/><path d="M22 13.5a4.5 4.5 0 0 0-4.5-4.5H16.3a8.03 8.03 0 0 0-14.3 3.5"/></svg>` },
  45: { labelKey: "cond_foggy", icon: "fog", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A4B0BE" stroke-width="2"><path d="M5 10h14"/><path d="M3 14h18"/><path d="M5 18h14"/></svg>` },
  48: { labelKey: "cond_foggy", icon: "fog", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A4B0BE" stroke-width="2"><path d="M5 10h14"/><path d="M3 14h18"/><path d="M5 18h14"/></svg>` },
  51: { labelKey: "cond_rain", icon: "rain", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4B7BEC" stroke-width="2"><path d="M16 13v6"/><path d="M8 13v6"/><path d="M12 15v6"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>` },
  61: { labelKey: "cond_rain", icon: "rain", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3867D6" stroke-width="2"><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>` },
  63: { labelKey: "cond_rain", icon: "rain", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2D98DA" stroke-width="2"><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>` },
  65: { labelKey: "cond_rain", icon: "heavy-rain", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#20BF6B" stroke-width="2"><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>` },
  71: { labelKey: "cond_snow", icon: "snow", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#45AAF2" stroke-width="2"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="12" y1="18" x2="12.01" y2="18"/><line x1="16" y1="16" x2="16.01" y2="16"/></svg>` },
  73: { labelKey: "cond_snow", icon: "snow", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#45AAF2" stroke-width="2"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="12" y1="18" x2="12.01" y2="18"/><line x1="16" y1="16" x2="16.01" y2="16"/></svg>` },
  75: { labelKey: "cond_snow", icon: "snow", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#45AAF2" stroke-width="2"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="12" y1="18" x2="12.01" y2="18"/><line x1="16" y1="16" x2="16.01" y2="16"/></svg>` },
  80: { labelKey: "cond_rain", icon: "rain-showers", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3867D6" stroke-width="2"><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>` },
  95: { labelKey: "cond_thunder", icon: "thunder", svg: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FED330" stroke-width="2"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/><polyline points="13 11 9 17 15 17 11 23"/></svg>` }
};
