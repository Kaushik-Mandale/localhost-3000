import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Shift + Enter', desc: 'Execute current cell and advance to next' },
    { key: 'Ctrl + Enter', desc: 'Execute current cell and stay on it' },
    { key: 'Alt + Enter', desc: 'Execute current cell and insert new cell below' },
    { key: 'Ctrl + S', desc: 'Save current notebook changes' },
    { key: 'A', desc: 'Insert new cell above (in command mode)' },
    { key: 'B', desc: 'Insert new cell below (in command mode)' },
    { key: 'M', desc: 'Convert cell type to Markdown' },
    { key: 'Y', desc: 'Convert cell type to Code' },
    { key: 'D, D', desc: 'Delete selected cell (press D twice)' },
    { key: 'Ctrl + B', desc: 'Toggle left sidebar visibility' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 select-none">
      <div className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800/80">
          <div className="flex items-center space-x-2">
            <Keyboard size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-xs text-neutral-800 dark:text-neutral-200">
              Notebook Keyboard Shortcuts
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-4 space-y-2 text-xs max-h-[70vh] overflow-y-auto">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-700/50"
            >
              <span className="text-neutral-600 dark:text-neutral-300">{s.desc}</span>
              <kbd className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded text-[11px] font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 bg-neutral-50 dark:bg-neutral-850 border-t border-neutral-200 dark:border-neutral-700 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded text-xs text-neutral-800 dark:text-neutral-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
