import React from 'react';
import {
  User,
  X,
  Cpu,
  FolderGit2,
  ShieldCheck,
  Zap,
  Terminal,
  Server,
  Layers
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  repoName: string;
  runtime: string;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  repoName,
  runtime
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#eeebf6] rounded-[28px] max-w-md w-full p-6 shadow-2xl space-y-5 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-violet-100 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
              A
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Administrator Profile</h3>
              <p className="text-[11px] text-slate-400 font-medium">ReForge Engine Operator</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* System Specs & Workspace Info */}
        <div className="space-y-3 relative z-10 text-xs text-slate-600">
          <div className="p-3 rounded-2xl bg-[#faf9fe] border border-purple-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Engine Mode</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Deterministic AST
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Active Repository</span>
              <span className="font-mono font-bold text-slate-800">{repoName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Target Modernization</span>
              <span className="font-mono font-bold text-violet-700">{runtime} → Node.js 22 LTS</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Verification Guardrail</span>
              <span className="font-bold text-slate-800">Behavioral Regression Runner</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">FastAPI Backend</span>
              <span className="font-mono text-slate-700">http://127.0.0.1:8000</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-violet-50/60 border border-violet-100/80 text-[11px] text-violet-900 leading-relaxed">
            ReForge AI Software Recovery & Evolution Engine. Mined rules and dependency topologies are grounded with exact AST file and line coordinate proof.
          </div>
        </div>
      </div>
    </div>
  );
};
