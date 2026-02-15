import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../utils/logger';

class DatabaseUtility {
    public _db: Database.Database;

    constructor() {
        const dbPath = process.env.DATABASE_PATH || './data/api_specs.db';
        const schemaPath = process.env.DATABASE_SCHEMA || './dbschema.sql';

        // 1. Ensure Directory Exists
        const dir = path.dirname(dbPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // 2. Connect
        this._db = new Database(dbPath); // verbose: logger.info for debugging

        // Apply WAL mode for better concurrency handling during tests
        this._db.pragma('journal_mode = WAL');

        // 3. Initialize Schema
        this.initSchema(schemaPath);
    }

    private initSchema(schemaPath: string) {
        if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf-8');
            this._db.exec(schema);
            logger.info("Database schema initialized successfully.");
        } else {
            logger.warn(`Schema file not found at ${schemaPath}. Tables might be missing.`);
        }
    }

    public get database(){
        return this._db
    }
}

// Export a singleton instance
export const db = new DatabaseUtility().database;