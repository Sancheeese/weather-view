const { pinyin } = require('pinyin-pro');
const { getWeatherDescription } = require('./weatherCodes');

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

const ADMIN_SUFFIXES = ['市', '省', '县', '区', '州', '盟', '地区', '自治区', '特别行政区'];

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error(`Upstream request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function hasCjkCharacters(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

function hasAdminSuffix(name) {
  return ADMIN_SUFFIXES.some((suffix) => name.endsWith(suffix));
}

function toPinyinQuery(city) {
  return pinyin(city, { toneType: 'none', separator: '' });
}

async function searchGeocode(query) {
  const params = new URLSearchParams(query);
  const data = await fetchJson(`${GEOCODING_URL}?${params}`);
  return data.results?.[0] ?? null;
}

function buildGeocodeAttempts(city) {
  const attempts = [];
  const seen = new Set();

  function add(query) {
    const key = JSON.stringify(query);
    if (seen.has(key)) return;
    seen.add(key);
    attempts.push(query);
  }

  if (hasCjkCharacters(city)) {
    add({ name: city, count: '1', language: 'zh' });

    if (!hasAdminSuffix(city)) {
      for (const suffix of ['市', '州']) {
        add({ name: city + suffix, count: '1', language: 'zh' });
      }
    }

    const romanized = toPinyinQuery(city);
    if (romanized && romanized !== city) {
      add({ name: romanized, count: '1' });
    }
  } else {
    add({ name: city, count: '1' });
  }

  return attempts;
}

async function geocodeCity(city) {
  for (const query of buildGeocodeAttempts(city)) {
    const result = await searchGeocode(query);
    if (result) {
      return result;
    }
  }
  return null;
}

async function fetchForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    timezone: 'auto',
  });
  return fetchJson(`${FORECAST_URL}?${params}`);
}

async function getWeatherByCity(city) {
  const location = await geocodeCity(city);
  if (!location) {
    return { notFound: true };
  }

  const forecast = await fetchForecast(location.latitude, location.longitude);
  const current = forecast.current;

  return {
    data: {
      city: location.name,
      country: location.country || location.country_code || '',
      latitude: location.latitude,
      longitude: location.longitude,
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      weatherCode: current.weather_code,
      weatherDescription: getWeatherDescription(current.weather_code),
      fetchedAt: new Date().toISOString(),
    },
  };
}

module.exports = { getWeatherByCity };
