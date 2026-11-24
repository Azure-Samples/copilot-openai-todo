import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import router from './routes/root';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env', quiet: true });

const app = express();

app.use(pino());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', router);

export default app;
