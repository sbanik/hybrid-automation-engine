import { db } from '../config/Database';
import { randomUUID } from 'crypto';

export class UiFlowModel {

    add(flow: any) {
        const id = flow.id || randomUUID();
        db.prepare(`
            INSERT OR REPLACE INTO ui_flows (id, description, steps)
            VALUES (@id, @description, @steps)
        `).run({
            id,
            description: flow.description || 'Untitled Flow',
            steps: JSON.stringify(flow.steps || [])
        });
        return this.getById(id);
    }

    getById(id: string) {
        const row = db.prepare('SELECT * FROM ui_flows WHERE id = ?').get(id);
        return this.deserialize(row);
    }

    getAll() {
        return db.prepare('SELECT * FROM ui_flows').all().map(r => this.deserialize(r));
    }

    delete(id: string): boolean {
        return db.prepare('DELETE FROM ui_flows WHERE id = ?').run(id).changes > 0;
    }

    private deserialize(row: any) {
        if (!row) return undefined;
        return {
            ...row,
            steps: row.steps ? JSON.parse(row.steps) : []
        };
    }
}