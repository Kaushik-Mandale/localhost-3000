import React from 'react';

interface Props {
  isPruned?: boolean;
}

export const DecisionTreeVisual: React.FC<Props> = ({ isPruned = false }) => {
  return (
    <div className="my-2 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded overflow-x-auto shadow-sm">
      <div className="text-xs font-semibold text-neutral-500 mb-2 uppercase tracking-wide">
        {isPruned ? 'Pruned Decision Tree (max_depth=2)' : 'Unpruned Decision Tree (entropy)'}
      </div>
      <svg viewBox="0 0 760 300" className="w-full min-w-[680px] h-auto font-mono text-[11px]">
        {/* Connection Lines */}
        <line x1="380" y1="52" x2="200" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="380" y1="52" x2="560" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
        {!isPruned && (
          <>
            <line x1="560" y1="165" x2="470" y2="230" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="560" y1="165" x2="650" y2="230" stroke="#94a3b8" strokeWidth="1.5" />
          </>
        )}

        {/* Root Node */}
        <g transform="translate(290, 8)">
          <rect width="180" height="52" rx="4" fill="#fed7aa" stroke="#f97316" strokeWidth="1.5" />
          <text x="90" y="16" textAnchor="middle" fontWeight="bold" fill="#7c2d12">PetalLengthCm &le; 2.45</text>
          <text x="90" y="30" textAnchor="middle" fill="#9a3412">entropy = 1.585 | samples = 21</text>
          <text x="90" y="44" textAnchor="middle" fill="#9a3412">value = [7, 7, 7] | class = setosa</text>
        </g>

        {/* Left Child (Leaf: Setosa) */}
        <g transform="translate(110, 115)">
          <rect width="180" height="50" rx="4" fill="#bbf7d0" stroke="#22c55e" strokeWidth="1.5" />
          <text x="90" y="16" textAnchor="middle" fontWeight="bold" fill="#14532d">entropy = 0.0</text>
          <text x="90" y="30" textAnchor="middle" fill="#166534">samples = 7 | value = [7, 0, 0]</text>
          <text x="90" y="44" textAnchor="middle" fontWeight="bold" fill="#15803d">class = Iris-setosa</text>
        </g>

        {/* Right Child */}
        <g transform="translate(470, 115)">
          <rect width="180" height="52" rx="4" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="90" y="16" textAnchor="middle" fontWeight="bold" fill="#1e3a8a">
            {isPruned ? 'entropy = 1.0' : 'PetalWidthCm \u2264 1.75'}
          </text>
          <text x="90" y="30" textAnchor="middle" fill="#1e40af">
            {isPruned ? 'samples = 14 | value = [0, 7, 7]' : 'entropy = 1.0 | samples = 14'}
          </text>
          <text x="90" y="44" textAnchor="middle" fontWeight="bold" fill="#2563eb">
            {isPruned ? 'class = versicolor' : 'value = [0, 7, 7]'}
          </text>
        </g>

        {!isPruned && (
          <>
            {/* Versicolor Leaf */}
            <g transform="translate(380, 225)">
              <rect width="180" height="50" rx="4" fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="90" y="16" textAnchor="middle" fontWeight="bold" fill="#4c1d95">entropy = 0.0</text>
              <text x="90" y="30" textAnchor="middle" fill="#5b21b6">samples = 7 | value = [0, 7, 0]</text>
              <text x="90" y="44" textAnchor="middle" fontWeight="bold" fill="#6d28d9">class = Iris-versicolor</text>
            </g>

            {/* Virginica Leaf */}
            <g transform="translate(560, 225)">
              <rect width="180" height="50" rx="4" fill="#fbcfe8" stroke="#ec4899" strokeWidth="1.5" />
              <text x="90" y="16" textAnchor="middle" fontWeight="bold" fill="#831843">entropy = 0.0</text>
              <text x="90" y="30" textAnchor="middle" fill="#9d174d">samples = 7 | value = [0, 0, 7]</text>
              <text x="90" y="44" textAnchor="middle" fontWeight="bold" fill="#be185d">class = Iris-virginica</text>
            </g>
          </>
        )}
      </svg>
    </div>
  );
};
