import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import weatherRouter from './routes/weather.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
  }),
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api', weatherRouter);

app.listen(PORT, () => {
  console.log(`Weather API listening on http://localhost:${PORT}`);
});
