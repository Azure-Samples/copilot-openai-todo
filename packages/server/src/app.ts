import express from 'express';
import pino from 'pino-http';
import router from './routes/index';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const app = express();

app.use(pino());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', router);

export default app;
