import React from 'react';
import { KernelState } from '../types/notebook';
import { Bell, Terminal, Shield } from 'lucide-react';

interface Props {
  activeFilename: string;
  kernelState: KernelState;
  kernelMessage?: string;
  isEditMode: boolean;
  activeCellIndex: number;
  totalCells: number;
}

export const StatusBar: React.FC<Props> = ({
  activeFilename,
  kernelState,
  isEditMode,
  activeCellIndex,
  totalCells,
}) => {
  return (
    <footer className="h-6 bg-neutral-200 dark:bg-neutral-800 border-t border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-[11px] px-3 flex items-center justify-between select-none font-mono">
      {/* Left Status Items (Matching Image 2: Terminal icon, Python 3 ipykernel) */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1.5">
          <Terminal size={12} className="text-neutral-500" />
          <span
            className={`w-2 h-2 rounded-full ${
              kernelState === 'busy'
                ? 'bg-amber-500 animate-ping'
                : kernelState === 'error'
                ? 'bg-red-500'
                : 'bg-emerald-500'
            }`}
          />
          <span className="font-sans font-medium text-neutral-700 dark:text-neutral-300">
            Python 3 (ipykernel) | {kernelState === 'busy' ? 'Busy' : 'Idle'}
          </span>
        </div>
      </div>

      {/* Right Status Items (Matching Image 2: Mode, Shield, Cell X/Y, Ln, Col, Filename, 0) */}
      <div className="flex items-center space-x-3 text-neutral-600 dark:text-neutral-400">
        <div className="font-sans">
          Mode: <span className="font-medium text-neutral-800 dark:text-neutral-200">{isEditMode ? 'Edit' : 'Command'}</span>
        </div>

        <div className="h-3 w-[1px] bg-neutral-300 dark:bg-neutral-600" />

        <Shield size={12} className="text-neutral-500" />

        <div className="h-3 w-[1px] bg-neutral-300 dark:bg-neutral-600" />

        <div>
          Cell {activeCellIndex + 1}/{Math.max(1, totalCells)}
        </div>

        <div className="h-3 w-[1px] bg-neutral-300 dark:bg-neutral-600" />

        <div>
          Ln 1, Col 1
        </div>

        <div className="h-3 w-[1px] bg-neutral-300 dark:bg-neutral-600" />

        <div className="text-neutral-700 dark:text-neutral-300 font-sans">
          {activeFilename}
        </div>

        <div className="h-3 w-[1px] bg-neutral-300 dark:bg-neutral-600" />

        <div className="flex items-center space-x-1">
          <Bell size={12} className="text-neutral-500" />
          <span>0</span>
        </div>
      </div>
    </footer>
  );
};
