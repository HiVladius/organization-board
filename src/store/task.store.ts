import { create } from "zustand";

import {
  getCommentsByTaskId,
  getTaskById,
  getTaskByProjectId,
  updateTask,
} from "@/api/tasks";
import { createComment } from "@/api/comments";
import type { Comment, Task, TaskStatus } from "@/types/index.types";
import { updateTaskStatus } from "@/api/updateTaskStatus";
import { normalizeMongoTask } from "@/lib/mongodb-utils";
import { createTask } from "@/api/tasks";
import { deleteTask } from "../api/tasks";

interface TaskStore {
  tasks: Task[];
  selectedTask: Task | null; // Agregar estado para la tarea seleccionada
  comments: Comment[]; // Agregar estado para los comentarios
  isLoading: boolean; // Para cargar la lista de tareas
  isLoadingTaskDetails: boolean; // Para cargar los detalles de una tarea específica
  error: string | null;
  updatingTasks: Set<string>; // Usar Set para mejor performance
  fetchTasks: (projectId: string) => Promise<void>;
  updateTask: (taskId: string, newStatus: TaskStatus) => Promise<Task>;
  updateTaskDetails: (taskId: string, updates: {
    title?: string;
    description?: string;
    priority?: string;
    assignee_id?: string;
  }) => Promise<void>;
  updateTaskFromWebSocket: (updateTask: Task) => void;
  fetchTaskById: (taskId: string) => Promise<void>;
  clearSelectedTask: () => void;
  addComment: (taskId: string, comment: string) => Promise<void>;
  createTask: (
    projectId: string,
    title: string,
    status?: string,
  ) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  isLoadingTaskDetails: false,
  error: null,
  updatingTasks: new Set<string>(), // Inicializar Set vacío
  selectedTask: null, // Inicializar tarea seleccionada como null
  comments: [], // Inicializar comentarios como un array vacío

  createTask: async (projectId, title, status = "ToDo") => {
    try {
      const rawTask = await createTask(projectId, title, status);

      // Normalizar la tarea usando utility
      const normalizedTask = normalizeMongoTask(rawTask);

      set((state) => ({
        tasks: [...state.tasks, normalizedTask],
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    const originalTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    }));

    try {
      await deleteTask(taskId);
    } catch (error) {
      
      set({ tasks: originalTasks, error: "No se pudo eliminar la tarea." });
      throw error;
    }
  },

  fetchTaskById: async (taskId) => {
    set({ isLoadingTaskDetails: true, error: null });
    try {
      const rawTask = await getTaskById(taskId);
      const comments = await getCommentsByTaskId(taskId);

      // Normalizar la tarea usando utility
      const normalizedTask = normalizeMongoTask(rawTask);

      set({
        selectedTask: normalizedTask,
        comments,
        isLoadingTaskDetails: false,
      });
    } catch (error) {
      set({
        error: "No se pudieron cargar los detalles de la tarea.",
        isLoadingTaskDetails: false,
      });
    }
  },

  clearSelectedTask: () => {
    set({ selectedTask: null, comments: [] });
  },

  addComment: async (taskId, content) => {
    try {
      const newComment = await createComment(taskId, content);
      set((state) => ({
        comments: [...state.comments, newComment],
      }));
    } catch (error) {
      set({ error: "No se pudo agregar el comentario." });
      throw error;
    }
  },

  fetchTasks: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const rawTasks = await getTaskByProjectId(projectId);

      // Normalizar todas las tareas usando utility
      const normalizedTasks = rawTasks.map(normalizeMongoTask);

      set({ tasks: normalizedTasks, isLoading: false });
    } catch (error: any) {
      let errorMessage = "No se pudieron cargar las tareas";
      if (error.response?.status === 400) {
        errorMessage = "Solicitud inválida";
      } else if (error.response?.status === 401) {
        errorMessage = "No autorizado";
      } else if (error.response?.status === 404) {
        errorMessage = "Proyecto no encontrado";
      }

      set({ error: errorMessage, isLoading: false });
    }
  },
  updateTask: async (taskId: string, newStatus: TaskStatus) => {
    // Función helper para manejar updatingTasks
    const updateTasksSet = (taskId: string, action: "add" | "remove") => {
      set((state) => {
        const newUpdatingTasks = new Set(state.updatingTasks);
        if (action === "add") {
          newUpdatingTasks.add(taskId);
        } else {
          newUpdatingTasks.delete(taskId);
        }
        return { ...state, updatingTasks: newUpdatingTasks };
      });
    };

    //* Marcar que estamos actualizando esta tarea
    updateTasksSet(taskId, "add");

    try {
      const rawTask = await updateTaskStatus(taskId, newStatus);
      const normalizedTask = normalizeMongoTask(rawTask);

      set((state) => {
        const taskExists = state.tasks.some(
          (task) => task.id === normalizedTask.id,
        );
        const newUpdatingTasks = new Set(state.updatingTasks);
        newUpdatingTasks.delete(taskId);

        if (!taskExists) {
          return {
            ...state,
            tasks: [...state.tasks, normalizedTask],
            updatingTasks: newUpdatingTasks,
          };
        }

        return {
          ...state,
          tasks: state.tasks.map((task) =>
            task.id === normalizedTask.id ? normalizedTask : task
          ),
          updatingTasks: newUpdatingTasks,
        };
      });

      return normalizedTask;
    } catch (error) {
      // Remover de la lista de tareas siendo actualizadas en caso de error
      updateTasksSet(taskId, "remove");
      throw error;
    }
  },

  updateTaskFromWebSocket: (updateTask) => {
    set((state) => {
      // Si estamos actualizando esta tarea localmente, ignorar el WebSocket
      if (state.updatingTasks.has(updateTask.id)) {
        return state; // No cambiar el estado
      }

      const taskIndex = state.tasks.findIndex(
        (task) => task.id === updateTask.id,
      );

      if (taskIndex === -1) {
        // Tarea no encontrada, agregarla
        return {
          ...state,
          tasks: [...state.tasks, updateTask],
        };
      }

      // Actualizar tarea existente
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === updateTask.id ? updateTask : task
        ),
      };
    });
  },

  updateTaskDetails: async (taskId, updates) => {
    try {
      const updatedTask = await updateTask(taskId, updates);
      const normalizedTask = normalizeMongoTask(updatedTask);

      set((state) => ({
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === normalizedTask.id ? normalizedTask : task
        ),
        selectedTask: state.selectedTask?.id === normalizedTask.id
          ? normalizedTask
          : state.selectedTask,
      }));
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
      throw error;
    }
  },
}));
