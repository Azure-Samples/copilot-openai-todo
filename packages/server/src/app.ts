import path from 'node:path';
import express from 'express';
import pino from 'pino-http';
import router from './routes/index';

const publicDir = path.join(__dirname, '..', 'public');
const app = express();

app.use(pino());
app.use(express.static(publicDir));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', router);

// SPA fallback
app.get('*', (req, res, next) => {
  console.log(req.url);
  if (req.url.startsWith('/api/')) {
    return next();
  }
	res.sendFile(path.join(publicDir, 'index.html'));
});

export default app;
