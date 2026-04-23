import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const icons = {
  success: <CheckCircle size={16} className="text-emerald-400" />,
  error: <AlertCircle size={16} className="text-red-400" />,
  info: <Info size={16} className="text-blue-400" />,
};

const borders = {
  success: "border-emerald-500/40",
  error: "border-red-500/40",
  info: "border-blue-500/40",
};

export default function ToastContainer({ toasts, removeToast }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 bg-slate-800 border ${borders[toast.type] || borders.info} rounded-lg px-4 py-3 shadow-2xl shadow-black/40 min-w-[280px] max-w-sm animate-in slide-in-from-right-5 fade-in duration-200`}
        >
          {icons[toast.type] || icons.info}
          <p className="text-sm text-slate-200 flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
