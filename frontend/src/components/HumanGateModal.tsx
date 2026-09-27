import React, { useState } from 'react';
import { HumanDecisionGate } from '../types';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  FileCode,
  X
} from 'lucide-react';

interface HumanGateModalProps {
  gate: HumanDecisionGate;
  onDecision: (option: string, rationale: string) => void;
  onClose?: () => void;
}

export const HumanGateModal: React.FC<HumanGateModalProps> = ({ gate, onDecision, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<string>('preserve');
  const [rationale, setRationale] = useState<string>(
    'Preserve 3x retry mechanism inside modern PaymentAdapter to maintain production payment settlement reliability.'
  );

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-amber-200 rounded-3xl max-w-xl w-full p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 text-slate-800">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-purple-50 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-100 text-amber-700 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-extrabold block mb-0.5">
                Human Decision Required • Phase 6 Gate
              </span>
              <h2 className="text-base font-extrabold text-slate-900">{gate.title}</h2>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Description & Detected Behavior */}
        <div className="space-y-3 text-xs text-slate-700">
          <p className="leading-relaxed bg-amber-50/50 p-4 rounded-2xl border border-amber-100 text-amber-950 font-medium">
            {gate.description}
          </p>

          {/* Evidence box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-purple-100 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 border-b border-purple-50 pb-1.5 font-bold">
              <span className="flex items-center gap-1.5 text-violet-700">
                <FileCode className="w-3.5 h-3.5" />
                <span>Evidence: {gate.evidence?.file}:{gate.evidence?.lines}</span>
              </span>
              <span className="text-[10px] text-slate-400">AST Pattern Match</span>
            </div>
            <pre className="text-[11px] font-mono text-amber-900 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 overflow-x-auto whitespace-pre-wrap py-1">
              {gate.evidence?.snippet}
            </pre>
          </div>
        </div>

        {/* Decision Options */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
            Choose Modernization Action:
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            {gate.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setSelectedOption(opt.id);
                  if (opt.id === 'preserve') {
                    setRationale('Preserve 3x retry mechanism inside modern PaymentAdapter to maintain production payment settlement reliability.');
                  } else if (opt.id === 'remove') {
                    setRationale('Remove retry logic and delegate failures directly to upstream client.');
                  } else {
                    setRationale('Flag for engineering lead manual review.');
                  }
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  selectedOption === opt.id
                    ? 'bg-violet-50 border-violet-500 text-violet-950 shadow-sm ring-2 ring-violet-500/20'
                    : 'bg-white border-purple-100 text-slate-600 hover:text-slate-900 hover:bg-violet-50/40'
                }`}
              >
                <div className="font-extrabold text-xs">{opt.label}</div>
                <div className="text-[10px] text-slate-500 mt-1 leading-snug line-clamp-2">
                  {opt.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Decision Rationale */}
        <div>
          <span className="text-[11px] font-mono text-slate-500 block mb-1 font-bold">
            Institutional Memory Rationale:
          </span>
          <input
            type="text"
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            className="w-full bg-violet-50/40 border border-purple-200/80 rounded-2xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500 font-mono"
          />
        </div>

        {/* Submit */}
        <div className="pt-3 border-t border-purple-50 flex items-center justify-end gap-3">
          <button
            onClick={() => onDecision(selectedOption, rationale)}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-violet-500/25 transition-all"
          >
            Confirm Decision & Resume Modernization
          </button>
        </div>
      </div>
    </div>
  );
};
