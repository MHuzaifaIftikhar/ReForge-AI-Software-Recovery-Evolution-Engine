# ReForge — Complete Hackathon Demo Guide

Follow this exact 3-minute sequence to demonstrate the complete vertical slice of ReForge to judges and evaluators.

---

### Step 1: Load the Demo Repository
- Launch ReForge at `http://localhost:5173`.
- In the top navigation bar, click **"Load Demo Repository"**.
- ReForge instantly indexes `demo/legacy-shop` (Node.js 12, Express, MongoDB driver v3).

### Step 2: Deterministic Repository Analysis
- Click **"Analyze Repository"**.
- Watch the dashboard metrics update:
  - **17 Files Analyzed** across routes, services, repositories, and config.
  - **5 Dependencies Audited** (flags deprecated `request@2.88.2`).
  - **5 Business Rules Discovered**.
  - **4 Security Findings** (detects hardcoded secret in `middleware/auth.js`).
  - **7 Tests Verified**.

### Step 3: Explore the Software Knowledge Graph
- Click **"Knowledge Graph"** in the sidebar.
- Inspect the interactive React Flow canvas showing color-coded nodes for services, APIs, databases, rules, and tests.
- Click **PaymentService** on the canvas:
  - The right-side Node Inspector displays its file location (`services/payment.js:12`), description, connected tests, and callers.

### Step 4: Inspect Recovered Institutional Business Rules
- Click **"Business Rules"** in the sidebar.
- Show the cards containing extracted domain logic:
  - **Senior Customer Discount**: 15% discount for age >= 60 and total > $500 (`services/pricing.js:42-47`).
  - **Bulk Order Discount**: 10% volume discount for items >= 10 (`services/pricing.js:26-29`).
  - **Legacy Payment Retry Mechanism**: 3x automatic retry loop on socket failures (`services/payment.js:91-103`).
- Click **"Confirm"** on the Senior Customer Discount card.

### Step 5: Simulate Blast Radius in Change Impact Simulator
- Click **"Impact Simulator"** in the sidebar.
- Target is pre-selected as **PaymentService**.
- Click **"Analyze Impact"**:
  - ReForge flags **HIGH RISK** blast radius.
  - Direct callers: `POST /api/checkout`, `POST /api/checkout/refund`, `orders collection`.
  - Indirect orchestrators: `OrderService`.
  - Governed business rules: `Legacy Payment Retry Mechanism`, `Idempotent Payment Settle Check`.
  - External integration: `LegacyGateway`.
  - **Architectural Advice**: *"Introduce a PaymentAdapter before replacement to encapsulate the legacy gateway protocol and isolate external network calls."*

### Step 6: Ask Why ("Software Archaeology")
- Click the purple **"Ask ReForge ('Why?')"** button.
- Ask: *"Why does PaymentService depend on LegacyGateway?"*
- ReForge outputs a grounded explanation citing exact source lines:
  - `services/payment.js:10` (IMPORTS)
  - `services/payment.js:43` (CALLS)
  - `services/payment.js:90` (CALLS)
  - `tests/payment.test.js:26` (TESTS)
- Click the jump icon to view the exact line in code.

### Step 7: Launch Modernization Mission & Human Approval Gate
- Click **"Missions"** in the sidebar.
- Click **"Launch Mission"** with goal: *"Modernize Payment Layer"*.
- The Commander Agent executes phases 1 through 5 in real time, streaming terminal logs.
- **The mission stops at Phase 6: Human Approval Gate**:
  - ReForge halts before modifying code.
  - Modal pops up: *"Undocumented Payment Retry Mechanism Detected (services/payment.js:91-103). What should happen during modernization?"*
  - Select **[Preserve Behavior]** and click **"Confirm Decision & Resume Modernization"**.
  - Decision is committed to Institutional Memory (`data/institutional_memory.json`).
  - Migration Agent applies the modernization in the isolated workspace.

### Step 8: Inspect Side-by-Side Code Diff
- Click **"Code Explorer"** in the sidebar.
- Click **"Side-by-Side Diff (Legacy vs Modern)"**:
  - Monaco Diff Editor displays `services/payment.js` side-by-side.
  - Shows how the direct coupling to `LegacyGateway` was replaced by the clean `PaymentAdapter` pattern, and how the 3x retry mechanism was cleanly encapsulated.

### Step 9: Live Behavioral Verification
- Click **"Verification"** in the sidebar.
- Inspect the live verification results:
  - **5/5 Behavioral Contracts Passed** (including Senior Discount contract and Payment Retry Resiliency contract).
  - **8/8 Modern Test Runner Passed** (0 regressions).
  - **4/4 Security Remediations Verified** (deprecated `request` eliminated, JWT hardcoded secret removed).
  - Real subprocess test runner stdout captured in the terminal log box.

### Step 10: Export Final Executive Report
- Click **"Reports"** in the sidebar.
- Review the comprehensive audit report, architecture decision records (ADRs), and risk assessments.
- Click **"Download Markdown"** to save `reforge-modernization-report-legacy-shop.md`.
