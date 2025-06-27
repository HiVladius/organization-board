import apiClient from "./index.api";
import type { Task } from "../types/index.types";

export const getTaskByProjectId = async(projectId: string): Promise<Task[]> => {
    if (!projectId || projectId === 'undefined' || projectId === '[object Object]') {
        throw new Error('Project ID is required and must be a valid string');
    }
    
    // Asegurar que el projectId sea un string válido
    const cleanProjectId = String(projectId).trim();
    console.log('Making API request to:', `/projects/${cleanProjectId}/tasks`);
    console.log('ProjectId type:', typeof cleanProjectId, 'Value:', cleanProjectId);
    
    const response = await apiClient.get(`/projects/${cleanProjectId}/tasks`);
    return response.data;
}