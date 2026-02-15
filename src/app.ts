import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import routes from './routes';
import * as dotenv from 'dotenv';
import { logger } from './utils/logger';

dotenv.config();

const app = express();

// Load Swagger Document
const swaggerDocument = YAML.load('./swagger.yaml');

app.use(express.json());

// Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Request Logging Middleware
app.use((req, res, next) => {
    logger.info(`Incoming API Request: ${req.method} ${req.url}`);
    next();
});

app.use('/api', routes);

export default app;