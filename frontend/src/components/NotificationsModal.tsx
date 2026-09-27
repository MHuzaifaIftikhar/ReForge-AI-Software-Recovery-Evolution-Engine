import React from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'Legacy Package Deprecation Detected',
      desc: 'request@2.88.2 has known CVE vulnerabilities and is deprecated. Node.js 22 native fetch upgrade required.',
      type: 'warning',
      time: 'Just now',
      actionTab: 'missions',
      actionLabel: 'Launch Migration Mission'
    },
    {
      id: 2,
      title: '5 Institutional Business Rules Recovered',
      desc: 'Mined Senior Discount (15%) and Payment 3x Retry Policy with grounded AST code coordinates.',
      type: 'success',
      time: '2 mins ago',
      actionTab: 'rules',
      actionLabel: 'Review Rules'
    },
    {
      id: 3,
      title: 'Hardcoded Secret Flagged in services/payment.js',
      desc: 'Line 28: hardcoded API token identified in legacy payment adapter. Parameterization recommended.',
      type: 'danger',
      time: '5 mins ago',
      actionTab: 'code',
      actionLabel: 'Inspect in Code Explorer'
    },
    {
      id: 4,
      title: 'Knowledge Graph Topology Synthesized',
      desc: '27 nodes and 35 directed edges mapped across services, APIs, rules, tests, and database calls.',
      type: 'info',
      time: '12 mins ago',
      actionTab: 'graph',
      actionLabel: 'View Graph'
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#eeebf6] rounded-[28px] max-w-lg w-full p-6 shadow-2xl space-y-5 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-violet-100 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">System Notifications</h3>
              <p className="text-[11px] text-slate-400 font-medium">ReForge Engine Audit Alerts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Notification list */}
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 relative z-10">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-3.5 rounded-2xl border border-purple-50 hover:bg-violet-50/40 transition-colors bg-[#faf9fe]/60 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {n.type === 'danger' && <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />}
                  {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                  {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                  {n.type === 'info' && <Info className="w-4 h-4 text-violet-500 shrink-0" />}
                  <span className="text-xs font-bold text-slate-900">{n.title}</span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed pl-6">{n.desc}</p>

              <div className="pl-6 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onNavigate(n.actionTab);
                  }}
                  className="text-[11px] font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>{n.actionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
