# Hybrid Automation Engine

A modular, TypeScript-based automation server that orchestrates API and UI tests using a declarative YAML catalog. 

## 🚀 Features
- **Declarative Workflows:** Define tests in `catalog.yaml`.
- **Hybrid Execution:** Mix `api_call` (Axios) and `ui_flow` (Playwright).
- **Session Management:** JSONPath extraction & variable injection.

## 📦 Usage

### 1. Start Server
```bash
npm install
npm start