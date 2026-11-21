import React, { useState, useEffect, useRef } from 'react';
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
  Trash2,
  Copy,
  Download,
  Edit2,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  programs: PracticalProgram[];
  datasets: { name: string; size: string; modified: string }[];
  activeFilename: string;
  onOpenNotebook: (program: PracticalProgram) => void;
  onOpenDataset: (name: string) => void;
  onNewNotebook: () => void;
  onCreateFolder: (name: string) => void;
  onDeleteNotebook: (id: string) => void;
  onDeleteDataset?: (name: string) => void;
  onRefresh: () => void;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  type: 'notebook' | 'dataset' | 'directory';
  item: any;
}

export const FileBrowser: React.FC<Props> = ({
  programs,
  datasets,
  activeFilename,
  onOpenNotebook,
  onOpenDataset,
  onNewNotebook,
  onCreateFolder,
  onDeleteNotebook,
  onDeleteDataset,
  onRefresh,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    type: 'notebook',
    item: null,
  });

  // Delete Confirmation Modal State
  const [itemToDelete, setItemToDelete] = useState<{
    id?: string;
    name: string;
    type: 'notebook' | 'dataset';
  } | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };
    window.addEventListener('click', handleClick);
    window.addEventListener('contextmenu', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('contextmenu', handleClick);
    };
  }, []);

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

  const handleRightClick = (
    e: React.MouseEvent,
    type: 'notebook' | 'dataset' | 'directory',
    item: any
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // Position menu within viewport
    const x = Math.min(e.clientX, window.innerWidth - 180);
    const y = Math.min(e.clientY, window.innerHeight - 220);

    setContextMenu({
      visible: true,
      x,
      y,
      type,
      item,
    });
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'notebook' && itemToDelete.id) {
      onDeleteNotebook(itemToDelete.id);
    } else if (itemToDelete.type === 'dataset' && onDeleteDataset) {
      onDeleteDataset(itemToDelete.name);
    }

    setItemToDelete(null);
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
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 select-none text-xs relative">
      {/* Top Action Bar */}
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

      {/* Filter Input */}
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

      {/* New Folder Form */}
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

      {/* Path Breadcrumb */}
      <div className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 flex items-center space-x-1.5 font-medium">
        <Folder size={14} className="text-neutral-500 fill-neutral-500" />
        <span>/</span>
      </div>

      {/* Header Row: Name ▴ | Modified */}
      <div className="grid grid-cols-12 px-3 py-1.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        <div className="col-span-8 flex items-center space-x-1 cursor-pointer">
          <span>Name</span>
          <ChevronDown size={11} className="rotate-180" />
        </div>
        <div className="col-span-4 text-right">Modified</div>
      </div>

      {/* File & Directory Listing */}
      <div className="flex-1 overflow-y-auto">
        {/* Directories */}
        {filteredDirs.map((dir) => (
          <div
            key={dir.id}
            onContextMenu={(e) => handleRightClick(e, 'directory', dir)}
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
              onContextMenu={(e) => handleRightClick(e, 'dataset', d)}
              className={`grid grid-cols-12 px-3 py-1.5 cursor-pointer items-center transition-colors group ${
                isSelected
                  ? 'bg-blue-600 text-white font-medium'
                  : 'hover:bg-neutral-200/60 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
              }`}
            >
              <div className="col-span-8 flex items-center space-x-2 truncate">
                <Table size={14} className={isSelected ? 'text-white flex-shrink-0' : 'text-emerald-600 flex-shrink-0'} />
                <span className="truncate text-xs">{d.name}</span>
              </div>
              <div className="col-span-4 flex items-center justify-end space-x-1">
                <span className={`text-[11px] truncate ${isSelected ? 'text-blue-100' : 'text-neutral-400'}`}>
                  {d.modified || 'now'}
                </span>
                {/* Beside Delete Icon Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setItemToDelete({ name: d.name, type: 'dataset' });
                  }}
                  className={`opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-neutral-300 dark:hover:bg-neutral-700 transition ${
                    isSelected ? 'hover:text-red-200 text-white' : 'hover:text-red-600 text-neutral-400'
                  }`}
                  title={`Delete ${d.name}`}
                >
                  <Trash2 size={12} />
                </button>
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
              onContextMenu={(e) => handleRightClick(e, 'notebook', p)}
              className={`grid grid-cols-12 px-3 py-1.5 cursor-pointer items-center transition-colors group ${
                isSelected
                  ? 'bg-blue-600 text-white font-medium'
                  : 'hover:bg-neutral-200/60 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
              }`}
            >
              <div className="col-span-8 flex items-center space-x-2 truncate">
                <FileCode size={14} className={isSelected ? 'text-white flex-shrink-0' : 'text-orange-500 flex-shrink-0'} />
                <span className="truncate text-xs">{p.filename}</span>
              </div>
              <div className="col-span-4 flex items-center justify-end space-x-1">
                <span className={`text-[11px] truncate ${isSelected ? 'text-blue-100' : 'text-neutral-400'}`}>
                  now
                </span>
                {/* Beside Delete Icon Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setItemToDelete({ id: p.id, name: p.filename, type: 'notebook' });
                  }}
                  className={`opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-neutral-300 dark:hover:bg-neutral-700 transition ${
                    isSelected ? 'hover:text-red-200 text-white' : 'hover:text-red-600 text-neutral-400'
                  }`}
                  title={`Delete ${p.filename}`}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Realistic JupyterLab Right-Click Context Menu */}
      {contextMenu.visible && (
        <div
          ref={menuRef}
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed z-50 w-44 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded shadow-xl py-1 text-xs text-neutral-800 dark:text-neutral-200 select-none animate-in fade-in zoom-in-95 duration-100"
        >
          <button
            onClick={() => {
              if (contextMenu.type === 'notebook') onOpenNotebook(contextMenu.item);
              if (contextMenu.type === 'dataset') onOpenDataset(contextMenu.item.name);
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-blue-600 hover:text-white text-left"
          >
            <div className="flex items-center space-x-2">
              <FileText size={13} />
              <span>Open</span>
            </div>
          </button>

          <button
            onClick={() => {
              const newName = prompt('Rename file:', contextMenu.item.filename || contextMenu.item.name);
              if (newName && contextMenu.type === 'notebook') {
                contextMenu.item.filename = newName.endsWith('.ipynb') ? newName : `${newName}.ipynb`;
                contextMenu.item.title = newName.replace('.ipynb', '');
                onRefresh();
              }
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-blue-600 hover:text-white text-left"
          >
            <div className="flex items-center space-x-2">
              <Edit2 size={13} />
              <span>Rename</span>
            </div>
          </button>

          <button
            onClick={() => {
              if (contextMenu.type === 'notebook') {
                const original = contextMenu.item as PracticalProgram;
                onNewNotebook();
              }
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-blue-600 hover:text-white text-left"
          >
            <div className="flex items-center space-x-2">
              <Copy size={13} />
              <span>Duplicate</span>
            </div>
          </button>

          <button
            onClick={() => {
              const filename = contextMenu.item.filename || contextMenu.item.name;
              const content = JSON.stringify(contextMenu.item, null, 2);
              const blob = new Blob([content], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = filename;
              a.click();
              URL.revokeObjectURL(url);
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-blue-600 hover:text-white text-left"
          >
            <div className="flex items-center space-x-2">
              <Download size={13} />
              <span>Download</span>
            </div>
          </button>

          <div className="border-t border-neutral-200 dark:border-neutral-700 my-1" />

          {/* Delete Option */}
          <button
            onClick={() => {
              const name = contextMenu.item.filename || contextMenu.item.name;
              const id = contextMenu.item.id;
              setItemToDelete({ id, name, type: contextMenu.type as any });
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 text-left font-medium"
          >
            <div className="flex items-center space-x-2">
              <Trash2 size={13} />
              <span>Delete</span>
            </div>
            <span className="text-[10px] opacity-70">Del</span>
          </button>
        </div>
      )}

      {/* Realistic JupyterLab Delete Confirmation Dialog */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
          <div className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center space-x-2 px-4 py-3 bg-neutral-100 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-xs">
              <AlertTriangle size={15} className="text-red-500" />
              <span>Delete</span>
            </div>

            <div className="p-4 text-xs space-y-2 text-neutral-700 dark:text-neutral-300">
              <p>
                Are you sure you want to permanently delete{' '}
                <strong className="text-neutral-900 dark:text-neutral-100 font-semibold">
                  "{itemToDelete.name}"
                </strong>
                ?
              </p>
              <p className="text-[11px] text-neutral-500">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-850 border-t border-neutral-200 dark:border-neutral-700 text-xs">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
