import React, { useState, useEffect } from 'react';
import type { Asset } from '../../../services/assetService';
import { assetService } from '../../../services/assetService';

export interface ResourceFormProps {
  initialData?: Asset | null;
  onSubmit: (data: Omit<Asset, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const ResourceForm: React.FC<ResourceFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<Omit<Asset, 'id'>>({
    name: '',
    type: 'ROOM',
    status: 'ACTIVE',
    capacity: 0,
    locationId: 1,
    startDatetime: new Date().toISOString().slice(0, 16),
    endDatetime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  });

  const [locations, setLocations] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    assetService.fetchLocations().then(setLocations).catch(console.error);
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        status: initialData.status,
        capacity: initialData.capacity,
        locationId: initialData.locationId,
        // For datetime-local input, we need "YYYY-MM-DDThh:mm" format
        startDatetime: initialData.startDatetime ? new Date(initialData.startDatetime).toISOString().slice(0, 16) : '',
        endDatetime: initialData.endDatetime ? new Date(initialData.endDatetime).toISOString().slice(0, 16) : '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'locationId' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert local datetime string back to UTC ISO if needed, or send as is if backend handles local
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Resource Name</label>
        <input 
          type="text" required name="name" value={formData.name} onChange={handleChange}
          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="e.g., Chemistry Lab 101"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
          <select 
            name="type" value={formData.type} onChange={handleChange}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="ROOM">Room</option>
            <option value="LAB">Lab</option>
            <option value="EQUIPMENT">Equipment</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
          <select 
            name="status" value={formData.status} onChange={handleChange}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="ACTIVE">Active</option>
            <option value="OUT_OF_SERVICE">Out of Service</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Capacity</label>
          <input 
            type="number" required min="0" max="1000" name="capacity" value={formData.capacity} onChange={handleChange}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
          <select 
            name="locationId" value={formData.locationId} onChange={handleChange}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Available From</label>
          <input 
            type="datetime-local" required name="startDatetime" value={formData.startDatetime} onChange={handleChange}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Available Until</label>
          <input 
            type="datetime-local" required name="endDatetime" value={formData.endDatetime} onChange={handleChange}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 mt-6">
        <button type="button" onClick={onCancel} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
          {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
          {initialData ? 'Update Resource' : 'Create Resource'}
        </button>
      </div>
    </form>
  );
};
