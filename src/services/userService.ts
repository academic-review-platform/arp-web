import apiClient from "./client/apiclient";
import type { UserProfile, UpdateUserRequest } from "./models/userModels";

const url = '/users';

export const getMe = async (): Promise<UserProfile> => {
  try {
    const res = await apiClient.get('/auth/me');
    return res.data.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<UserProfile> => {
  try {
    const res = await apiClient.get(`${url}/${id}`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const updateUser = async (id: string, userData: UpdateUserRequest): Promise<UserProfile> => {
  try {
    const res = await apiClient.put(`${url}/${id}`, userData);
    return res.data.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`${url}/${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
export const uploadAvatar = async (id: string, avatarFile: File): Promise<UserProfile> => {
  try {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    const res = await apiClient.post(`${url}/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};