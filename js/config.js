// Pogoda Kg - Kyrgyzstan Cities & App Configuration

export const OTHER_COUNTRIES = [
  { id: "sydney", name: "Sydney", nativeName: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093 },
  { id: "tokyo", name: "Tokyo", nativeName: "東京", country: "Japan", lat: 35.6762, lon: 139.6503 },
  { id: "london", name: "London", nativeName: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278 },
  { id: "new-york", name: "New York", nativeName: "New York", country: "United States", lat: 40.7128, lon: -74.0060 },
  { id: "dubai", name: "Dubai", nativeName: "دبي", country: "United Arab Emirates", lat: 25.2048, lon: 55.2708 },
  { id: "paris", name: "Paris", nativeName: "Paris", country: "France", lat: 48.8566, lon: 2.3522 },
  { id: "seoul", name: "Seoul", nativeName: "서울", country: "South Korea", lat: 37.5665, lon: 126.9780 },
  { id: "istanbul", name: "Istanbul", nativeName: "İstanbul", country: "Turkey", lat: 41.0082, lon: 28.9784 }
];
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
  0: { labelKey: "cond_sunny", icon: "sun", svg: `<img src="/assets/animated/day.svg" class="weather-anim-icon" alt="Sunny">` },
  1: { labelKey: "cond_mainly_clear", icon: "sun-cloud", svg: `<img src="/assets/animated/cloudy-day-1.svg" class="weather-anim-icon" alt="Mainly Clear">` },
  2: { labelKey: "cond_partly_cloudy", icon: "cloud-sun", svg: `<img src="/assets/animated/cloudy-day-3.svg" class="weather-anim-icon" alt="Partly Cloudy">` },
  3: { labelKey: "cond_overcast", icon: "cloud", svg: `<img src="/assets/animated/cloudy.svg" class="weather-anim-icon" alt="Overcast">` },
  45: { labelKey: "cond_foggy", icon: "fog", svg: `<img src="/assets/animated/cloudy.svg" class="weather-anim-icon" alt="Foggy">` },
  48: { labelKey: "cond_foggy", icon: "fog", svg: `<img src="/assets/animated/cloudy.svg" class="weather-anim-icon" alt="Foggy">` },
  51: { labelKey: "cond_rain", icon: "rain", svg: `<img src="/assets/animated/rainy-4.svg" class="weather-anim-icon" alt="Light Rain">` },
  61: { labelKey: "cond_rain", icon: "rain", svg: `<img src="/assets/animated/rainy-5.svg" class="weather-anim-icon" alt="Rain">` },
  63: { labelKey: "cond_rain", icon: "rain", svg: `<img src="/assets/animated/rainy-6.svg" class="weather-anim-icon" alt="Heavy Rain">` },
  65: { labelKey: "cond_rain", icon: "heavy-rain", svg: `<img src="/assets/animated/rainy-7.svg" class="weather-anim-icon" alt="Very Heavy Rain">` },
  71: { labelKey: "cond_snow", icon: "snow", svg: `<img src="/assets/animated/snowy-4.svg" class="weather-anim-icon" alt="Light Snow">` },
  73: { labelKey: "cond_snow", icon: "snow", svg: `<img src="/assets/animated/snowy-5.svg" class="weather-anim-icon" alt="Snow">` },
  75: { labelKey: "cond_snow", icon: "snow", svg: `<img src="/assets/animated/snowy-6.svg" class="weather-anim-icon" alt="Heavy Snow">` },
  80: { labelKey: "cond_rain", icon: "rain-showers", svg: `<img src="/assets/animated/rainy-6.svg" class="weather-anim-icon" alt="Rain Showers">` },
  95: { labelKey: "cond_thunder", icon: "thunder", svg: `<img src="/assets/animated/thunder.svg" class="weather-anim-icon" alt="Thunder">` }
};
