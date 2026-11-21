import React, { useState } from 'react';
import { PracticalProgram } from '../types/notebook';
import { WorkspaceFolder } from '../services/firestoreService';
import {
  FileCode,
  Table,
  FolderPlus,
  RefreshCw,
  Search,
  Upload,
  Plus,
  Folder,
  Cloud,
  Check,
} from 'lucide-react';

interface Props {
  programs: PracticalProgram[];
  datasets: { name: string; size: string; modified: string }[];
  folders: WorkspaceFolder[];
  activeFilename: string;
  syncStatus: 'synced' | 'syncing' | 'offline';
  onOpenNotebook: (program: PracticalProgram) => void;
  onOpenDataset: (name: string) => void;
  onNewNotebook: () => void;
  onCreateFolder: (name: string) => void;
  onRefresh: () => void;
}

export const FileBrowser: React.FC<Props> = ({
  programs,
  datasets,
  folders,
  activeFilename,
  syncStatus,
  onOpenNotebook,
  onOpenDataset,
  onNewNotebook,
  onCreateFolder,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const handleFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const filteredPrograms = programs.filter(
    (p) =>
      p.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDatasets = datasets.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 select-none text-xs">
      {/* File Browser Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center space-x-1.5">
          <span className="font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider text-[11px]">
            File Browser
          </span>
          {/* Cloud Firestore Status Badge */}
          <span
            className="flex items-center space-x-1 text-[10px] px-1.5 py-0.5 rounded font-mono text-neutral-500 bg-neutral-200/60 dark:bg-neutral-800"
            title={`Firestore Status: ${syncStatus}`}
          >
            <Cloud size={11} className={syncStatus === 'syncing' ? 'text-amber-500 animate-pulse' : 'text-blue-500'} />
            <span className="hidden sm:inline">Firestore</span>
          </span>
        </div>

        <div className="flex items-center space-x-1 text-neutral-500">
          <button
            onClick={onNewNotebook}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition"
            title="New Notebook"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={() => setIsCreatingFolder(true)}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition"
            title="New Folder"
          >
            <FolderPlus size={14} />
          </button>
          <button
            onClick={() => alert('Dataset upload: You can drop CSV files or use Firestore datasets.')}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition"
            title="Upload Files"
          >
            <Upload size={14} />
          </button>
          <button
            onClick={handleRefresh}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition"
            title="Refresh File List from Cloud"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* New Folder Inline Form */}
      {isCreatingFolder && (
        <form
          onSubmit={handleFolderSubmit}
          className="p-2 bg-blue-50/60 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-800 flex items-center space-x-1"
        >
          <Folder size={14} className="text-blue-500 flex-shrink-0" />
          <input
            type="text"
            required
            autoFocus
            placeholder="Folder name..."
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="flex-1 bg-white dark:bg-neutral-800 border border-blue-300 dark:border-blue-700 rounded px-2 py-0.5 text-xs focus:outline-none"
          />
          <button
            type="submit"
            className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
            title="Create"
          >
            <Check size={12} />
          </button>
          <button
            type="button"
            onClick={() => setIsCreatingFolder(false)}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-neutral-500"
            title="Cancel"
          >
            &times;
          </button>
        </form>
      )}

      {/* Search Input */}
      <div className="p-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter files by name"
            className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded pl-7 pr-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Directory Path Breadcrumb */}
      <div className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 font-mono flex items-center justify-between">
        <span>/ workspace / practicals /</span>
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
          {syncStatus === 'synced' ? '● Synced' : syncStatus === 'syncing' ? '○ Syncing' : '▲ Cached'}
        </span>
      </div>

      {/* File & Folder List */}
      <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/40">
        {/* Folders */}
        {folders.map((f) => (
          <div
            key={f.id}
            className="flex items-center space-x-2 px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-neutral-700 dark:text-neutral-300 font-medium"
          >
            <Folder size={14} className="text-amber-500 flex-shrink-0" />
            <span className="truncate text-xs">{f.name}</span>
          </div>
        ))}

        {/* Notebook Files */}
        {filteredPrograms.map((p) => {
          const isSelected = p.filename === activeFilename;
          return (
            <div
              key={p.id}
              onClick={() => onOpenNotebook(p)}
              className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center space-x-2 min-w-0">
                <FileCode size={15} className="text-orange-500 flex-shrink-0" />
                <div className="truncate">
                  <div className="truncate text-xs font-medium">{p.filename}</div>
                  <div className="text-[10px] text-neutral-400 truncate">
                    Prac {p.practicalNumber}: {p.title}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-neutral-400 flex-shrink-0 ml-2">
                ipynb
              </span>
            </div>
          );
        })}

        {/* Datasets */}
        {filteredDatasets.map((d) => {
          const isSelected = d.name === activeFilename;
          return (
            <div
              key={d.name}
              onClick={() => onOpenDataset(d.name)}
              className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center space-x-2 min-w-0">
                <Table size={15} className="text-emerald-500 flex-shrink-0" />
                <div className="truncate">
                  <div className="truncate text-xs">{d.name}</div>
                  <div className="text-[10px] text-neutral-400">{d.size}</div>
                </div>
              </div>
              <span className="text-[10px] text-neutral-400 flex-shrink-0 ml-2">
                csv
              </span>
            </div>
          );
        })}

        {filteredPrograms.length === 0 && filteredDatasets.length === 0 && (
          <div className="p-4 text-center text-neutral-400 text-xs">
            No matching files found.
          </div>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="p-2 bg-neutral-100 dark:bg-neutral-800/80 border-t border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-500 text-center">
        Stored in Cloud Firestore & Local Cache
      </div>
    </div>
  );
};
