// Mountain passes are shown separately from official road status. Weather is
// live; only the Ministry of Transport can confirm whether a road is open.
export const KYRGYZSTAN_PASSES = [
  { id: 'too-ashuu', name: 'Төө-Ашуу', ru: 'Төө-Ашуу', en: 'Too-Ashuu', route: 'Бишкек — Ош', lat: 42.316, lon: 73.889, elevation: '3,180 m' },
  { id: 'ala-bel', name: 'Ала-Бел', ru: 'Ала-Бел', en: 'Ala-Bel', route: 'Бишкек — Ош', lat: 42.247, lon: 72.998, elevation: '3,184 m' },
  { id: 'dolon', name: 'Долон', ru: 'Долон', en: 'Dolon', route: 'Бишкек — Нарын — Торугарт', lat: 41.721, lon: 75.725, elevation: '3,030 m' },
  { id: 'otmok', name: 'Өтмөк', ru: 'Өтмөк', en: 'Otmek', route: 'Тараз — Талас — Суусамыр', lat: 42.126, lon: 72.924, elevation: '3,326 m' },
  { id: 'tuz-bel', name: 'Түз-Бел', ru: 'Түз-Бел', en: 'Tuz-Bel', route: 'Нарын — Торугарт', lat: 40.891, lon: 75.809, elevation: '3,574 m' }
];

export const OFFICIAL_ROAD_STATUS_URL = 'https://mtd.gov.kg/category/proezzhaemost/';
export const OFFICIAL_CAMERAS_URL = 'https://back.joldor.gov.kg/ru/online/?post=sosnovka';
