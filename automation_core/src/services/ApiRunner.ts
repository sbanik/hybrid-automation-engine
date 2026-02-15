import { request, APIRequestContext } from 'playwright';
import * as jsonpath from 'jsonpath';
import { SessionManager } from '../models/SessionManager';
import { logger } from '../utils/logger';

export class ApiRunner {
    constructor(private session: SessionManager) {}

    // UPDATED: Accepts optional context
    async execute(step: any, logs: string[], externalContext?: APIRequestContext) {
        const req = step.request || {};
        
        // 1. Determine Context Strategy
        let context = externalContext;
        let isOwnContext = false;

        // If no context provided, create a generic one (Stateless)
        if (!context) {
            context = await request.newContext();
            isOwnContext = true;
            logger.info("   -> Using isolated API context");
        } else {
            logger.info("   -> Using shared Page context (Cookies/Auth shared)");
        }

        const url = this.session.resolve(req.url);
        const method = req.method || 'GET';
        const headers = this.session.resolveObject(req.headers || {});
        const params = this.session.resolveObject(req.params || {});
        const data = this.session.resolveObject(req.body || {});

        const logMsg = `[API] ${method} ${url}`;
        logger.info(logMsg);
        logs.push(logMsg);

        try {
            // 2. Execute Request
            const response = await context.fetch(url, {
                method,
                headers,
                params,
                data: ['GET', 'HEAD'].includes(method) ? undefined : data,
                
                timeout: step.timeout,                  
                failOnStatusCode: step.failOnStatusCode,
                maxRedirects: step.maxRedirects,        
                ignoreHTTPSErrors: step.ignoreHTTPSErrors 
            });

            const status = response.status();
            logs.push(`   -> Status: ${status} ${response.statusText()}`);

            // 3. Assertions
            if (step.assertions && Array.isArray(step.assertions)) {
                for (const assert of step.assertions) {
                    if (assert.check === 'status_code') {
                        if (status !== assert.value) {
                            throw new Error(`Assertion Failed: Expected status ${assert.value}, got ${status}`);
                        }
                    }
                }
            }

            // 4. Extraction
            if (step.extract) {
                let responseBody = {};
                try {
                    responseBody = await response.json();
                } catch (e) {
                    logger.warn(`Could not parse response body as JSON.`);
                }
                
                for (const [key, path] of Object.entries(step.extract)) {
                    // @ts-ignore
                    const val = jsonpath.value(responseBody, path as string);
                    if (val !== undefined) {
                        this.session.set(key, val);
                        logs.push(`   -> Extracted ${key}: ${val}`);
                    }
                }
            }

        } catch (error: any) {
            const errorMsg = `API Execution Failed: ${error.message}`;
            logger.error(errorMsg);
            throw new Error(errorMsg);
        } finally {
            // 5. CLEANUP: Only dispose if we created it
            if (isOwnContext && context) {
                await context.dispose();
            }
        }
    }
}