import React, { useEffect } from 'react';
import { CheckCircle, Info, WarningCircle, X } from '@phosphor-icons/react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface NotificationToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-stone-900 text-stone-50 border-stone-800',
          icon: <CheckCircle size={20} className="text-emerald-400 shrink-0" weight="fill" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-900 text-amber-50 border-amber-800',
          icon: <WarningCircle size={20} className="text-amber-400 shrink-0" weight="fill" />,
        };
      default:
        return {
          bg: 'bg-stone-900 text-stone-50 border-stone-800',
          icon: <Info size={20} className="text-sky-400 shrink-0" weight="fill" />,
        };
    }
  };

  const style = getStyle();

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className={`p-4 rounded-2xl shadow-xl border flex items-start space-x-3 ${style.bg}`}>
        {style.icon}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold leading-tight">{toast.title}</p>
          {toast.message && (
            <p className="text-[11px] text-stone-300 mt-1 leading-normal">
              {toast.message}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-stone-400 hover:text-white p-0.5"
          aria-label="Tutup notifikasi"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
