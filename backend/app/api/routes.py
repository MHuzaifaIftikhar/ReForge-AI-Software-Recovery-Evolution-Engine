import re
import time
import shutil
import zipfile
from pathlib import Path
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Query
from pydantic import BaseModel

from ..analyzers.repo_analyzer import RepoAnalyzer
from ..analyzers.rule_miner import BusinessRuleMiner
from ..analyzers.impact_simulator import change_impact_simulator
from ..graph.knowledge_graph import knowledge_graph_engine
from ..agents.ask_why import AskWhyAgent
from ..missions.mission_engine import mission_engine
from ..verification.verifier import verifier
from ..services.report_generator import report_generator
from ..models.schemas import (
    KnowledgeGraphResponse,
    BusinessRule,
    ChangeImpact,
    AskWhyResponse,
    Mission,
    VerificationResult,
    FinalReport
)

router = APIRouter(prefix="/api")

# In-memory shared state for hackathon session
CURRENT_REPO_PATH = Path("d:/Hackathon/demo/legacy-shop").resolve()
MODERNIZED_REPO_PATH = Path("d:/Hackathon/demo/modernized-shop").resolve()
CURRENT_ANALYSIS: Dict[str, Any] = {}
CURRENT_RULES: list[Dict[str, Any]] = []

def run_full_pipeline(repo_path: Path):
    global CURRENT_ANALYSIS, CURRENT_RULES
    analyzer = RepoAnalyzer(str(repo_path))
    CURRENT_ANALYSIS = analyzer.analyze()
    miner = BusinessRuleMiner(str(repo_path))
    CURRENT_RULES = miner.discover_rules()
    knowledge_graph_engine.build(CURRENT_ANALYSIS, CURRENT_RULES)
    return CURRENT_ANALYSIS

# Auto-initialize on module load with legacy-shop
try:
    if CURRENT_REPO_PATH.exists():
        run_full_pipeline(CURRENT_REPO_PATH)
except Exception:
    pass

class SimulateRequest(BaseModel):
    target: str = "PaymentService"

class AskWhyRequest(BaseModel):
    query: str
    target_node: str = "PaymentService"

class RuleUpdateRequest(BaseModel):
    status: str  # confirmed, rejected, needs_review, discovered
    note: Optional[str] = None

class GateDecisionRequest(BaseModel):
    option: str  # preserve, remove, investigate
    rationale: Optional[str] = ""

class UploadCodeRequest(BaseModel):
    filename: str = "custom_module.js"
    code: str
    repo_name: Optional[str] = "custom-snippet"

# ==============================================================================
# Repository Management
# ==============================================================================
@router.post("/repo/load-demo")
async def load_demo_repository():
    """Loads and initializes the controlled legacy-shop demo repository."""
    global CURRENT_REPO_PATH
    CURRENT_REPO_PATH = Path("d:/Hackathon/demo/legacy-shop").resolve()
    if not CURRENT_REPO_PATH.exists():
        raise HTTPException(status_code=404, detail="Demo repository not found at demo/legacy-shop")
    
    analysis = run_full_pipeline(CURRENT_REPO_PATH)
    return {
        "success": True,
        "message": "Demo repository 'legacy-shop' loaded and analyzed successfully.",
        "repository": analysis["repository"],
        "metrics": {
            "files": len(analysis.get("files", [])),
            "dependencies": len(analysis.get("dependencies", {}).get("direct", [])),
            "business_rules": len(CURRENT_RULES),
            "security_findings": len(analysis.get("security_findings", [])),
            "tests": len(analysis.get("tests", []))
        }
    }

@router.post("/repo/upload")
async def upload_repository_zip(file: UploadFile = File(...)):
    """Uploads a repository ZIP and analyzes it."""
    global CURRENT_REPO_PATH
    import time
    clean_stem = re.sub(r'[^a-zA-Z0-9_-]', '_', Path(file.filename).stem)
    upload_dir = Path("d:/Hackathon/data/uploads") / f"{clean_stem}_{int(time.time())}"
    upload_dir.mkdir(parents=True, exist_ok=True)
    zip_dest = upload_dir / file.filename

    with open(zip_dest, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    with zipfile.ZipFile(zip_dest, "r") as z:
        z.extractall(upload_dir)

    # Check if the extracted contents are wrapped in a single root folder
    subdirs = [p for p in upload_dir.iterdir() if p.is_dir() and not p.name.startswith(".")]
    files_at_root = [p for p in upload_dir.iterdir() if p.is_file() and p.name != file.filename]
    if len(subdirs) == 1 and len(files_at_root) == 0:
        CURRENT_REPO_PATH = subdirs[0]
    else:
        CURRENT_REPO_PATH = upload_dir

    analysis = run_full_pipeline(CURRENT_REPO_PATH)
    return {
        "success": True,
        "message": f"Uploaded repository '{file.filename}' analyzed.",
        "repository": analysis["repository"],
        "metrics": {
            "files": len(analysis.get("files", [])),
            "dependencies": len(analysis.get("dependencies", {}).get("direct", [])),
            "business_rules": len(CURRENT_RULES),
            "security_findings": len(analysis.get("security_findings", [])),
            "tests": len(analysis.get("tests", []))
        }
    }

@router.post("/repo/upload-files")
async def upload_multiple_files(files: list[UploadFile] = File(...)):
    """Uploads multiple source files into a repository workspace and analyzes it."""
    global CURRENT_REPO_PATH
    import time
    upload_dir = Path("d:/Hackathon/data/uploads") / f"project_{int(time.time())}"
    upload_dir.mkdir(parents=True, exist_ok=True)

    for f in files:
        target_path = upload_dir / f.filename
        target_path.parent.mkdir(parents=True, exist_ok=True)
        with open(target_path, "wb") as buffer:
            shutil.copyfileobj(f.file, buffer)

    CURRENT_REPO_PATH = upload_dir
    analysis = run_full_pipeline(CURRENT_REPO_PATH)
    return {
        "success": True,
        "message": f"Successfully uploaded {len(files)} files.",
        "repository": analysis["repository"],
        "metrics": {
            "files": len(analysis.get("files", [])),
            "dependencies": len(analysis.get("dependencies", {}).get("direct", [])),
            "business_rules": len(CURRENT_RULES),
            "security_findings": len(analysis.get("security_findings", [])),
            "tests": len(analysis.get("tests", []))
        }
    }

@router.post("/repo/upload-code")
async def upload_code_snippet(req: UploadCodeRequest):
    """Directly uploads and analyzes a pasted code snippet."""
    global CURRENT_REPO_PATH
    import time
    clean_repo = re.sub(r'[^a-zA-Z0-9_-]', '_', req.repo_name or "custom_snippet")
    upload_dir = Path("d:/Hackathon/data/uploads") / f"{clean_repo}_{int(time.time())}"
    upload_dir.mkdir(parents=True, exist_ok=True)

    file_path = upload_dir / req.filename
    file_path.parent.mkdir(parents=True, exist_ok=True)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(req.code)

    CURRENT_REPO_PATH = upload_dir
    analysis = run_full_pipeline(CURRENT_REPO_PATH)
    return {
        "success": True,
        "message": f"Snippet '{req.filename}' saved and analyzed.",
        "repository": analysis["repository"],
        "metrics": {
            "files": len(analysis.get("files", [])),
            "dependencies": len(analysis.get("dependencies", {}).get("direct", [])),
            "business_rules": len(CURRENT_RULES),
            "security_findings": len(analysis.get("security_findings", [])),
            "tests": len(analysis.get("tests", []))
        }
    }

@router.get("/repo/files")
async def get_repository_files():
    """Returns the list of analyzed files."""
    return {"files": CURRENT_ANALYSIS.get("files", [])}

@router.get("/repo/file-content")
async def get_file_content(path: str = Query(..., description="Relative file path")):
    """Returns the raw content and metadata of a specific file."""
    file_path = CURRENT_REPO_PATH / path
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"File not found: {path}")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        return {
            "path": path,
            "content": content,
            "lines": len(content.splitlines()),
            "size": file_path.stat().st_size
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/repo/diff")
async def get_file_diff(path: str = Query("services/payment.js", description="Relative file path")):
    """Returns legacy vs modernized file content for side-by-side Monaco diff."""
    legacy_file = CURRENT_REPO_PATH / path
    modern_file = MODERNIZED_REPO_PATH / path

    legacy_content = ""
    modern_content = ""

    if legacy_file.exists():
        with open(legacy_file, "r", encoding="utf-8") as f:
            legacy_content = f.read()

    if modern_file.exists():
        with open(modern_file, "r", encoding="utf-8") as f:
            modern_content = f.read()
    else:
        # If file was replaced or renamed (e.g. paymentAdapter introduced)
        adapter_file = MODERNIZED_REPO_PATH / "integrations" / "paymentAdapter.js"
        if adapter_file.exists() and "payment" in path:
            with open(adapter_file, "r", encoding="utf-8") as f:
                modern_content = f.read()

    return {
        "path": path,
        "legacy_content": legacy_content,
        "modern_content": modern_content
    }

# ==============================================================================
# Analysis & Knowledge Graph
# ==============================================================================
@router.post("/repo/analyze")
async def analyze_repository():
    """Reruns complete deterministic static analysis."""
    analysis = run_full_pipeline(CURRENT_REPO_PATH)
    return analysis

@router.get("/graph", response_model=Dict[str, Any])
async def get_knowledge_graph():
    """Returns the Knowledge Graph formatted for React Flow canvas."""
    return knowledge_graph_engine.to_react_flow()

# ==============================================================================
# Business Rules
# ==============================================================================
@router.get("/rules")
async def get_business_rules():
    """Returns recovered institutional business rules."""
    return {"rules": CURRENT_RULES}

@router.patch("/rules/{rule_id}")
async def update_business_rule(rule_id: str, req: RuleUpdateRequest):
    """Updates rule confirmation status and appends user notes."""
    global CURRENT_RULES
    for r in CURRENT_RULES:
        if r["id"] == rule_id:
            r["status"] = req.status
            if req.note:
                if "notes" not in r:
                    r["notes"] = []
                r["notes"].append(req.note)
            return {"success": True, "rule": r}
    raise HTTPException(status_code=404, detail="Rule not found")

# ==============================================================================
# Change Impact Simulation & "Ask Why"
# ==============================================================================
@router.post("/simulate", response_model=ChangeImpact)
async def simulate_change_impact(req: SimulateRequest):
    """Calculates upstream and downstream blast radius for target component."""
    return change_impact_simulator.simulate(req.target)

@router.post("/ask-why", response_model=AskWhyResponse)
async def ask_why_query(req: AskWhyRequest):
    """Contextual Q&A explaining architecture and dependencies citing source lines."""
    agent = AskWhyAgent(str(CURRENT_REPO_PATH))
    return await agent.answer(req.query, req.target_node)

# ==============================================================================
# Modernization Missions & Human Gates
# ==============================================================================
@router.post("/missions", response_model=Mission)
async def create_mission(goal: str = Query("Modernize Payment Layer")):
    """Creates a new modernization mission with structured phases."""
    mission = mission_engine.create_mission(goal)
    # Execute phases up to Human Approval Gate (phases 1 through 5)
    for p_id in range(1, 6):
        mission = mission_engine.execute_phase(p_id)
    return mission

@router.get("/missions/active", response_model=Mission)
async def get_active_mission():
    """Returns current active mission state."""
    if not mission_engine.active_mission:
        return mission_engine.create_mission()
    return mission_engine.active_mission

@router.post("/missions/gate", response_model=Mission)
@router.post("/missions/{mission_id}/decision", response_model=Mission)
async def submit_human_gate_decision(req: GateDecisionRequest, mission_id: Optional[str] = None):
    """Submits human approval decision and resumes modernization."""
    return mission_engine.submit_gate_decision(req.option, req.rationale or "")

# ==============================================================================
# Verification & Reports
# ==============================================================================
@router.post("/verify", response_model=VerificationResult)
async def execute_verification():
    """Executes live Node test suites and evaluates behavioral contracts."""
    return verifier.run_verification()

@router.get("/report", response_model=FinalReport)
@router.get("/reports/final", response_model=FinalReport)
async def get_final_report():
    """Generates comprehensive modernization audit report in JSON."""
    ver_res = verifier.run_verification()
    mission = mission_engine.active_mission
    return report_generator.generate(CURRENT_ANALYSIS, CURRENT_RULES, ver_res, mission)

@router.get("/report/markdown")
async def get_report_markdown():
    """Exports report as downloadable Markdown."""
    ver_res = verifier.run_verification()
    mission = mission_engine.active_mission
    report = report_generator.generate(CURRENT_ANALYSIS, CURRENT_RULES, ver_res, mission)
    md_content = report_generator.to_markdown(report)
    return {"markdown": md_content}
