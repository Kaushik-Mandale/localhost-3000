import React from 'react';
import {
  Files,
  Cpu,
  ListOrdered,
  Blocks,
  Settings,
} from 'lucide-react';
import { FileBrowser } from './FileBrowser';
import { PracticalProgram, KernelState } from '../types/notebook';

export type SidebarTab = 'files' | 'running' | 'toc' | 'extensions' | null;

interface Props {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onOpenSettingsLogin: () => void;
  programs: PracticalProgram[];
  datasets: { name: string; size: string; modified: string }[];
  activeFilename: string;
  onOpenNotebook: (program: PracticalProgram) => void;
  onOpenDataset: (name: string) => void;
  onNewNotebook: () => void;
  onCreateFolder: (name: string) => void;
  onRefresh: () => void;
  kernelState: KernelState;
  activeNotebookCells?: { id: string; source: string; type: string }[];
  onScrollToCell?: (cellId: string) => void;
}

export const LeftSidebar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  onOpenSettingsLogin,
  programs,
  datasets,
  activeFilename,
  onOpenNotebook,
  onOpenDataset,
  onNewNotebook,
  onCreateFolder,
  onRefresh,
  kernelState,
  activeNotebookCells = [],
  onScrollToCell,
}) => {
  const toggleTab = (tab: SidebarTab) => {
    onTabChange(activeTab === tab ? null : tab);
  };

  return (
    <div className="flex h-full border-r border-neutral-300 dark:border-neutral-700 select-none">
      {/* Icon Navigation Bar (Leftmost Strip) */}
      <div className="w-11 bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center justify-between py-2 border-r border-neutral-300 dark:border-neutral-700 z-10">
        {/* Top Icons */}
        <div className="flex flex-col items-center space-y-2">
          {/* File Browser */}
          <button
            onClick={() => toggleTab('files')}
            className={`p-2 rounded transition-colors ${
              activeTab === 'files'
                ? 'bg-neutral-300 dark:bg-neutral-700 text-blue-600 dark:text-blue-400 font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
            title="File Browser (Ctrl+Shift+F)"
          >
            <Files size={18} />
          </button>

          {/* Running Terminals and Kernels */}
          <button
            onClick={() => toggleTab('running')}
            className={`p-2 rounded transition-colors relative ${
              activeTab === 'running'
                ? 'bg-neutral-300 dark:bg-neutral-700 text-blue-600 dark:text-blue-400 font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
            title="Running Terminals and Kernels"
          >
            <Cpu size={18} />
            <span
              className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                kernelState === 'busy' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
              }`}
            />
          </button>

          {/* Table of Contents */}
          <button
            onClick={() => toggleTab('toc')}
            className={`p-2 rounded transition-colors ${
              activeTab === 'toc'
                ? 'bg-neutral-300 dark:bg-neutral-700 text-blue-600 dark:text-blue-400 font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
            title="Table of Contents"
          >
            <ListOrdered size={18} />
          </button>

          {/* Extensions */}
          <button
            onClick={() => toggleTab('extensions')}
            className={`p-2 rounded transition-colors ${
              activeTab === 'extensions'
                ? 'bg-neutral-300 dark:bg-neutral-700 text-blue-600 dark:text-blue-400 font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
            title="Extension Manager"
          >
            <Blocks size={18} />
          </button>
        </div>

        {/* Extreme Bottom-Left Corner: Settings Icon */}
        <div className="flex flex-col items-center pt-2 border-t border-neutral-300 dark:border-neutral-700 w-full">
          <button
            onClick={onOpenSettingsLogin}
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
            title="Settings & Admin Management (Sign In)"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Collapsible Panel Content */}
      {activeTab !== null && (
        <div className="w-64 md:w-72 h-full flex flex-col bg-white dark:bg-neutral-900 border-r border-neutral-300 dark:border-neutral-700 overflow-hidden shadow-inner">
          {activeTab === 'files' && (
            <FileBrowser
              programs={programs}
              datasets={datasets}
              activeFilename={activeFilename}
              onOpenNotebook={onOpenNotebook}
              onOpenDataset={onOpenDataset}
              onNewNotebook={onNewNotebook}
              onCreateFolder={onCreateFolder}
              onRefresh={onRefresh}
            />
          )}

          {activeTab === 'running' && (
            <div className="p-3 text-xs space-y-3">
              <div className="font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 border-b pb-1 text-[11px]">
                Running Sessions & Kernels
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-800 p-2.5 rounded border border-neutral-200 dark:border-neutral-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    Python 3 (ipykernel)
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      kernelState === 'busy'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                    }`}
                  >
                    {kernelState.toUpperCase()}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 font-mono">
                  Runtime: WebAssembly Pyodide
                </div>
                <div className="text-[11px] text-neutral-500 font-mono">
                  Active: {activeFilename}
                </div>
              </div>

              <div className="text-neutral-500 text-[11px] leading-relaxed">
                All open notebooks share the active Python 3 kernel. Variables persist across notebook cells during this session.
              </div>
            </div>
          )}

          {activeTab === 'toc' && (
            <div className="p-3 text-xs flex flex-col h-full">
              <div className="font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 border-b pb-1 text-[11px] mb-2">
                Table of Contents
              </div>
              <div className="flex-1 overflow-y-auto space-y-1">
                {activeNotebookCells
                  .filter((c) => c.source.includes('#'))
                  .map((c) => {
                    const firstLine = c.source.split('\n')[0].replace(/^#+\s*/, '');
                    return (
                      <div
                        key={c.id}
                        onClick={() => onScrollToCell && onScrollToCell(c.id)}
                        className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded cursor-pointer text-neutral-700 dark:text-neutral-300 font-medium truncate"
                      >
                        {firstLine || 'Section'}
                      </div>
                    );
                  })}
                {activeNotebookCells.filter((c) => c.source.includes('#')).length === 0 && (
                  <div className="text-neutral-400 text-xs italic">
                    No headings found in active notebook.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'extensions' && (
            <div className="p-3 text-xs space-y-3">
              <div className="font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 border-b pb-1 text-[11px]">
                Installed Extensions
              </div>
              <div className="space-y-2">
                <div className="p-2 border rounded border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                  <div className="font-medium text-neutral-800 dark:text-neutral-200">
                    Pyodide Wasm Engine
                  </div>
                  <div className="text-[11px] text-neutral-500">v0.26.4 (Active)</div>
                </div>
                <div className="p-2 border rounded border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                  <div className="font-medium text-neutral-800 dark:text-neutral-200">
                    Scikit-Learn ML Package
                  </div>
                  <div className="text-[11px] text-neutral-500">ML Algorithms & Metrics</div>
                </div>
                <div className="p-2 border rounded border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                  <div className="font-medium text-neutral-800 dark:text-neutral-200">
                    Matplotlib Visualizer
                  </div>
                  <div className="text-[11px] text-neutral-500">Plot & Tree Rendering</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
