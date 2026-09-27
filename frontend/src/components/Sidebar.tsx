import React from 'react';
import {
  LayoutDashboard,
  Network,
  BookOpenCheck,
  Activity,
  Code2,
  Compass,
  CheckCheck,
  FileText,
  HelpCircle,
  FolderGit2,
  Sparkles,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAskWhy: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenAskWhy }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'graph', label: 'Knowledge Graph', icon: Network, badge: '27' },
    { id: 'rules', label: 'Business Rules', icon: BookOpenCheck, badge: '5' },
    { id: 'impact', label: 'Impact Simulator', icon: Activity },
    { id: 'code', label: 'Code Explorer', icon: Code2 },
    { id: 'missions', label: 'Missions', icon: Compass, pulse: true },
    { id: 'verify', label: 'Verification', icon: CheckCheck },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#eeebf6] flex flex-col h-full select-none relative z-20 shadow-[4px_0_24px_rgba(124,58,237,0.02)]">
      {/* Brand header with stylized purple arc logo matching reference image */}
      <div className="h-20 px-6 flex flex-col justify-center border-b border-[#f0edf9] relative overflow-hidden">
        {/* Soft atmospheric purple glow behind logo matching reference */}
        <div className="absolute -top-10 -left-10 w-36 h-36 bg-violet-200/40 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3 relative z-10">
          {/* Custom SVG logo with curved orbital arc */}
          <div className="relative flex flex-col items-center justify-center">
            <svg className="w-9 h-7 text-violet-600" viewBox="0 0 100 65" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 5 50 Q 50 -10 95 50"
                stroke="url(#purpleGradient)"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M 20 40 Q 50 15 80 40"
                stroke="url(#purpleGradient2)"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.8"
              />
              <defs>
                <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="50%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="purpleGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl text-slate-900 tracking-tighter italic">ReForge</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 font-bold">
                AI
              </span>
            </div>
            <span className="block text-[10px] text-slate-400 font-medium tracking-tight">
              Software Recovery Engine
            </span>
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-3 py-1 flex items-center justify-between">
          <span>Main Menu</span>
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 font-bold'
                  : 'text-slate-500 hover:text-violet-700 hover:bg-violet-50/70 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-violet-600'
                  }`}
                />
                <span className="tracking-tight">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-violet-50 text-violet-600 group-hover:bg-violet-100'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {item.pulse && !item.badge && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions: Ask ReForge + Log Out matching reference screenshot */}
      <div className="p-4 border-t border-[#f0edf9] bg-[#faf9fe]/60 space-y-2">
        <button
          onClick={onOpenAskWhy}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-violet-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
          <span>Ask ReForge ("Why?")</span>
        </button>

        <button
          onClick={() => alert("ReForge Modernization Session Active (Local Demo Mode)")}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-[#ca4253] hover:text-[#b91c1c] hover:bg-rose-50/70 rounded-xl font-bold text-xs transition-colors group cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-[#ca4253] group-hover:-translate-x-0.5 transition-transform" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
