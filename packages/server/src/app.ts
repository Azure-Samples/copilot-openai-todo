const express = require('express');
const cors = require('cors');
const pino = require('pino-http');
const router = require('./routes/root');
const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });

const app = express();

app.use(pino());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', router);

export default app;
