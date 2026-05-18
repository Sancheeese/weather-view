import { fetchWeather } from './api.js';
import {
  renderEmpty,
  renderLoading,
  renderError,
  renderWeather,
  setSearchLoading,
} from './ui.js';

const form = document.getElementById('search-form');
const input = document.getElementById('city-input');

renderEmpty();

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const city = input.value.trim();
  if (!city) {
    renderError('请输入城市名称');
    return;
  }
  await search(city);
});

async function search(city) {
  renderLoading();
  setSearchLoading(true);

  try {
    const result = await fetchWeather(city);
    if (!result.ok) {
      renderError(result.error);
      return;
    }
    renderWeather(result.data);
  } catch {
    renderError('网络异常，请确认后端已启动后重试');
  } finally {
    setSearchLoading(false);
  }
}
