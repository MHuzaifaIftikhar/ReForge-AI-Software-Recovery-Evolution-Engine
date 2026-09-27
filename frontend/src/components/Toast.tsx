import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-xl shadow-xl flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-5 ${
            t.type === 'success'
              ? 'bg-white/95 border-emerald-200 text-slate-900 shadow-emerald-500/10'
              : t.type === 'warning'
              ? 'bg-white/95 border-amber-200 text-slate-900 shadow-amber-500/10'
              : 'bg-white/95 border-purple-200 text-slate-900 shadow-violet-500/10'
          }`}
        >
          {t.type === 'success' ? (
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : t.type === 'warning' ? (
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4" />
            </div>
          )}

          <div className="flex-1">
            <h3 className="text-xs font-bold text-slate-900">{t.title}</h3>
            {t.message && <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{t.message}</p>}
          </div>

          <button
            onClick={() => onDismiss(t.id)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
