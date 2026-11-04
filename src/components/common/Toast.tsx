import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, clearToast } = useAppStore();

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-[#005C52] text-white border-emerald-700 shadow-emerald-950/20',
    error: 'bg-[#D9534F] text-white border-red-700 shadow-red-950/20',
    info: 'bg-[#1E2A28] text-white border-slate-700 shadow-slate-950/20',
  }[toast.type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[toast.type];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl transition-all duration-300 max-w-md animate-slide-up bg-opacity-95 backdrop-blur-md">
      <div className={`p-1.5 rounded-lg flex items-center justify-center ${bgStyles}`}>
        <Icon className="w-5 h-5 shrink-0" />
      </div>
      <p className="text-sm font-medium text-slate-800 pr-2">{toast.message}</p>
      <button
        onClick={clearToast}
        className="ml-auto text-slate-400 hover:text-slate-600 transition-colors p-1"
        aria-label="Fermer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
