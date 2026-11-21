import React from 'react';
import { WorkspaceTab } from '../types/notebook';
import { X, Plus, FileCode, Table, Settings } from 'lucide-react';

interface Props {
  tabs: WorkspaceTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onNewNotebook: () => void;
}

export const NotebookTabs: React.FC<Props> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewNotebook,
}) => {
  return (
    <div className="flex items-center bg-neutral-200 dark:bg-neutral-800 border-b border-neutral-300 dark:border-neutral-700 h-9 px-1 select-none overflow-x-auto">
      <div className="flex items-center space-x-1 h-full">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center space-x-2 h-full px-3 text-xs cursor-pointer border-t-2 transition-colors ${
                isActive
                  ? 'bg-white dark:bg-neutral-900 border-t-blue-600 text-neutral-900 dark:text-neutral-100 font-medium'
                  : 'bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border-t-transparent text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {tab.type === 'notebook' && (
                <FileCode size={13} className="text-orange-500 flex-shrink-0" />
              )}
              {tab.type === 'dataset' && (
                <Table size={13} className="text-emerald-500 flex-shrink-0" />
              )}
              {tab.type === 'admin' && (
                <Settings size={13} className="text-blue-500 flex-shrink-0" />
              )}

              <span className="truncate max-w-[150px]">{tab.title}</span>

              {tab.isDirty !== false && (
                <span className="w-2 h-2 rounded-full bg-neutral-600 dark:bg-neutral-300 flex-shrink-0" title="Unsaved changes" />
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className="p-0.5 rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                title="Close Tab"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={onNewNotebook}
        className="ml-1 p-1 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded text-neutral-600 dark:text-neutral-400"
        title="New Notebook"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};
