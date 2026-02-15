import { ScenarioModel } from '../../src/models/ScenarioModel';
import { db } from '../../src/config/Database';

describe('ScenarioModel', () => {
    let model: ScenarioModel;

    beforeAll(() => model = new ScenarioModel());
    beforeEach(() => db.prepare('DELETE FROM scenarios').run());

    test('should save steps as JSON', () => {
        const steps = [
            { type: 'api_call', spec_id: '123' },
            { type: 'ui_flow', flow_id: 'abc' }
        ];

        model.add({ id: 'scn_1', steps });
        
        const result = model.getById('scn_1');
        expect(result.steps).toHaveLength(2);
        expect(result.steps[0].spec_id).toBe('123');
    });
});