import React, { useState } from 'react';
import { AskWhyResponse } from '../types';
import { api } from '../services/api';
import {
  HelpCircle,
  X,
  Send,
  FileCode,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface AskWhyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetNode: string;
  onJumpToCode: (file: string, line?: number) => void;
}

export const AskWhyDrawer: React.FC<AskWhyDrawerProps> = ({
  isOpen,
  onClose,
  targetNode = 'PaymentService',
  onJumpToCode
}) => {
  const [query, setQuery] = useState<string>(`Why does ${targetNode} depend on LegacyGateway?`);
  const [response, setResponse] = useState<AskWhyResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const presets = [
    `Why does ${targetNode} depend on LegacyGateway?`,
    `Why is the 3x retry policy implemented in services/payment.js?`,
    `What undocumented business rules exist in services/pricing.js?`,
    `Why is the 'request' package still in package.json?`
  ];

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim()) return;
    setLoading(true);
    try {
      const res = await api.askWhy(questionText, targetNode);
      setResponse(res);
    } catch (err) {
      console.error('Ask Why failed', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[460px] bg-white/95 backdrop-blur-2xl border-l border-purple-100 shadow-2xl z-50 flex flex-col text-xs animate-in slide-in-from-right duration-200 text-slate-800">
      {/* Drawer Header */}
      <div className="h-16 px-6 border-b border-purple-50 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-violet-700 font-extrabold">
          <HelpCircle className="w-5 h-5 text-violet-600" />
          <span className="text-slate-900 text-sm tracking-tight">Ask ReForge ("Why?")</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-violet-50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Presets */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2 font-bold">
            Suggested Contextual Questions:
          </span>
          <div className="space-y-1.5">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(preset);
                  handleAsk(preset);
                }}
                className="w-full text-left p-2.5 rounded-2xl bg-violet-50/50 hover:bg-violet-100/70 border border-purple-100 text-slate-700 text-[11px] truncate transition-all font-medium hover:border-purple-200"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask why a dependency, function, or weird pattern exists..."
              className="w-full bg-violet-50/40 border border-purple-200/80 rounded-2xl p-3.5 text-xs text-slate-800 focus:outline-none focus:border-violet-500 font-mono resize-none shadow-sm"
            />
          </div>
          <button
            onClick={() => handleAsk(query)}
            disabled={loading || !query.trim()}
            className="w-full py-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-md shadow-violet-500/25 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
          >
            <Send className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Searching Repository AST & References...' : 'Ask ReForge'}</span>
          </button>
        </div>

        {/* Answer Presentation */}
        {response && (
          <div className="space-y-4 pt-2">
            <div className="bg-violet-50/40 rounded-3xl p-5 border border-purple-100 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-purple-100/70 pb-2.5">
                <span className="text-[10px] font-mono text-violet-700 uppercase font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                  <span>Grounded Explanation</span>
                </span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                  Confidence: {response.confidence}
                </span>
              </div>

              <p className="text-slate-800 text-xs leading-relaxed font-medium">
                {response.raw_answer}
              </p>

              {/* Evidence Chain */}
              {response.evidence_chain.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-purple-100/70">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                    CITED SOURCE EVIDENCE:
                  </span>
                  {response.evidence_chain.map((e, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-2.5 rounded-xl border border-purple-100 text-[11px] font-mono flex items-center justify-between shadow-sm"
                    >
                      <div className="truncate mr-2">
                        <span className="text-violet-700 font-bold">[{e.relationship}]</span>{' '}
                        <span className="text-slate-800 font-bold">{e.source}:{e.line}</span>
                        <span className="text-slate-500 block truncate text-[10px]">{e.snippet}</span>
                      </div>
                      <button
                        onClick={() => onJumpToCode(e.source, e.line)}
                        className="text-violet-600 hover:text-violet-800 flex-shrink-0 p-1 rounded hover:bg-violet-50"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
