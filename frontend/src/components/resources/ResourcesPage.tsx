import React, { useState, useEffect, useMemo } from 'react';
import { LayoutGrid, Search as SearchIcon, PackageOpen, RefreshCcw, Server } from 'lucide-react';
import { assetService } from '../../services/assetService';
import type { Asset, AssetFilters } from '../../services/assetService';
import { AssetCard } from './AssetCard';
import { AssetCardSkeleton } from './AssetCardSkeleton';
import { FilterPanel } from './FilterPanel';
import { SearchBar } from './SearchBar';
import { AssetDetailModal } from './AssetDetailModal';
import { BookResourceModal } from '../bookings/BookResourceModal';

const DEFAULT_FILTERS: AssetFilters = {};

export const ResourcesPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AssetFilters>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [bookingAsset, setBookingAsset] = useState<Asset | null>(null);

  const loadAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const hasBackendFilters = filters.type || filters.status;
      let data: Asset[];
      if (hasBackendFilters) {
        data = await assetService.searchAssets(filters);
      } else {
        data = await assetService.fetchAllAssets();
      }
      setAssets(data);
    } catch (e) {
      setError('Unable to connect to the backend. Make sure the server is running on port 8082.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.type, filters.status]);

  // Client-side filter: capacity + search query
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = !searchQuery
        || asset.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCapacity = !filters.capacity
        || asset.capacity >= filters.capacity;
      return matchesSearch && matchesCapacity;
    });
  }, [assets, searchQuery, filters.capacity]);

  const stats = useMemo(() => ({
    total: assets.length,
    active: assets.filter(a => a.status === 'ACTIVE').length,
    labs: assets.filter(a => a.type === 'LAB').length,
    rooms: assets.filter(a => a.type === 'ROOM').length,
    equipment: assets.filter(a => a.type === 'EQUIPMENT').length,
  }), [assets]);

  const handleFiltersChange = (newFilters: AssetFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/30">
                <LayoutGrid className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Campus Resources</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Browse and manage all campus assets</p>
              </div>
            </div>
            <button
              onClick={loadAssets}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Stats bar */}
          {!loading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: 'Total', value: stats.total, color: 'text-gray-900 dark:text-white', bg: 'bg-gray-100 dark:bg-gray-800' },
                { label: 'Active', value: stats.active, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                { label: 'Labs', value: stats.labs, color: 'text-violet-700 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
                { label: 'Rooms', value: stats.rooms, color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                { label: 'Equipment', value: stats.equipment, color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
              ].map(stat => (
                <div key={stat.label} className={`${stat.bg} px-4 py-2.5 rounded-xl flex items-center justify-between`}>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</span>
                  <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter panel */}
          <FilterPanel
            filters={filters}
            onChange={handleFiltersChange}
            onReset={handleResetFilters}
          />

          {/* Right column */}
          <div className="flex-1 min-w-0">
            {/* Search bar */}
            <div className="flex items-center gap-3 mb-5">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                totalCount={assets.length}
                filteredCount={filteredAssets.length}
              />
            </div>

            {/* Error state */}
            {error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl mb-4">
                  <Server className="w-12 h-12 text-rose-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Connection Error</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-4">{error}</p>
                <button
                  onClick={loadAssets}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading skeletons */}
            {loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <AssetCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && filteredAssets.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl mb-4">
                  <PackageOpen className="w-12 h-12 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No assets found</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {searchQuery || filters.type || filters.status || filters.capacity
                    ? 'No assets match your current filters. Try adjusting them.'
                    : 'No assets have been added yet.'}
                </p>
                {(searchQuery || filters.type || filters.status || filters.capacity) && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    <SearchIcon className="w-4 h-4" />
                    Reset Filters
                  </button>
                )}
              </div>
            )}

            {/* Asset cards grid */}
            {!loading && !error && filteredAssets.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredAssets.map(asset => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    onClick={setSelectedAsset}
                    onBook={setBookingAsset}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}

      {/* Booking modal */}
      <BookResourceModal
        asset={bookingAsset}
        isOpen={!!bookingAsset}
        onClose={() => setBookingAsset(null)}
        onSuccess={() => {
          alert('Booking request submitted successfully!');
        }}
      />
    </div>
  );
};
