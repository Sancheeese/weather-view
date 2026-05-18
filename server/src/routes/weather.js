const express = require('express');
const { getWeatherByCity } = require('../services/weather');

const router = express.Router();

router.get('/', async (req, res) => {
  const city = req.query.city?.trim();

  if (!city) {
    return res.status(400).json({ ok: false, error: 'city is required' });
  }

  try {
    const result = await getWeatherByCity(city);

    if (result.notFound) {
      return res.status(404).json({ ok: false, error: 'city not found' });
    }

    return res.json({ ok: true, data: result.data });
  } catch {
    return res.status(502).json({ ok: false, error: 'weather service unavailable' });
  }
});

module.exports = router;
