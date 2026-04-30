import userAxiosInstance from './axiosUserConfig';
import type { UserDto } from './userService';

export async function fetchCurrentUser(): Promise<UserDto> {
  const response = await userAxiosInstance.get<UserDto>('/auth/me');
  return response.data;
}
