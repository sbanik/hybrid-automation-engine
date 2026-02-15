import express from 'express';
import routes from './routes';
import * as dotenv from 'dotenv';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
app.use(express.json());

// Request Logging Middleware
app.use((req, res, next) => {
    logger.info(`Incoming API Request: ${req.method} ${req.url}`);
    next();
});

app.use('/api', routes);

export default app;