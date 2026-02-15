import { Request, Response } from 'express';
import { SpecModel } from '../models/SpecModel';

export class SpecController {

    static addSpec(req: Request, res: Response) {
        try {
            const model = new SpecModel();
            const created = model.add(req.body);
            res.status(201).json(created);
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    }

    static getSpec(req: Request, res: Response) {
        const model = new SpecModel();
        const spec = model.getById(req.params.id);
        if (spec) res.json(spec);
        else res.status(404).json({ error: "Spec not found" });
    }

    static getAllSpecs(req: Request, res: Response) {
        const model = new SpecModel();
        res.json(model.getAll());
    }

    static updateSpec(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const model = new SpecModel();
            
            // Check existence first
            if (!model.getById(id)) {
                return res.status(404).json({ error: "Spec not found" });
            }

            // Perform update (Assuming you add update() to SpecModel based on previous pattern)
            // If strict separation, ensure SpecModel has update() method
            // For now, using add() with ID acts as "INSERT OR REPLACE" which is effectively an update
            const updated = model.add({ ...req.body, id }); 
            res.json(updated);
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    }

    static deleteSpec(req: Request, res: Response) {
        const model = new SpecModel();
        if (model.delete(req.params.id)) {
            res.json({ message: "Spec deleted successfully" });
        } else {
            res.status(404).json({ error: "Spec not found" });
        }
    }

    // Import Swagger/OpenAPI
    static ingestSwagger(req: Request, res: Response) {
        try {
            const swagger = req.body;
            const model = new SpecModel();
            const paths = swagger.paths || {};
            let count = 0;

            for (const [endpoint, methods] of Object.entries(paths)) {
                for (const [method, op] of Object.entries(methods as any)) {
                    const operation = op as any;
                    model.add({
                        name: operation.summary || `${method.toUpperCase()} ${endpoint}`,
                        method: method.toUpperCase(),
                        endpoint: endpoint,
                        extract: operation['x-automation-extract'] || {},
                        headers: operation['x-automation-headers'] || {}
                    });
                    count++;
                }
            }
            res.status(201).json({ message: `Imported ${count} specs successfully` });
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    }
}