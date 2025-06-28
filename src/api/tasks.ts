import apiClient from "./index.api";
import type { Comment, Task } from "../types/index.types";

export const getTaskByProjectId = async (
  projectId: string,
): Promise<Task[]> => {
  if (
    !projectId || projectId === "undefined" || projectId === "[object Object]"
  ) {
    throw new Error("Project ID is required and must be a valid string");
  }

  // Asegurar que el projectId sea un string válido
  const cleanProjectId = String(projectId).trim();

  const response = await apiClient.get(`/projects/${cleanProjectId}/tasks`);
  return response.data;
};

export const getTaskById = async (taskId: string): Promise<Task> => {
  const response = await apiClient.get<Task>(`/tasks/${taskId}`);
  return response.data;
};

export const getCommentsByTaskId = async (
  taskId: string,
): Promise<Comment[]> => {
  const response = await apiClient.get<Comment[]>(`/tasks/${taskId}/comments`);
  return response.data;
};
