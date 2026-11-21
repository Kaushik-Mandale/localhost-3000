import React from 'react';
import {
  Save,
  Plus,
  Scissors,
  Copy,
  Clipboard,
  Play,
  Square,
  RotateCw,
  FastForward,
  ExternalLink,
} from 'lucide-react';
import { CellType } from '../types/notebook';

interface Props {
  cellType: CellType;
  isKernelBusy: boolean;
  onSave: () => void;
  onInsertCell: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onRun: () => void;
  onInterrupt: () => void;
  onRestartKernel: () => void;
  onRestartAndRunAll: () => void;
  onCellTypeChange: (type: CellType) => void;
}

export const NotebookToolbar: React.FC<Props> = ({
  cellType,
  isKernelBusy,
  onSave,
  onInsertCell,
  onCut,
  onCopy,
  onPaste,
  onRun,
  onInterrupt,
  onRestartKernel,
  onRestartAndRunAll,
  onCellTypeChange,
}) => {
  return (
    <div className="flex items-center space-x-1 px-3 py-1 bg-white dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs select-none">
      {/* Save Button */}
      <button
        onClick={onSave}
        className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition"
        title="Save (Ctrl+S)"
      >
        <Save size={15} />
      </button>

      {/* Insert Cell */}
      <button
        onClick={onInsertCell}
        className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition"
        title="Insert cell below (B)"
      >
        <Plus size={15} />
      </button>

      {/* Cut */}
      <button
        onClick={onCut}
        className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition"
        title="Cut selected cells (X)"
      >
        <Scissors size={15} />
      </button>

      {/* Copy */}
      <button
        onClick={onCopy}
        className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition"
        title="Copy selected cells (C)"
      >
        <Copy size={15} />
      </button>

      {/* Paste */}
      <button
        onClick={onPaste}
        className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition"
        title="Paste cells below (V)"
      >
        <Clipboard size={15} />
      </button>

      <div className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-600 mx-1" />

      {/* Run Selected Cell */}
      <button
        onClick={onRun}
        className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition text-blue-600 dark:text-blue-400 font-bold"
        title="Run selected cell (Shift+Enter)"
      >
        <Play size={14} fill="currentColor" />
      </button>

      {/* Interrupt Kernel */}
      <button
        onClick={onInterrupt}
        className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition text-red-600 dark:text-red-400"
        title="Interrupt execution"
      >
        <Square size={13} fill="currentColor" />
      </button>

      {/* Restart Kernel */}
      <button
        onClick={onRestartKernel}
        className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition"
        title="Restart the kernel"
      >
        <RotateCw size={13} className={isKernelBusy ? 'animate-spin' : ''} />
      </button>

      {/* Restart & Run All */}
      <button
        onClick={onRestartAndRunAll}
        className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition"
        title="Restart kernel and run all"
      >
        <FastForward size={14} />
      </button>

      <div className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-600 mx-1" />

      {/* Cell Type Selector */}
      <div className="flex items-center">
        <select
          value={cellType}
          onChange={(e) => onCellTypeChange(e.target.value as CellType)}
          className="bg-transparent border border-neutral-300 dark:border-neutral-600 rounded px-2 py-0.5 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none"
        >
          <option value="code">Code</option>
          <option value="markdown">Markdown</option>
        </select>
      </div>

      <div className="flex-1" />

      {/* Right Controls (Matching Image 2: Notebook icon, Kernel status) */}
      <div className="flex items-center space-x-3 text-[12px] text-neutral-600 dark:text-neutral-400 pr-2">
        <div className="flex items-center space-x-1 cursor-pointer hover:text-neutral-800 dark:hover:text-neutral-200">
          <span>Notebook</span>
          <ExternalLink size={12} />
        </div>

        <div className="flex items-center space-x-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isKernelBusy ? 'bg-amber-500 animate-pulse' : 'bg-neutral-400'
            }`}
          />
          <span>Python 3 (ipykernel)</span>
        </div>
      </div>
    </div>
  );
};
