import { Page } from 'playwright';
import { SessionManager } from '../models/SessionManager';
import { logger } from '../utils/logger';

export class UiRunner {
    constructor(private session: SessionManager) {}

    async executeSteps(page: Page, steps: any[], logs: string[]) {
        for (const step of steps) {
            await this.executeAction(page, step, logs);
        }
    }

    private async executeAction(page: Page, step: any, logs: string[]) {
        const selector = this.session.resolve(step.selector);
        const value = this.session.resolve(step.value);
        const url = this.session.resolve(step.url);

        const logMsg = `[UI] ${step.action} ${selector || url || ''}`;
        logger.info(logMsg);
        logs.push(logMsg);

        switch (step.action) {
            case 'goto':
                await page.goto(url);
                break;
            case 'fill':
                await page.fill(selector, value);
                break;
            case 'click':
                await page.click(selector);
                break;
            case 'wait_for_selector':
                await page.waitForSelector(selector);
                break;
            case 'evaluate':
                const result = await page.evaluate(step.script);
                if (step.store) {
                    this.session.set(step.store, result);
                    logs.push(`   -> Stored ${step.store} = ${result}`);
                }
                break;
            case 'screenshot':
                await page.screenshot({ path: this.session.resolve(step.path) });
                break;
            default:
                throw new Error(`Unknown UI Action: ${step.action}`);
        }
    }
}