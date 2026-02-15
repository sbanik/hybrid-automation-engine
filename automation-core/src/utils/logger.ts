import winston from 'winston';
import * as fs from 'fs';

const logPath: string = process.env.LOG_PATH || './output/logs'

// Ensure logs directory exists
if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, {recursive: true});
}

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
            return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaString}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `${logPath}/server.log` })
    ]
});