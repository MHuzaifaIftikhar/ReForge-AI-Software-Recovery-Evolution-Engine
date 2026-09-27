import React from 'react';
import {
  Play,
  RotateCw,
  GitBranch,
  Bell,
  Sparkles,
  Maximize2,
  Minimize2,
  Palette,
  UploadCloud,
  FolderGit2
} from 'lucide-react';

interface NavbarProps {
  onLoadDemo: () => void;
  onAnalyze: () => void;
  onOpenUpload: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  isAnalyzing: boolean;
  repoName: string;
  runtime: string;
  missionStatus: string;
  pageTitle?: string;
  isFramed?: boolean;
  onToggleFramed?: () => void;
  bgTheme?: 'pastel' | 'porcelain' | 'slate';
  onCycleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLoadDemo,
  onAnalyze,
  onOpenUpload,
  onOpenNotifications,
  onOpenProfile,
  isAnalyzing,
  repoName,
  runtime,
  missionStatus,
  pageTitle = 'Overview',
  isFramed = true,
  onToggleFramed,
  bgTheme = 'pastel',
  onCycleTheme
}) => {
  return (
    <header className="mx-6 sm:mx-8 mt-4 sm:mt-5 mb-2 px-4 sm:px-6 py-2.5 bg-white rounded-2xl border border-[#eeebf6] shadow-[0_2px_12px_rgba(100,80,180,0.03)] flex items-center justify-between z-10 shrink-0 gap-3">
      {/* Left side: Page Title & Context Badges */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <h2 className="text-sm font-extrabold text-slate-800 tracking-tight capitalize">
          {pageTitle}
        </h2>

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-violet-50/80 border border-violet-200/60 shadow-2xs text-violet-900">
            <GitBranch className="w-3 h-3 text-violet-600" />
            <span className="text-violet-600/70 font-mono text-[10px] font-medium hidden md:inline">Repo:</span>
            <span className="font-bold font-mono text-[11px] truncate max-w-[120px]">{repoName || 'legacy-shop'}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-800 font-mono text-[10px] shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-amber-700/70">Runtime:</span>
            <span className="font-bold">{runtime || 'Node.js 12'}</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200/60 text-[10px] font-mono text-emerald-800 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-700/70">Mission:</span>
            <span className="font-bold uppercase tracking-wider">{missionStatus}</span>
          </div>
        </div>
      </div>

      {/* Right side: Action Buttons, Upload Button, Toggles, Bell & Admin Profile */}
      <div className="flex items-center gap-2">
        {/* Upload Repo / Code Button (Requested by User) */}
        <button
          onClick={onOpenUpload}
          title="Upload your own repository ZIP archive, multiple code files, or paste custom code"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 border border-violet-200/90 text-violet-800 text-xs font-bold transition-all hover:-translate-y-0.5 active:scale-95 shadow-2xs cursor-pointer"
        >
          <UploadCloud className="w-3.5 h-3.5 text-violet-600" />
          <span className="hidden sm:inline">Upload Code / Repo</span>
          <span className="sm:hidden">Upload</span>
        </button>

        {/* Load Demo Repository Button */}
        <button
          onClick={onLoadDemo}
          title="Reset and reload the benchmark sample legacy repository"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-violet-50/70 border border-[#e6e2f2] text-xs font-semibold text-slate-700 transition-all hover:-translate-y-0.5 active:scale-95 shadow-2xs cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5 text-violet-600" />
          <span className="hidden md:inline">Load Demo</span>
        </button>

        {/* Analyze Repo Button */}
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          title="Run complete deterministic AST analysis across active repository"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-violet-500/20 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
        >
          <Play className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline">{isAnalyzing ? 'Analyzing...' : 'Analyze Repo'}</span>
        </button>

        {/* Framing toggle (Window vs Fullscreen) */}
        {onToggleFramed && (
          <button
            onClick={onToggleFramed}
            title={isFramed ? "Switch to Fullscreen Full-Bleed mode" : "Switch to Framed Mockup Window mode"}
            className="w-8 h-8 rounded-xl bg-white border border-[#eeebf6] flex items-center justify-center text-slate-500 hover:text-violet-600 hover:bg-violet-50 transition-colors shadow-2xs cursor-pointer"
          >
            {isFramed ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
        )}

        {/* Background Theme Palette Cycler */}
        {onCycleTheme && (
          <button
            onClick={onCycleTheme}
            title={`Current Canvas: ${bgTheme.toUpperCase()} (Click to toggle Lilac / Porcelain / Slate)`}
            className="w-8 h-8 rounded-xl bg-white border border-[#eeebf6] flex items-center justify-center text-slate-500 hover:text-violet-600 hover:bg-violet-50 transition-colors shadow-2xs cursor-pointer relative"
          >
            <Palette className="w-3.5 h-3.5" />
            <span className={`w-1.5 h-1.5 rounded-full absolute top-1 right-1 ${
              bgTheme === 'pastel' ? 'bg-violet-500' :
              bgTheme === 'porcelain' ? 'bg-emerald-500' :
              'bg-sky-500'
            }`} />
          </button>
        )}

        {/* Notification bell button */}
        <button
          onClick={onOpenNotifications}
          title="System Notifications & Audit Findings"
          className="w-8 h-8 rounded-xl bg-white border border-[#eeebf6] flex items-center justify-center text-slate-500 hover:text-violet-600 hover:bg-violet-50 transition-colors shadow-2xs relative cursor-pointer"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white animate-pulse" />
        </button>

        {/* User Pill Profile */}
        <button
          onClick={onOpenProfile}
          title="Admin Profile & System Specs"
          className="flex items-center gap-2 bg-white hover:bg-violet-50/60 border border-[#eeebf6] rounded-full py-0.5 px-2 pr-2.5 shadow-2xs cursor-pointer transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white text-[10px] font-bold shadow-2xs">
            A
          </div>
          <span className="text-xs font-bold text-slate-800 hidden sm:inline">Admin</span>
        </button>
      </div>
    </header>
  );
};
