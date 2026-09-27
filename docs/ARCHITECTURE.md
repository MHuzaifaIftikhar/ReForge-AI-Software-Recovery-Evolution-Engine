# ReForge — Technical Architecture

```
                    ┌─────────────────────────┐
                    │  React 18 + TypeScript  │
                    │  Vite + Tailwind CSS    │
                    │  React Flow + Monaco    │
                    └────────────┬────────────┘
                                 │ HTTP REST
                    ┌────────────▼────────────┐
                    │     FastAPI Gateway     │
                    │    Python 3.10+ ASGI    │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
  │  Repository  │        │  Knowledge   │        │   Mission    │
  │   Analyzer   │        │ Graph Engine │        │    Engine    │
  │  (AST/Regex) │        │  (NetworkX)  │        │ (9-Phase FSM)│
  └──────┬───────┘        └──────┬───────┘        └──────┬───────┘
         │                       │                       │
         ▼                       ▼                       ▼
  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
  │Business Rule │        │Change Impact │        │ Verification │
  │    Miner     │        │  Simulator   │        │Engine (Tests)│
  └──────┬───────┘        └──────┬───────┘        └──────┬───────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │      Storage Layer      │
                    │ SQLite / JSON / FS / ADR│
                    └─────────────────────────┘
```

## 1. System Components

### Frontend (`/frontend`)
- **React 18 + TypeScript + Vite**: Ultra-fast hot-reloading SPA.
- **Tailwind CSS v4**: Dark developer workspace theme with high information density.
- **@xyflow/react**: Interactive canvas rendering Knowledge Graph and Change Impact sub-graphs.
- **@monaco-editor/react**: Code viewer and side-by-side diff editor.
- **Lucide React**: Clean developer tool iconography.

### Backend (`/backend`)
- **FastAPI**: Asynchronous Python REST API gateway.
- **RepoAnalyzer**: Deterministic AST parser extracting files, routes, DB operations, and security flaws.
- **BusinessRuleMiner**: Extracts conditional domain logic with line-level evidence.
- **KnowledgeGraphEngine**: NetworkX directed multigraph managing nodes, typed edges, and React Flow coordinates.
- **ChangeImpactSimulator**: Traverses upstream callers and downstream dependencies to calculate blast radius.
- **AskWhyAgent**: Contextual query engine citing repository evidence chains.
- **MissionEngine**: 9-phase state machine managing agent logs and Human Decision Gates.
- **Verifier**: Executes native Node subprocess test runners in `legacy-shop` and `modernized-shop`.
- **ReportGenerator**: Compiles executive summaries, ADRs, and downloadable Markdown/JSON.

---

## 2. Storage & Zero-Infra Design
- **No external MongoDB daemon required**: In-process collection wrappers allow self-contained execution.
- **No external npm install required for demo**: Core files use standard Node.js libraries with graceful fallbacks.
- **Persistent Institutional Memory**: Stores human decisions in `data/institutional_memory.json`.
