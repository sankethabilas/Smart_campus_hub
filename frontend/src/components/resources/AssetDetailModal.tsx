import React, { useEffect } from 'react';
import { X, FlaskConical, DoorOpen, Cpu, Calendar, Users, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Asset } from '../../services/assetService';

interface AssetDetailModalProps {
  asset: Asset;
  onClose: () => void;
}

const formatDate = (dt: string) => {
  if (!dt) return 'N/A';
  return new Date(dt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ asset, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const getIcon = () => {
    const cls = 'w-10 h-10';
    switch (asset.type) {
      case 'LAB': return <FlaskConical className={`${cls} text-violet-500`} />;
      case 'ROOM': return <DoorOpen className={`${cls} text-blue-500`} />;
      case 'EQUIPMENT': return <Cpu className={`${cls} text-amber-500`} />;
    }
  };

  const getTypeGradient = () => {
    switch (asset.type) {
      case 'LAB': return 'from-violet-600 to-purple-700';
      case 'ROOM': return 'from-blue-600 to-sky-700';
      case 'EQUIPMENT': return 'from-amber-500 to-orange-600';
    }
  };

  const fillPercentage = Math.min(100, Math.max(0, (asset.capacity / 200) * 100));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ animation: 'fadeIn 0.2s ease' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        style={{ animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Gradient header */}
        <div className={`bg-gradient-to-br ${getTypeGradient()} p-6 text-white`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              {getIcon()}
            </div>
            <div>
              <p className="text-sm font-medium text-white/70 uppercase tracking-wider mb-1">{asset.type}</p>
              <h2 className="text-2xl font-bold text-white">{asset.name}</h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            {asset.status === 'ACTIVE' ? (
              <span className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <CheckCircle className="w-4 h-4" />
                Active
              </span>
            ) : (
              <span className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 rounded-full">
                <XCircle className="w-4 h-4" />
                Out of Service
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">Asset ID: #{asset.id}</span>
          </div>

          {/* Capacity */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Users className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium">Capacity</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{asset.capacity}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${fillPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">{fillPercentage.toFixed(0)}% of max tracked capacity (200)</p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Location ID</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{asset.locationId}</p>
            </div>
          </div>

          {/* Availability Window */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <Calendar className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Available From</p>
                <p className="text-xs font-medium text-gray-900 dark:text-white">{formatDate(asset.startDatetime)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <Calendar className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Available Until</p>
                <p className="text-xs font-medium text-gray-900 dark:text-white">{formatDate(asset.endDatetime)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  );
};
