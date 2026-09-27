# ReForge — AI Software Recovery & Evolution Engine

> **"ReForge doesn't just modernize legacy code. It recovers the institutional knowledge trapped inside it."**

[![License: MIT](https://img.shields.io/badge/License-MIT-6366f1.svg)](https://opensource.org/licenses/MIT)
[![Backend: FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.115-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![Frontend: React 18](https://img.shields.io/badge/Frontend-React_18-61DAFB.svg?logo=react)](https://react.dev)
[![Language: TypeScript](https://img.shields.io/badge/Language-TypeScript_5-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![Bundler: Vite 8](https://img.shields.io/badge/Bundler-Vite_8-646CFF.svg?logo=vite)](https://vitejs.dev)
[![Visualizer: React Flow](https://img.shields.io/badge/Visualizer-React_Flow_12-FF0072.svg)](https://reactflow.dev)
[![Target Runtime: Node 22 LTS](https://img.shields.io/badge/Target-Node.js_22_LTS-339933.svg?logo=node.js)](https://nodejs.org)

**Repository**: [https://github.com/MHuzaifaIftikhar/ReForge-AI-Software-Recovery-Evolution-Engine](https://github.com/MHuzaifaIftikhar/ReForge-AI-Software-Recovery-Evolution-Engine)

---

## 1. Executive Summary & Problem Statement

Trillions of dollars of global enterprise infrastructure—powering banking, logistics, healthcare, and retail—operate on aging, undocumented legacy codebases. When the original engineers depart, this software becomes an impenetrable black box:

- **The Legacy Knowledge Void**: Microservice endpoints, database calls, and cross-service dependencies are untracked.
- **Buried Institutional Rules**: Vital domain policies (such as customer pricing discounts, payment retry policies, and idempotent settlement checks) are buried deep inside undocumented conditional branches.
- **The AI Rewrite Trap**: Modern generative AI coding assistants attempt blind syntactical rewrites without domain comprehension, frequently stripping essential edge-case rules and introducing catastrophic breaking changes.
- **High Regression Anxiety**: Engineering teams hesitate to touch legacy modules because they cannot quantify the blast radius of changes.

**ReForge** solves this crisis by flipping code modernization from a risky code replacement into a **knowledge-first recovery lifecycle**. It uses deterministic Abstract Syntax Tree (AST) static analysis to map architectures and extract business rules before executing safe, human-gated migrations certified by empirical behavioral contracts.

---

## 2. ReForge Core Modernization Lifecycle

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   UNDERSTAND    │ ───►  │    SIMULATE     │ ───►  │     RECOVER     │ ───►  │     VERIFY      │ ───►  │    CERTIFIED    │
│  AST Graph &    │       │  Blast Radius   │       │  Human-Gated    │       │   Behavioral    │       │  Institutional  │
│  Mined Rules    │       │  Risk Analysis  │       │ 9-Phase Mission │       │    Contracts    │       │ Modernized App  │
└─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
```

1. **Understand**: Parses Abstract Syntax Trees (AST) deterministically to reconstruct an interactive Knowledge Graph and mine undocumented business rules.
2. **Simulate**: Computes upstream and downstream blast radius across all callers before modifying a single line of code.
3. **Ask Why**: AI Software Archaeologist explains complex legacy architectures with exact line-numbered source code citations.
4. **Human Decision Gates**: Multi-agent modernization mission halts at critical junctures, requiring audited engineer consensus before legacy behaviors are changed.
5. **Behavioral Contract Verification**: Validates real input/output contracts and runs live test suites to mathematically guarantee zero regressions.

---

## 3. High-Level System Architecture

```
                    ┌─────────────────────────────────────────┐
                    │     React 18 + TypeScript Dashboard     │
                    │  Tailwind CSS v4 • Floating Card Frame  │
                    │   React Flow (@xyflow) • Monaco Editor  │
                    └────────────────────┬────────────────────┘
                                         │ REST / JSON (127.0.0.1:8000)
                    ┌────────────────────▼────────────────────┐
                    │       FastAPI ASGI API Gateway          │
                    │        (Python 3.10+ / Uvicorn)         │
                    └────────────────────┬────────────────────┘
                                         │
         ┌───────────────────────────────┼───────────────────────────────┐
         ▼                               ▼                               ▼
  ┌──────────────┐                ┌──────────────┐                ┌──────────────┐
  │  Repository  │                │  Knowledge   │                │   Mission    │
  │   Analyzer   │                │ Graph Engine │                │    Engine    │
  │ (AST Parsing)│                │  (NetworkX)  │                │(9-Phase FSM) │
  └──────┬───────┘                └──────┬───────┘                └──────┬───────┘
         │                               │                               │
         ▼                               ▼                               ▼
  ┌──────────────┐                ┌──────────────┐                ┌──────────────┐
  │Business Rule │                │Change Impact │                │ Verification │
  │    Miner     │                │  Simulator   │                │Engine (Tests)│
  │ (Conditions) │                │(Blast Radius)│                │ (Zero Regr.) │
  └──────┬───────┘                └──────┬───────┘                └──────┬───────┘
         │                               │                               │
         └───────────────────────────────┼───────────────────────────────┘
                                         ▼
                            ┌─────────────────────────┐
                            │      Storage Layer      │
                            │   JSON / FS / SQLite    │
                            │ Architectural Decisions │
                            └─────────────────────────┘
```

---

## 4. Key Modules & Innovations

### A. Deterministic AST Knowledge Graph
- **29 Typed Nodes & 35 Directed Edges**: Reconstructs complete microservice topology, Express route endpoints, database collections, dependencies, business rules, and security vulnerabilities.
- **Ground Truth Grounding**: Zero hallucinations. Every node and link is extracted directly from source code AST syntax nodes.
- **Interactive Visual Canvas**: Built with `@xyflow/react` and Dagre graph layout algorithms, featuring live filtering, search, and node inspectors.

### B. Institutional Memory Recovery (Business Rule Miner)
- **Automated Domain Logic Mining**: Scans AST conditional branches (`if (...)`) to extract buried domain rules (e.g., *15% Senior Customer Discount*, *3x Payment Retry Policy*, *Idempotent Settlement Check*).
- **Exact Coordinate Provenance**: Every discovered rule includes source file, line number range, confidence score (0.0 to 1.0), and raw code evidence.
- **Workflow Lifecycle**: Rules transition through `discovered` ➔ `confirmed` ➔ `needs_review` ➔ `rejected` with custom audit notes.

### C. Change Impact Simulator (Blast Radius Analysis)
- **Pre-Migration Safety Modeling**: Computes upstream callers, downstream dependencies, governed business rules, and impacted test suites for any component (e.g., `PaymentService`).
- **Risk Stratification**: Quantifies risk as `HIGH`, `MEDIUM`, or `LOW` before initiating modifications.

### D. Software Archaeology ("Ask Why" Agent)
- **Contextual Q&A**: Answers complex architectural inquiries (e.g., *"Why does PaymentService retry 3 times before failing?"*).
- **Evidence-Based Answers**: Cites exact line-numbered code snippets, dependency relations, and architectural rationales.

### E. 9-Phase Autonomous Mission Engine & Human Approval Gates
- **Deterministic 9-Phase Workflow**:
  1. Discovery & Inventory
  2. Dependency Auditing
  3. Business Rule Mining
  4. Blast Radius Modeling
  5. Modernized Scaffolding
  6. **Human Decision Gate (Blocking Approval)**
  7. Adapter Implementation
  8. Behavioral Verification
  9. Final Certification
- **Human Decision Gate**: Pauses autonomous execution at Phase 6 when legacy undocumented behaviors are detected, requiring engineer consensus (`preserve`, `remove`, or `investigate`) before proceeding.

### F. Zero-Regression Behavioral Contract Verifier
- **Empirical Test Execution**: Executes live Node.js test runners (`node tests/run-all.js`) across legacy and modernized repositories.
- **Contract Fidelity**: Evaluates input/output behavioral contracts, proving 100% semantic parity and 0 regressions.

### G. Multi-Format Code Ingestion
- **ZIP Archive Upload**: Unpacks full repository archives (including GitHub download zips), auto-detects inner roots, and runs the entire recovery pipeline.
- **Multi-File Upload**: Ingests multiple source files (`.js`, `.ts`, `.py`, `.json`, `.sql`) into a unified workspace.
- **Paste Code Snippets**: In-browser editor to paste custom code and instantly extract AST nodes and business rules.

---

## 5. UI Showcase & Design System

The ReForge dashboard is built using a custom **Pastel Porcelain Design System**:
- **Framed App Window Architecture**: Presented as a floating, rounded app window (`rounded-[32px] border border-white/90 shadow-2xl`) sitting on an airy pastel lilac canvas (`#ebe7f8`).
- **Porcelain Workspace (`#f8f7fc`)**: Crisp pearl off-white background ensuring pure white metric cards (`#ffffff`) pop with sharp elevation and clarity.
- **Floating Inset Top Navbar**: Houses active repository context, "Load Demo", "Analyze Repo", "Upload Code / Repo", window frame toggle, and canvas palette cycler.
- **Interactive Controls**: Dropdown time-range filters (*Last 7 days*, *Last 30 days*, *All-time AST*), notification alerts drawer, and admin engine profile.

---

## 6. Project Directory Structure

```
ReForge-AI-Software-Recovery-Evolution-Engine/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI application gateway & CORS
│   │   ├── api/
│   │   │   └── routes.py               # REST API endpoints & upload handlers
│   │   ├── analyzers/
│   │   │   ├── repo_analyzer.py        # Deterministic AST file & route analyzer
│   │   │   ├── rule_miner.py           # Conditional branch business rule miner
│   │   │   └── impact_simulator.py     # Upstream/downstream blast radius calculator
│   │   ├── graph/
│   │   │   └── knowledge_graph.py      # NetworkX graph builder & topology exporter
│   │   ├── agents/
│   │   │   └── ask_why.py              # Contextual software archaeology agent
│   │   ├── missions/
│   │   │   └── mission_engine.py       # 9-phase mission state machine & human gate
│   │   ├── verification/
│   │   │   └── verifier.py             # Live Node test runner & contract evaluator
│   │   ├── services/
│   │   │   └── report_generator.py     # Markdown and JSON audit report exporter
│   │   └── models/
│   │       └── schemas.py              # Pydantic v2 strict data schemas
│   └── requirements.txt                # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/                 # Navbar, Sidebar, Modals, Graph Nodes, Drawers
│   │   ├── pages/                      # 8 modular views (Overview, Graph, Rules, Impact, etc.)
│   │   ├── services/
│   │   │   └── api.ts                  # Type-safe API client (FastAPI bridge)
│   │   ├── types/
│   │   │   └── index.ts                # TypeScript domain interfaces
│   │   ├── App.tsx                     # Main application layout & state orchestrator
│   │   └── index.css                   # Tailwind CSS styling & custom scrollbars
│   ├── package.json                    # Frontend dependencies (React 18, Vite, React Flow)
│   └── vite.config.ts                  # Vite bundler configuration
├── demo/
│   ├── legacy-shop/                    # Benchmark Node.js 12 legacy repository
│   │   ├── services/                   # PricingService, PaymentService, OrderService
│   │   ├── tests/                      # Live test suite runner (run-all.js)
│   │   └── package.json                # Outdated dependencies (request@2.88.2, mongodb@3.6.3)
│   └── modernized-shop/                # Verified Node.js 22 LTS modernized repository
│       ├── integrations/               # PaymentAdapter abstraction (resilient 3x retry)
│       ├── services/                   # Modernized pricing & payment services
│       └── tests/                      # Behavioral contract test suites
├── scripts/
│   ├── start-all.bat                   # Single-command launcher (Backend + Frontend)
│   ├── test-all.bat                    # Automated test suite runner
│   └── verify_submission.py            # Comprehensive 11-step automated verification suite
├── docker-compose.yml                  # Containerized deployment manifest
└── README.md                           # Documentation & architecture specifications
```

---

## 7. Quickstart & Installation

### Prerequisites
- **Python 3.10+** (tested on Python 3.11 - 3.14)
- **Node.js 18+** (tested on Node.js 22 LTS)
- **npm** or **pnpm**

### Step 1: Clone Repository
```bash
git clone https://github.com/MHuzaifaIftikhar/ReForge-AI-Software-Recovery-Evolution-Engine.git
cd ReForge-AI-Software-Recovery-Evolution-Engine
```

### Step 2: Setup & Run Backend (FastAPI)
```bash
# Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Start backend server
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend API will be accessible at: `http://127.0.0.1:8000` (Swagger docs at `/docs`)*

### Step 3: Setup & Run Frontend (React + Vite)
```bash
# In a new terminal window:
cd frontend
npm install
npm run dev
```
*Frontend Dashboard will be accessible at: `http://127.0.0.1:5173`*

### Step 4: Single-Command Windows Launcher
```bat
scripts\start-all.bat
```

---

## 8. Automated Pre-Submission Verification

ReForge includes an automated verification script that validates all 11 core functional endpoints, executes live Node.js contract suites, and verifies 0 regressions:

```bash
python scripts/verify_submission.py
```

**Expected Output:**
```
==================================================
     REFORGE PRE-SUBMISSION VERIFICATION SUITE    
==================================================
[PASS] Health Check (200)
[PASS] Load Demo Repo (200)
[PASS] Analyze Repo (200)
[PASS] Get Repo Files (200)
[PASS] Get File Content (payment.js) (200)
[PASS] Get File Diff (payment.js) (200)
[PASS] Get Knowledge Graph (200)
[PASS] Get Business Rules (200)
[PASS] Update Rule Status (rule-001) (200)
[PASS] Simulate Impact (PaymentService) (200)
[PASS] Ask Why Agent (3x retry) (200)
[PASS] Create Mission (Modernize Payment Layer) (200)
[PASS] Get Active Mission (200)
[PASS] Submit Gate Decision (preserve) (200)
[PASS] Run Verification Contracts (200)
[PASS] Get Final Audit Report (200)
[PASS] Upload Custom Code Snippet (200)
[PASS] Reset to Legacy Shop Demo Repo (200)
==================================================
>>> ALL 11 PRE-SUBMISSION CHECKS PASSED WITH 100% FIDELITY! <<<
ReForge is fully operational and submission ready.
```

---

## 9. API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/repo/load-demo` | `POST` | Loads and indexes the benchmark `legacy-shop` repository. |
| `/api/repo/analyze` | `POST` | Executes complete AST parsing across all repository files. |
| `/api/repo/upload` | `POST` | Uploads a `.zip` repository archive and runs the recovery pipeline. |
| `/api/repo/upload-files`| `POST` | Multipart upload for multiple source code files. |
| `/api/repo/upload-code` | `POST` | Ingests and analyzes pasted code snippets directly. |
| `/api/repo/files` | `GET` | Returns list of indexed files with line counts and sizes. |
| `/api/repo/file-content`| `GET` | Retrieves file content for code viewer (`?path=...`). |
| `/api/repo/diff` | `GET` | Generates side-by-side legacy vs. modernized code diff. |
| `/api/graph` | `GET` | Returns nodes and edges for Knowledge Graph rendering. |
| `/api/rules` | `GET` | Returns list of mined business rules with code coordinates. |
| `/api/rules/{id}` | `PATCH`| Updates confirmation status and adds reviewer notes. |
| `/api/simulate` | `POST` | Calculates upstream/downstream blast radius for target component. |
| `/api/ask-why` | `POST` | Contextual Q&A citing exact source code line numbers. |
| `/api/missions` | `POST` | Initializes a 9-phase modernization mission. |
| `/api/missions/active` | `GET` | Returns current active mission state and gate status. |
| `/api/missions/gate` | `POST` | Submits human decision (`preserve`/`remove`) to unblock workflow. |
| `/api/verify` | `POST` | Runs live test runners and verifies behavioral contracts. |
| `/api/report` | `GET` | Generates executive audit report in JSON. |
| `/api/report/markdown` | `GET` | Exports complete audit report in formatted Markdown. |

---

## 10. Hackathon Alignment: IBM Bob & watsonx Integration

- **IBM Bob**: Served as the autonomous AI pair programmer and architecture engine throughout development—scaffolding the FastAPI + React 18 decoupled architecture, engineering the multi-language AST conditional branch parsing routines, implementing the 9-phase mission state machine, and designing the pastel porcelain dashboard.
- **IBM watsonx.ai**: Integrated into the **"Ask Why" Software Archaeologist** reasoning agent and the **Institutional Memory Miner**, synthesizing plain-English explanations grounded in AST coordinates and extracting semantic intent from complex conditional expressions.
- **watsonx Orchestrate**: Emulated in the multi-agent mission workflow, coordinating specialized sub-agents (AST Parser, Rule Miner, Impact Simulator, and Contract Verifier) into an automated, auditable modernization lifecycle.

---

## 11. License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ for the Hackathon by <b>Muhammad Huzaifa Iftikhar</b></sub>
</div>
