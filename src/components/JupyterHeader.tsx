import React from 'react';
import { MainMenuBar } from './MainMenuBar';
import { Sun, Moon, Bell } from 'lucide-react';

interface Props {
  isDark: boolean;
  onToggleTheme: () => void;
  onSave: () => void;
  onNewNotebook: () => void;
  onCloseActiveTab: () => void;
  onCloseAllTabs: () => void;
  onRunSelectedCell: () => void;
  onRunAllCells: () => void;
  onRestartKernel: () => void;
  onInterruptKernel: () => void;
  onToggleSidebar: () => void;
  onOpenAdmin: () => void;
  onShowShortcuts: () => void;
  activeFilename: string;
}

export const JupyterHeader: React.FC<Props> = ({
  isDark,
  onToggleTheme,
  onSave,
  onNewNotebook,
  onCloseActiveTab,
  onCloseAllTabs,
  onRunSelectedCell,
  onRunAllCells,
  onRestartKernel,
  onInterruptKernel,
  onToggleSidebar,
  onOpenAdmin,
  onShowShortcuts,
  activeFilename,
}) => {
  return (
    <header className="flex flex-col bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-300 dark:border-neutral-700 select-none">
      {/* Top Bar with Logo and Menu */}
      <div className="flex items-center justify-between px-2.5 h-8">
        <div className="flex items-center space-x-3">
          {/* Logo */}
          <div className="flex items-center space-x-1.5 cursor-default">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f97316"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M3.6 9h16.8" />
              <path d="M3.6 15h16.8" />
            </svg>
            <span className="font-semibold text-xs tracking-tight text-neutral-800 dark:text-neutral-100">
              Jupyter<span className="text-orange-600 font-bold">Lab</span>
            </span>
          </div>

          <div className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-600" />

          {/* Menus */}
          <MainMenuBar
            onSave={onSave}
            onNewNotebook={onNewNotebook}
            onCloseActiveTab={onCloseActiveTab}
            onCloseAllTabs={onCloseAllTabs}
            onRunSelectedCell={onRunSelectedCell}
            onRunAllCells={onRunAllCells}
            onRestartKernel={onRestartKernel}
            onInterruptKernel={onInterruptKernel}
            onToggleSidebar={onToggleSidebar}
            onToggleTheme={onToggleTheme}
            onOpenAdmin={onOpenAdmin}
            onShowShortcuts={onShowShortcuts}
            isDark={isDark}
          />
        </div>

        {/* Right Action Icons & Active File */}
        <div className="flex items-center space-x-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="text-[11px] font-mono px-2 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded text-neutral-700 dark:text-neutral-300">
            {activeFilename}
          </span>

          <button
            onClick={onToggleTheme}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-neutral-600 dark:text-neutral-300 transition"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <button
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-neutral-600 dark:text-neutral-300"
            title="Notifications"
          >
            <Bell size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};
