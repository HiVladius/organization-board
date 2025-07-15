import apiClient from "./index.api";
import type {
  Comment,
  Task,
  TaskDateRange,
  TaskWithDateRange,
} from "@/types/index.types";

export const getTaskByProjectId = async (
  projectId: string,
): Promise<Task[]> => {
  if (
    !projectId ||
    projectId === "undefined" ||
    projectId === "[object Object]"
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

export const createTask = async (
  projectId: string,
  title: string,
  status: string = "ToDo",
): Promise<Task> => {
  const response = await apiClient.post<Task>(`/projects/${projectId}/tasks`, {
    title,
    status,
  });
  return response.data;
};

export const deleteTask = async (taskId: string) => {
  const response = await apiClient.delete(`/tasks/${taskId}`);
  return response.data;
};

export const updateTask = async (
  taskId: string,
  updates: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    assignee_id?: string;
  },
): Promise<Task> => {
  const response = await apiClient.patch(`/tasks/${taskId}`, updates);
  return response.data;
};

// Establecer/Actualizar rango de fechas para una tarea
export const setTaskDateRange = async (
  taskId: string,
  startDate?: string,
  endDate?: string,
): Promise<TaskDateRange> => {
  const body: { start_date?: string; end_date?: string } = {};

  if (startDate) body.start_date = startDate;
  if (endDate) body.end_date = endDate;

  const response = await apiClient.post(`/tasks/${taskId}/date-range`, body);
  return response.data;
};

// Obtener rango de fechas de una tarea
export const getTaskDateRange = async (
  taskId: string,
): Promise<TaskDateRange | null> => {
  const response = await apiClient.get(`/tasks/${taskId}/date-range`);
  return response.data;
};

// Eliminar rango de fechas de una tarea
export const deleteTaskDateRange = async (taskId: string): Promise<void> => {
  await apiClient.delete(`/tasks/${taskId}/date-range`);
};

// Obtener tarea completa con rango de fechas
export const getTaskWithDateRange = async (
  taskId: string,
): Promise<TaskWithDateRange> => {
  const response = await apiClient.get(`/tasks/${taskId}/full`);
  return response.data;
};

// Obtener todos los rangos de fechas de las tareas de un proyecto
export const getProjectDateRanges = async (
  projectId: string,
): Promise<TaskDateRange[]> => {
  const response = await apiClient.get(`/projects/${projectId}/date-ranges`);
  return response.data;
};
