import React from 'react';
import { Sun, Moon, CheckCircle2 } from 'lucide-react';

export default function Header({ theme, toggleTheme }) {
  return (
    <header className="border-b border-[var(--border-color)] bg-[var(--surface-color)] px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <h1 className="text-xl font-semibold flex items-center gap-2">
        <CheckCircle2 className="w-6 h-6 text-[var(--accent-color)]" />
        Daily Task Planner
      </h1>
      <button 
        onClick={toggleTheme} 
        aria-label="Toggle dark mode"
        className="p-2 rounded-full hover:bg-[var(--surface-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-[var(--text-muted)]" />}
      </button>
    </header>
  );
}
