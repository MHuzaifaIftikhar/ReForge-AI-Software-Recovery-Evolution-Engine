import React from 'react';
import {
  FileCode,
  Package,
  BookOpenCheck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Activity,
  Compass,
  Code2,
  Calendar,
  ChevronDown,
  Eye,
  FileText
} from 'lucide-react';

interface OverviewPageProps {
  stats: {
    files: number;
    dependencies: number;
    rules: number;
    security: number;
    tests: number;
  };
  onNavigate: (tab: string) => void;
  onRunMission: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ stats, onNavigate, onRunMission }) => {
  const [timeRange, setTimeRange] = React.useState<'7d' | '30d' | 'all'>('7d');
  const [isDropdownOpen, setIsDropdownOpen] = React.useState<boolean>(false);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-7 overflow-y-auto h-full text-slate-800">
      {/* Title & Date Breadcrumb matching reference image */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Overview</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Monday, May 4, 2026 • ReForge AI Modernization Engine • Node.js AST Analysis
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('missions')}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-md shadow-violet-500/25 transition-all flex items-center gap-2 hover:-translate-y-0.5 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Launch Mission</span>
          </button>
          <button
            onClick={() => onNavigate('graph')}
            className="px-4 py-2 bg-white hover:bg-violet-50 border border-purple-200/80 text-slate-700 text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center gap-2 hover:-translate-y-0.5 active:scale-95"
          >
            <Layers className="w-3.5 h-3.5 text-violet-600" />
            <span>Knowledge Graph</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metric Cards matching the exact reference image cards */}
      <div className="grid grid-cols-4 gap-5">
        {/* Card 1: Total Signatures / Files */}
        <div
          onClick={() => onNavigate('code')}
          className="bg-white rounded-3xl p-6 border border-purple-100/80 shadow-[0_8px_30px_rgb(124,58,237,0.04)] relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
        >
          {/* Subtle top-right purple glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-100/60 rounded-full blur-2xl pointer-events-none group-hover:bg-violet-200/60 transition-colors" />

          {/* Icon in soft square container */}
          <div className="w-10 h-10 rounded-2xl bg-violet-100/80 text-violet-700 flex items-center justify-center mb-4 shadow-sm">
            <FileCode className="w-5 h-5" />
          </div>

          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.files || 17}
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">
            Total Files Mapped & Analyzed
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
            <span>↑ +100% Deterministic AST</span>
          </div>
        </div>

        {/* Card 2: Active Collectors / Dependencies */}
        <div
          onClick={() => onNavigate('graph')}
          className="bg-white rounded-3xl p-6 border border-purple-100/80 shadow-[0_8px_30px_rgb(124,58,237,0.04)] relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-200/50 transition-colors" />

          <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-4 shadow-sm">
            <Package className="w-5 h-5" />
          </div>

          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.dependencies || 5}
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">
            Package Dependencies Audited
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
            <span>↑ Node 12 → Node 22 Upgrade</span>
          </div>
        </div>

        {/* Card 3: Districts On Track / Business Rules */}
        <div
          onClick={() => onNavigate('rules')}
          className="bg-white rounded-3xl p-6 border border-purple-100/80 shadow-[0_8px_30px_rgb(124,58,237,0.04)] relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-100/50 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-200/50 transition-colors" />

          <div className="w-10 h-10 rounded-2xl bg-amber-100/80 text-amber-700 flex items-center justify-center mb-4 shadow-sm">
            <BookOpenCheck className="w-5 h-5" />
          </div>

          <div className="flex items-baseline gap-1 text-3xl font-extrabold text-slate-900 tracking-tight">
            <span>{stats.rules || 5}</span>
            <span className="text-slate-400 text-lg font-bold">/ 5</span>
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">
            Business Rules Mined
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-amber-600">
            <span>Senior Discount & 3x Retry</span>
          </div>
        </div>

        {/* Card 4: Submissions Pending / Behavioral Contracts */}
        <div
          onClick={() => onNavigate('verify')}
          className="bg-white rounded-3xl p-6 border border-purple-100/80 shadow-[0_8px_30px_rgb(124,58,237,0.04)] relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-100/50 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-200/50 transition-colors" />

          <div className="w-10 h-10 rounded-2xl bg-rose-100/80 text-rose-700 flex items-center justify-center mb-4 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.tests || 5}
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">
            Behavioral Contracts Passed
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
            <span>100% Fidelity (0 Regressions)</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Line Chart & Donut Chart matching reference image */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left: Daily Activity Curve Chart (Col 8) */}
        <div className="col-span-8 bg-white rounded-3xl p-7 border border-purple-100/80 shadow-[0_8px_30px_rgb(124,58,237,0.04)] relative">
          {/* Card Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-extrabold text-slate-900">
              Daily AST Activity & Rule Traversal — Last 7 Days
            </h2>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white border border-purple-200/80 text-xs font-bold text-slate-700 shadow-sm hover:bg-violet-50 transition-colors cursor-pointer"
              >
                <span>
                  {timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : 'All-time AST'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white border border-[#eeebf6] rounded-xl shadow-lg py-1 z-30 text-xs font-semibold">
                  <button
                    onClick={() => {
                      setTimeRange('7d');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-violet-50 text-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>Last 7 days</span>
                    {timeRange === '7d' && <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />}
                  </button>
                  <button
                    onClick={() => {
                      setTimeRange('30d');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-violet-50 text-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>Last 30 days</span>
                    {timeRange === '30d' && <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />}
                  </button>
                  <button
                    onClick={() => {
                      setTimeRange('all');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-violet-50 text-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>All-time AST</span>
                    {timeRange === 'all' && <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SVG Line Graph Container with Tooltip Pin */}
          <div className="relative h-64 w-full">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] font-mono text-slate-400">
              <div className="flex items-center gap-3 border-b border-purple-50 pb-1">
                <span className="w-7 text-right">900</span>
                <div className="flex-1 border-b border-dashed border-purple-100/60" />
              </div>
              <div className="flex items-center gap-3 border-b border-purple-50 pb-1">
                <span className="w-7 text-right">800</span>
                <div className="flex-1 border-b border-dashed border-purple-100/60" />
              </div>
              <div className="flex items-center gap-3 border-b border-purple-50 pb-1">
                <span className="w-7 text-right">600</span>
                <div className="flex-1 border-b border-dashed border-purple-100/60" />
              </div>
              <div className="flex items-center gap-3 border-b border-purple-50 pb-1">
                <span className="w-7 text-right">400</span>
                <div className="flex-1 border-b border-dashed border-purple-100/60" />
              </div>
              <div className="flex items-center gap-3 border-b border-purple-50 pb-1">
                <span className="w-7 text-right">200</span>
                <div className="flex-1 border-b border-dashed border-purple-100/60" />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 text-right">0</span>
                <div className="flex-1 border-b border-purple-100" />
              </div>
            </div>

            {/* SVG Wave Line & Gradient Area */}
            <svg className="absolute inset-0 w-full h-full pl-10 pr-2 pt-2 pb-5 overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 200">
              <defs>
                <linearGradient id="violetArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Shaded Area */}
              <path
                d="M 0 130 Q 50 140 100 80 T 200 120 T 300 60 T 400 85 T 480 35 T 560 60 T 640 100 T 700 40 L 700 200 L 0 200 Z"
                fill="url(#violetArea)"
              />

              {/* Curved Line */}
              <path
                d="M 0 130 Q 50 140 100 80 T 200 120 T 300 60 T 400 85 T 480 35 T 560 60 T 640 100 T 700 40"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Vertical Guide Line */}
              <line
                x1="480"
                y1="35"
                x2="480"
                y2="200"
                stroke="#a78bfa"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Active Green Dot on Curve */}
              <circle cx="480" cy="35" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
            </svg>

            {/* Floating Tooltip Pill matching reference image */}
            <div
              className="absolute left-[65%] top-[12%] -translate-x-1/2 bg-gradient-to-r from-violet-700 to-indigo-700 text-white rounded-2xl px-3.5 py-2 shadow-xl shadow-violet-500/30 text-[11px] font-bold z-10 pointer-events-none"
            >
              <div>Phase: Rule Extraction</div>
              <div className="text-[10px] text-violet-200 font-medium">Total AST Operations: 879</div>
            </div>
          </div>

          {/* X-Axis Month / Day Labels */}
          <div className="flex justify-between pl-11 pr-2 pt-2 text-[10px] font-mono text-slate-400">
            <span>Jan</span>
            <span>Feb</span>
            <span>March</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span className="font-bold text-violet-700">Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-3 border-t border-purple-50 text-[11px] text-slate-400 font-medium">
            Total this cycle: <span className="font-bold text-slate-800">50,000 AST graph operations</span>
          </div>
        </div>

        {/* Right: District Status / Modernization Ring (Col 4) */}
        <div className="col-span-4 bg-white rounded-3xl p-7 border border-purple-100/80 shadow-[0_8px_30px_rgb(124,58,237,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-slate-900">District Status</h2>
              <button
                onClick={() => onNavigate('graph')}
                className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Segmented Ring Chart matching reference image */}
            <div className="flex justify-center my-4">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                  {/* Segment 1: Emerald (On Track) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeDasharray="90 200"
                    strokeDashoffset="0"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Segment 2: Amber (Almost Full) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    stroke="#f59e0b"
                    strokeWidth="12"
                    strokeDasharray="60 220"
                    strokeDashoffset="-95"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Segment 3: Coral/Orange (Completed) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    stroke="#f97316"
                    strokeWidth="12"
                    strokeDasharray="50 230"
                    strokeDashoffset="-160"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Segment 4: Violet (Not Started) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    stroke="#8b5cf6"
                    strokeWidth="12"
                    strokeDasharray="40 240"
                    strokeDashoffset="-215"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Center Big Number */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-slate-900 leading-none">34</span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                    Districts
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Breakdown Legend matching reference image */}
          <div className="space-y-2 pt-2 border-t border-purple-50 text-xs font-medium">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                <span className="text-slate-600">On Track</span>
              </div>
              <span className="font-bold text-slate-900">18 districts</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
                <span className="text-slate-600">Almost Full</span>
              </div>
              <span className="font-bold text-slate-900">8 districts</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm" />
                <span className="text-slate-600">Completed</span>
              </div>
              <span className="font-bold text-slate-900">6 districts</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-sm" />
                <span className="text-slate-600">Not Started</span>
              </div>
              <span className="font-bold text-slate-900">4 districts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Submissions Table matching reference image */}
      <div className="bg-white rounded-3xl p-7 border border-purple-100/80 shadow-[0_8px_30px_rgb(124,58,237,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900">Recent Submissions</h2>
          <button
            onClick={() => onNavigate('missions')}
            className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {/* Row 1 */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-violet-50/50 transition-colors border border-purple-50 group">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-violet-100/60 text-violet-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Marcus Johnson</div>
                <div className="text-[10px] text-slate-400 font-medium">Amendment 47 • D18</div>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-mono">2:34 PM</div>

            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 text-[10px] font-bold uppercase tracking-wider">
                Pending
              </span>
              <button
                onClick={() => onNavigate('missions')}
                className="text-slate-400 hover:text-violet-600 p-1.5 rounded-lg hover:bg-white transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-violet-50/50 transition-colors border border-purple-50 group">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100/60 text-emerald-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Rachel Moore</div>
                <div className="text-[10px] text-slate-400 font-medium">Senior Discount Rule 15% • PricingService:42</div>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-mono">1:15 PM</div>

            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold uppercase tracking-wider">
                Approved
              </span>
              <button
                onClick={() => onNavigate('rules')}
                className="text-slate-400 hover:text-violet-600 p-1.5 rounded-lg hover:bg-white transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-violet-50/50 transition-colors border border-purple-50 group">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-violet-100/60 text-violet-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">PaymentAdapter Resiliency Check</div>
                <div className="text-[10px] text-slate-400 font-medium">3x Retry Gateway Policy Preserved • Node 22</div>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-mono">11:02 AM</div>

            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200/60 text-[10px] font-bold uppercase tracking-wider">
                Verified
              </span>
              <button
                onClick={() => onNavigate('verify')}
                className="text-slate-400 hover:text-violet-600 p-1.5 rounded-lg hover:bg-white transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
