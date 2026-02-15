import { db } from '../config/Database';
import { randomUUID } from 'crypto';

export class SpecModel {

    add(spec: any) {
        const id = spec.id || randomUUID();

        db.prepare(`
            INSERT OR REPLACE INTO specs (
                id, name, method, endpoint, headers, params, body, extract,
                timeout, failOnStatusCode, ignoreHTTPSErrors, maxRedirects,
                use_page_context  -- <--- NEW COLUMN
            ) VALUES (
                @id, @name, @method, @endpoint, @headers, @params, @body, @extract,
                @timeout, @failOnStatusCode, @ignoreHTTPSErrors, @maxRedirects,
                @use_page_context -- <--- NEW PARAM
            )
        `).run({
            id,
            name: spec.name || 'Untitled',
            method: (spec.method || 'GET').toUpperCase(),
            endpoint: spec.endpoint || '/',
            headers: JSON.stringify(spec.headers || {}),
            params: JSON.stringify(spec.params || {}),
            body: JSON.stringify(spec.body || {}),
            extract: JSON.stringify(spec.extract || {}),
            timeout: spec.timeout ?? 30000,
            failOnStatusCode: spec.failOnStatusCode === false ? 0 : 1,
            ignoreHTTPSErrors: spec.ignoreHTTPSErrors ? 1 : 0,
            maxRedirects: spec.maxRedirects ?? 20,
            use_page_context: spec.use_page_context ? 1 : 0
        });
        return this.getById(id);
    }

    getById(id: string) {
        const row = db.prepare('SELECT * FROM specs WHERE id = ?').get(id);
        return this.deserialize(row);
    }

    getAll() {
        return db.prepare('SELECT * FROM specs').all().map(r => this.deserialize(r));
    }

    delete(id: string): boolean {
        return db.prepare('DELETE FROM specs WHERE id = ?').run(id).changes > 0;
    }

    // Helper
    private deserialize(row: any) {
        if (!row) return undefined;
        const result = { ...row };
        ['headers', 'params', 'body', 'extract'].forEach(k => {
            if (result[k]) result[k] = JSON.parse(result[k]);
        });
        result.failOnStatusCode = !!result.failOnStatusCode;
        result.ignoreHTTPSErrors = !!result.ignoreHTTPSErrors;
        result.use_page_context = !!result.use_page_context;
        return result;
    }
}