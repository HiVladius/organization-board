import { create } from "zustand";

import { getTaskByProjectId } from "../api/tasks";
import type { Task, TaskStatus } from "../types/index.types";
import { updateTaskStatus } from "../api/updateTaskStatus";
import { normalizeMongoTask } from "../lib/mongodb-utils";

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  updatingTasks: Set<string>; // Usar Set para mejor performance
  fetchTasks: (projectId: string) => Promise<void>;
  updateTask: (taskId: string, newStatus: TaskStatus) => Promise<Task>;
  updateTaskFromWebSocket: (updateTask: Task) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,
  updatingTasks: new Set<string>(), // Inicializar Set vacío

  fetchTasks: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const rawTasks = await getTaskByProjectId(projectId);
      
      // Normalizar todas las tareas usando utility
      const normalizedTasks = rawTasks.map(normalizeMongoTask);
      
      // Verificar que no haya IDs duplicados
      const ids = normalizedTasks.map((t) => t.id);
      const uniqueIds = new Set(ids);
      if (uniqueIds.size !== ids.length) {
        console.warn("⚠️ Se encontraron IDs duplicados en las tareas");
      }

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
    const updateTasksSet = (taskId: string, action: 'add' | 'remove') => {
      set((state) => {
        const newUpdatingTasks = new Set(state.updatingTasks);
        if (action === 'add') {
          newUpdatingTasks.add(taskId);
        } else {
          newUpdatingTasks.delete(taskId);
        }
        return { ...state, updatingTasks: newUpdatingTasks };
      });
    };

    // Marcar que estamos actualizando esta tarea
    updateTasksSet(taskId, 'add');
    
    try {
      const rawTask = await updateTaskStatus(taskId, newStatus);
      const normalizedTask = normalizeMongoTask(rawTask);
      
      set((state) => {
        const taskExists = state.tasks.some(task => task.id === normalizedTask.id);
        const newUpdatingTasks = new Set(state.updatingTasks);
        newUpdatingTasks.delete(taskId);
        
        if (!taskExists) {
          return {
            ...state,
            tasks: [...state.tasks, normalizedTask],
            updatingTasks: newUpdatingTasks
          };
        }
        
        return {
          ...state,
          tasks: state.tasks.map((task) =>
            task.id === normalizedTask.id ? normalizedTask : task
          ),
          updatingTasks: newUpdatingTasks
        };
      });
      
      return normalizedTask;
    } catch (error) {
      console.error("❌ Store: Fallo actualizar la tarea:", error);
      // Remover de la lista de tareas siendo actualizadas en caso de error
      updateTasksSet(taskId, 'remove');
      throw error;
    }
  },

  updateTaskFromWebSocket: (updateTask) => {
    set((state) => {
      // Si estamos actualizando esta tarea localmente, ignorar el WebSocket
      if (state.updatingTasks.has(updateTask.id)) {
        return state; // No cambiar el estado
      }
      
      const taskIndex = state.tasks.findIndex(task => task.id === updateTask.id);
      
      if (taskIndex === -1) {
        // Tarea no encontrada, agregarla
        return {
          ...state,
          tasks: [...state.tasks, updateTask]
        };
      }
      
      // Actualizar tarea existente
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === updateTask.id ? updateTask : task
        )
      };
    });
  },
}));
