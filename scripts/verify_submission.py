import requests
import sys
import json

BASE = "http://127.0.0.1:8000"
errors = []

def test_endpoint(name, method, url, **kwargs):
    global errors
    try:
        if method == "GET":
            r = requests.get(url, **kwargs)
        elif method == "POST":
            r = requests.post(url, **kwargs)
        elif method == "PATCH":
            r = requests.patch(url, **kwargs)

        if r.status_code in [200, 201]:
            print(f"[PASS] {name} ({r.status_code})")
            return r.json()
        else:
            print(f"[FAIL] {name} status={r.status_code} text={r.text[:120]}")
            errors.append(f"{name} returned {r.status_code}")
            return None
    except Exception as e:
        print(f"[ERROR] {name}: {e}")
        errors.append(f"{name} exception: {e}")
        return None

print("==================================================")
print("     REFORGE PRE-SUBMISSION VERIFICATION SUITE    ")
print("==================================================")

# 1. Core Health
test_endpoint("Health Check", "GET", f"{BASE}/health")

# 2. Repository Loading & Analysis
test_endpoint("Load Demo Repo", "POST", f"{BASE}/api/repo/load-demo")
test_endpoint("Analyze Repo", "POST", f"{BASE}/api/repo/analyze")
files_res = test_endpoint("Get Repo Files", "GET", f"{BASE}/api/repo/files")
if files_res:
    print(f"       Total files indexed: {len(files_res.get('files', []))}")

test_endpoint("Get File Content (payment.js)", "GET", f"{BASE}/api/repo/file-content", params={"path": "services/payment.js"})
test_endpoint("Get File Diff (payment.js)", "GET", f"{BASE}/api/repo/diff", params={"path": "services/payment.js"})

# 3. Knowledge Graph
g = test_endpoint("Get Knowledge Graph", "GET", f"{BASE}/api/graph")
if g:
    nodes = g.get("nodes", [])
    edges = g.get("edges", [])
    print(f"       Graph Nodes: {len(nodes)} | Directed Edges: {len(edges)}")
    assert len(nodes) > 0, "Graph has 0 nodes"
    assert len(edges) > 0, "Graph has 0 edges"

# 4. Business Rules
r = test_endpoint("Get Business Rules", "GET", f"{BASE}/api/rules")
if r:
    rules = r.get("rules", [])
    print(f"       Discovered Business Rules: {len(rules)}")
    assert len(rules) >= 5, f"Expected at least 5 rules, got {len(rules)}"

test_endpoint("Update Rule Status (rule-001)", "PATCH", f"{BASE}/api/rules/rule-001", json={"status": "confirmed", "note": "Verified via pre-submission automated audit"})

# 5. Blast Radius Simulation
sim = test_endpoint("Simulate Impact (PaymentService)", "POST", f"{BASE}/api/simulate", json={"target": "PaymentService"})
if sim:
    print(f"       Impact Level: {sim.get('impact_level')} | Blast Radius Count: {len(sim.get('blast_radius', []))}")

# 6. Ask Why Agent
why = test_endpoint("Ask Why Agent (3x retry)", "POST", f"{BASE}/api/ask-why", json={"query": "Why does payment retry 3 times?", "target_node": "PaymentService"})
if why:
    print(f"       Ask Why Grounded Answer: {why.get('answer', '')[:80]}...")

# 7. Missions Workflow & Decision Gate
m = test_endpoint("Create Mission (Modernize Payment Layer)", "POST", f"{BASE}/api/missions?goal=Modernize%20Payment%20Layer")
if m and "id" in m:
    mission_id = m["id"]
    active = test_endpoint("Get Active Mission", "GET", f"{BASE}/api/missions/active")
    print(f"       Mission Phase: {active.get('current_phase')} | Status: {active.get('status')}")
    gate_res = test_endpoint("Submit Gate Decision (preserve)", "POST", f"{BASE}/api/missions/{mission_id}/decision", json={"option": "preserve", "rationale": "Human approval to keep 3x retry mechanism in modernized adapter"})
    if gate_res:
        print(f"       Gate Decision Status: {gate_res.get('status')} | Phase: {gate_res.get('current_phase')}")

# 8. Verification Engine (Behavioral Regression Contracts)
ver = test_endpoint("Run Verification Contracts", "POST", f"{BASE}/api/verify")
if ver:
    passed = ver.get("contracts_passed", 0)
    total = ver.get("contracts_total", 0)
    print(f"       Verification Contracts: {passed}/{total} Passed | Regressions: {len(ver.get('regressions', []))}")
    assert ver.get("status") == "PASS", "Verification status is not PASS"

# 9. Reports Generation
rep = test_endpoint("Get Final Audit Report", "GET", f"{BASE}/api/reports/final")
if rep:
    print(f"       Audit Report Title: {rep.get('title')} | Formats: Markdown & JSON ready")

# 10. Custom Code Upload Test
upload_res = test_endpoint("Upload Custom Code Snippet", "POST", f"{BASE}/api/repo/upload-code", json={
    "filename": "services/custom_auth.js",
    "code": "function verifyUser(user) {\n  if (user.role === 'admin' && user.status === 'active') return true;\n}",
    "repo_name": "pre-submission-test"
})
if upload_res:
    print(f"       Custom Code Upload: {upload_res.get('message')}")

# 11. Reset to Benchmark Demo Repository for final submission state
reset_res = test_endpoint("Reset to Legacy Shop Demo Repo", "POST", f"{BASE}/api/repo/load-demo")
if reset_res:
    print(f"       Repository Reset: {reset_res.get('message')}")

print("==================================================")
if errors:
    print(f"VERIFICATION FAILED: {len(errors)} errors found:")
    for err in errors:
        print(f"  - {err}")
    sys.exit(1)
else:
    print(">>> ALL 11 PRE-SUBMISSION CHECKS PASSED WITH 100% FIDELITY! <<<")
    print("ReForge is fully operational and submission ready.")
