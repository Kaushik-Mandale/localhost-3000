import React, { useCallback, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { NotebookCell } from '../types/notebook';
import { CellOutput } from './CellOutput';
import { Trash2, ArrowUp, ArrowDown, Plus, Copy } from 'lucide-react';

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
      className={`relative my-2 transition-all group flex flex-col ${
        isActive ? 'active-cell' : ''
      }`}
    >
      {/* Code Editor Row (Matching Image 2: Left blue indicator, [ ]: prompt, editor, top-right buttons) */}
      <div className="flex flex-row items-stretch relative">
        {/* Active Blue Left Bar (Directly like Image 2) */}
        <div
          className={`w-1 rounded-l transition-colors flex-shrink-0 mr-1.5 ${
            isActive ? 'bg-blue-600' : 'bg-transparent'
          }`}
        />

        {/* Execution Prompt [ ]: */}
        <div className="w-12 flex-shrink-0 flex items-start justify-end pr-2 pt-1.5 select-none font-mono text-[13px] text-blue-600 dark:text-blue-400 font-normal">
          {isExecuting
            ? '[*]:'
            : cell.executionCount !== null
            ? `[${cell.executionCount}]:`
            : '[ ]: '}
        </div>

        {/* Cell Editor Wrapper with action controls at top-right */}
        <div
          onKeyDown={handleKeyDown}
          className={`flex-1 relative rounded border transition-colors ${
            isActive
              ? 'border-blue-500 shadow-sm bg-white dark:bg-neutral-900'
              : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
          }`}
        >
          {/* Top-Right Cell Action Buttons (Matching Image 2: duplicate, up, down, insert, trash) */}
          <div
            className={`absolute right-1.5 top-1.5 z-10 flex items-center space-x-0.5 text-neutral-400 dark:text-neutral-500 ${
              isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            } transition-opacity`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded hover:text-neutral-700 dark:hover:text-neutral-200"
              title="Duplicate cell"
            >
              <Copy size={13} />
            </button>
            {canMoveUp && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp();
                }}
                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded hover:text-neutral-700 dark:hover:text-neutral-200"
                title="Move cell up"
              >
                <ArrowUp size={13} />
              </button>
            )}
            {canMoveDown && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown();
                }}
                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded hover:text-neutral-700 dark:hover:text-neutral-200"
                title="Move cell down"
              >
                <ArrowDown size={13} />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInsertBelow();
              }}
              className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded hover:text-neutral-700 dark:hover:text-neutral-200"
              title="Insert cell below"
            >
              <Plus size={13} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded hover:text-red-500"
              title="Delete cell"
            >
              <Trash2 size={13} />
            </button>
          </div>

          <div className="py-0.5 pr-20 min-h-[36px]">
            <CodeMirror
              value={cell.source}
              height="auto"
              theme={isDark ? oneDark : 'light'}
              extensions={[python()]}
              onChange={onChange}
              basicSetup={{
                lineNumbers: false,
                highlightActiveLineGutter: false,
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
      </div>

      {/* Output Area */}
      <CellOutput outputs={cell.outputs} executionCount={cell.executionCount} />
    </div>
  );
};
