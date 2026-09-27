import React, { useState } from 'react';
import { Mission } from '../types';
import { HumanGateModal } from '../components/HumanGateModal';
import {
  Compass,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Terminal,
  Play,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Sparkles,
  Zap,
  RotateCw
} from 'lucide-react';

interface MissionsPageProps {
  mission: Mission | null;
  onCreateMission: (goal: string) => void;
  onSubmitGateDecision: (option: string, rationale: string) => void;
  onNavigateToVerify: () => void;
}

export const MissionsPage: React.FC<MissionsPageProps> = ({
  mission,
  onCreateMission,
  onSubmitGateDecision,
  onNavigateToVerify
}) => {
  const [missionGoal, setMissionGoal] = useState<string>('Modernize Payment Layer');
  const [showGateModal, setShowGateModal] = useState<boolean>(false);

  const isPausedAtGate = mission?.status === 'paused_at_gate';

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-7 overflow-y-auto h-full text-slate-800">
      {/* Header & Goal Launch */}
      <div className="bg-white rounded-3xl p-6 border border-purple-100/80 shadow-[0_8px_30px_rgb(124,58,237,0.04)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-100/80 text-violet-700 flex items-center justify-center shadow-sm">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-violet-600 uppercase tracking-wider font-bold block mb-0.5">
              Autonomous Multi-Agent Swarm
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Modernization Mission Engine
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={missionGoal}
            onChange={(e) => setMissionGoal(e.target.value)}
            className="bg-violet-50/60 border border-purple-200/80 text-slate-800 text-xs font-bold rounded-2xl px-4 py-2.5 w-72 focus:outline-none focus:border-violet-500 font-mono shadow-sm"
            placeholder="Mission objective..."
          />
          <button
            onClick={() => onCreateMission(missionGoal)}
            className="px-5 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-md shadow-violet-500/25 transition-all flex items-center gap-2 hover:-translate-y-0.5 active:scale-95"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Launch Mission</span>
          </button>
        </div>
      </div>

      {/* Human Gate Warning Alert if Paused */}
      {isPausedAtGate && mission?.gate && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 shadow-lg shadow-amber-500/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl border border-amber-200 shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-extrabold block">
                ACTION REQUIRED • PHASE 6 HUMAN APPROVAL GATE
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Undocumented Payment Retry Mechanism Detected (services/payment.js:91-103)
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                ReForge halted automatic modification. An undocumented 3x retry policy was discovered in the payment layer. Explicit human consent required to preserve or remove it.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowGateModal(true)}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>Review & Approve</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Mission Grid */}
      {mission && (
        <div className="grid grid-cols-12 gap-6">
          {/* Phases Stepper (Left 7 cols) */}
          <div className="col-span-7 bg-white rounded-3xl p-7 border border-purple-100/80 space-y-4 shadow-[0_8px_30px_rgb(124,58,237,0.04)]">
            <div className="flex items-center justify-between border-b border-purple-50 pb-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Mission Execution Workflow ({mission.phases.filter((p) => p.status === 'completed').length} / {mission.phases.length} Phases Complete)
              </h2>
              <span className="text-[10px] font-mono text-violet-700 uppercase font-bold bg-violet-50 border border-violet-200 px-3 py-1 rounded-full">
                {mission.status.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-3">
              {mission.phases.map((phase) => {
                const isCompleted = phase.status === 'completed';
                const isGateAwaiting = phase.status === 'awaiting_approval';
                return (
                  <div
                    key={phase.id}
                    className={`p-4 rounded-2xl border text-xs transition-all duration-300 ${
                      isCompleted
                        ? 'bg-violet-50/40 border-purple-100 text-slate-700 shadow-sm'
                        : isGateAwaiting
                        ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-md shadow-amber-500/10'
                        : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : isGateAwaiting ? (
                          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 animate-bounce">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <span className="font-bold text-slate-900 text-xs">
                          Phase {phase.id}: {phase.name}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-violet-700 bg-violet-100/70 px-2.5 py-0.5 rounded-full font-bold">
                        {phase.agent}
                      </span>
                    </div>

                    {phase.output && (
                      <p className="text-[11px] text-slate-500 mt-2 pl-9 font-mono border-t border-purple-50 pt-1.5 leading-relaxed">
                        ↳ {phase.output}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {mission.status === 'completed' && (
              <div className="pt-4 border-t border-purple-50">
                <button
                  onClick={onNavigateToVerify}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Mission Certified — Inspect Live Verification Results</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Terminal Console (Right 5 cols) */}
          <div className="col-span-5 bg-slate-900 border border-purple-100/80 rounded-3xl p-6 flex flex-col font-mono text-xs shadow-2xl text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 text-[11px]">
              <div className="flex items-center gap-2 text-slate-200 font-bold">
                <Terminal className="w-4 h-4 text-violet-400" />
                <span>Multi-Agent Swarm Terminal</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">● Streaming Live</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 text-[11px] text-slate-300 pr-2 max-h-[520px]">
              {mission.logs.map((log, index) => (
                <div key={index} className="flex gap-2 leading-relaxed">
                  <span className="text-slate-600 select-none font-bold">[{index + 1}]</span>
                  <span
                    className={
                      log.includes('Human')
                        ? 'text-amber-300 font-bold'
                        : log.includes('QA Agent')
                        ? 'text-emerald-300 font-bold'
                        : log.includes('Migration Agent')
                        ? 'text-cyan-300'
                        : 'text-slate-300'
                    }
                  >
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Human Gate Modal */}
      {showGateModal && mission?.gate && (
        <HumanGateModal
          gate={mission.gate}
          onDecision={(opt, rat) => {
            onSubmitGateDecision(opt, rat);
            setShowGateModal(false);
          }}
          onClose={() => setShowGateModal(false)}
        />
      )}
    </div>
  );
};
