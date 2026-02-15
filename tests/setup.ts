import { db } from '../src/config/Database';

process.env.DATABASE_PATH = ':memory:';

// This runs once for every test file
beforeEach(() => {
    // List all your tables here to ensure a clean slate
    const tables = ['specs', 'ui_flows', 'scenarios'];
    for (const table of tables) {
        db.prepare(`DELETE FROM ${table}`).run();
    }
});

// Optional: Clean up the file system if you are using physical test files
afterAll(() => {
    // Explicitly close the connection
    db.close(); 
    
    // Optional: If you want to force delete the physical test DB file
    // after the connection is closed:
    const dbPath = process.env.DATABASE_PATH;
    if (dbPath && dbPath !== ':memory:') {
        // We delay slightly to let the OS release the file lock
        setTimeout(() => {
            try { 
                // This removes the .db, .db-wal, and .db-shm files
                const dir = require('path').dirname(dbPath);
                const files = require('fs').readdirSync(dir);
                files.forEach((f: string) => {
                    if (f.includes('test_')) require('fs').unlinkSync(`${dir}/${f}`);
                });
            } catch (e) {}
        }, 100);
    }
});