import apiClient from './index.api';
import type { Task } from '../types/index.types';
import { TaskStatus } from '../types/index.types';

// Mapear los valores del frontend a los valores que espera el backend
const mapStatusToBackend = (status: TaskStatus): string => {
    const statusMap = {
        [TaskStatus.ToDo]: 'ToDo',
        [TaskStatus.InProgress]: 'InProgress', 
        [TaskStatus.Done]: 'Done',
        [TaskStatus.Cancelled]: 'Cancelled'
    };
    
    return statusMap[status] || status;
};

export const updateTaskStatus = async (taskId: string, status: TaskStatus): Promise<Task> => {
    // Validación básica
    if (!taskId || taskId === 'undefined' || taskId === 'null') {
        throw new Error(`Invalid taskId: ${taskId}`);
    }
    
    // Validar que el status sea válido
    if (!Object.values(TaskStatus).includes(status)) {
        throw new Error(`Invalid status: ${status}. Valid statuses are: ${Object.values(TaskStatus).join(', ')}`);
    }
    
    const backendStatus = mapStatusToBackend(status);
    const payload = { status: backendStatus };
    
    try {
        const response = await apiClient.patch<Task>(`/tasks/${taskId}`, payload);
        return response.data;
    } catch (error: any) {
        throw error;
    }
}
