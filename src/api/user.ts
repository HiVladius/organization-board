import apiClient from './index.api';
import type { User } from '@/types/index.types';

export interface UpdateUserProfileRequest {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  role?: string;
  avatar?: string;
}

export interface UpdateAvatarRequest {
  avatar: string; // Base64 encoded image
}

/**
 * Obtiene el perfil completo del usuario actual
 */
export const getUserProfile = async (): Promise<User> => {
  const response = await apiClient.get('/user/profile');
  return response.data;
};

/**
 * Actualiza el perfil del usuario
 */
export const updateUserProfile = async (data: UpdateUserProfileRequest): Promise<User> => {
  const response = await apiClient.put('/user/profile', data);
  return response.data;
};

/**
 * Actualiza solo el avatar del usuario
 */
export const updateUserAvatar = async (data: UpdateAvatarRequest): Promise<User> => {
  const response = await apiClient.put('/user/avatar', data);
  return response.data;
};

/**
 * Elimina el avatar del usuario
 */
export const deleteUserAvatar = async (): Promise<User> => {
  const response = await apiClient.delete('/user/avatar');
  return response.data;
};

/**
 * Obtiene los proyectos en los que participa el usuario
 */
export const getUserProjects = async (): Promise<any[]> => {
  const response = await apiClient.get('/user/projects');
  return response.data;
};

/**
 * Obtiene las estadísticas del usuario
 */
export const getUserStats = async (): Promise<{
  totalProjects: number;
  ownedProjects: number;
  memberProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}> => {
  const response = await apiClient.get('/user/stats');
  return response.data;
};
