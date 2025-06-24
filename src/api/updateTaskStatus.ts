import apiClient from './index.api';
import type { Task } from '../types/index.types';
import { TaskStatus } from '../types/index.types';

// Mapear los valores del frontend a los valores que espera el backend
const mapStatusToBackend = (status: TaskStatus): string => {
    const statusMap = {
        [TaskStatus.ToDo]: 'ToDo',
        [TaskStatus.InProgress]: 'InProgress', 
        [TaskStatus.Done]: 'Done',
        [TaskStatus.Canceled]: 'Cancelled' // Backend usa "Cancelled" con doble L
    };
    
    return statusMap[status] || status;
};

export const updateTaskStatus = async (taskId: string, status: TaskStatus): Promise<Task> => {
    console.log('🎯 API updateTaskStatus called with:', { taskId, status });
    
    // Validación básica
    if (!taskId || taskId === 'undefined' || taskId === 'null') {
        throw new Error(`Invalid taskId: ${taskId}`);
    }
    
    const backendStatus = mapStatusToBackend(status);
    const payload = { status: backendStatus };
    
    console.log('📤 Sending PATCH request:', {
        url: `/tasks/${taskId}`,
        method: 'PATCH',
        payload: payload,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    try {
        const response = await apiClient.patch<Task>(`/tasks/${taskId}`, payload);
        console.log('✅ API response received:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data
        });
        return response.data;
    } catch (error: any) {
        console.error('❌ API Error Details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method,
            payload: error.config?.data,
            requestTaskId: taskId,
            requestStatus: status,
            requestPayload: payload
        });
        throw error;
    }
}
