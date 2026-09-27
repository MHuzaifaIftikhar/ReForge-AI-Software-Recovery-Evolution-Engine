import {
  KnowledgeGraphData,
  BusinessRule,
  ChangeImpact,
  AskWhyResponse,
  Mission,
  VerificationResult,
  FinalReport
} from '../types';

const API_BASE = 'http://127.0.0.1:8000/api';

export const api = {
  // Repository Management & Upload
  loadDemoRepo: async () => {
    const res = await fetch(`${API_BASE}/repo/load-demo`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to load demo repository');
    return res.json();
  },

  uploadZip: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/repo/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.detail || 'Failed to upload ZIP repository');
    }
    return res.json();
  },

  uploadFiles: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    const res = await fetch(`${API_BASE}/repo/upload-files`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'File upload failed' }));
      throw new Error(err.detail || 'Failed to upload source files');
    }
    return res.json();
  },

  uploadCodeSnippet: async (filename: string, code: string, repoName?: string) => {
    const res = await fetch(`${API_BASE}/repo/upload-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, code, repo_name: repoName })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Snippet upload failed' }));
      throw new Error(err.detail || 'Failed to analyze code snippet');
    }
    return res.json();
  },

  analyzeRepo: async () => {
    const res = await fetch(`${API_BASE}/repo/analyze`, { method: 'POST' });
    if (!res.ok) throw new Error('Analysis failed');
    return res.json();
  },

  getFiles: async () => {
    const res = await fetch(`${API_BASE}/repo/files`);
    if (!res.ok) throw new Error('Failed to fetch files');
    return res.json();
  },

  getFileContent: async (path: string) => {
    const res = await fetch(`${API_BASE}/repo/file-content?path=${encodeURIComponent(path)}`);
    if (!res.ok) throw new Error(`Failed to load file: ${path}`);
    return res.json();
  },

  getFileDiff: async (path: string = 'services/payment.js') => {
    const res = await fetch(`${API_BASE}/repo/diff?path=${encodeURIComponent(path)}`);
    if (!res.ok) throw new Error(`Failed to load diff for: ${path}`);
    return res.json();
  },

  // Knowledge Graph
  getKnowledgeGraph: async (): Promise<KnowledgeGraphData> => {
    const res = await fetch(`${API_BASE}/graph`);
    if (!res.ok) throw new Error('Failed to load knowledge graph');
    return res.json();
  },

  // Business Rules
  getBusinessRules: async (): Promise<{ rules: BusinessRule[] }> => {
    const res = await fetch(`${API_BASE}/rules`);
    if (!res.ok) throw new Error('Failed to fetch business rules');
    return res.json();
  },

  updateBusinessRule: async (id: string, status: string, note?: string) => {
    const res = await fetch(`${API_BASE}/rules/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note })
    });
    if (!res.ok) throw new Error('Failed to update business rule');
    return res.json();
  },

  // Change Impact & Ask Why
  simulateImpact: async (target: string): Promise<ChangeImpact> => {
    const res = await fetch(`${API_BASE}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target })
    });
    if (!res.ok) throw new Error('Impact simulation failed');
    return res.json();
  },

  askWhy: async (query: string, target_node: string = 'PaymentService'): Promise<AskWhyResponse> => {
    const res = await fetch(`${API_BASE}/ask-why`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, target_node })
    });
    if (!res.ok) throw new Error('Query failed');
    return res.json();
  },

  // Missions & Human Gate
  createMission: async (goal: string = 'Modernize Payment Layer'): Promise<Mission> => {
    const res = await fetch(`${API_BASE}/missions?goal=${encodeURIComponent(goal)}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to create mission');
    return res.json();
  },

  getActiveMission: async (): Promise<Mission> => {
    const res = await fetch(`${API_BASE}/missions/active`);
    if (!res.ok) throw new Error('Failed to get mission');
    return res.json();
  },

  submitGateDecision: async (option: string, rationale: string = ''): Promise<Mission> => {
    const res = await fetch(`${API_BASE}/missions/gate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ option, rationale })
    });
    if (!res.ok) throw new Error('Failed to submit gate decision');
    return res.json();
  },

  // Verification & Reports
  runVerification: async (): Promise<VerificationResult> => {
    const res = await fetch(`${API_BASE}/verify`, { method: 'POST' });
    if (!res.ok) throw new Error('Verification failed');
    return res.json();
  },

  getReport: async (): Promise<FinalReport> => {
    const res = await fetch(`${API_BASE}/report`);
    if (!res.ok) throw new Error('Failed to fetch report');
    return res.json();
  },

  getReportMarkdown: async (): Promise<{ markdown: string }> => {
    const res = await fetch(`${API_BASE}/report/markdown`);
    if (!res.ok) throw new Error('Failed to fetch report markdown');
    return res.json();
  }
};
