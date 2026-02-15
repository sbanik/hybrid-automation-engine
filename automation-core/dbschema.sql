-- ========================================================
-- 1. API SPECIFICATIONS TABLE
-- Stores executable API request templates.
-- FLATTENED OPTIONS: Playwright settings are top-level columns.
-- ========================================================
CREATE TABLE IF NOT EXISTS specs (
    id TEXT PRIMARY KEY,          -- Unique ID (e.g., 'get_user_v1')
    name TEXT,                    -- Human-readable name
    method TEXT DEFAULT 'GET',    -- HTTP Method
    endpoint TEXT,                -- URL (can contain {{variables}})
    
    -- JSON Fields (Stored as TEXT)
    headers TEXT,                 -- JSON: {"Authorization": "Bearer..."}
    params TEXT,                  -- JSON: Query parameters
    body TEXT,                    -- JSON: Request body
    extract TEXT,                 -- JSON: {"varName": "$.jsonPath"}
    
    -- FLATTENED Playwright Options
    timeout INTEGER DEFAULT 30000,      -- Request timeout in ms
    failOnStatusCode BOOLEAN DEFAULT 1, -- 1=True, 0=False (Throw error on 4xx/5xx)
    ignoreHTTPSErrors BOOLEAN DEFAULT 0,-- 1=True (Self-signed certs)
    maxRedirects INTEGER DEFAULT 20,     -- Max number of redirects to follow

    -- NEW FLAG: Should this API share cookies with the Browser?
    use_page_context BOOLEAN DEFAULT 0  -- 0 = No (Isolated), 1 = Yes (Shared)
);

-- ========================================================
-- 2. UI FLOWS TABLE
-- Stores reusable sequences of browser interactions.
-- ========================================================
CREATE TABLE IF NOT EXISTS ui_flows (
    id TEXT PRIMARY KEY,          -- Unique ID (e.g., 'login_flow')
    description TEXT,             -- What this flow does
    steps TEXT                    -- JSON Array: [{"action": "click", "selector": "#btn"}]
);

-- ========================================================
-- 3. SCENARIOS TABLE (The "Test Case")
-- Stitches API Specs and UI Flows into a complete test.
-- ========================================================
CREATE TABLE IF NOT EXISTS scenarios (
    id TEXT PRIMARY KEY,          -- Unique ID (e.g., 'e2e_checkout_test')
    description TEXT,             -- Description of the test case
    steps TEXT                    -- JSON Array: [{"type": "api_call", "spec_id": "..."}]
);  