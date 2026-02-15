import app from './app';
import { db } from './config/Database';
import { logger } from './utils/logger';
import { Server } from 'http';

const PORT = process.env.PORT || 3001;

// Initialize the variable so the shutdown function can "see" it
let server: Server;

server = app.listen(PORT, () => {
    logger.info(`🚀 Hybrid Automation Server running on port ${PORT}`);
});

const shutdown = () => {
    logger.info('Shutting down gracefully...');
    
    // Check if server exists before closing
    if (server) {
        server.close(() => {
            logger.info('HTTP server closed.');
            db.close();
            logger.info('Database connection closed.');
            process.exit(0);
        });
    } else {
        db.close();
        process.exit(0);
    }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);