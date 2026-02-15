import { Request, Response } from 'express';
import { ScenarioModel } from '../models/ScenarioModel';

export class ScenarioController {

    static addScenario(req: Request, res: Response) {
        try {
            const model = new ScenarioModel();
            const created = model.add(req.body);
            res.status(201).json(created);
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    }

    static getScenario(req: Request, res: Response) {
        const model = new ScenarioModel();
        const scenario = model.getById(req.params.id);
        if (scenario) res.json(scenario);
        else res.status(404).json({ error: "Scenario not found" });
    }

    static getAllScenarios(req: Request, res: Response) {
        const model = new ScenarioModel();
        res.json(model.getAll());
    }

    static updateScenario(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const model = new ScenarioModel();
            
            if (!model.getById(id)) return res.status(404).json({ error: "Scenario not found" });

            // Using add() as upsert
            const updated = model.add({ ...req.body, id });
            res.json(updated);
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    }

    static deleteScenario(req: Request, res: Response) {
        const model = new ScenarioModel();
        if (model.delete(req.params.id)) {
            res.json({ message: "Scenario deleted successfully" });
        } else {
            res.status(404).json({ error: "Scenario not found" });
        }
    }
}