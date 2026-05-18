const { getWeatherDescription } = require('./weatherCodes');

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

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

async function geocodeCity(city) {
  const attempts = [{ name: city, count: '1' }];
  if (hasCjkCharacters(city)) {
    attempts.push({ name: city, count: '1', language: 'zh' });
  }

  for (const query of attempts) {
    const params = new URLSearchParams(query);
    const data = await fetchJson(`${GEOCODING_URL}?${params}`);
    if (data.results?.length > 0) {
      return data.results[0];
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
