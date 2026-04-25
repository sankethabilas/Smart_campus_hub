import axiosInstance from './axiosConfig';

export interface Asset {
  id: number;
  name: string;
  type: 'ROOM' | 'LAB' | 'EQUIPMENT';
  status: 'ACTIVE' | 'OUT_OF_SERVICE';
  capacity: number;
  locationId: number;
  startDatetime?: string;
  endDatetime?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface AssetFilters {
  query?: string;
  type?: string;
  status?: string;
  capacity?: number;
  locationId?: number;
  available?: boolean;
}

export const assetService = {
  async fetchAllAssets(): Promise<Asset[]> {
    const response = await axiosInstance.get<ApiResponse<Asset[]> | Asset[]>('/assets');
    const data = response.data;
    return (data as ApiResponse<Asset[]>).data || data as Asset[];
  },

  async searchAssets(filters: AssetFilters): Promise<Asset[]> {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.capacity !== undefined) params.append('capacity', filters.capacity.toString());
    if (filters.locationId !== undefined) params.append('location_id', filters.locationId.toString());
    if (filters.available !== undefined) params.append('available', filters.available.toString());

    const response = await axiosInstance.get<ApiResponse<Asset[]> | Asset[]>(`/assets/search?${params.toString()}`);
    const data = response.data;
    return (data as ApiResponse<Asset[]>).data || data as Asset[];
  },

  async fetchLocations(): Promise<{ id: number; name: string }[]> {
    const response = await axiosInstance.get<ApiResponse<{ id: number; name: string }[]> | { id: number; name: string }[]>('/locations');
    const data = response.data;
    return (data as ApiResponse<{ id: number; name: string }[]>).data || data as { id: number; name: string }[];
  },

  async createAsset(asset: Omit<Asset, 'id'>): Promise<Asset> {
    try {
      const response = await axiosInstance.post<ApiResponse<Asset> | Asset>('/assets', asset);
      const data = response.data;
      return (data as ApiResponse<Asset>).data || data as Asset;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create asset');
    }
  },

  async updateAsset(id: number, asset: Partial<Asset>): Promise<Asset> {
    try {
      const response = await axiosInstance.put<ApiResponse<Asset> | Asset>(`/assets/${id}`, asset);
      const data = response.data;
      return (data as ApiResponse<Asset>).data || data as Asset;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update asset');
    }
  },

  async deleteAsset(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/assets/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete asset');
    }
  }
};
