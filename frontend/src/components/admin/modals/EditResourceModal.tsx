import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Asset } from '../../../services/assetService';
import { assetService } from '../../../services/assetService';
import { ResourceForm } from '../forms/ResourceForm';

interface EditResourceModalProps {
  asset: Asset | null; // null means we are creating a new one
  onClose: () => void;
  onSuccess: () => void;
}

export const EditResourceModal: React.FC<EditResourceModalProps> = ({ asset, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async (data: Omit<Asset, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      if (asset) {
        await assetService.updateAsset(asset.id, data);
      } else {
        await assetService.createAsset(data);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {asset ? 'Edit Resource' : 'Add New Resource'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <ResourceForm 
            initialData={asset} 
            onSubmit={handleSubmit} 
            onCancel={onClose} 
            isLoading={loading} 
          />
        </div>
      </div>
    </div>
  );
};
