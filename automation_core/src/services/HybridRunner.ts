import { chromium, Browser, Page } from 'playwright';
import { SessionManager } from '../models/SessionManager';
import { SpecModel } from '../models/SpecModel';
import { UiFlowModel } from '../models/UiFlowModel';
import { ScenarioModel } from '../models/ScenarioModel';
import { ApiRunner } from './ApiRunner';
import { UiRunner } from './UiRunner';
import { AutomationResult, Step } from '../types';
import { logger } from '../utils/logger';

export class HybridRunner {
    private session: SessionManager;
    private apiRunner: ApiRunner;
    private uiRunner: UiRunner;
    private specModel: SpecModel;
    private uiFlowModel: UiFlowModel;
    private scenarioModel: ScenarioModel;

    constructor(initialVariables: Record<string, any> = {}) {
        this.session = new SessionManager(initialVariables);
        this.specModel = new SpecModel();
        this.uiFlowModel = new UiFlowModel();
        this.scenarioModel = new ScenarioModel();
        this.apiRunner = new ApiRunner(this.session);
        this.uiRunner = new UiRunner(this.session);
    }

    async runScenario(scenarioId: string): Promise<AutomationResult> {
        const logs: string[] = [];
        const scenario = this.scenarioModel.getById(scenarioId);
        
        if (!scenario) return { status: 'failed', scenario_id: scenarioId, error: "Scenario not found", logs };

        let browser: Browser | undefined;
        let page: Page | undefined;

        try {
            // Initialize Browser 
            browser = await chromium.launch({ headless: true });
            const context = await browser.newContext();
            page = await context.newPage();

            for (const rawStep of scenario.steps) {
                const step = this.resolveStep(rawStep);
                logs.push(`Step: ${step.step_name || 'Untitled'}`);

                if (step.type === 'api_call') {
                    // DECISION: Shared Context vs Isolated?
                    // You can control this via a flag in the step, e.g., 'use_page_context: true'
                    // For now, let's default to Page Context if available, or make it a specific check.
                    
                    if (step.use_page_context && page) {
                        await this.runApiInPageContext(step, page, logs);
                    } else {
                        // Default: Isolated Context
                        await this.apiRunner.execute(step, logs);
                    }
                } 
                else if (step.type === 'ui_flow') {
                    const flow = this.uiFlowModel.getById(step.flow_id);
                    if (flow) await this.uiRunner.executeSteps(page, flow.steps, logs);
                }
            }

            return { status: 'passed', scenario_id: scenarioId, session_data: this.session.getAll(), logs };

        } catch (e: any) {
            return { status: 'failed', scenario_id: scenarioId, error: e.message, logs };
        } finally {
            if (browser) await browser.close();
        }
    }

    // --- NEW METHOD YOU REQUESTED ---
    private async runApiInPageContext(step: Step, page: Page, logs: string[]) {
        logger.info(`[Hybrid] Delegating API step '${step.step_name}' to Page Context`);
        
        // page.request IS an APIRequestContext, but it shares cookies with the page
        await this.apiRunner.execute(step, logs, page.request);
    }

    private resolveStep(step: Step): Step {
        if (!step.spec_id) return step;
        const dbSpec = this.specModel.getById(step.spec_id);
        if (!dbSpec) throw new Error(`Spec ID '${step.spec_id}' not found`);

        return {
            ...step,
            // Merge logic (omitted for brevity, same as previous)
            request: {
                method: step.request?.method || dbSpec.method,
                url: step.request?.url || dbSpec.endpoint,
                headers: { ...dbSpec.headers, ...step.request?.headers },
                params: { ...dbSpec.params, ...step.request?.params },
                body: step.request?.body ? step.request.body : (dbSpec.body || {})
            },
            extract: { ...dbSpec.extract, ...step.extract },
            // Pass the flag through if it exists in the DB or Step
            use_page_context: step.use_page_context ?? dbSpec.use_page_context ?? false
            };
    }
}