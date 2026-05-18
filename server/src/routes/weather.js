import { Router } from 'express';
import {
  getWeatherByCity,
  CityNotFoundError,
  WeatherServiceError,
} from '../services/weather.js';

const router = Router();

router.get('/weather', async (req, res) => {
  const city = req.query.city?.trim();

  if (!city) {
    return res.status(400).json({ ok: false, error: 'city is required' });
  }

  try {
    const data = await getWeatherByCity(city);
    return res.json({ ok: true, data });
  } catch (err) {
    if (err instanceof CityNotFoundError) {
      return res.status(404).json({ ok: false, error: 'city not found' });
    }
    if (err instanceof WeatherServiceError) {
      return res.status(502).json({ ok: false, error: 'weather service unavailable' });
    }
    return res.status(502).json({ ok: false, error: 'weather service unavailable' });
  }
});

export default router;
