export interface Scenario {
    id: string;
    description?: string;
    steps: Step[];
}

export interface AutomationResult {
    status: 'passed' | 'failed';
    scenario_id: string;
    session_data?: any;
    error?: string;
    logs: string[];
}

export interface Step {
    step_name: string;
    type: 'api_call' | 'ui_flow';
    spec_id?: string;        // <-- NEW: Reference to SQLite DB
    request?: any;           // Optional overrides
    extract?: any;           // Runtime extraction logic
    assertions?: any[];      // Runtime assertions
    [key: string]: any;
}