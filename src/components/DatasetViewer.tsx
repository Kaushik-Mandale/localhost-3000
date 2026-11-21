import React, { useState } from 'react';
import { Search, Download, Table } from 'lucide-react';

interface Props {
  filename: string;
  csvContent: string;
}

export const DatasetViewer: React.FC<Props> = ({ filename, csvContent }) => {
  const [filter, setFilter] = useState('');

  const rows = csvContent
    .trim()
    .split('\n')
    .map((r) => r.split(','));

  const headers = rows[0] || [];
  const dataRows = rows.slice(1);

  const filteredRows = dataRows.filter((r) =>
    r.some((cell) => cell.toLowerCase().includes(filter.toLowerCase()))
  );

  const handleDownload = () => {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 select-none overflow-hidden">
      {/* Top CSV Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-300 dark:border-neutral-700 text-xs">
        <div className="flex items-center space-x-2">
          <Table size={15} className="text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">{filename}</span>
          <span className="text-neutral-500">
            ({dataRows.length} rows &times; {headers.length} columns)
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-2 text-neutral-400" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search table values..."
              className="pl-7 pr-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-xs focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center space-x-1 px-2.5 py-1 bg-white dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded border border-neutral-300 dark:border-neutral-600 transition"
            title="Download CSV"
          >
            <Download size={13} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* CSV Table Grid */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-xs font-mono">
          <thead className="sticky top-0 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-b border-neutral-300 dark:border-neutral-700 select-none shadow-sm">
            <tr>
              <th className="px-3 py-2 w-12 text-center border-r border-neutral-300 dark:border-neutral-700 text-neutral-400 bg-neutral-200/60 dark:bg-neutral-800">
                #
              </th>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-3 py-2 text-left font-semibold border-r border-neutral-300 dark:border-neutral-700 uppercase tracking-tight text-[11px]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {filteredRows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className="hover:bg-blue-50/50 dark:hover:bg-neutral-800/60 transition-colors"
              >
                <td className="px-3 py-1.5 text-center border-r border-neutral-200 dark:border-neutral-800 text-neutral-400 text-[11px] bg-neutral-50 dark:bg-neutral-900/60">
                  {rIdx + 1}
                </td>
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className="px-3 py-1.5 border-r border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 whitespace-nowrap"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
