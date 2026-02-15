import { Router } from 'express';
import { AutomationController } from '../controllers/AutomationController';
import { SpecController } from '../controllers/SpecController';
import { UiFlowController } from '../controllers/UiFlowController';
import { ScenarioController } from '../controllers/ScenarioController';

const router = Router();

// =========================================================
// 1. AUTOMATION ENGINE (The Runner)
// =========================================================
router.post('/execute', AutomationController.execute);


// =========================================================
// 2. API SPECIFICATIONS (Manage Requests)
// =========================================================
router.post('/spec', SpecController.addSpec);               // Create/Update
router.get('/spec', SpecController.getAllSpecs);            // List All
router.get('/spec/:id', SpecController.getSpec);            // Get One
router.put('/spec/:id', SpecController.updateSpec);         // Update
router.delete('/spec/:id', SpecController.deleteSpec);      // Delete
router.post('/spec/swagger', SpecController.ingestSwagger); // Import OpenAPI


// =========================================================
// 3. UI FLOWS (Manage Browser Actions)
// =========================================================
router.post('/uiflow', UiFlowController.addUiFlow);         // Create/Update
router.get('/uiflow', UiFlowController.getAllUiFlows);      // List All
router.get('/uiflow/:id', UiFlowController.getUiFlow);      // Get One
router.put('/uiflow/:id', UiFlowController.updateUiFlow);   // Update
router.delete('/uiflow/:id', UiFlowController.deleteUiFlow);// Delete


// =========================================================
// 4. SCENARIOS (Manage Test Logic)
// =========================================================
router.post('/scenario', ScenarioController.addScenario);       // Create/Update
router.get('/scenario', ScenarioController.getAllScenarios);    // List All
router.get('/scenario/:id', ScenarioController.getScenario);    // Get One
router.put('/scenario/:id', ScenarioController.updateScenario); // Update
router.delete('/scenario/:id', ScenarioController.deleteScenario);// Delete


// =========================================================
// 5. Database Cleanup
// =========================================================
router.post('/admin/checkpoint', (req, res) => {
    try {
        const { db } = require('../config/Database');
        // FULL checkpoint: ensures all data is moved and the WAL file is truncated
        db.pragma('wal_checkpoint(FULL)');
        res.json({ message: "Checkpoint successful. WAL files merged." });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});


export default router;