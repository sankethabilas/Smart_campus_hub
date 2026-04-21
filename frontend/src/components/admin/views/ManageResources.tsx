import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { assetService } from '../../../services/assetService';
import type { Asset, AssetType } from '../../../services/assetService';
import type { AssetFilters } from '../../resources/ResourcesPage';

import { SearchBar } from '../../resources/SearchBar';
import { FilterPanel } from '../../resources/FilterPanel';
import { AssetCard } from '../../resources/AssetCard';
import { AssetCardSkeleton } from '../../resources/AssetCardSkeleton';
import { AssetDetailModal } from '../../resources/AssetDetailModal';

import { EditResourceModal } from '../modals/EditResourceModal';
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal';

import { Plus, SlidersHorizontal, RefreshCcw } from 'lucide-react';

export const ManageResources: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AssetFilters>({});
  
  // Modals state
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deletingAsset, setDeletingAsset] = useState<Asset | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [showFilters, setShowFilters] = useState(false);

  // Check URL for add=true
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setIsAddModalOpen(true);
      // Clean up URL so refresh doesn't pop it open again
      setSearchParams(new URLSearchParams());
    }
  }, [searchParams, setSearchParams]);

  const loadAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await assetService.searchAssets(filters.query, filters.type, filters.status, filters.minCapacity);
      setAssets(data);
    } catch (err) {
      setError('Failed to connect to the backend server. Make sure it is running on port 8082.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, [filters]);

  const handleEditSuccess = () => {
    setIsAddModalOpen(false);
    setEditingAsset(null);
    loadAssets();
  };

  const handleDeleteSuccess = () => {
    setDeletingAsset(null);
    loadAssets();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Manage Resources</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add, edit, or remove campus facilities and equipment.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Resource
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="w-full md:w-96">
          <SearchBar 
            onSearch={(query) => setFilters(prev => ({ ...prev, query }))} 
            resultCount={assets.length} 
          />
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all flex-1 md:flex-none ${
              showFilters || Object.keys(filters).length > 1
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {Object.keys(filters).length > 1 && `(${Object.keys(filters).length - (filters.query ? 1 : 0)})`}
          </button>
          <button 
            onClick={loadAssets}
            className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-slate-700 transition-colors"
            title="Refresh Data"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-full lg:w-64 shrink-0">
            <FilterPanel 
              filters={filters} 
              onChange={setFilters} 
              onReset={() => setFilters(filters.query ? { query: filters.query } : {})} 
            />
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1">
          {error ? (
            <div className="p-10 border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/10 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/50 rounded-full flex items-center justify-center mb-4">
                <RefreshCcw className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Connection Error</h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">{error}</p>
              <button 
                onClick={loadAssets}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <AssetCardSkeleton key={i} />)
              ) : assets.length > 0 ? (
                assets.map(asset => (
                  <AssetCard 
                    key={asset.id} 
                    asset={asset} 
                    onClick={setSelectedAsset} 
                    isAdminView={true}
                    onEdit={setEditingAsset}
                    onDelete={setDeletingAsset}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <SlidersHorizontal className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No resources found</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">We couldn't find any resources matching your current filters.</p>
                  <button 
                    onClick={() => setFilters({})}
                    className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedAsset && (
        <AssetDetailModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
      )}

      {(isAddModalOpen || editingAsset) && (
        <EditResourceModal 
          asset={editingAsset}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingAsset(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {deletingAsset && (
        <DeleteConfirmModal 
          asset={deletingAsset}
          onClose={() => setDeletingAsset(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};
