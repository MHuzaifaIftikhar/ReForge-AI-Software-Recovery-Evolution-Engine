from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Node(BaseModel):
    id: str
    type: str  # service, file, function, api, database, dependency, business_rule, test, security_finding, external_service, configuration
    name: str
    file: Optional[str] = None
    line: Optional[int] = None
    description: str = ""
    confidence: float = 1.0
    metadata: Dict[str, Any] = Field(default_factory=dict)

class Edge(BaseModel):
    source: str
    target: str
    relationship: str  # CONTAINS, IMPORTS, CALLS, DEPENDS_ON, READS, WRITES, EXPOSES, TESTS, USES, TRIGGERS, IMPLEMENTS, AFFECTS
    metadata: Dict[str, Any] = Field(default_factory=dict)

class KnowledgeGraphResponse(BaseModel):
    nodes: List[Node]
    edges: List[Edge]
    stats: Dict[str, Any] = Field(default_factory=dict)

class BusinessRule(BaseModel):
    id: str
    title: str
    description: str
    source_file: str
    source_lines: str
    confidence: float = 0.9
    status: str = "discovered"  # discovered, confirmed, rejected, needs_review
    evidence: str = ""
    notes: List[str] = Field(default_factory=list)

class SecurityFinding(BaseModel):
    id: str
    title: str
    severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    category: str
    source_file: str
    source_lines: str
    description: str
    remediation: str

class ImpactItem(BaseModel):
    id: str
    name: str
    type: str
    file: Optional[str] = None
    reason: str

class ChangeImpact(BaseModel):
    target: str
    target_type: str
    impact_level: str  # LOW, MEDIUM, HIGH
    direct_impact: List[ImpactItem] = Field(default_factory=list)
    indirect_impact: List[ImpactItem] = Field(default_factory=list)
    business_rules: List[Dict[str, Any]] = Field(default_factory=list)
    tests: List[Dict[str, Any]] = Field(default_factory=list)
    security: List[Dict[str, Any]] = Field(default_factory=list)
    external_integrations: List[Dict[str, Any]] = Field(default_factory=list)
    reason: str
    recommendations: List[str] = Field(default_factory=list)
    subgraph_nodes: List[str] = Field(default_factory=list)
    subgraph_edges: List[Dict[str, str]] = Field(default_factory=list)

class EvidenceChainItem(BaseModel):
    source: str
    line: int
    snippet: str
    relationship: str

class AskWhyResponse(BaseModel):
    query: str
    target_node: str
    has_evidence: bool
    evidence_chain: List[EvidenceChainItem] = Field(default_factory=list)
    conclusion: str
    confidence: str  # High, Medium, Low, None
    confidence_score: float = 0.0
    raw_answer: str

class BehavioralContract(BaseModel):
    id: str
    rule_id: str
    name: str
    component: str
    condition_desc: str
    expected_behavior: str
    status: str = "pending"  # passed, failed, pending, not_executed
    actual_result: Optional[str] = None

class HumanDecisionGate(BaseModel):
    gate_id: str
    mission_id: str
    phase_id: int
    title: str
    description: str
    detected_behavior: str
    evidence: Dict[str, Any]
    options: List[Dict[str, str]]
    selected_option: Optional[str] = None
    rationale: Optional[str] = None
    timestamp: Optional[str] = None

class MissionPhase(BaseModel):
    id: int
    name: str
    status: str = "pending"  # pending, in_progress, awaiting_approval, completed, failed
    progress: int = 0
    agent: str
    findings: List[str] = Field(default_factory=list)
    output: Optional[str] = None

class Mission(BaseModel):
    id: str
    goal: str
    status: str = "idle"  # idle, running, paused_at_gate, completed, failed
    current_phase: int = 1
    phases: List[MissionPhase]
    gate: Optional[HumanDecisionGate] = None
    logs: List[str] = Field(default_factory=list)

class VerificationResult(BaseModel):
    timestamp: str
    status: str = "PASS"
    contracts_passed: int = 5
    contracts_total: int = 5
    regressions: List[str] = Field(default_factory=list)
    legacy_tests_passed: int
    legacy_tests_failed: int
    modern_tests_passed: int
    modern_tests_failed: int
    behavioral_contracts: List[BehavioralContract]
    security_checks: List[Dict[str, Any]]
    dependency_audit: Dict[str, Any]
    output_logs: str

class FinalReport(BaseModel):
    report_id: str
    generated_at: str
    repository_name: str
    executive_summary: str
    metrics: Dict[str, Any]
    recovered_business_rules: List[Dict[str, Any]]
    security_findings: List[Dict[str, Any]]
    architectural_changes: List[Dict[str, Any]]
    human_decisions: List[Dict[str, Any]]
    verification_summary: Dict[str, Any]
    remaining_risks: List[str]
    recommended_next_steps: List[str]
