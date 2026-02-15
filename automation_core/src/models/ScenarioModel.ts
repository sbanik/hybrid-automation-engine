import { db } from '../config/Database';
import { randomUUID } from 'crypto';

export class ScenarioModel {

    add(scenario: any) {
        const id = scenario.id || randomUUID();
        db.prepare(`
            INSERT OR REPLACE INTO scenarios (id, description, steps)
            VALUES (@id, @description, @steps)
        `).run({
            id,
            description: scenario.description || 'Untitled Scenario',
            steps: JSON.stringify(scenario.steps || [])
        });
        return this.getById(id);
    }

    getById(id: string) {
        const row = db.prepare('SELECT * FROM scenarios WHERE id = ?').get(id);
        return this.deserialize(row);
    }

    getAll() {
        return db.prepare('SELECT * FROM scenarios').all().map(r => this.deserialize(r));
    }

    delete(id: string): boolean {
        return db.prepare('DELETE FROM scenarios WHERE id = ?').run(id).changes > 0;
    }

    private deserialize(row: any) {
        if (!row) return undefined;
        return {
            ...row,
            steps: row.steps ? JSON.parse(row.steps) : []
        };
    }
}