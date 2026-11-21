import React, { useState } from 'react';
import { PracticalProgram } from '../types/notebook';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  LogOut,
  FileCode,
  Calendar,
  AlertTriangle,
  X,
  Save,
  Database,
  ArrowUpDown,
} from 'lucide-react';

interface Props {
  programs: PracticalProgram[];
  onAddProgram: (prog: Omit<PracticalProgram, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateProgram: (prog: PracticalProgram) => void;
  onDeleteProgram: (id: string) => void;
  onOpenNotebook: (prog: PracticalProgram) => void;
  onLogout: () => void;
}

export const AdminWorkspace: React.FC<Props> = ({
  programs,
  onAddProgram,
  onUpdateProgram,
  onDeleteProgram,
  onOpenNotebook,
  onLogout,
}) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'number' | 'title' | 'date'>('number');
  const [sortAsc, setSortAsc] = useState(true);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<PracticalProgram | null>(null);
  const [deletingProgram, setDeletingProgram] = useState<PracticalProgram | null>(null);

  // Form State
  const [formNumber, setFormNumber] = useState<number>(1);
  const [formTitle, setFormTitle] = useState('');
  const [formFilename, setFormFilename] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDataset, setFormDataset] = useState('Iris.csv');
  const [formCode, setFormCode] = useState('');

  const openAddModal = () => {
    const nextNum = programs.length > 0 ? Math.max(...programs.map((p) => p.practicalNumber)) + 1 : 1;
    setFormNumber(nextNum);
    setFormTitle('');
    setFormFilename(`Practical_${nextNum}.ipynb`);
    setFormDescription('');
    setFormDataset('Iris.csv');
    setFormCode('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (prog: PracticalProgram) => {
    setEditingProgram(prog);
    setFormNumber(prog.practicalNumber);
    setFormTitle(prog.title);
    setFormFilename(prog.filename);
    setFormDescription(prog.description);
    setFormDataset(prog.dataset || 'Iris.csv');
    // Extract code from cells
    const code = prog.cells
      .filter((c) => c.type === 'code')
      .map((c) => c.source)
      .join('\n\n');
    setFormCode(code);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formFilename.trim()) return;

    // Build initial cells from code
    const initialCells = [
      {
        id: `c-md-${Date.now()}`,
        type: 'markdown' as const,
        source: `# Practical No. ${formNumber}: ${formTitle}\n${formDescription}`,
        executionCount: null,
        outputs: [],
      },
      {
        id: `c-code-${Date.now()}`,
        type: 'code' as const,
        source: formCode,
        executionCount: null,
        outputs: [],
      },
    ];

    onAddProgram({
      practicalNumber: Number(formNumber),
      title: formTitle.trim(),
      filename: formFilename.endsWith('.ipynb') ? formFilename.trim() : `${formFilename.trim()}.ipynb`,
      description: formDescription.trim(),
      dataset: formDataset.trim(),
      cells: initialCells,
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;

    // Update cells or keep existing if unchanged
    const updatedCells = [...editingProgram.cells];
    const codeCellIndex = updatedCells.findIndex((c) => c.type === 'code');
    if (codeCellIndex !== -1) {
      updatedCells[codeCellIndex] = {
        ...updatedCells[codeCellIndex],
        source: formCode,
      };
    } else {
      updatedCells.push({
        id: `c-code-${Date.now()}`,
        type: 'code',
        source: formCode,
        executionCount: null,
        outputs: [],
      });
    }

    onUpdateProgram({
      ...editingProgram,
      practicalNumber: Number(formNumber),
      title: formTitle.trim(),
      filename: formFilename.endsWith('.ipynb') ? formFilename.trim() : `${formFilename.trim()}.ipynb`,
      description: formDescription.trim(),
      dataset: formDataset.trim(),
      cells: updatedCells,
      updatedAt: new Date().toISOString(),
    });

    setEditingProgram(null);
  };

  const handleConfirmDelete = () => {
    if (deletingProgram) {
      onDeleteProgram(deletingProgram.id);
      setDeletingProgram(null);
    }
  };

  // Filter and sort
  const filtered = programs.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.filename.toLowerCase().includes(search.toLowerCase()) ||
      p.practicalNumber.toString().includes(search)
  );

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'number') cmp = a.practicalNumber - b.practicalNumber;
    else if (sortBy === 'title') cmp = a.title.localeCompare(b.title);
    else if (sortBy === 'date') cmp = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    return sortAsc ? cmp : -cmp;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 overflow-y-auto select-none p-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-neutral-300 dark:border-neutral-700 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              Admin Console
            </span>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Practical Program Manager
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Manage your Machine Learning practical notebooks. Changes immediately sync to the Student Workspace.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={openAddModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-sm transition"
          >
            <Plus size={14} />
            <span>Add Practical Program</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded text-xs font-medium transition"
            title="Sign out from Admin Manager"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-4">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or practical number..."
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-neutral-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 text-xs focus:outline-none"
          >
            <option value="number">Practical Number</option>
            <option value="title">Alphabetical (Title)</option>
            <option value="date">Last Modified</option>
          </select>
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-neutral-600 dark:text-neutral-400"
            title="Toggle sort direction"
          >
            <ArrowUpDown size={14} />
          </button>
        </div>
      </div>

      {/* Program Listing Table */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-100 dark:bg-neutral-700/60 text-neutral-600 dark:text-neutral-300 font-semibold border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="px-4 py-3 w-16">Prac #</th>
                <th className="px-4 py-3">Program Title</th>
                <th className="px-4 py-3">Notebook Filename</th>
                <th className="px-4 py-3">Dataset</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 w-32">Last Modified</th>
                <th className="px-4 py-3 w-40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700/60">
              {sorted.map((prog) => (
                <tr
                  key={prog.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors"
                >
                  <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                    #{prog.practicalNumber}
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                    {prog.title}
                  </td>
                  <td className="px-4 py-3 font-mono text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-center space-x-1.5">
                      <FileCode size={13} className="text-orange-500" />
                      <span>{prog.filename}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                    {prog.dataset ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <Database size={10} className="mr-1" />
                        {prog.dataset}
                      </span>
                    ) : (
                      <span className="text-neutral-400">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 max-w-xs truncate">
                    {prog.description || 'No description provided.'}
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-[11px]">
                    <div className="flex items-center space-x-1">
                      <Calendar size={11} />
                      <span>
                        {new Date(prog.updatedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onOpenNotebook(prog)}
                        className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-neutral-600 dark:text-neutral-300"
                        title="Open in Workspace"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <button
                        onClick={() => openEditModal(prog)}
                        className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-blue-600 dark:text-blue-400"
                        title="Edit Practical"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeletingProgram(prog)}
                        className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-red-600 dark:text-red-400"
                        title="Delete Practical"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-neutral-400">
                    No practical programs found. Click "Add Practical Program" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingProgram) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
          <div className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="font-semibold text-sm">
                {isAddModalOpen ? 'Add New Practical Program' : `Edit Practical #${formNumber}`}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProgram(null);
                }}
                className="p-1 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                <X size={15} />
              </button>
            </div>

            <form
              onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit}
              className="p-5 overflow-y-auto space-y-4 text-xs flex-1"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium mb-1">Practical Number *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formNumber}
                    onChange={(e) => setFormNumber(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">Practical Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Random Forest Classifier"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Notebook Filename *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Random_Forest.ipynb"
                    value={formFilename}
                    onChange={(e) => setFormFilename(e.target.value)}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-xs focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Dataset Filename</label>
                  <input
                    type="text"
                    placeholder="e.g. Iris.csv"
                    value={formDataset}
                    onChange={(e) => setFormDataset(e.target.value)}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-xs focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Summary of this machine learning practical..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Python Program Code (Initial Cells)</label>
                <textarea
                  rows={8}
                  placeholder="# Python implementation code here..."
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-xs font-mono leading-relaxed focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProgram(null);
                  }}
                  className="px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow-sm"
                >
                  <Save size={13} />
                  <span>{isAddModalOpen ? 'Create Program' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
          <div className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-2xl w-full max-w-md p-5 text-xs space-y-4">
            <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
              <AlertTriangle size={20} />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-neutral-600 dark:text-neutral-300">
              Are you sure you want to permanently delete{' '}
              <strong className="text-neutral-900 dark:text-neutral-100">
                Practical #{deletingProgram.practicalNumber}: {deletingProgram.title}
              </strong>{' '}
              ({deletingProgram.filename})? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
              <button
                onClick={() => setDeletingProgram(null)}
                className="px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
