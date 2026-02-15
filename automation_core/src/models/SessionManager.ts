export class SessionManager {
    private store: Map<string, any>;

    constructor(initialData: Record<string, any> = {}) {
        this.store = new Map(Object.entries(initialData));
    }

    set(key: string, value: any): void {
        this.store.set(key, value);
    }

    get(key: string): any {
        return this.store.get(key);
    }

    getAll(): Record<string, any> {
        return Object.fromEntries(this.store);
    }

    /**
     * Injects variables into a string template.
     * Syntax: {{variableName}}
     */
    resolve(template: any): any {
        if (typeof template !== 'string') return template;

        return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
            if (key.startsWith('env.')) {
                return process.env[key.split('.')[1]] || `MISSING_ENV_${key}`;
            }
            return this.store.get(key) || `{{${key}}}`;
        });
    }

    /**
     * Deeply resolves variables in objects/arrays.
     */
    resolveObject(obj: any): any {
        if (Array.isArray(obj)) return obj.map(v => this.resolveObject(v));
        if (typeof obj === 'object' && obj !== null) {
            const result: any = {};
            for (const key in obj) {
                result[key] = this.resolveObject(obj[key]);
            }
            return result;
        }
        return this.resolve(obj);
    }
}