import userAxiosInstance from './axiosUserConfig';

export interface UserDto {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

class UserService {
  /**
   * Get all users
   */
  async getAllUsers(): Promise<UserDto[]> {
    try {
      const response = await userAxiosInstance.get<UserDto[]>('/users');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error}`);
    }
  }

  /**
   * Get all technicians
   */
  async getTechnicians(): Promise<UserDto[]> {
    try {
      const response = await userAxiosInstance.get<UserDto[]>('/users/role/technician');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch technicians: ${error}`);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<UserDto> {
    try {
      const response = await userAxiosInstance.get<UserDto>(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error}`);
    }
  }
}

export default new UserService();
