import test from 'node:test';
import assert from 'node:assert/strict';
import { formatWeatherData, fetchWeatherData } from '../src/js/api.js';
import { readRecentCities } from '../src/js/storage.js';

function fixture() {
  const days = Array.from({length:7}, (_,i) => `2026-09-${15+i}`);
  const times = days.flatMap(day => Array.from({length:24}, (_,i) => `${day}T${String(i).padStart(2,'0')}:00`));
  return {
    timezone:'Asia/Bishkek', utc_offset_seconds:21600,
    current:{time:'2026-09-15T15:15',temperature_2m:20,apparent_temperature:19,weather_code:82,is_day:1,relative_humidity_2m:50,wind_speed_10m:11,wind_direction_10m:180,pressure_msl:1014},
    hourly:{time:times,temperature_2m:times.map((_,i)=>i),weather_code:times.map(()=>82),is_day:times.map(()=>1),precipitation_probability:times.map(()=>0),wind_speed_10m:times.map(()=>11),visibility:times.map((_,i)=>i===15?0:10000)},
    daily:{time:days,weather_code:days.map(()=>82),temperature_2m_max:days.map(()=>25),temperature_2m_min:days.map(()=>10),sunrise:days.map(d=>`${d}T06:00`),sunset:days.map(d=>`${d}T18:00`),precipitation_probability_max:days.map(()=>0)}
  };
}

test('forecast selection follows Bishkek time, including across midnight', () => {
  const data=fixture(); const result=formatWeatherData(data);
  assert.equal(result.hourly[0].temp,15);
  assert.equal(result.hourly[23].temp,38);
  assert.equal(result.hourly[9].time,'00:00');
  assert.equal(result.current.visibility,'0.0 km');
  assert.equal(result.current.windSpeed,11);
  assert.equal(result.observedAt,Date.parse('2026-09-15T09:15:00Z'));
  assert.equal(result.weekly.length,7);
  assert.equal(result.weekly[0].minTemp,10);
});
test('precipitation codes are not shown as sunshine and unknown codes stay unknown', () => {
  const data=fixture();
  assert.equal(formatWeatherData(data).current.conditionKey,'cond_rain');
  data.current.weather_code=999;
  assert.equal(formatWeatherData(data).current.conditionKey,'cond_unknown');
  data.current.weather_code=0; data.current.is_day=0;
  assert.match(formatWeatherData(data).current.svg,/night.svg/);
});
test('incomplete responses are rejected',()=> {
  assert.throws(()=>formatWeatherData({}), /Incomplete/);
  const data=fixture();data.current.time='2026-10-01T15:15';
  assert.throws(()=>formatWeatherData(data),/hour missing/);
});
test('network errors never return fabricated weather', async()=> {
  const previous=globalThis.fetch;
  globalThis.fetch=async()=>{throw Error('Offline');};
  try { await assert.rejects(fetchWeatherData(0,0),/Offline/); }
  finally { globalThis.fetch=previous; }
});
test('duplicate requests share one fetch and successful weather is cached', async()=> {
  const previous=globalThis.fetch; let calls=0;
  globalThis.fetch=async url=>{calls++;assert.match(url,/wind_speed_unit=kmh/); return {ok:true,json:async()=>fixture()};};
  try {
    const [a,b]=await Promise.all([fetchWeatherData(1,1),fetchWeatherData(1,1)]);
    assert.deepEqual(a,b); await fetchWeatherData(1,1); assert.equal(calls,1);
  } finally {globalThis.fetch=previous;}
});
test('cached data is labeled stale after a failed refresh and expires after an hour',async()=> {
  const previous=globalThis.fetch, now=Date.now; let time=now(); Date.now=()=>time;
  globalThis.fetch=async()=>({ok:true,json:async()=>fixture()});
  try {
    await fetchWeatherData(2,2); time+=16*60*1000;
    globalThis.fetch=async()=>{throw Error('Offline');};
    assert.equal((await fetchWeatherData(2,2)).stale,true);
    time+=60*60*1000;
    await assert.rejects(fetchWeatherData(2,2),/Offline/);
  } finally {globalThis.fetch=previous;Date.now=now;}
});
test('recent searches tolerate malformed storage and discard untrusted city fields',()=> {
  const original=globalThis.localStorage;
  const city={id:'osh',name:'Osh'};
  try {
    globalThis.localStorage={getItem:()=>'{bad json'};assert.deepEqual(readRecentCities([city]),[]);
    globalThis.localStorage={getItem:()=>JSON.stringify([{id:'osh',name:'<img onerror=bad>'},{id:'missing'}])};
    assert.deepEqual(readRecentCities([city]),[city]);
    globalThis.localStorage={getItem:()=>{throw Error('Blocked');}};assert.deepEqual(readRecentCities([city]),[]);
  } finally {globalThis.localStorage=original;}
});
test('different city requests are batched and mapped to the right city', async()=> {
  const previous=globalThis.fetch; let calls=0;
  globalThis.fetch=async url=>{
    calls++;assert.equal(new URL(url).searchParams.get('latitude'),'3,4');
    const first=fixture(),second=fixture();second.current.temperature_2m=30;
    return {ok:true,json:async()=>[first,second]};
  };
  try {
    const [a,b]=await Promise.all([fetchWeatherData(3,3),fetchWeatherData(4,4)]);
    assert.equal(a.current.temp,20);assert.equal(b.current.temp,30);assert.equal(calls,1);
  } finally {globalThis.fetch=previous;}
});
