import React, { useState, useMemo } from 'react';
import { BusinessRule } from '../types';
import {
  BookOpenCheck,
  Check,
  X,
  Search,
  ExternalLink,
  MessageSquarePlus,
  ShieldCheck,
  Sparkles,
  Filter,
  CheckCheck,
  FileCode
} from 'lucide-react';

interface BusinessRulesPageProps {
  rules: BusinessRule[];
  onUpdateRuleStatus: (id: string, status: string, note?: string) => void;
  onJumpToCode: (file: string, line?: number) => void;
}

export const BusinessRulesPage: React.FC<BusinessRulesPageProps> = ({
  rules,
  onUpdateRuleStatus,
  onJumpToCode
}) => {
  const [selectedNoteRule, setSelectedNoteRule] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRules = useMemo(() => {
    return rules.filter((r) => {
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.source_file.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [rules, statusFilter, searchQuery]);

  const handleAddNote = (ruleId: string) => {
    if (!noteText.trim()) return;
    onUpdateRuleStatus(ruleId, 'needs_review', noteText);
    setNoteText('');
    setSelectedNoteRule(null);
  };

  const handleConfirmAll = () => {
    rules.forEach((r) => {
      if (r.status === 'discovered') {
        onUpdateRuleStatus(r.id, 'confirmed');
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Confirmed</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-rose-50 text-rose-700 border border-rose-200/80 px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Rejected</span>
          </span>
        );
      case 'needs_review':
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200/80 px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Needs Review</span>
          </span>
        );
      default:
        return (
          <span className="bg-violet-50 text-violet-700 border border-violet-200/80 px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span>Discovered</span>
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-7 overflow-y-auto h-full text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-violet-600 uppercase tracking-wider font-bold block mb-0.5">
            Institutional Memory Extraction
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpenCheck className="w-6 h-6 text-violet-600" />
            <span>Recovered Institutional Business Rules</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Undocumented domain logic mined from AST conditional branches with grounded source file coordinates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleConfirmAll}
            className="px-4 py-2 rounded-2xl bg-white hover:bg-emerald-50 border border-purple-200/80 text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-2 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Confirm All Discovered</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="bg-white border border-purple-100/90 rounded-2xl px-3.5 py-2 flex items-center gap-2 w-80 shadow-sm">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rules, files, keywords..."
            className="bg-transparent border-none text-xs text-slate-700 placeholder-slate-400 focus:outline-none w-full font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Status Tabs */}
        <div className="bg-white border border-purple-100 rounded-2xl p-1.5 flex items-center gap-1 shadow-sm text-xs">
          {[
            { id: 'all', label: 'All', count: rules.length },
            { id: 'discovered', label: 'Discovered', count: rules.filter((r) => r.status === 'discovered').length },
            { id: 'confirmed', label: 'Confirmed', count: rules.filter((r) => r.status === 'confirmed').length },
            { id: 'needs_review', label: 'Needs Review', count: rules.filter((r) => r.status === 'needs_review').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25'
                  : 'text-slate-500 hover:text-violet-700 hover:bg-violet-50/70'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                  statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-white hover:bg-white rounded-3xl p-6 border border-purple-100/80 shadow-[0_8px_30px_rgb(124,58,237,0.04)] hover:shadow-lg flex flex-col justify-between transition-all duration-300 group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  {rule.id}
                </span>
                {getStatusBadge(rule.status)}
              </div>

              <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-1.5 group-hover:text-violet-700 transition-colors">
                {rule.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {rule.description}
              </p>

              {/* Source coordinates with Jump Button */}
              <div className="flex items-center justify-between bg-violet-50/40 px-3.5 py-2 rounded-2xl border border-purple-100 text-xs font-mono mb-3">
                <span className="text-slate-600 text-[11px] truncate font-bold">
                  {rule.source_file}:{rule.source_lines}
                </span>
                <button
                  onClick={() => {
                    const startLine = parseInt(rule.source_lines.split('-')[0]) || 1;
                    onJumpToCode(rule.source_file, startLine);
                  }}
                  className="text-violet-700 hover:text-violet-900 font-bold flex items-center gap-1 text-[11px] hover:underline"
                >
                  <span>View in Monaco</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Code Evidence Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-purple-100 mb-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1 font-bold">
                  <FileCode className="w-3.5 h-3.5 text-violet-600" />
                  <span>Mined Conditional Evidence</span>
                </div>
                <pre className="text-[11px] font-mono text-violet-950 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {rule.evidence}
                </pre>
              </div>

              {/* Confidence Meter & Notes */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4 font-mono text-[11px]">
                <span>
                  Certainty: <strong className="text-emerald-600">{Math.round(rule.confidence * 100)}% Deterministic</strong>
                </span>
                {rule.notes && rule.notes.length > 0 && (
                  <span className="text-[10px] text-slate-400 italic truncate max-w-[200px]">
                    "{rule.notes[0]}"
                  </span>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-purple-50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateRuleStatus(rule.id, 'confirmed')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    rule.status === 'confirmed'
                      ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm</span>
                </button>

                <button
                  onClick={() => onUpdateRuleStatus(rule.id, 'rejected')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    rule.status === 'rejected'
                      ? 'bg-rose-600 text-white shadow-rose-500/25'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedNoteRule(selectedNoteRule === rule.id ? null : rule.id)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <MessageSquarePlus className="w-3.5 h-3.5 text-violet-600" />
                <span>Add Note</span>
              </button>
            </div>

            {/* Note Drawer */}
            {selectedNoteRule === rule.id && (
              <div className="mt-3 pt-3 border-t border-purple-50 space-y-2 animate-in fade-in duration-150">
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Record architectural rationale into institutional memory..."
                  className="w-full bg-slate-50 border border-purple-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500 font-mono"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedNoteRule(null)}
                    className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-slate-600 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAddNote(rule.id)}
                    className="px-3.5 py-1 bg-violet-600 hover:bg-violet-700 text-white text-[11px] rounded-xl font-bold shadow-sm shadow-violet-500/20"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
