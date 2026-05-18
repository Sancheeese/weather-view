const panel = document.getElementById('weather-panel');

/** WMO 天气码 → emoji（常见 0–99） */
const WEATHER_EMOJI = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌧️',
  56: '🌧️',
  57: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  66: '🌧️',
  67: '🌧️',
  71: '🌨️',
  73: '🌨️',
  75: '❄️',
  77: '❄️',
  80: '🌦️',
  81: '🌧️',
  82: '⛈️',
  85: '🌨️',
  86: '❄️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️',
};

export function getWeatherEmoji(code) {
  if (WEATHER_EMOJI[code] !== undefined) return WEATHER_EMOJI[code];
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '🌨️';
  if (code >= 80 && code <= 82) return '🌦️';
  return '🌡️';
}

function formatTime(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function renderEmpty() {
  panel.innerHTML = `
    <div class="state-card state-empty">
      <span class="state-icon" aria-hidden="true">🌍</span>
      <p class="state-title">开始查询天气</p>
      <p class="state-desc">在上方输入城市名，例如「北京」或「Shanghai」，点击查询或按回车</p>
    </div>
  `;
}

export function renderLoading() {
  panel.innerHTML = `
    <div class="state-card state-loading">
      <div class="spinner" aria-hidden="true"></div>
      <p class="state-title">正在查询…</p>
    </div>
  `;
}

export function renderError(message) {
  panel.innerHTML = `
    <div class="state-card state-error">
      <span class="state-icon" aria-hidden="true">⚠️</span>
      <p class="state-title">查询失败</p>
      <p class="state-desc">${escapeHtml(message)}</p>
    </div>
  `;
}

export function renderWeather(data) {
  const emoji = getWeatherEmoji(data.weatherCode);
  const temp = Number(data.temperature);
  const tempDisplay = Number.isFinite(temp) ? Math.round(temp * 10) / 10 : '—';

  panel.innerHTML = `
    <article class="weather-card">
      <header class="weather-card__header">
        <div class="weather-card__location">
          <h2 class="weather-card__city">${escapeHtml(data.city)}</h2>
          <p class="weather-card__country">${escapeHtml(data.country)}</p>
        </div>
        <span class="weather-card__emoji" aria-hidden="true">${emoji}</span>
      </header>

      <p class="weather-card__temp">
        <span class="weather-card__temp-value">${tempDisplay}</span>
        <span class="weather-card__temp-unit">°C</span>
      </p>

      <p class="weather-card__desc">${escapeHtml(data.weatherDescription)}</p>

      <dl class="weather-card__meta">
        <div class="weather-card__meta-item">
          <dt>湿度</dt>
          <dd>${escapeHtml(String(data.humidity))}%</dd>
        </div>
        <div class="weather-card__meta-item">
          <dt>风速</dt>
          <dd>${escapeHtml(String(data.windSpeed))} km/h</dd>
        </div>
      </dl>

      <p class="weather-card__updated">
        更新时间：${escapeHtml(formatTime(data.fetchedAt))}
      </p>
    </article>
  `;
}

export function setSearchLoading(isLoading) {
  const btn = document.getElementById('search-btn');
  const input = document.getElementById('city-input');
  btn.disabled = isLoading;
  input.disabled = isLoading;
  btn.textContent = isLoading ? '查询中…' : '查询';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
