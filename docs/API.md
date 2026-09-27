# ReForge — REST API Specification

Base URL: `http://localhost:8000/api`

## Endpoints

### 1. Repository
- `POST /repo/load-demo`: Initializes and analyzes `demo/legacy-shop`.
- `POST /repo/upload`: Accepts a multipart ZIP file, extracts, and analyzes.
- `GET /repo/files`: Lists all files in the current repository.
- `GET /repo/file-content?path={filePath}`: Returns file content, line count, and byte size.
- `GET /repo/diff?path={filePath}`: Returns legacy vs modernized file content for side-by-side Monaco diffing.
- `POST /repo/analyze`: Re-runs full deterministic static analysis.

### 2. Knowledge Graph
- `GET /graph`: Returns nodes, edges, and statistics formatted for React Flow rendering.

### 3. Business Rules
- `GET /rules`: Lists discovered institutional business rules with source file, lines, and confidence.
- `PATCH /rules/{ruleId}`: Updates status (`confirmed`, `rejected`, `needs_review`) and adds institutional memory notes.

### 4. Change Impact & Ask Why
- `POST /simulate`: Body `{ "target": "PaymentService" }`. Calculates blast radius, affected rules, affected tests, and recommendations.
- `POST /ask-why`: Body `{ "query": "Why does PaymentService depend on LegacyGateway?", "target_node": "PaymentService" }`. Returns cited source lines, relationship, and confidence.

### 5. Missions & Human Gates
- `POST /missions?goal={goal}`: Launches structured 9-phase modernization mission.
- `GET /missions/active`: Returns current mission status and phase progress.
- `POST /missions/gate`: Body `{ "option": "preserve", "rationale": "..." }`. Commits human decision to institutional memory and resumes modernization.

### 6. Verification & Reports
- `POST /verify`: Executes live Node test suites in legacy and modernized repos, returning behavioral contract results.
- `GET /report`: Returns comprehensive Modernization Audit Report in JSON format.
- `GET /report/markdown`: Returns downloadable Markdown string.
