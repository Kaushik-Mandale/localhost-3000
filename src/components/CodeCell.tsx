import React, { useCallback, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { NotebookCell } from '../types/notebook';
import { CellOutput } from './CellOutput';
import { Play, Trash2, ArrowUp, ArrowDown, Plus, Copy } from 'lucide-react';

interface Props {
  cell: NotebookCell;
  isActive: boolean;
  isExecuting: boolean;
  isDark: boolean;
  onSelect: () => void;
  onChange: (source: string) => void;
  onExecute: () => void;
  onExecuteAndNext: () => void;
  onExecuteAndInsert: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onInsertBelow: () => void;
  onDuplicate: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export const CodeCell: React.FC<Props> = ({
  cell,
  isActive,
  isExecuting,
  isDark,
  onSelect,
  onChange,
  onExecute,
  onExecuteAndNext,
  onExecuteAndInsert,
  onDelete,
  onMoveUp,
  onMoveDown,
  onInsertBelow,
  onDuplicate,
  canMoveUp,
  canMoveDown,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        onExecuteAndNext();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onExecute();
      } else if (e.key === 'Enter' && e.altKey) {
        e.preventDefault();
        onExecuteAndInsert();
      }
    },
    [onExecute, onExecuteAndNext, onExecuteAndInsert]
  );

  return (
    <div
      ref={containerRef}
      onClick={onSelect}
      className={`relative my-1.5 transition-all group border-l-4 ${
        isActive
          ? 'border-l-blue-600 bg-white dark:bg-neutral-900 shadow-sm'
          : 'border-l-transparent hover:border-l-neutral-300 dark:hover:border-l-neutral-700'
      }`}
    >
      {/* Quick Action Floating Controls on Hover */}
      <div className="absolute right-3 -top-3 hidden group-hover:flex items-center space-x-0.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded shadow-md z-10 px-1 py-0.5 text-neutral-600 dark:text-neutral-300">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExecute();
          }}
          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded hover:text-blue-600"
          title="Run Cell (Ctrl+Enter)"
        >
          <Play size={12} fill="currentColor" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInsertBelow();
          }}
          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded hover:text-green-600"
          title="Insert Cell Below"
        >
          <Plus size={12} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded hover:text-blue-500"
          title="Duplicate Cell"
        >
          <Copy size={12} />
        </button>
        {canMoveUp && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
            title="Move Cell Up"
          >
            <ArrowUp size={12} />
          </button>
        )}
        {canMoveDown && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
            title="Move Cell Down"
          >
            <ArrowDown size={12} />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded hover:text-red-500"
          title="Delete Cell"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Code Editor Row */}
      <div className="flex flex-row items-stretch">
        {/* Left In Prompt Gutter */}
        <div className="w-16 flex-shrink-0 flex items-start justify-end pr-3 pt-2 select-none">
          <span className="font-mono text-[11px] text-blue-700 dark:text-blue-400 font-semibold tracking-tight">
            {isExecuting ? 'In [*]:' : cell.executionCount !== null ? `In [${cell.executionCount}]:` : 'In [ ]:'}
          </span>
        </div>

        {/* Code Editor Box */}
        <div
          onKeyDown={handleKeyDown}
          className={`flex-1 rounded border transition-colors ${
            isActive
              ? 'border-blue-500 ring-1 ring-blue-500/20 bg-neutral-50/60 dark:bg-neutral-900/60'
              : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700'
          }`}
        >
          <CodeMirror
            value={cell.source}
            height="auto"
            theme={isDark ? oneDark : 'light'}
            extensions={[python()]}
            onChange={onChange}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightSpecialChars: true,
              history: true,
              foldGutter: false,
              drawSelection: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              syntaxHighlighting: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: true,
              crosshairCursor: true,
              highlightActiveLine: false,
              highlightSelectionMatches: true,
              closeBracketsKeymap: true,
              defaultKeymap: true,
              searchKeymap: true,
              historyKeymap: true,
              foldKeymap: true,
              completionKeymap: true,
              lintKeymap: true,
            }}
          />
        </div>
      </div>

      {/* Outputs */}
      <CellOutput outputs={cell.outputs} executionCount={cell.executionCount} />
    </div>
  );
};
