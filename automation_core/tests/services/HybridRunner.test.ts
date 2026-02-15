import { HybridRunner } from '../../src/services/HybridRunner';
import { SpecModel } from '../../src/models/SpecModel';
import { ScenarioModel } from '../../src/models/ScenarioModel';
import { ApiRunner } from '../../src/services/ApiRunner';

// Mock dependencies
jest.mock('../../src/services/ApiRunner');
jest.mock('../../src/services/UiRunner');

describe('HybridRunner Service', () => {
    let runner: HybridRunner;
    let specModel: SpecModel;
    let scenarioModel: ScenarioModel;

    beforeEach(() => {
        // Clear DB
        const { db } = require('../../src/config/Database');
        db.prepare('DELETE FROM specs').run();
        db.prepare('DELETE FROM scenarios').run();

        runner = new HybridRunner();
        specModel = new SpecModel();
        scenarioModel = new ScenarioModel();
    });

    test('should run a scenario with 1 API step', async () => {
        // 1. Setup Data
        specModel.add({ id: 'api_1', endpoint: '/test', method: 'GET' });
        scenarioModel.add({
            id: 'scn_1',
            steps: [{ type: 'api_call', spec_id: 'api_1' }]
        });

        // 2. Mock ApiRunner execution
        const mockExecute = jest.spyOn(ApiRunner.prototype, 'execute').mockResolvedValue();

        // 3. Run
        const result = await runner.runScenario('scn_1');

        // 4. Assert
        expect(result.status).toBe('passed');
        expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    test('should fail if Spec ID is missing', async () => {
        scenarioModel.add({
            id: 'scn_bad',
            steps: [{ type: 'api_call', spec_id: 'MISSING_ID' }]
        });

        const result = await runner.runScenario('scn_bad');
        expect(result.status).toBe('failed');
        expect(result.error).toMatch(/Spec ID 'MISSING_ID' not found/);
    });
});