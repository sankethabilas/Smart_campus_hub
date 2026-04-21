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

const API_BASE_URL = 'http://localhost:8081/api';

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
    // Option C: Static dropdown with known location IDs until backend provides an endpoint.
    return [
      { id: 1, name: 'Main Campus Building' },
      { id: 2, name: 'Engineering Annex' },
      { id: 3, name: 'Science Block' },
      { id: 4, name: 'Library' },
    ];
  }
};
