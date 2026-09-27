import React, { useState, useEffect } from 'react';
import { FinalReport } from '../types';
import { api } from '../services/api';
import {
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [report, setReport] = useState<FinalReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const data = await api.getReport();
      setReport(data);
    } catch (err) {
      console.error('Failed to load report', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadMarkdown = async () => {
    try {
      const data = await api.getReportMarkdown();
      const blob = new Blob([data.markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reforge-modernization-report-${report?.repository_name || 'legacy-shop'}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download markdown', err);
    }
  };

  const downloadJSON = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reforge-modernization-report-${report.repository_name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono text-xs">
        Compiling final modernization report...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-7 overflow-y-auto h-full text-slate-800 text-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-purple-50 pb-5">
        <div>
          <span className="text-[10px] font-mono text-violet-600 uppercase tracking-wider font-bold block mb-0.5">
            Executive Summary & Architecture Audit
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-violet-600" />
            <span>Modernization Audit Report: {report?.repository_name}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={downloadMarkdown}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-md shadow-violet-500/25 transition-all flex items-center gap-2 hover:-translate-y-0.5 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Markdown</span>
          </button>

          <button
            onClick={downloadJSON}
            className="px-4 py-2 bg-white hover:bg-violet-50 text-slate-700 font-bold rounded-2xl border border-purple-200/80 transition-all flex items-center gap-2 shadow-sm hover:-translate-y-0.5 active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-violet-600" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {report && (
        <div className="space-y-6">
          {/* Executive Summary */}
          <div className="bg-white border border-purple-100/80 rounded-3xl p-7 space-y-2 shadow-[0_8px_30px_rgb(124,58,237,0.04)]">
            <span className="text-[10px] font-mono text-violet-600 uppercase tracking-wider font-bold">
              1. Executive Statement
            </span>
            <p className="text-slate-700 text-sm leading-relaxed">
              {report.executive_summary}
            </p>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-4 gap-5">
            <div className="bg-white border border-purple-100/80 p-5 rounded-3xl shadow-sm">
              <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Files Analyzed</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{report.metrics.files_analyzed}</span>
            </div>
            <div className="bg-white border border-purple-100/80 p-5 rounded-3xl shadow-sm">
              <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Rules Recovered</span>
              <span className="text-2xl font-black text-violet-700 mt-1 block">{report.metrics.business_rules_recovered}</span>
            </div>
            <div className="bg-white border border-purple-100/80 p-5 rounded-3xl shadow-sm">
              <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Vulnerabilities Fixed</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">{report.metrics.security_vulnerabilities_closed}</span>
            </div>
            <div className="bg-white border border-purple-100/80 p-5 rounded-3xl shadow-sm">
              <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Target Runtime</span>
              <span className="text-xl font-black text-amber-700 font-mono mt-1 block">{report.metrics.target_runtime}</span>
            </div>
          </div>

          {/* Architectural Modernizations */}
          <div className="bg-white border border-purple-100/80 rounded-3xl p-7 space-y-4 shadow-[0_8px_30px_rgb(124,58,237,0.04)]">
            <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-600" />
              <span>Architectural Modernization Patterns</span>
            </h2>

            <div className="space-y-3">
              {report.architectural_changes.map((arch, idx) => (
                <div key={idx} className="bg-violet-50/40 p-4 rounded-2xl border border-purple-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900">{arch.component}</span>
                    <span className="font-mono text-[10px] text-violet-700 bg-white border border-purple-100 px-2.5 py-0.5 rounded-full font-bold">
                      {arch.pattern}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs">{arch.description}</p>
                  <div className="text-[10px] font-mono text-slate-400 pt-1">
                    Reference: {arch.evidence}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Memory / Human Decisions */}
          <div className="bg-white border border-purple-100/80 rounded-3xl p-7 space-y-4 shadow-[0_8px_30px_rgb(124,58,237,0.04)]">
            <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Institutional Memory: Architecture Decision Records (ADR)</span>
            </h2>

            <div className="space-y-3">
              {report.human_decisions.map((h, idx) => (
                <div key={idx} className="bg-violet-50/40 p-4 rounded-2xl border border-purple-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900">{h.title}</span>
                    <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase font-bold">
                      Decision: {h.decision}
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs italic">"{h.rationale}"</p>
                  <div className="text-[10px] font-mono text-slate-400 pt-1">
                    Recorded at: {h.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Remaining Risks & Recommendations */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white border border-purple-100/80 rounded-3xl p-6 space-y-3 shadow-sm">
              <h3 className="font-extrabold text-amber-700 font-mono text-xs uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Remaining Technical Risks</span>
              </h3>
              <ul className="space-y-1.5 text-slate-600 text-xs pl-2">
                {report.remaining_risks.map((r, idx) => (
                  <li key={idx} className="list-disc pl-1">
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-purple-100/80 rounded-3xl p-6 space-y-3 shadow-sm">
              <h3 className="font-extrabold text-violet-700 font-mono text-xs uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Recommended Next Steps</span>
              </h3>
              <ul className="space-y-1.5 text-slate-600 text-xs pl-2">
                {report.recommended_next_steps.map((s, idx) => (
                  <li key={idx} className="list-disc pl-1">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
