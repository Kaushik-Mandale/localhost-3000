import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PracticalProgram, NotebookCell, CellType, KernelState } from '../types/notebook';
import { NotebookToolbar } from './NotebookToolbar';
import { CodeCell } from './CodeCell';
import { MarkdownCell } from './MarkdownCell';
import { PythonKernelService } from '../services/pythonKernel';

interface Props {
  program: PracticalProgram;
  isDark: boolean;
  onSaveProgram: (updated: PracticalProgram) => void;
  onCellCountChange?: (activeIdx: number, total: number) => void;
  kernelState: KernelState;
}

export const NotebookWorkspace: React.FC<Props> = ({
  program,
  isDark,
  onSaveProgram,
  onCellCountChange,
  kernelState,
}) => {
  const [cells, setCells] = useState<NotebookCell[]>(program.cells);
  const [activeCellId, setActiveCellId] = useState<string>(
    program.cells.length > 0 ? program.cells[0].id : ''
  );
  const [executingCellId, setExecutingCellId] = useState<string | null>(null);
  const [clipboardCell, setClipboardCell] = useState<NotebookCell | null>(null);
  const cellRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});

  // Sync state if program id changes
  useEffect(() => {
    setCells(program.cells);
    if (program.cells.length > 0) {
      setActiveCellId(program.cells[0].id);
    }
  }, [program.id]);

  // Notify parent of active cell index and total
  useEffect(() => {
    const activeIdx = cells.findIndex((c) => c.id === activeCellId);
    if (onCellCountChange) {
      onCellCountChange(activeIdx >= 0 ? activeIdx : 0, cells.length);
    }
  }, [activeCellId, cells, onCellCountChange]);

  const activeCell = cells.find((c) => c.id === activeCellId) || cells[0];

  // Cell Content Change
  const handleCellChange = useCallback((id: string, newSource: string) => {
    setCells((prev) =>
      prev.map((c) => (c.id === id ? { ...c, source: newSource } : c))
    );
  }, []);

  // Save notebook
  const handleSave = useCallback(() => {
    const updated = {
      ...program,
      cells,
      updatedAt: new Date().toISOString(),
    };
    onSaveProgram(updated);
  }, [cells, onSaveProgram, program]);

  // Execute single cell
  const handleExecuteCell = useCallback(
    async (cellId: string) => {
      const targetCell = cells.find((c) => c.id === cellId);
      if (!targetCell) return;

      if (targetCell.type === 'markdown') return;

      setExecutingCellId(cellId);
      const kernel = PythonKernelService.getInstance();
      const result = await kernel.executeCode(targetCell.source);

      setCells((prev) =>
        prev.map((c) =>
          c.id === cellId
            ? {
                ...c,
                outputs: result.outputs,
                executionCount: result.executionCount,
              }
            : c
        )
      );
      setExecutingCellId(null);
    },
    [cells]
  );

  // Execute and move to next
  const handleExecuteAndNext = useCallback(
    async (cellId: string) => {
      await handleExecuteCell(cellId);
      const idx = cells.findIndex((c) => c.id === cellId);
      if (idx !== -1 && idx < cells.length - 1) {
        setActiveCellId(cells[idx + 1].id);
      } else {
        // If last cell, insert a new code cell below
        const newCell: NotebookCell = {
          id: `cell-${Date.now()}`,
          type: 'code',
          source: '',
          executionCount: null,
          outputs: [],
        };
        setCells((prev) => [...prev, newCell]);
        setActiveCellId(newCell.id);
      }
    },
    [cells, handleExecuteCell]
  );

  // Execute and insert new cell below
  const handleExecuteAndInsert = useCallback(
    async (cellId: string) => {
      await handleExecuteCell(cellId);
      const idx = cells.findIndex((c) => c.id === cellId);
      const newCell: NotebookCell = {
        id: `cell-${Date.now()}`,
        type: 'code',
        source: '',
        executionCount: null,
        outputs: [],
      };
      setCells((prev) => {
        const next = [...prev];
        next.splice(idx + 1, 0, newCell);
        return next;
      });
      setActiveCellId(newCell.id);
    },
    [cells, handleExecuteCell]
  );

  // Run all cells sequentially
  const handleRunAll = useCallback(async () => {
    for (const cell of cells) {
      if (cell.type === 'code') {
        setActiveCellId(cell.id);
        setExecutingCellId(cell.id);
        const kernel = PythonKernelService.getInstance();
        const result = await kernel.executeCode(cell.source);
        setCells((prev) =>
          prev.map((c) =>
            c.id === cell.id
              ? {
                  ...c,
                  outputs: result.outputs,
                  executionCount: result.executionCount,
                }
              : c
          )
        );
      }
    }
    setExecutingCellId(null);
  }, [cells]);

  // Insert cell below active
  const handleInsertBelow = useCallback(
    (afterId?: string) => {
      const targetId = afterId || activeCellId;
      const idx = cells.findIndex((c) => c.id === targetId);
      const newCell: NotebookCell = {
        id: `cell-${Date.now()}`,
        type: 'code',
        source: '',
        executionCount: null,
        outputs: [],
      };
      setCells((prev) => {
        const next = [...prev];
        const insertIdx = idx !== -1 ? idx + 1 : next.length;
        next.splice(insertIdx, 0, newCell);
        return next;
      });
      setActiveCellId(newCell.id);
    },
    [activeCellId, cells]
  );

  // Insert cell above active
  const handleInsertAbove = useCallback(() => {
    const idx = cells.findIndex((c) => c.id === activeCellId);
    const newCell: NotebookCell = {
      id: `cell-${Date.now()}`,
      type: 'code',
      source: '',
      executionCount: null,
      outputs: [],
    };
    setCells((prev) => {
      const next = [...prev];
      const insertIdx = idx !== -1 ? idx : 0;
      next.splice(insertIdx, 0, newCell);
      return next;
    });
    setActiveCellId(newCell.id);
  }, [activeCellId, cells]);

  // Delete cell
  const handleDeleteCell = useCallback(
    (id: string) => {
      if (cells.length <= 1) {
        // Keep at least one empty cell
        setCells([
          {
            id: `cell-${Date.now()}`,
            type: 'code',
            source: '',
            executionCount: null,
            outputs: [],
          },
        ]);
        return;
      }
      const idx = cells.findIndex((c) => c.id === id);
      const newCells = cells.filter((c) => c.id !== id);
      setCells(newCells);
      const newIdx = Math.max(0, idx - 1);
      setActiveCellId(newCells[newIdx].id);
    },
    [cells]
  );

  // Duplicate cell
  const handleDuplicateCell = useCallback(
    (id: string) => {
      const idx = cells.findIndex((c) => c.id === id);
      if (idx === -1) return;
      const original = cells[idx];
      const duplicated: NotebookCell = {
        ...original,
        id: `cell-${Date.now()}`,
        executionCount: null,
        outputs: [],
      };
      setCells((prev) => {
        const next = [...prev];
        next.splice(idx + 1, 0, duplicated);
        return next;
      });
      setActiveCellId(duplicated.id);
    },
    [cells]
  );

  // Move cell up
  const handleMoveUp = useCallback(
    (id: string) => {
      const idx = cells.findIndex((c) => c.id === id);
      if (idx <= 0) return;
      setCells((prev) => {
        const next = [...prev];
        const [moved] = next.splice(idx, 1);
        next.splice(idx - 1, 0, moved);
        return next;
      });
    },
    [cells]
  );

  // Move cell down
  const handleMoveDown = useCallback(
    (id: string) => {
      const idx = cells.findIndex((c) => c.id === id);
      if (idx < 0 || idx >= cells.length - 1) return;
      setCells((prev) => {
        const next = [...prev];
        const [moved] = next.splice(idx, 1);
        next.splice(idx + 1, 0, moved);
        return next;
      });
    },
    [cells]
  );

  // Change cell type
  const handleCellTypeChange = useCallback(
    (type: CellType) => {
      setCells((prev) =>
        prev.map((c) =>
          c.id === activeCellId
            ? { ...c, type, outputs: type === 'markdown' ? [] : c.outputs }
            : c
        )
      );
    },
    [activeCellId]
  );

  // Cut, Copy, Paste
  const handleCut = useCallback(() => {
    if (!activeCell) return;
    setClipboardCell(activeCell);
    handleDeleteCell(activeCell.id);
  }, [activeCell, handleDeleteCell]);

  const handleCopy = useCallback(() => {
    if (!activeCell) return;
    setClipboardCell(activeCell);
  }, [activeCell]);

  const handlePaste = useCallback(() => {
    if (!clipboardCell) return;
    const pasted: NotebookCell = {
      ...clipboardCell,
      id: `cell-${Date.now()}`,
      executionCount: null,
      outputs: [],
    };
    const idx = cells.findIndex((c) => c.id === activeCellId);
    setCells((prev) => {
      const next = [...prev];
      next.splice(idx + 1, 0, pasted);
      return next;
    });
    setActiveCellId(pasted.id);
  }, [activeCellId, cells, clipboardCell]);

  // Restart Kernel
  const handleRestartKernel = useCallback(() => {
    PythonKernelService.getInstance().restartKernel();
    // Clear execution counts and outputs
    setCells((prev) =>
      prev.map((c) => ({
        ...c,
        executionCount: null,
      }))
    );
  }, []);

  const handleInterruptKernel = useCallback(() => {
    PythonKernelService.getInstance().interruptKernel();
  }, []);

  // Global Notebook Shortcuts (A, B, M, Y, DD)
  useEffect(() => {
    let lastKey = '';
    let lastKeyTime = 0;

    const handleGlobalKey = (e: KeyboardEvent) => {
      // If focus is in a textarea or input, do not intercept single letter command shortcuts
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.classList.contains('cm-content');

      if (e.ctrlKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
        return;
      }

      if (isInput) return;

      const now = Date.now();
      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleInsertAbove();
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        handleInsertBelow();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleCellTypeChange('markdown');
      } else if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        handleCellTypeChange('code');
      } else if (e.key === 'd' || e.key === 'D') {
        if (lastKey === 'd' && now - lastKeyTime < 600) {
          e.preventDefault();
          handleDeleteCell(activeCellId);
          lastKey = '';
        } else {
          lastKey = 'd';
          lastKeyTime = now;
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [activeCellId, handleCellTypeChange, handleDeleteCell, handleInsertAbove, handleInsertBelow, handleSave]);

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-neutral-900 select-none overflow-hidden">
      {/* Notebook Action Toolbar */}
      <NotebookToolbar
        cellType={activeCell?.type || 'code'}
        isKernelBusy={kernelState === 'busy'}
        onSave={handleSave}
        onInsertCell={() => handleInsertBelow()}
        onCut={handleCut}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onRun={() => handleExecuteCell(activeCellId)}
        onInterrupt={handleInterruptKernel}
        onRestartKernel={handleRestartKernel}
        onRestartAndRunAll={async () => {
          handleRestartKernel();
          await handleRunAll();
        }}
        onCellTypeChange={handleCellTypeChange}
      />

      {/* Cells Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-2">
        {cells.map((cell, idx) => {
          const isActive = cell.id === activeCellId;
          const isExecuting = cell.id === executingCellId;

          return (
            <div
              key={cell.id}
              ref={(el) => (cellRefs.current[cell.id] = el)}
              id={`cell-${cell.id}`}
            >
              {cell.type === 'code' ? (
                <CodeCell
                  cell={cell}
                  isActive={isActive}
                  isExecuting={isExecuting}
                  isDark={isDark}
                  onSelect={() => setActiveCellId(cell.id)}
                  onChange={(val) => handleCellChange(cell.id, val)}
                  onExecute={() => handleExecuteCell(cell.id)}
                  onExecuteAndNext={() => handleExecuteAndNext(cell.id)}
                  onExecuteAndInsert={() => handleExecuteAndInsert(cell.id)}
                  onDelete={() => handleDeleteCell(cell.id)}
                  onMoveUp={() => handleMoveUp(cell.id)}
                  onMoveDown={() => handleMoveDown(cell.id)}
                  onInsertBelow={() => handleInsertBelow(cell.id)}
                  onDuplicate={() => handleDuplicateCell(cell.id)}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < cells.length - 1}
                />
              ) : (
                <MarkdownCell
                  cell={cell}
                  isActive={isActive}
                  isDark={isDark}
                  onSelect={() => setActiveCellId(cell.id)}
                  onChange={(val) => handleCellChange(cell.id, val)}
                  onDelete={() => handleDeleteCell(cell.id)}
                  onMoveUp={() => handleMoveUp(cell.id)}
                  onMoveDown={() => handleMoveDown(cell.id)}
                  onInsertBelow={() => handleInsertBelow(cell.id)}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < cells.length - 1}
                />
              )}
            </div>
          );
        })}

        {/* Bottom space to click and add */}
        <div
          onClick={() => handleInsertBelow()}
          className="h-28 flex items-center justify-center text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 border border-dashed border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 rounded-lg cursor-pointer transition my-4"
        >
          Click to append code cell below
        </div>
      </div>
    </div>
  );
};
