import React, { useState, useEffect } from 'react';
import { ChangeImpact } from '../types';
import {
  Activity,
  AlertTriangle,
  Server,
  ArrowRight,
  ShieldAlert,
  FileCode,
  BookOpenCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Compass,
  Zap,
  Globe,
  Database,
  Radio,
  ChevronDown
} from 'lucide-react';

interface ImpactSimulatorPageProps {
  impact: ChangeImpact | null;
  onSimulate: (target: string) => void;
  onLaunchMission: () => void;
  onJumpToCode: (file: string, line?: number) => void;
  loading: boolean;
}

export const ImpactSimulatorPage: React.FC<ImpactSimulatorPageProps> = ({
  impact,
  onSimulate,
  onLaunchMission,
  onJumpToCode,
  loading
}) => {
  const [selectedComponent, setSelectedComponent] = useState<string>(impact?.target || 'PaymentService');

  useEffect(() => {
    if (impact?.target) {
      setSelectedComponent(impact.target);
    }
  }, [impact?.target]);

  const componentsList = [
    { name: 'PaymentService', type: 'Core Service', description: 'Handles transactions & LegacyGateway coupling' },
    { name: 'PricingService', type: 'Core Service', description: 'Manages Senior & Bulk discount rules' },
    { name: 'OrderService', type: 'Orchestrator', description: 'Coordinates order state lifecycle' },
    { name: 'UserService', type: 'Profile Service', description: 'User lookup and loyalty tiers' },
    { name: 'LegacyGateway', type: 'External Integration', description: 'Obsolete payment gateway' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-7 overflow-y-auto h-full text-slate-800">
      {/* Top Selector Bar */}
      <div className="bg-white rounded-3xl p-6 border border-purple-100/80 shadow-[0_8px_30px_rgb(124,58,237,0.04)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-700 flex items-center justify-center shadow-sm">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-amber-600 uppercase tracking-wider font-bold block mb-0.5">
              Blast Radius & Dependency Traversal
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              What happens if I change or modernize...
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              className="bg-violet-50/60 border border-purple-200/80 text-slate-800 text-xs font-bold rounded-2xl px-4 py-2.5 focus:outline-none focus:border-violet-500 font-mono shadow-sm appearance-none pr-9 cursor-pointer"
            >
              {componentsList.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          <button
            onClick={() => onSimulate(selectedComponent)}
            disabled={loading}
            className="px-5 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-2xl shadow-md shadow-violet-500/25 transition-all flex items-center gap-2 hover:-translate-y-0.5 active:scale-95"
          >
            <Radio className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Tracing Graph...' : 'Analyze Impact'}</span>
          </button>
        </div>
      </div>

      {impact && (
        <div className="space-y-6">
          {/* Risk Level Banner */}
          <div className="relative bg-white border border-rose-200/80 rounded-3xl p-6 shadow-[0_8px_30px_rgb(244,63,94,0.06)] overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Target Component:
                </span>
                <span className="text-xl font-black text-slate-900 font-mono">{impact.target}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400 font-medium">Blast Radius Assessment:</span>
                <span className="px-4 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-extrabold font-mono uppercase tracking-wider flex items-center gap-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>{impact.impact_level} RISK LEVEL</span>
                </span>
              </div>
            </div>

            <p className="text-slate-700 text-xs leading-relaxed bg-rose-50/40 p-4 rounded-2xl border border-rose-100 font-mono">
              {impact.reason}
            </p>
          </div>

          {/* Impact Categorization Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Directly Affected */}
            <div className="bg-white rounded-3xl p-6 border border-purple-100/80 shadow-[0_8px_30px_rgb(124,58,237,0.04)] space-y-3">
              <div className="flex items-center justify-between border-b border-purple-50 pb-3">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase font-mono tracking-wider flex items-center gap-2">
                  <Server className="w-4 h-4 text-violet-600" />
                  <span>Direct Invocations</span>
                </h3>
                <span className="text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-0.5 rounded-full font-mono">
                  {impact.direct_impact.length}
                </span>
              </div>

              <div className="space-y-2">
                {impact.direct_impact.map((item) => (
                  <div key={item.id} className="p-3.5 bg-violet-50/40 rounded-2xl border border-purple-100 text-xs space-y-0.5">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>{item.name}</span>
                      <span className="text-[9px] font-mono uppercase text-slate-400">{item.type}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">{item.reason}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Governed Business Rules */}
            <div className="bg-white rounded-3xl p-6 border border-purple-100/80 shadow-[0_8px_30px_rgb(124,58,237,0.04)] space-y-3">
              <div className="flex items-center justify-between border-b border-purple-50 pb-3">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase font-mono tracking-wider flex items-center gap-2">
                  <BookOpenCheck className="w-4 h-4 text-cyan-600" />
                  <span>Governed Rules</span>
                </h3>
                <span className="text-xs font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full font-mono">
                  {impact.business_rules.length}
                </span>
              </div>

              <div className="space-y-2">
                {impact.business_rules.map((rule) => (
                  <div key={rule.id} className="p-3.5 bg-cyan-50/40 rounded-2xl border border-cyan-100 text-xs space-y-1">
                    <div className="font-bold text-cyan-900">{rule.title}</div>
                    <div className="text-[10px] font-mono text-slate-500">
                      Coordinates: {rule.file}:{rule.lines}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tests & External Integrations */}
            <div className="bg-white rounded-3xl p-6 border border-purple-100/80 shadow-[0_8px_30px_rgb(124,58,237,0.04)] space-y-3">
              <div className="flex items-center justify-between border-b border-purple-50 pb-3">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase font-mono tracking-wider flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-600" />
                  <span>Tests & Gateways</span>
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono">
                  {impact.tests.length + impact.external_integrations.length}
                </span>
              </div>

              <div className="space-y-2">
                {impact.tests.map((t) => (
                  <div key={t.id} className="p-3.5 bg-emerald-50/40 rounded-2xl border border-emerald-100 text-xs">
                    <span className="text-[9px] text-emerald-700 font-mono block uppercase font-bold">Verifying Test Suite</span>
                    <span className="font-bold text-slate-900">{t.name}</span>
                  </div>
                ))}
                {impact.external_integrations.map((ext) => (
                  <div key={ext.id} className="p-3.5 bg-amber-50/40 rounded-2xl border border-amber-100 text-xs">
                    <span className="text-[9px] text-amber-700 font-mono block uppercase font-bold">Coupled Gateway</span>
                    <span className="font-bold text-slate-900">{ext.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Architectural Recommendation & Direct Mission Launch */}
          <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-900 rounded-3xl p-7 shadow-xl shadow-violet-900/20 space-y-4 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
                Architectural Evolution Strategy
              </h3>
            </div>

            <ul className="space-y-2 text-xs text-violet-100">
              {impact.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-cyan-300 font-bold text-sm">↳</span>
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <button
                onClick={onLaunchMission}
                className="px-6 py-3 bg-white hover:bg-violet-50 text-violet-900 font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2.5 hover:-translate-y-0.5 active:scale-95"
              >
                <Compass className="w-4 h-4 text-violet-700" />
                <span>Initialize Modernization Mission for {impact.target}</span>
                <ArrowRight className="w-4 h-4 text-violet-700" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
