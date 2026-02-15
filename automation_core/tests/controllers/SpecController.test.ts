import request from 'supertest';
import app from '../../src/app';
import { db } from '../../src/config/Database';

describe('SpecController API', () => {
    beforeEach(() => db.prepare('DELETE FROM specs').run());

    test('POST /api/spec - Create Spec', async () => {
        const res = await request(app)
            .post('/api/spec')
            .send({
                id: 'api_create',
                name: 'Create User',
                endpoint: '/users',
                use_page_context: true
            });

        expect(res.status).toBe(201);
        expect(res.body.id).toBe('api_create');
        expect(res.body.use_page_context).toBe(true);
    });

    test('GET /api/spec/:id - Retrieve Spec', async () => {
        // Seed
        await request(app).post('/api/spec').send({ id: 'api_get', name: 'Get User' });

        const res = await request(app).get('/api/spec/api_get');
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Get User');
    });

    test('GET /api/spec - List All', async () => {
        await request(app).post('/api/spec').send({ id: '1' });
        await request(app).post('/api/spec').send({ id: '2' });

        const res = await request(app).get('/api/spec');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
    });
});