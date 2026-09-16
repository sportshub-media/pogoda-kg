// Pogoda Kg - Kyrgyzstan Cities & App Configuration

export const KYRGYZSTAN_CITIES = [
  {
    id: "bishkek",
    name: "Bishkek",
    nativeName: "Бишкек",
    region: "Chuy Region",
    regionKey: "chuy",
    lat: 42.8746,
    lon: 74.5698,
    isCapital: true,
    population: "1,074,000",
    elevation: "800 m",
    image: "assets/images/generated/cities/bishkek.jpg"
  },
  {
    id: "osh",
    name: "Osh",
    nativeName: "Ош",
    region: "Osh Region",
    regionKey: "osh",
    lat: 40.5140,
    lon: 72.8161,
    isCapital: false,
    population: "322,000",
    elevation: "963 m",
    image: "assets/images/generated/cities/osh.jpg"
  },
  {
    id: "jalal-abad",
    name: "Jalal-Abad",
    nativeName: "Жалал-Абад",
    region: "Jalal-Abad Region",
    regionKey: "jalalabad",
    lat: 40.9333,
    lon: 72.9833,
    isCapital: false,
    population: "123,000",
    elevation: "763 m",
    image: "assets/images/generated/cities/jalal-abad.jpg"
  },
  {
    id: "karakol",
    name: "Karakol",
    nativeName: "Каракол",
    region: "Issyk-Kul Region",
    regionKey: "issykkul",
    lat: 42.4907,
    lon: 78.3936,
    isCapital: false,
    population: "84,000",
    elevation: "1,760 m",
    image: "assets/images/generated/cities/karakol.jpg"
  },
  {
    id: "tokmok",
    name: "Tokmok",
    nativeName: "Токмок",
    region: "Chuy Region",
    regionKey: "chuy",
    lat: 42.8419,
    lon: 75.3015,
    isCapital: false,
    population: "71,000",
    elevation: "816 m",
    image: "assets/images/generated/cities/tokmok.jpg"
  },
  {
    id: "uzgen",
    name: "Uzgen",
    nativeName: "Өзгөн",
    region: "Osh Region",
    regionKey: "osh",
    lat: 40.7699,
    lon: 73.3005,
    isCapital: false,
    population: "62,000",
    elevation: "1,025 m",
    image: "assets/images/generated/cities/uzgen.jpg"
  },
  {
    id: "kara-balta",
    name: "Kara-Balta",
    nativeName: "Кара-Балта",
    region: "Chuy Region",
    regionKey: "chuy",
    lat: 42.8142,
    lon: 73.8481,
    isCapital: false,
    population: "54,000",
    elevation: "780 m",
    image: "assets/images/generated/cities/kara-balta.jpg"
  },
  {
    id: "balykchy",
    name: "Balykchy",
    nativeName: "Балыкчы",
    region: "Issyk-Kul Region",
    regionKey: "issykkul",
    lat: 42.4602,
    lon: 76.1871,
    isCapital: false,
    population: "51,000",
    elevation: "1,609 m",
    image: "assets/images/generated/cities/balykchy.jpg"
  },
  {
    id: "naryn",
    name: "Naryn",
    nativeName: "Нарын",
    region: "Naryn Region",
    regionKey: "naryn",
    lat: 41.4287,
    lon: 75.9911,
    isCapital: false,
    population: "41,000",
    elevation: "2,044 m",
    image: "assets/images/generated/cities/naryn.jpg"
  },
  {
    id: "talas",
    name: "Talas",
    nativeName: "Талас",
    region: "Talas Region",
    regionKey: "talas",
    lat: 42.5228,
    lon: 72.2427,
    isCapital: false,
    population: "40,000",
    elevation: "1,280 m",
    image: "assets/images/generated/cities/talas.jpg"
  },
  { id: "batken", name: "Batken", nativeName: "Баткен", region: "Batken Region", regionKey: "batken", lat: 40.0626, lon: 70.8194, isCapital: false, population: "23,000", elevation: "1,036 m", image: "assets/images/generated/cities/batken.jpg" },
  { id: "cholpon-ata", name: "Cholpon-Ata", nativeName: "Чолпон-Ата", region: "Issyk-Kul Region", regionKey: "issykkul", lat: 42.6494, lon: 77.0813, isCapital: false, population: "14,000", elevation: "1,609 m", image: "assets/images/generated/cities/cholpon-ata.jpg" },
  { id: "kant", name: "Kant", nativeName: "Кант", region: "Chuy Region", regionKey: "chuy", lat: 42.8911, lon: 74.8505, isCapital: false, population: "22,000", elevation: "742 m", image: "assets/images/generated/cities/kant.jpg" },
  { id: "kemin", name: "Kemin", nativeName: "Кемин", region: "Chuy Region", regionKey: "chuy", lat: 42.7864, lon: 75.7003, isCapital: false, population: "9,000", elevation: "1,123 m", image: "assets/images/generated/cities/kemin.jpg" },
  { id: "kyzyl-kiya", name: "Kyzyl-Kiya", nativeName: "Кызыл-Кыя", region: "Batken Region", regionKey: "batken", lat: 40.2568, lon: 72.1279, isCapital: false, population: "56,000", elevation: "1,058 m", image: "assets/images/generated/cities/kyzyl-kiya.jpg" },
  { id: "toktogul", name: "Toktogul", nativeName: "Токтогул", region: "Jalal-Abad Region", regionKey: "jalalabad", lat: 41.8731, lon: 72.9416, isCapital: false, population: "19,000", elevation: "1,030 m", image: "assets/images/generated/cities/toktogul.jpg" },
  { id: "razzakov", name: "Razzakov", nativeName: "Раззаков", region: "Batken Region", regionKey: "batken", lat: 39.8389, lon: 69.5306, isCapital: false, population: "28,000", elevation: "1,328 m", image: "assets/images/generated/cities/razzakov.jpg" }
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

// Complete the provider's precipitation codes; unknown values remain unknown.
for (const [code, equivalent] of Object.entries({53:51,55:51,56:61,57:65,66:61,67:65,77:71,81:63,82:65,85:71,86:75,96:95,99:95})) {
  WMO_WEATHER_CODES[code] = WMO_WEATHER_CODES[equivalent];
}
