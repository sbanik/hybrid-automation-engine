# Hybrid Automation Engine

A high-performance Node.js & TypeScript automation engine that unifies **API Testing** and **UI Testing** using Playwright. 

## 🚀 Features
- **Unified Stack:** Pure Playwright for both UI and API (no Axios).
- **Shared Context:** API requests can optionally share cookies/auth state with the browser.
- **Flattened Options:** Direct control over timeout, redirects, and SSL via top-level JSON fields.
- **Relational Storage:** SQLite backend with separate models for Specs, UI Flows, and Scenarios.
- **Variable Resolution:** Dynamic data injection (e.g., `{{userId}}`) across all steps.

## 🛠️ Installation

### ⚙️ Configuration
Copy/rename the `.env.example` file with `.env` in the root:

```TOML
PORT=3001
DATABASE_PATH=./data/automation.db
DATABASE_SCHEMA=./dbschema.sql
```

### Build & Run

```bash
# Install dependencies in package.json
npm install 
# Install browser for automation
npx playwright install chromium 
# Build the project
npm run build 
# Run in Dev mode
npm run dev
# Start Derver
npm run start
```

### 🧪 Testing
Run all tests (sequential mode for SQLite)

```bash
 npm test
```

## 📍 Endpoints

`POST /api/execute` - Runs a full Hybrid Scenario.

Body: 
```json
{ "scenarioId": "string", "variables": {} }
```

### API Specifications

`GET /api/spec` - List all API templates.

`POST /api/spec` - Create/Update a spec (Flattened options).

`GET /api/spec/:id` - Get specific spec.

`DELETE /api/spec/:id` - Remove a spec.

`POST /api/spec/swagger` - Ingest an OpenAPI/Swagger file.

### UI Flows

`GET /api/uiflow` - List all browser action sequences.

`POST /api/uiflow` - Create/Update a UI flow.

`DELETE /api/uiflow/:id` - Remove a UI flow.

### Scenarios

`GET /api/scenario` - List all test scenarios.

`POST /api/scenario` - Create a test (link specs and UI flows).

`DELETE /api/scenario/:id` - Remove a scenario.