/**
 * 请求天气数据
 * @param {string} city
 * @returns {Promise<{ ok: true, data: object } | { ok: false, error: string }>}
 */
export async function fetchWeather(city) {
  const params = new URLSearchParams({ city });
  const response = await fetch(`/api/weather?${params}`);

  let body;
  try {
    body = await response.json();
  } catch {
    return { ok: false, error: '服务器响应异常，请稍后重试' };
  }

  if (!response.ok || body.ok === false) {
    return {
      ok: false,
      error: body.error || '查询失败，请稍后重试',
    };
  }

  return body;
}
