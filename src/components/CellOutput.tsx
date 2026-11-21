import React, { useState } from 'react';
import { CellOutput as CellOutputType } from '../types/notebook';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { DecisionTreeVisual } from './DecisionTreeVisual';

interface Props {
  outputs: CellOutputType[];
  executionCount?: number | null;
}

export const CellOutput: React.FC<Props> = ({ outputs, executionCount }) => {
  const [collapsed, setCollapsed] = useState(false);

  if (!outputs || outputs.length === 0) return null;

  return (
    <div className="flex flex-row mt-1 group">
      {/* Left Output Prompt Gutter */}
      <div className="w-16 flex-shrink-0 flex items-start justify-end pr-3 pt-1 select-none">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 mr-1 p-0.5"
          title={collapsed ? 'Expand Output' : 'Collapse Output'}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
        </button>
        <span className="font-mono text-[11px] text-red-600 dark:text-red-400 font-medium tracking-tight">
          {executionCount ? `Out [${executionCount}]:` : 'Out [ ]:'}
        </span>
      </div>

      {/* Output Content Container */}
      <div className="flex-1 min-w-0 pr-4">
        {collapsed ? (
          <div
            onClick={() => setCollapsed(false)}
            className="text-xs italic text-neutral-400 cursor-pointer hover:underline py-1"
          >
            Output collapsed (click to expand)
          </div>
        ) : (
          <div className="space-y-2 text-xs font-mono">
            {outputs.map((out) => {
              if (out.outputType === 'stream') {
                return (
                  <pre
                    key={out.id}
                    className="whitespace-pre-wrap break-words leading-relaxed text-neutral-800 dark:text-neutral-200 bg-transparent p-0 m-0"
                  >
                    {out.text}
                  </pre>
                );
              }

              if (out.outputType === 'dataframe') {
                return (
                  <div key={out.id} className="overflow-x-auto my-1">
                    {out.html ? (
                      <div dangerouslySetInnerHTML={{ __html: out.html }} />
                    ) : (
                      <pre className="whitespace-pre p-2 bg-neutral-50 dark:bg-neutral-800 rounded">
                        {out.text}
                      </pre>
                    )}
                  </div>
                );
              }

              if (out.outputType === 'image') {
                if (out.imageSrc) {
                  return (
                    <div key={out.id} className="my-2">
                      <img
                        src={out.imageSrc}
                        alt="Matplotlib visualization"
                        className="max-w-full h-auto rounded border border-neutral-200 dark:border-neutral-700 bg-white"
                      />
                    </div>
                  );
                }
                // If it's a decision tree visual
                const isPruned = out.text?.includes('max_depth=2') || out.id.includes('13');
                return <DecisionTreeVisual key={out.id} isPruned={isPruned} />;
              }

              if (out.outputType === 'error') {
                return (
                  <div
                    key={out.id}
                    className="p-2.5 bg-red-50 dark:bg-red-950/40 border-l-4 border-red-500 rounded-r text-red-700 dark:text-red-300 my-1"
                  >
                    <div className="font-bold mb-1">
                      {out.ename}: {out.evalue}
                    </div>
                    {out.traceback && (
                      <pre className="text-[11px] whitespace-pre-wrap opacity-90 leading-tight">
                        {out.traceback.join('\n')}
                      </pre>
                    )}
                  </div>
                );
              }

              if (out.outputType === 'execute_result' || out.outputType === 'display_data') {
                return (
                  <pre
                    key={out.id}
                    className="whitespace-pre-wrap break-words text-neutral-800 dark:text-neutral-200"
                  >
                    {out.text}
                  </pre>
                );
              }

              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};
