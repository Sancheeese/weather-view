import { fetchWeather, ApiError } from './api.js';
import { initUI, showEmpty, showLoading, showError, showWeather } from './ui.js';

const form = document.getElementById('search-form');
const input = document.getElementById('city-input');
const submitBtn = document.getElementById('search-btn');
const panel = document.getElementById('weather-panel');

let activeController = null;

initUI(panel);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  handleSearch(input.value);
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleSearch(input.value);
  }
});

/**
 * @param {string} city
 */
async function handleSearch(city) {
  const trimmed = city.trim();
  if (!trimmed) {
    showError('请输入城市名称');
    input.focus();
    return;
  }

  if (activeController) {
    activeController.abort();
  }
  activeController = new AbortController();

  setBusy(true);
  showLoading(trimmed);

  try {
    const result = await fetchWeather(trimmed, { signal: activeController.signal });
    showWeather(result.data);
  } catch (error) {
    if (error.name === 'AbortError') return;
    const message =
      error instanceof ApiError ? error.message : '网络异常，请检查后端是否已启动';
    showError(message);
  } finally {
    setBusy(false);
    activeController = null;
  }
}

/**
 * @param {boolean} busy
 */
function setBusy(busy) {
  submitBtn.disabled = busy;
  input.disabled = busy;
  submitBtn.textContent = busy ? '查询中…' : '查询';
}
