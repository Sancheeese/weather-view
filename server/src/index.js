require('dotenv').config();

const express = require('express');
const cors = require('cors');
const weatherRouter = require('./routes/weather');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:3000'],
  })
);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/weather', weatherRouter);

app.listen(PORT, () => {
  console.log(`Weather API listening on http://localhost:${PORT}`);
});
