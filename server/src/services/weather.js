import { getWeatherDescription } from './weatherCodes.js';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export class CityNotFoundError extends Error {
  constructor(message = 'city not found') {
    super(message);
    this.name = 'CityNotFoundError';
  }
}

export class WeatherServiceError extends Error {
  constructor(message = 'weather service unavailable') {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

async function fetchJson(url) {
  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new WeatherServiceError();
  }

  if (!response.ok) {
    throw new WeatherServiceError();
  }

  try {
    return await response.json();
  } catch {
    throw new WeatherServiceError();
  }
}

function hasCjkCharacters(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

async function geocodeCity(city) {
  const languages = hasCjkCharacters(city) ? ['zh', 'en'] : ['en', 'zh'];

  for (const language of languages) {
    const params = new URLSearchParams({
      name: city,
      count: '1',
      language,
    });
    const data = await fetchJson(`${GEOCODING_URL}?${params}`);
    if (data.results?.length) {
      return data.results[0];
    }
  }

  throw new CityNotFoundError();
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

export async function getWeatherByCity(city) {
  const location = await geocodeCity(city);
  const forecast = await fetchForecast(location.latitude, location.longitude);

  const current = forecast.current;
  if (!current) {
    throw new WeatherServiceError();
  }

  const weatherCode = current.weather_code ?? 0;

  return {
    city: location.name,
    country: location.country ?? '',
    latitude: location.latitude,
    longitude: location.longitude,
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    weatherCode,
    weatherDescription: getWeatherDescription(weatherCode),
    fetchedAt: new Date().toISOString(),
  };
}
