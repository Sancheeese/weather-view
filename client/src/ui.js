/** @type {HTMLElement} */
let panelEl;

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
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  71: '🌨️',
  73: '🌨️',
  75: '❄️',
  80: '🌦️',
  81: '🌧️',
  82: '⛈️',
  95: '⛈️',
};

const SUGGESTION_ICONS = {
  clothing: '👕',
  travel: '🚶',
  comfort: '💧',
};

const DESCRIPTION_ZH = {
  'Clear sky': '晴朗',
  'Mainly clear': '大部晴朗',
  'Partly cloudy': '局部多云',
  Overcast: '阴天',
  Fog: '雾',
  Drizzle: '毛毛雨',
  Rain: '雨',
  Snow: '雪',
  Thunderstorm: '雷暴',
};

export function initUI(panel) {
  panelEl = panel;
  showEmpty();
}

export function showEmpty() {
  panelEl.innerHTML = `
    <div class="state-card state-empty">
      <span class="state-icon" aria-hidden="true">🌍</span>
      <h2 class="state-title">开始查询</h2>
      <p class="state-text">在上方输入城市名称，例如「北京」或「Shanghai」，即可查看当前天气。</p>
    </div>
  `;
}

export function showLoading(city) {
  panelEl.innerHTML = `
    <div class="state-card state-loading">
      <div class="spinner" role="status" aria-label="加载中"></div>
      <p class="state-text">正在查询「${escapeHtml(city)}」的天气…</p>
    </div>
  `;
}

export function showError(message) {
  panelEl.innerHTML = `
    <div class="state-card state-error">
      <span class="state-icon" aria-hidden="true">⚠️</span>
      <h2 class="state-title">查询失败</h2>
      <p class="state-text">${escapeHtml(message)}</p>
    </div>
  `;
}

/**
 * @param {import('./api.js').WeatherData} data
 */
export function showWeather(data) {
  const emoji = getWeatherEmoji(data.weatherCode);
  const description = DESCRIPTION_ZH[data.weatherDescription] || data.weatherDescription;
  const updatedAt = formatFetchedAt(data.fetchedAt);
  const temp = Math.round(data.temperature * 10) / 10;
  const wind = Math.round(data.windSpeed * 10) / 10;

  panelEl.innerHTML = `
    <article class="weather-card">
      <header class="weather-card-header">
        <div class="weather-location">
          <h2 class="weather-city">${escapeHtml(data.city)}</h2>
          <p class="weather-country">${escapeHtml(data.country)}</p>
        </div>
        <span class="weather-emoji" aria-hidden="true">${emoji}</span>
      </header>

      <div class="weather-main">
        <p class="weather-temp" aria-label="当前温度">${temp}<span class="weather-unit">°C</span></p>
        <p class="weather-desc">${escapeHtml(description)}</p>
      </div>

      <ul class="weather-metrics">
        <li class="metric">
          <span class="metric-label">湿度</span>
          <span class="metric-value">${data.humidity}<span class="metric-unit">%</span></span>
        </li>
        <li class="metric">
          <span class="metric-label">风速</span>
          <span class="metric-value">${wind}<span class="metric-unit"> km/h</span></span>
        </li>
        <li class="metric">
          <span class="metric-label">坐标</span>
          <span class="metric-value metric-coords">${data.latitude.toFixed(1)}°, ${data.longitude.toFixed(1)}°</span>
        </li>
      </ul>

      ${renderSuggestions(data.suggestions)}

      ${renderAttractions(data.attractions)}

      <footer class="weather-updated">
        <time datetime="${escapeHtml(data.fetchedAt)}">更新于 ${updatedAt}</time>
      </footer>
    </article>
  `;
}

/**
 * @param {import('./api.js').WeatherData['suggestions']} suggestions
 */
function renderSuggestions(suggestions) {
  if (!suggestions?.length) return '';

  const sections = suggestions
    .map((group) => {
      const icon = SUGGESTION_ICONS[group.category] ?? '💡';
      const items = group.tips
        .map((tip) => `<li>${escapeHtml(tip)}</li>`)
        .join('');
      return `
        <section class="suggestion-group">
          <h3 class="suggestion-title">
            <span class="suggestion-icon" aria-hidden="true">${icon}</span>
            ${escapeHtml(group.label)}
          </h3>
          <ul class="suggestion-list">${items}</ul>
        </section>
      `;
    })
    .join('');

  return `
    <section class="weather-suggestions" aria-label="生活建议">
      <h2 class="suggestions-heading">生活建议</h2>
      ${sections}
    </section>
  `;
}

/**
 * @param {import('./api.js').WeatherData['attractions']} attractions
 */
function renderAttractions(attractions) {
  if (!attractions?.length) return '';

  const items = attractions
    .map((spot) => {
      const tags = spot.tags?.length
        ? `<ul class="attraction-tags" aria-label="标签">${spot.tags
            .map((tag) => `<li class="attraction-tag">${escapeHtml(tag)}</li>`)
            .join('')}</ul>`
        : '';
      const description = spot.description
        ? `<p class="attraction-desc">${escapeHtml(spot.description)}</p>`
        : '';

      return `
        <article class="attraction-item">
          <h3 class="attraction-name">${escapeHtml(spot.name)}</h3>
          ${description}
          ${tags}
        </article>
      `;
    })
    .join('');

  return `
    <section class="weather-attractions" aria-label="推荐景点">
      <h2 class="attractions-heading">推荐景点</h2>
      <div class="attraction-list">${items}</div>
    </section>
  `;
}

function getWeatherEmoji(code) {
  if (WEATHER_EMOJI[code] !== undefined) return WEATHER_EMOJI[code];
  if (code >= 0 && code <= 3) return WEATHER_EMOJI[code] ?? '🌡️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '🌨️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 95) return '⛈️';
  return '🌡️';
}

function formatFetchedAt(iso) {
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
