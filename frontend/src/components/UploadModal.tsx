import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileArchive,
  Files,
  Code2,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  FileCode,
  FolderGit2
} from 'lucide-react';
import { api } from '../services/api';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (repoName: string, runtime: string) => void;
  onError: (msg: string) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  onError
}) => {
  const [activeTab, setActiveTab] = useState<'zip' | 'files' | 'snippet'>('zip');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedZip, setSelectedZip] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Snippet state
  const [snippetName, setSnippetName] = useState<string>('services/payment.js');
  const [snippetRepo, setSnippetRepo] = useState<string>('custom-service');
  const [snippetCode, setSnippetCode] = useState<string>(
`// Paste legacy code to recover business rules & construct knowledge graph
const LegacyGateway = require('../gateways/legacy');

class CustomPaymentService {
  constructor() {
    this.maxRetries = 3;
  }

  async processOrder(order, customer) {
    // Business Rule: Senior Customer Discount
    if (customer.age >= 60 && order.total > 500) {
      order.discount = 0.15;
      order.rule = 'SENIOR_DISCOUNT_APPLIED';
    }

    // Business Rule: VIP Loyalty Discount
    if (customer.tier === 'VIP' && order.total > 200) {
      order.discount = Math.max(order.discount || 0, 0.05);
    }

    // Resilience: 3x Retry Policy
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const res = await LegacyGateway.charge(order.total);
        if (res.status === 'SUCCESS') return res;
      } catch (err) {
        if (attempt === this.maxRetries) throw err;
      }
    }
  }
}

module.exports = CustomPaymentService;`
  );

  const zipInputRef = useRef<HTMLInputElement>(null);
  const filesInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleZipUpload = async () => {
    if (!selectedZip) return;
    setIsUploading(true);
    try {
      const res = await api.uploadZip(selectedZip);
      onUploadSuccess(res.repository?.name || selectedZip.name.replace(/\.zip$/i, ''), res.repository?.runtime || 'Node.js 12');
      onClose();
    } catch (err: any) {
      console.error(err);
      onError(err.message || 'Failed to analyze uploaded ZIP archive');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFilesUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    try {
      const res = await api.uploadFiles(selectedFiles);
      onUploadSuccess('uploaded-files-workspace', res.repository?.runtime || 'Node.js 22');
      onClose();
    } catch (err: any) {
      console.error(err);
      onError(err.message || 'Failed to analyze uploaded files');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSnippetUpload = async () => {
    if (!snippetCode.trim()) return;
    setIsUploading(true);
    try {
      const res = await api.uploadCodeSnippet(snippetName, snippetCode, snippetRepo);
      onUploadSuccess(snippetRepo, res.repository?.runtime || 'Node.js 22');
      onClose();
    } catch (err: any) {
      console.error(err);
      onError(err.message || 'Failed to analyze code snippet');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#eeebf6] rounded-[28px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Glow orb */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-violet-100/70 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-violet-500/25">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Upload Repository or Code
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Analyze your own codebase with deterministic AST parsing & rule recovery.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f5f3fb] rounded-2xl text-xs font-bold text-slate-600 relative z-10">
          <button
            onClick={() => setActiveTab('zip')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'zip'
                ? 'bg-white text-violet-700 shadow-xs'
                : 'hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <FileArchive className="w-4 h-4" />
            <span>ZIP Archive</span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'files'
                ? 'bg-white text-violet-700 shadow-xs'
                : 'hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Files className="w-4 h-4" />
            <span>Multiple Files</span>
          </button>

          <button
            onClick={() => setActiveTab('snippet')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'snippet'
                ? 'bg-white text-violet-700 shadow-xs'
                : 'hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Paste Snippet</span>
          </button>
        </div>

        {/* Tab 1: ZIP Archive Upload */}
        {activeTab === 'zip' && (
          <div className="space-y-4 relative z-10">
            <input
              type="file"
              ref={zipInputRef}
              accept=".zip"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedZip(e.target.files[0]);
                }
              }}
            />

            <div
              onClick={() => zipInputRef.current?.click()}
              className="border-2 border-dashed border-violet-200 hover:border-violet-400 bg-violet-50/40 hover:bg-violet-50/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
            >
              <FileArchive className="w-12 h-12 text-violet-500 mb-3 group-hover:scale-105 transition-transform" />
              {selectedZip ? (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">{selectedZip.name}</p>
                  <p className="text-xs text-slate-400">
                    {(selectedZip.size / 1024 / 1024).toFixed(2)} MB • Ready for AST scanning
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">
                    Click to browse or drop repository .ZIP here
                  </p>
                  <p className="text-xs text-slate-400">
                    Supports GitHub download ZIPs, Express/Node.js, or multi-directory archives
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleZipUpload}
              disabled={!selectedZip || isUploading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-violet-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>{isUploading ? 'Extracting & Scanning AST...' : 'Analyze ZIP Repository'}</span>
            </button>
          </div>
        )}

        {/* Tab 2: Multiple Files Upload */}
        {activeTab === 'files' && (
          <div className="space-y-4 relative z-10">
            <input
              type="file"
              ref={filesInputRef}
              multiple
              accept=".js,.ts,.jsx,.tsx,.json,.py,.sql,.java,.go"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  setSelectedFiles(Array.from(e.target.files));
                }
              }}
            />

            <div
              onClick={() => filesInputRef.current?.click()}
              className="border-2 border-dashed border-violet-200 hover:border-violet-400 bg-violet-50/40 hover:bg-violet-50/80 rounded-2xl p-7 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
            >
              <Files className="w-12 h-12 text-violet-500 mb-3 group-hover:scale-105 transition-transform" />
              {selectedFiles.length > 0 ? (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">
                    {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                  </p>
                  <div className="flex flex-wrap gap-1.5 justify-center max-h-24 overflow-y-auto mt-2">
                    {selectedFiles.map((f, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white border border-purple-100 text-slate-700 shadow-2xs">
                        {f.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">
                    Click to select multiple source files (.js, .ts, .json, .py)
                  </p>
                  <p className="text-xs text-slate-400">
                    ReForge will assemble them into a workspace and cross-reference calls
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleFilesUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-violet-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>{isUploading ? 'Parsing AST & Constructing Graph...' : `Analyze ${selectedFiles.length} Files`}</span>
            </button>
          </div>
        )}

        {/* Tab 3: Paste Code Snippet */}
        {activeTab === 'snippet' && (
          <div className="space-y-3 relative z-10">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  File Path / Name
                </label>
                <input
                  type="text"
                  value={snippetName}
                  onChange={(e) => setSnippetName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#e6e2f2] text-xs font-mono text-slate-800 focus:outline-none focus:border-violet-500 bg-white"
                  placeholder="e.g. services/payment.js"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Workspace / Module Name
                </label>
                <input
                  type="text"
                  value={snippetRepo}
                  onChange={(e) => setSnippetRepo(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#e6e2f2] text-xs font-mono text-slate-800 focus:outline-none focus:border-violet-500 bg-white"
                  placeholder="e.g. billing-core"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Source Code Content
              </label>
              <textarea
                value={snippetCode}
                onChange={(e) => setSnippetCode(e.target.value)}
                rows={9}
                className="w-full p-3 rounded-2xl border border-[#e6e2f2] text-xs font-mono text-slate-800 focus:outline-none focus:border-violet-500 bg-[#fdfcff] resize-none"
                placeholder="Paste your JavaScript or TypeScript source code here..."
              />
            </div>

            <button
              onClick={handleSnippetUpload}
              disabled={!snippetCode.trim() || isUploading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-violet-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>{isUploading ? 'Extracting AST & Mining Rules...' : 'Analyze Pasted Code Snippet'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
