import React from 'react';
import { Bell } from 'lucide-react';

export default function ToastNotification({ toast, onDismiss }) {
  return (
    <div className="bg-[var(--surface-color)] border-l-4 border-l-[var(--accent-color)] border border-[var(--border-color)] shadow-xl rounded-r-xl p-4 flex items-center gap-4 animate-slide-up origin-bottom-right pointer-events-auto">
      <div className="bg-[var(--bg-color)] p-2 rounded-full border border-[var(--border-color)]">
        <Bell className="w-5 h-5 text-[var(--accent-color)] animate-ping" style={{ animationDuration: '2s' }} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-[var(--text-main)]">Reminder</h4>
        <p className="text-xs font-medium opacity-80 mt-1">{toast.title}</p>
      </div>
      <button 
        onClick={() => onDismiss(toast.id)} 
        className="ml-2 text-[11px] font-semibold opacity-60 hover:opacity-100 p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
        aria-label="Dismiss reminder"
      >
        Dismiss
      </button>
    </div>
  );
}
