import { SpecModel } from '../../src/models/SpecModel';
import { db } from '../../src/config/Database';

describe('SpecModel (Database)', () => {
    let model: SpecModel;

    beforeAll(() => {
        model = new SpecModel();
    });

    beforeEach(() => {
        // Clear table
        db.prepare('DELETE FROM specs').run();
    });

    test('should create and retrieve a Spec with all options', () => {
        const input = {
            id: 'test_spec_1',
            name: 'Complex API',
            endpoint: 'https://api.test/v1',
            method: 'POST',
            timeout: 5000,
            use_page_context: true, // <--- Testing new flag
            headers: { 'X-Test': '123' }
        };

        model.add(input);
        const result = model.getById('test_spec_1');

        expect(result).toBeDefined();
        expect(result.name).toBe('Complex API');
        expect(result.timeout).toBe(5000);
        expect(result.use_page_context).toBe(true); // Should be Boolean
        expect(result.headers).toEqual({ 'X-Test': '123' }); // Should be parsed JSON
    });

    test('should update an existing Spec', () => {
        model.add({ id: 'update_me', name: 'Old Name' });
        
        // Update via overwrite (add with same ID)
        model.add({ id: 'update_me', name: 'New Name', method: 'DELETE' });
        
        const result = model.getById('update_me');
        expect(result.name).toBe('New Name');
        expect(result.method).toBe('DELETE');
    });

    test('should delete a Spec', () => {
        model.add({ id: 'delete_me' });
        expect(model.delete('delete_me')).toBe(true);
        expect(model.getById('delete_me')).toBeUndefined();
    });
});