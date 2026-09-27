import React, { useEffect, useState } from 'react';
import {
  FileCode,
  Search,
  BookOpenCheck,
  Network,
  ShieldAlert,
  CheckCircle2,
  Cpu,
  Sparkles
} from 'lucide-react';

interface AnalyzeModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const AnalyzeModal: React.FC<AnalyzeModalProps> = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    { title: 'Scanning File Structure & AST', detail: 'Parsing 17 JavaScript & manifest files', icon: FileCode },
    { title: 'Auditing Package Dependencies', detail: 'Flagged deprecated request@2.88.2 & Mongo v3', icon: Search },
    { title: 'Mining Conditional Domain Rules', detail: 'Extracted Senior Discount (15%) & 3x Retry', icon: BookOpenCheck },
    { title: 'Constructing Knowledge Graph', detail: 'Linked 27 typed nodes and 35 directed edges', icon: Network },
    { title: 'Evaluating Security Vulnerabilities', detail: 'Identified hardcoded secret & unverified JWT', icon: ShieldAlert }
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const progressPercent = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-purple-100 rounded-3xl max-w-lg w-full p-7 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Glow orb */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-violet-100 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center shadow-sm">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-violet-600 font-bold block mb-0.5">
              Deterministic Static Engine
            </span>
            <h2 className="text-base font-extrabold text-slate-900">
              Analyzing Repository Architecture...
            </h2>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500 font-medium">Processing Pipeline</span>
            <span className="text-violet-700 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-purple-100">
            <div
              className="h-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 transition-all duration-300 rounded-full shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-2.5">
          {steps.map((s, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;
            const Icon = s.icon;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-900'
                    : isCurrent
                    ? 'bg-violet-50 border-violet-300 text-violet-900 shadow-sm'
                    : 'bg-slate-50 border-slate-100 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-600'
                        : isCurrent
                        ? 'bg-violet-100 text-violet-700 animate-bounce'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs">{s.title}</h3>
                    <p className="text-[10px] text-slate-500">{s.detail}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold">
                  {isDone ? 'DONE' : isCurrent ? 'IN PROGRESS' : 'QUEUED'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
