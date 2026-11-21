import React, { useState } from 'react';
import { PracticalProgram } from '../types/notebook';
import { DEFAULT_DIRECTORIES } from '../data/initialPrograms';
import {
  FileCode,
  Table,
  FolderPlus,
  RefreshCw,
  Upload,
  Plus,
  Folder,
  ChevronDown,
  Filter,
} from 'lucide-react';

interface Props {
  programs: PracticalProgram[];
  datasets: { name: string; size: string; modified: string }[];
  activeFilename: string;
  onOpenNotebook: (program: PracticalProgram) => void;
  onOpenDataset: (name: string) => void;
  onNewNotebook: () => void;
  onCreateFolder: (name: string) => void;
  onRefresh: () => void;
}

export const FileBrowser: React.FC<Props> = ({
  programs,
  datasets,
  activeFilename,
  onOpenNotebook,
  onOpenDataset,
  onNewNotebook,
  onCreateFolder,
  onRefresh,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 300);
  };

  const handleFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const filteredPrograms = programs.filter((p) =>
    p.filename.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const filteredDatasets = datasets.filter((d) =>
    d.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const filteredDirs = DEFAULT_DIRECTORIES.filter((d) =>
    d.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 select-none text-xs">
      {/* Top Action Bar (Matching Image 2: Large Blue Plus, Folder Plus, Upload, Filter) */}
      <div className="p-2 border-b border-neutral-300 dark:border-neutral-800 flex items-center space-x-1.5">
        <button
          onClick={onNewNotebook}
          className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded py-1 px-3 shadow-sm transition font-medium"
          title="New Launcher / New Notebook"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>

        <button
          onClick={() => setIsCreatingFolder(true)}
          className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400"
          title="New Folder"
        >
          <FolderPlus size={16} />
        </button>

        <button
          onClick={() => alert('Upload files')}
          className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400"
          title="Upload Files"
        >
          <Upload size={16} />
        </button>

        <button
          onClick={() => setShowFilter(!showFilter)}
          className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400"
          title="Filter Files"
        >
          <Filter size={15} />
        </button>

        <button
          onClick={handleRefresh}
          className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400"
          title="Refresh List"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Optional Search Filter input */}
      {showFilter && (
        <div className="px-2 py-1.5 bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800">
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter files..."
            className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 text-xs focus:outline-none"
            autoFocus
          />
        </div>
      )}

      {/* New Folder Inline Form */}
      {isCreatingFolder && (
        <form
          onSubmit={handleFolderSubmit}
          className="p-2 bg-blue-50 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-800 flex items-center space-x-1"
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
            className="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px]"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setIsCreatingFolder(false)}
            className="px-1 text-neutral-500"
          >
            &times;
          </button>
        </form>
      )}

      {/* Path Breadcrumb (Matching Image 2: 📁 /) */}
      <div className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 flex items-center space-x-1.5 font-medium">
        <Folder size={14} className="text-neutral-500 fill-neutral-500" />
        <span>/</span>
      </div>

      {/* Header Row: Name ▴ | Modified (Matching Image 2) */}
      <div className="grid grid-cols-12 px-3 py-1.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        <div className="col-span-8 flex items-center space-x-1 cursor-pointer">
          <span>Name</span>
          <ChevronDown size={11} className="rotate-180" />
        </div>
        <div className="col-span-4 text-right">Modified</div>
      </div>

      {/* File & Directory Listing (Matching Image 2) */}
      <div className="flex-1 overflow-y-auto">
        {/* Directories */}
        {filteredDirs.map((dir) => (
          <div
            key={dir.id}
            className="grid grid-cols-12 px-3 py-1.5 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 cursor-pointer text-neutral-700 dark:text-neutral-300 items-center transition-colors"
          >
            <div className="col-span-8 flex items-center space-x-2 truncate">
              <Folder size={14} className="text-neutral-600 dark:text-neutral-400 fill-neutral-600 dark:fill-neutral-400 flex-shrink-0" />
              <span className="truncate text-xs">{dir.name}</span>
            </div>
            <div className="col-span-4 text-right text-[11px] text-neutral-400 truncate">
              {dir.modified}
            </div>
          </div>
        ))}

        {/* Datasets */}
        {filteredDatasets.map((d) => {
          const isSelected = d.name === activeFilename;
          return (
            <div
              key={d.name}
              onClick={() => onOpenDataset(d.name)}
              className={`grid grid-cols-12 px-3 py-1.5 cursor-pointer items-center transition-colors ${
                isSelected
                  ? 'bg-blue-600 text-white font-medium'
                  : 'hover:bg-neutral-200/60 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
              }`}
            >
              <div className="col-span-8 flex items-center space-x-2 truncate">
                <Table size={14} className={isSelected ? 'text-white flex-shrink-0' : 'text-emerald-600 flex-shrink-0'} />
                <span className="truncate text-xs">{d.name}</span>
              </div>
              <div className={`col-span-4 text-right text-[11px] truncate ${isSelected ? 'text-blue-100' : 'text-neutral-400'}`}>
                {d.modified || 'now'}
              </div>
            </div>
          );
        })}

        {/* Notebook Files */}
        {filteredPrograms.map((p) => {
          const isSelected = p.filename === activeFilename;
          return (
            <div
              key={p.id}
              onClick={() => onOpenNotebook(p)}
              className={`grid grid-cols-12 px-3 py-1.5 cursor-pointer items-center transition-colors ${
                isSelected
                  ? 'bg-blue-600 text-white font-medium'
                  : 'hover:bg-neutral-200/60 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
              }`}
            >
              <div className="col-span-8 flex items-center space-x-2 truncate">
                <FileCode size={14} className={isSelected ? 'text-white flex-shrink-0' : 'text-orange-500 flex-shrink-0'} />
                <span className="truncate text-xs">{p.filename}</span>
              </div>
              <div className={`col-span-4 text-right text-[11px] truncate ${isSelected ? 'text-blue-100' : 'text-neutral-400'}`}>
                now
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
