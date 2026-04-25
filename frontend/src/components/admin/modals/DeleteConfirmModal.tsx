import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { Asset } from '../../../services/assetService';
import { assetService } from '../../../services/assetService';

interface DeleteConfirmModalProps {
  asset: Asset;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ asset, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await assetService.deleteAsset(asset.id);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during deletion');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Resource?</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-300">{asset.name}</span>?
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                This action cannot be undone.
              </p>
              
              {error && (
                <div className="mt-3 text-sm text-rose-600 dark:text-rose-400 font-medium">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete} 
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};
