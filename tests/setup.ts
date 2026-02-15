import { db } from '../src/config/Database';

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
    // If you need to close the DB connection specifically
    db.close(); 
});