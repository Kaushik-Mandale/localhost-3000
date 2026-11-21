import React, { useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { NotebookCell } from '../types/notebook';
import { Trash2, ArrowUp, ArrowDown, Plus, Eye, Edit3 } from 'lucide-react';

interface Props {
  cell: NotebookCell;
  isActive: boolean;
  isDark: boolean;
  onSelect: () => void;
  onChange: (source: string) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onInsertBelow: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export const MarkdownCell: React.FC<Props> = ({
  cell,
  isActive,
  isDark,
  onSelect,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  onInsertBelow,
  canMoveUp,
  canMoveDown,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        setIsEditing(false);
      }
    },
    []
  );

  const renderSimpleMarkdown = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-neutral-800 dark:text-neutral-200">
        {lines.map((line, idx) => {
          if (line.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-xl font-bold border-b pb-1 my-2 border-neutral-200 dark:border-neutral-700">
                {line.slice(2)}
              </h1>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-lg font-semibold my-1.5">
                {line.slice(3)}
              </h2>
            );
          }
          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-base font-semibold my-1">
                {line.slice(4)}
              </h3>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <li key={idx} className="ml-4 list-disc text-sm">
                {formatInline(line.slice(2))}
              </li>
            );
          }
          return (
            <p key={idx} className="text-sm leading-relaxed">
              {formatInline(line)}
            </p>
          );
        })}
      </div>
    );
  };

  const formatInline = (str: string) => {
    // Basic bold, italic and inline code parser
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded font-mono text-xs">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div
      onClick={onSelect}
      onDoubleClick={() => setIsEditing(true)}
      className={`relative my-1.5 transition-all group border-l-4 ${
        isActive
          ? 'border-l-blue-600 bg-white dark:bg-neutral-900 shadow-sm'
          : 'border-l-transparent hover:border-l-neutral-300 dark:hover:border-l-neutral-700'
      }`}
    >
      {/* Action Toolbar on Hover */}
      <div className="absolute right-3 -top-3 hidden group-hover:flex items-center space-x-0.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded shadow-md z-10 px-1 py-0.5 text-neutral-600 dark:text-neutral-300">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(!isEditing);
          }}
          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded hover:text-blue-600"
          title={isEditing ? 'Preview Markdown (Shift+Enter)' : 'Edit Markdown'}
        >
          {isEditing ? <Eye size={12} /> : <Edit3 size={12} />}
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

      <div className="flex flex-row items-stretch">
        {/* Left Gutter */}
        <div className="w-16 flex-shrink-0 flex items-start justify-end pr-3 pt-2 select-none">
          <span className="font-mono text-[11px] text-neutral-400 font-medium">
            [M]:
          </span>
        </div>

        {/* Content Box */}
        <div className="flex-1 px-3 py-2 rounded border border-transparent">
          {isEditing ? (
            <div onKeyDown={handleKeyDown} className="border border-blue-400 rounded">
              <CodeMirror
                value={cell.source}
                height="auto"
                theme={isDark ? oneDark : 'light'}
                extensions={[markdown()]}
                onChange={onChange}
                basicSetup={{
                  lineNumbers: false,
                  foldGutter: false,
                  highlightActiveLine: true,
                }}
              />
              <div className="text-[10px] text-neutral-400 p-1 bg-neutral-50 dark:bg-neutral-800 text-right">
                Press Shift+Enter to render markdown
              </div>
            </div>
          ) : (
            <div className="cursor-pointer" title="Double click to edit">
              {renderSimpleMarkdown(cell.source || '*Empty markdown cell. Double-click to edit.*')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
