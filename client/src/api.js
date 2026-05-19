/**
 * 天气 API 封装
 * GET /api/weather?city=xxx
 */

/**
 * @typedef {Object} WeatherSuggestion
 * @property {string} category
 * @property {string} label
 * @property {string[]} tips
 */

/**
 * @typedef {Object} WeatherData
 * @property {string} city
 * @property {string} country
 * @property {number} latitude
 * @property {number} longitude
 * @property {number} temperature
 * @property {number} humidity
 * @property {number} windSpeed
 * @property {number} weatherCode
 * @property {string} weatherDescription
 * @property {string} fetchedAt
 * @property {WeatherSuggestion[]} [suggestions]
 */

/**
 * @typedef {Object} WeatherSuccess
 * @property {true} ok
 * @property {WeatherData} data
 */

/**
 * @typedef {Object} WeatherError
 * @property {false} ok
 * @property {string} error
 */

/**
 * @param {string} city
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<WeatherSuccess>}
 */
export async function fetchWeather(city, options = {}) {
  const trimmed = city.trim();
  if (!trimmed) {
    throw new ApiError('请输入城市名称', 400);
  }

  const params = new URLSearchParams({ city: trimmed });
  const response = await fetch(`/api/weather?${params}`, { signal: options.signal });

  let body;
  try {
    body = await response.json();
  } catch {
    throw new ApiError('服务响应异常，请稍后重试', response.status || 502);
  }

  if (!response.ok || body.ok === false) {
    const message = body?.error || getDefaultErrorMessage(response.status);
    throw new ApiError(message, response.status);
  }

  return body;
}

export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} [status]
   */
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * @param {number} status
 * @returns {string}
 */
function getDefaultErrorMessage(status) {
  if (status === 404) return '未找到该城市，请检查拼写';
  if (status === 400) return '请求参数有误';
  if (status >= 500) return '天气服务暂时不可用，请稍后重试';
  return '查询失败，请稍后重试';
}
