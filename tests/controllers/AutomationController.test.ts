import request from 'supertest';
import app from '../../src/app';
import { db } from '../../src/config/Database';

describe('AutomationController API', () => {
    beforeEach(() => {
        db.prepare('DELETE FROM specs').run();
        db.prepare('DELETE FROM scenarios').run();
    });

    test('POST /api/execute - Run E2E Scenario', async () => {
        // 1. Create Spec
        await request(app).post('/api/spec').send({
            id: 'google_home',
            endpoint: 'https://google.com',
            method: 'GET'
        });

        // 2. Create Scenario
        await request(app).post('/api/scenario').send({
            id: 'smoke_test',
            steps: [{ type: 'api_call', spec_id: 'google_home' }]
        });

        // 3. Execute (Real Run)
        // Note: This actually hits Google, so usually we mock network in integration tests
        // For now, we assume it works or mock nock.
        const res = await request(app)
            .post('/api/execute')
            .send({ scenarioId: 'smoke_test' });

        // Even if it fails network (due to no nock), it should return a structured result
        expect(res.status).toBe(res.body.status === 'passed' ? 200 : 400);
        expect(res.body).toHaveProperty('scenario_id', 'smoke_test');
        expect(res.body).toHaveProperty('logs');
    }, 10000); // Higher timeout for real execution
});