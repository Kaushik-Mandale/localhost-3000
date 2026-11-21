import React from 'react';
import { KernelState } from '../types/notebook';
import { Bell, Terminal, CheckCircle2, Cloud } from 'lucide-react';

interface Props {
  activeFilename: string;
  kernelState: KernelState;
  kernelMessage?: string;
  isEditMode: boolean;
  activeCellIndex: number;
  totalCells: number;
  syncStatus?: 'synced' | 'syncing' | 'offline';
}

export const StatusBar: React.FC<Props> = ({
  activeFilename,
  kernelState,
  kernelMessage,
  isEditMode,
  activeCellIndex,
  totalCells,
  syncStatus = 'synced',
}) => {
  return (
    <footer className="h-6 bg-neutral-200 dark:bg-neutral-800 border-t border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-[11px] px-3 flex items-center justify-between select-none font-mono">
      {/* Left Status Items */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5">
          <Terminal size={12} className="text-neutral-500" />
          <span className="font-sans font-medium text-neutral-700 dark:text-neutral-300">
            {isEditMode ? 'Edit Mode' : 'Command Mode'}
          </span>
        </div>

        <div className="h-3 w-[1px] bg-neutral-300 dark:bg-neutral-600" />

        <div className="truncate max-w-[280px]">
          <span className="text-neutral-400">Path: </span>
          <span>/practicals/{activeFilename}</span>
        </div>

        <div className="h-3 w-[1px] bg-neutral-300 dark:bg-neutral-600" />

        <div>
          <span>Cell {activeCellIndex + 1} of {totalCells}</span>
        </div>
      </div>

      {/* Right Status Items */}
      <div className="flex items-center space-x-3">
        {kernelMessage && (
          <span className="text-neutral-500 max-w-[200px] truncate hidden md:inline">
            {kernelMessage}
          </span>
        )}

        {/* Firestore Sync Status */}
        <div className="flex items-center space-x-1" title="Firestore Storage Status">
          <Cloud
            size={12}
            className={
              syncStatus === 'synced'
                ? 'text-blue-500'
                : syncStatus === 'syncing'
                ? 'text-amber-500 animate-pulse'
                : 'text-neutral-400'
            }
          />
          <span className="text-neutral-600 dark:text-neutral-400">
            {syncStatus === 'synced'
              ? 'Firestore: Synced'
              : syncStatus === 'syncing'
              ? 'Firestore: Syncing...'
              : 'Firestore: Local'}
          </span>
        </div>

        <div className="h-3 w-[1px] bg-neutral-300 dark:bg-neutral-600" />

        <div className="flex items-center space-x-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              kernelState === 'busy'
                ? 'bg-amber-500 animate-ping'
                : kernelState === 'error'
                ? 'bg-red-500'
                : 'bg-emerald-500'
            }`}
          />
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            Python 3 (ipykernel) : {kernelState === 'busy' ? 'Busy' : 'Idle'}
          </span>
        </div>

        <div className="h-3 w-[1px] bg-neutral-300 dark:bg-neutral-600" />

        <div className="flex items-center space-x-1">
          <CheckCircle2 size={12} className="text-emerald-500" />
          <span>Pyodide Wasm</span>
        </div>

        <div className="h-3 w-[1px] bg-neutral-300 dark:bg-neutral-600" />

        <button className="hover:text-neutral-900 dark:hover:text-neutral-100">
          <Bell size={12} />
        </button>
      </div>
    </footer>
  );
};
