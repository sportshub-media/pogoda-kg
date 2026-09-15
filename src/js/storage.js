export const storage = {
  getItem(key) { try { return localStorage.getItem(key); } catch { return null; } },
  setItem(key, value) { try { localStorage.setItem(key, value); } catch { /* Optional preferences. */ } }
};
export function readRecentCities(cities) {
  try {
    const saved = JSON.parse(storage.getItem('pogoda_recents') || '[]');
    return Array.isArray(saved) ? saved.map(item => cities.find(city => city.id === item?.id)).filter(Boolean).slice(0, 4) : [];
  } catch { return []; }
}
