const WMO_DESCRIPTIONS = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

function getWeatherDescription(code) {
  if (Object.prototype.hasOwnProperty.call(WMO_DESCRIPTIONS, code)) {
    return WMO_DESCRIPTIONS[code];
  }
  if (code >= 4 && code <= 44) return 'Unknown atmospheric condition';
  if (code >= 49 && code <= 50) return 'Unknown fog condition';
  if (code >= 58 && code <= 60) return 'Unknown drizzle condition';
  if (code >= 68 && code <= 70) return 'Unknown rain condition';
  if (code >= 76 && code <= 79) return 'Unknown snow condition';
  if (code >= 83 && code <= 84) return 'Unknown shower condition';
  if (code >= 87 && code <= 94) return 'Unknown precipitation';
  if (code >= 97 && code <= 98) return 'Unknown thunderstorm';
  return 'Unknown weather';
}

module.exports = { getWeatherDescription };
