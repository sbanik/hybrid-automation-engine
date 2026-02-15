import { Request, Response } from 'express';
import { HybridRunner } from '../services/HybridRunner';
import { logger } from '../utils/logger';

export class AutomationController {
    static async execute(req: Request, res: Response) {
        const { scenarioId, variables } = req.body;

        // Validate Input
        if (!scenarioId) {
            return res.status(400).json({ error: "Missing 'scenarioId' in request body" });
        }

        // Initialize Runner with runtime variables (e.g., env overrides)
        const runner = new HybridRunner(variables || {});

        try {
            logger.info(`Received execution request for scenario: ${scenarioId}`);
            
            // Execute
            const result = await runner.runScenario(scenarioId);
            
            // Return 200 for passed, 400 for logic failure (e.g. assertion failed), 500 for crash
            const statusCode = result.status === 'passed' ? 200 : 400;
            res.status(statusCode).json(result);

        } catch (e: any) {
            logger.error(`Execution crash: ${e.message}`);
            res.status(500).json({ 
                status: 'error', 
                message: 'Internal Server Error', 
                error: e.message 
            });
        }
    }
}