import { Request, Response } from 'express';
import { UiFlowModel } from '../models/UiFlowModel';

export class UiFlowController {

    static addUiFlow(req: Request, res: Response) {
        try {
            const model = new UiFlowModel();
            const created = model.add(req.body);
            res.status(201).json(created);
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    }

    static getUiFlow(req: Request, res: Response) {
        const model = new UiFlowModel();
        const flow = model.getById(req.params.id);
        if (flow) res.json(flow);
        else res.status(404).json({ error: "UI Flow not found" });
    }

    static getAllUiFlows(req: Request, res: Response) {
        const model = new UiFlowModel();
        res.json(model.getAll());
    }

    static updateUiFlow(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const model = new UiFlowModel();
            
            if (!model.getById(id)) return res.status(404).json({ error: "UI Flow not found" });

            // Using add() as upsert
            const updated = model.add({ ...req.body, id });
            res.json(updated);
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    }

    static deleteUiFlow(req: Request, res: Response) {
        const model = new UiFlowModel();
        if (model.delete(req.params.id)) {
            res.json({ message: "UI Flow deleted successfully" });
        } else {
            res.status(404).json({ error: "UI Flow not found" });
        }
    }
}