import React from 'react';
import { FlaskConical, DoorOpen, Cpu, Edit, Trash2, Eye } from 'lucide-react';
import type { Asset } from '../../services/assetService';

interface AssetCardProps {
  asset: Asset;
  onClick: (asset: Asset) => void;
  onEdit?: (asset: Asset) => void;
  onDelete?: (asset: Asset) => void;
  onBook?: (asset: Asset) => void;
  isAdminView?: boolean;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, onClick, onEdit, onDelete, onBook, isAdminView }) => {
  const getIcon = () => {
    switch (asset.type) {
      case 'LAB': return <FlaskConical className="w-6 h-6 text-violet-500" />;
      case 'ROOM': return <DoorOpen className="w-6 h-6 text-blue-500" />;
      case 'EQUIPMENT': return <Cpu className="w-6 h-6 text-amber-500" />;
      default: return <DoorOpen className="w-6 h-6 text-gray-500" />;
    }
  };

  const getAccentColor = () => {
    switch (asset.type) {
      case 'LAB': return 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300';
      case 'ROOM': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'EQUIPMENT': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const fillPercentage = Math.min(100, Math.max(0, (asset.capacity / 200) * 100)); // Assuming 200 is max

  return (
    <div 
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer relative"
      onClick={() => onClick(asset)}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-900 shadow-inner`}>
            {getIcon()}
          </div>
          <div className="flex flex-col items-end gap-2">
            {asset.status === 'ACTIVE' ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Active
              </span>
            ) : (
              <span className="px-2.5 py-1 text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 rounded-full">
                Out of Service
              </span>
            )}
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${getAccentColor()}`}>
              {asset.type}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {asset.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
          Location ID: {asset.locationId}
        </p>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
            <span>Capacity</span>
            <span className="font-medium">{asset.capacity}</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-indigo-500 dark:bg-indigo-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${fillPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Hover Actions Panel */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-800 dark:via-gray-800 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex justify-end gap-2">
        {onBook && (
          <button 
            className={`px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-colors mr-auto shadow-sm ${
              asset.status === 'OUT_OF_SERVICE' 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            onClick={(e) => { 
              e.stopPropagation(); 
              if (asset.status !== 'OUT_OF_SERVICE') {
                onBook(asset); 
              }
            }}
            disabled={asset.status === 'OUT_OF_SERVICE'}
            title={asset.status === 'OUT_OF_SERVICE' ? 'Resource is currently out of service' : 'Book this resource'}
          >
            {asset.status === 'OUT_OF_SERVICE' ? 'Unavailable' : 'Book Now'}
          </button>
        )}
        <button 
          className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
          onClick={(e) => { e.stopPropagation(); onClick(asset); }}
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
        {isAdminView && (
          <>
            <button 
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              onClick={(e) => { 
                e.stopPropagation(); 
                if (onEdit) onEdit(asset);
                else alert('Edit functionality placeholder'); 
              }}
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 dark:text-gray-300 dark:hover:text-rose-400 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
              onClick={(e) => { 
                e.stopPropagation(); 
                if (onDelete) onDelete(asset);
                else alert('Delete functionality placeholder'); 
              }}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
