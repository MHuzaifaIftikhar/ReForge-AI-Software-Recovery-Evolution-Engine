# ReForge — Product Requirements Document (PRD)

> **Category**: AI Software Recovery & Evolution Engine  
> **Event**: IBM Bob 2.0 Hackathon  
> **Version**: 1.0 (Production Blueprint)

---

## 1. Executive Summary & Value Proposition

Traditional AI modernization tools blindly rewrite code without understanding the domain context or institutional knowledge locked within legacy codebases. When engineers inherit legacy software, they don't know:
- Why specific dependencies or workarounds exist.
- What undocumented business rules govern pricing, retries, or settlement.
- What will break across the dependency graph if a service is replaced.
- How to verify that critical behaviors remain intact after upgrading runtimes.

**ReForge recovers the knowledge trapped inside legacy code.** It turns legacy software into an interactive software intelligence layer through four core pillars:
1. **Understand**: Deterministically reconstruct architecture, dependency graphs, and domain rules.
2. **Simulate**: Accurately predict blast radius and affected business rules before code changes.
3. **Recover**: Execute structured, human-in-the-loop modernization missions.
4. **Verify**: Provide regression proof using behavioral contracts and live test execution.

---

## 2. Product Philosophy & Grounding Mandate
> **"ReForge must never pretend to know something it cannot prove."**  
Every finding, rule, and dependency relationship must contain verifiable evidence: `source_file`, `source_lines`, `confidence`, and `explanation`. If historical or architectural evidence is missing, ReForge explicitly returns *"No evidence found"* rather than hallucinating.

---

## 3. Core Functional Capabilities

### A. Repository Ingestion & Deterministic Analysis
- 1-click loading of controlled `legacy-shop` demo repo or custom ZIP upload.
- Static AST parsing extracting files, modules, functions, routes, database queries, and security vulnerabilities without external infrastructure.

### B. Software Knowledge Graph
- Typed nodes (`service`, `api`, `database`, `business_rule`, `security_finding`, `test`, `dependency`, `external_service`).
- Typed edges (`CALLS`, `IMPORTS`, `DEPENDS_ON`, `READS`, `WRITES`, `EXPOSES`, `TESTS`, `IMPLEMENTS`, `AFFECTS`).
- Interactive React Flow canvas with type filtering and slide-out Node Inspector.

### C. Business Rule Discovery
- Scans source code for domain logic (e.g. 15% Senior Citizen discount on orders >$500 in `pricing.js:42-47`, 3x payment retry loop in `payment.js:91-103`).
- Tracks lifecycle: `discovered`, `confirmed`, `rejected`, `needs_review` with persistent institutional memory notes.

### D. Change Impact Simulation (Blast Radius)
- Upstream and downstream graph traversal computing direct callers, indirect orchestrators, affected rules, affected tests, and security risks.
- Provides actionable architectural recommendations (e.g. introducing the Adapter Pattern).

### E. Grounded "Ask Why" Assistant
- Natural language query interface citing line-level code evidence for why dependencies exist.
- Strict fallback to explicit *"No historical evidence found"* if ungrounded.

### F. Modernization Mission Engine & Human Approval Gate
- 9-phase structured mission workflow with real-time agent console logs.
- Hard blocking Human Decision Gate before code modification to decide whether to preserve or remove legacy behaviors.

### G. Behavioral Contracts & Verification Suite
- Validates input/output contracts against live modernized code.
- Executes standard Node.js test runners in legacy and modernized workspaces, capturing real exit codes and stdout.
- Side-by-side Monaco diff viewer comparing legacy Node 12 vs modernized Node 22 code.

### H. Executive Modernization Report
- In-app audit report with downloadable Markdown and JSON exports.
