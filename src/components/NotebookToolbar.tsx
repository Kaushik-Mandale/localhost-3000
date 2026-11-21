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
    <div className="flex items-center space-x-1 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs select-none">
      {/* Save Button */}
      <button
        onClick={onSave}
        className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition"
        title="Save notebook (Ctrl+S)"
      >
        <Save size={15} />
      </button>

      {/* Insert Cell */}
      <button
        onClick={onInsertCell}
        className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition"
        title="Insert cell below (B)"
      >
        <Plus size={15} />
      </button>

      {/* Cut */}
      <button
        onClick={onCut}
        className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition"
        title="Cut selected cells (X)"
      >
        <Scissors size={15} />
      </button>

      {/* Copy */}
      <button
        onClick={onCopy}
        className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition"
        title="Copy selected cells (C)"
      >
        <Copy size={15} />
      </button>

      {/* Paste */}
      <button
        onClick={onPaste}
        className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition"
        title="Paste cells below (V)"
      >
        <Clipboard size={15} />
      </button>

      <div className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-600 mx-1.5" />

      {/* Run Selected Cell */}
      <button
        onClick={onRun}
        className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition text-blue-600 dark:text-blue-400 font-bold"
        title="Run selected cell (Shift+Enter)"
      >
        <Play size={15} fill="currentColor" />
      </button>

      {/* Interrupt Kernel */}
      <button
        onClick={onInterrupt}
        className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition text-red-600 dark:text-red-400"
        title="Interrupt execution"
      >
        <Square size={14} fill="currentColor" />
      </button>

      {/* Restart Kernel */}
      <button
        onClick={onRestartKernel}
        className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition"
        title="Restart the kernel (restarts session)"
      >
        <RotateCw size={14} className={isKernelBusy ? 'animate-spin' : ''} />
      </button>

      {/* Restart & Run All */}
      <button
        onClick={onRestartAndRunAll}
        className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition"
        title="Restart kernel and run all cells"
      >
        <FastForward size={15} />
      </button>

      <div className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-600 mx-1.5" />

      {/* Cell Type Selector */}
      <div className="flex items-center">
        <select
          value={cellType}
          onChange={(e) => onCellTypeChange(e.target.value as CellType)}
          className="bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded px-2 py-0.5 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="code">Code</option>
          <option value="markdown">Markdown</option>
        </select>
      </div>

      <div className="flex-1" />

      {/* Execution Indicator */}
      <div className="flex items-center space-x-2 text-[11px] text-neutral-500 pr-2">
        <span
          className={`w-2 h-2 rounded-full ${
            isKernelBusy ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
          }`}
        />
        <span>{isKernelBusy ? 'Kernel Busy' : 'Python 3 (ipykernel)'}</span>
      </div>
    </div>
  );
};
