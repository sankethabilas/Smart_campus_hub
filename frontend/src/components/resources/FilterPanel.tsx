import React, { useState } from 'react';
import { SlidersHorizontal, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import type { AssetFilters } from '../../services/assetService';

interface FilterPanelProps {
  filters: AssetFilters;
  onChange: (filters: AssetFilters) => void;
  onReset: () => void;
}

type AssetType = 'ROOM' | 'LAB' | 'EQUIPMENT';
type AssetStatus = 'ACTIVE' | 'OUT_OF_SERVICE';

const TYPES: { value: AssetType; label: string; color: string; active: string }[] = [
  { value: 'ROOM', label: 'Room', color: 'border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20', active: 'bg-blue-600 border-blue-600 text-white' },
  { value: 'LAB', label: 'Lab', color: 'border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/20', active: 'bg-violet-600 border-violet-600 text-white' },
  { value: 'EQUIPMENT', label: 'Equipment', color: 'border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20', active: 'bg-amber-500 border-amber-500 text-white' },
];

const STATUSES: { value: AssetStatus; label: string; active: string }[] = [
  { value: 'ACTIVE', label: 'Active', active: 'bg-emerald-600 border-emerald-600 text-white' },
  { value: 'OUT_OF_SERVICE', label: 'Out of Service', active: 'bg-rose-600 border-rose-600 text-white' },
];

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange, onReset }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleTypeToggle = (type: AssetType) => {
    onChange({ ...filters, type: filters.type === type ? undefined : type });
  };

  const handleStatusToggle = (status: AssetStatus) => {
    onChange({ ...filters, status: filters.status === status ? undefined : status });
  };

  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    onChange({ ...filters, capacity: val === 0 ? undefined : val });
  };

  const hasActiveFilters = !!(filters.type || filters.status || filters.capacity);

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">Filters</span>
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                {[filters.type, filters.status, filters.capacity].filter(Boolean).length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Filter body */}
        <div className={`transition-all duration-300 ${collapsed ? 'hidden lg:block' : 'block'}`}>
          {/* Asset Type */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Asset Type</p>
            <div className="flex flex-col gap-2">
              {TYPES.map(({ value, label, color, active }) => (
                <button
                  key={value}
                  onClick={() => handleTypeToggle(value)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium text-left transition-all duration-200 ${
                    filters.type === value ? active : `${color} hover:opacity-80`
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Status</p>
            <div className="flex flex-col gap-2">
              {STATUSES.map(({ value, label, active }) => (
                <button
                  key={value}
                  onClick={() => handleStatusToggle(value)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium text-left transition-all duration-200 ${
                    filters.status === value
                      ? active
                      : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/40 hover:opacity-80'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Min Capacity */}
          <div className="p-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Min Capacity</p>
            <input
              type="range"
              min={0}
              max={200}
              step={10}
              value={filters.capacity ?? 0}
              onChange={handleCapacityChange}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{filters.capacity ?? 0}+</span>
              <span>200</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
