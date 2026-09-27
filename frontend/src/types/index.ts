export interface GraphNode {
  id: string;
  type: string;
  name: string;
  file?: string;
  line?: number;
  description: string;
  confidence: number;
  metadata?: Record<string, any>;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
  metadata?: Record<string, any>;
}

export interface KnowledgeGraphData {
  nodes: any[];
  edges: any[];
  stats: {
    total_nodes: number;
    total_edges: number;
    services: number;
    apis: number;
    business_rules: number;
    security_findings: number;
    tests: number;
  };
}

export interface BusinessRule {
  id: string;
  title: string;
  description: string;
  source_file: string;
  source_lines: string;
  confidence: number;
  status: 'discovered' | 'confirmed' | 'rejected' | 'needs_review';
  evidence: string;
  notes: string[];
}

export interface ImpactItem {
  id: string;
  name: string;
  type: string;
  file?: string;
  reason: string;
}

export interface ChangeImpact {
  target: string;
  target_type: string;
  impact_level: 'LOW' | 'MEDIUM' | 'HIGH';
  direct_impact: ImpactItem[];
  indirect_impact: ImpactItem[];
  business_rules: Array<{ id: string; title: string; file: string; lines: string | number; description?: string }>;
  tests: Array<{ id: string; name: string; file: string; relationship: string }>;
  security: Array<{ id: string; title: string; severity: string; remediation: string }>;
  external_integrations: Array<{ id: string; name: string; file?: string; description?: string }>;
  reason: string;
  recommendations: string[];
  subgraph_nodes: string[];
  subgraph_edges: Array<{ source: string; target: string; relationship: string }>;
}

export interface EvidenceChainItem {
  source: string;
  line: number;
  snippet: string;
  relationship: string;
}

export interface AskWhyResponse {
  query: string;
  target_node: string;
  has_evidence: boolean;
  evidence_chain: EvidenceChainItem[];
  conclusion: string;
  confidence: string;
  confidence_score: number;
  raw_answer: string;
}

export interface BehavioralContract {
  id: string;
  rule_id: string;
  name: string;
  component: string;
  condition_desc: string;
  expected_behavior: string;
  status: 'passed' | 'failed' | 'pending' | 'not_executed';
  actual_result?: string;
}

export interface HumanDecisionGate {
  gate_id: string;
  mission_id: string;
  phase_id: number;
  title: string;
  description: string;
  detected_behavior: string;
  evidence: {
    file: string;
    lines: string;
    snippet: string;
  };
  options: Array<{
    id: string;
    label: string;
    description: string;
  }>;
  selected_option?: string;
  rationale?: string;
  timestamp?: string;
}

export interface MissionPhase {
  id: number;
  name: string;
  status: 'pending' | 'in_progress' | 'awaiting_approval' | 'completed' | 'failed';
  progress: number;
  agent: string;
  findings: string[];
  output?: string;
}

export interface Mission {
  id: string;
  goal: string;
  status: 'idle' | 'running' | 'paused_at_gate' | 'completed' | 'failed';
  current_phase: number;
  phases: MissionPhase[];
  gate?: HumanDecisionGate;
  logs: string[];
}

export interface VerificationResult {
  timestamp: string;
  legacy_tests_passed: number;
  legacy_tests_failed: number;
  modern_tests_passed: number;
  modern_tests_failed: number;
  behavioral_contracts: BehavioralContract[];
  security_checks: Array<{ id: string; name: string; status: string; details: string }>;
  dependency_audit: {
    runtime_before: string;
    runtime_after: string;
    upgraded_dependencies: Array<{ package: string; from: string; to: string }>;
    removed_dependencies: string[];
  };
  output_logs: string;
}

export interface FinalReport {
  report_id: string;
  generated_at: string;
  repository_name: string;
  executive_summary: string;
  metrics: Record<string, any>;
  recovered_business_rules: Array<{ id: string; title: string; description: string; source: string; status: string }>;
  security_findings: Array<{ id: string; title: string; severity: string; resolution: string }>;
  architectural_changes: Array<{ component: string; pattern: string; description: string; evidence: string }>;
  human_decisions: Array<{ gate_id: string; title: string; decision: string; rationale: string; timestamp: string }>;
  verification_summary: Record<string, string>;
  remaining_risks: string[];
  recommended_next_steps: string[];
}
