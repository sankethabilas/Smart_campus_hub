export interface Asset {
  id: number;
  name: string;
  type: 'ROOM' | 'LAB' | 'EQUIPMENT';
  status: 'ACTIVE' | 'OUT_OF_SERVICE';
  capacity: number;
  locationId: number;
  startDatetime: string;
  endDatetime: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface AssetFilters {
  type?: string;
  status?: string;
  capacity?: number;
  locationId?: number;
  available?: boolean;
}

const API_BASE_URL = 'http://localhost:8082/api';

export const assetService = {
  async fetchAllAssets(): Promise<Asset[]> {
    const response = await fetch(`${API_BASE_URL}/assets`);
    if (!response.ok) {
      throw new Error('Failed to fetch assets');
    }
    const result = await response.json();
    return result.data || result; // Fallback in case ApiResponse wrapper isn't strictly used
  },

  async searchAssets(filters: AssetFilters): Promise<Asset[]> {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.capacity !== undefined) params.append('capacity', filters.capacity.toString());
    if (filters.locationId !== undefined) params.append('locationId', filters.locationId.toString());
    if (filters.available !== undefined) params.append('available', filters.available.toString());

    const response = await fetch(`${API_BASE_URL}/assets/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to search assets');
    }
    const result = await response.json();
    return result.data || result;
  },

  async fetchLocations(): Promise<{ id: number; name: string }[]> {
    const response = await fetch(`${API_BASE_URL}/locations`);
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    const result = await response.json();
    return result.data || result;
  },

  async createAsset(asset: Omit<Asset, 'id'>): Promise<Asset> {
    const response = await fetch(`${API_BASE_URL}/assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asset),
    });
    if (!response.ok) {
      throw new Error('Failed to create asset');
    }
    const result = await response.json();
    return result.data || result;
  },

  async updateAsset(id: number, asset: Partial<Asset>): Promise<Asset> {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asset),
    });
    if (!response.ok) {
      throw new Error('Failed to update asset');
    }
    const result = await response.json();
    return result.data || result;
  },

  async deleteAsset(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete asset');
    }
  }
};
