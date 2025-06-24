import { create } from "zustand";

import { getTaskByProjectId } from "../api/tasks";
import type { Task, TaskStatus } from "../types/index.types";
import { updateTaskStatus } from "../api/updateTaskStatus";

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (projectId: string) => Promise<void>;
  updateTask: (taskId: string, newStatus: TaskStatus) => Promise<Task>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Fetching tasks for project:", projectId);
      const rawTasks = await getTaskByProjectId(projectId);
      console.log("Raw tasks from API:", rawTasks);

      // Mapear y validar IDs de tareas (similar al mapeo de proyectos)
      const tasksWithValidIds = rawTasks.map((task: any) => {
        let taskId = task.id;

        // Manejar diferentes formatos de ID de MongoDB
        if (task._id) {
          if (typeof task._id === "object") {
            // Si es un objeto de MongoDB ObjectId
            if (task._id.$oid) {
              taskId = task._id.$oid;
            } else if (task._id.toString) {
              taskId = task._id.toString();
            } else {
              taskId = String(task._id);
            }
          } else if (typeof task._id === "string") {
            taskId = task._id;
          } else {
            taskId = String(task._id);
          }
        }

        // Asegurar que siempre sea un string válido
        taskId = String(taskId);

        // Si aún es undefined o 'undefined', generar un ID temporal
        if (!taskId || taskId === "undefined" || taskId === "null") {
          taskId = `temp-${Date.now()}-${Math.random().toString(36)}`;
        }

        const mappedTask = {
          ...task,
          id: taskId,
        };

        return mappedTask;
      });

      // Verificar que no haya IDs duplicados
      const ids = tasksWithValidIds.map((t) => t.id);
      const uniqueIds = new Set(ids);
      if (uniqueIds.size !== ids.length) {
      }

      set({ tasks: tasksWithValidIds, isLoading: false });
    } catch (error: any) {
      let errorMessage = "No se pudieron cargar las tareas";
      if (error.response?.status === 400) {
      } else if (error.response?.status === 401) {
      } else if (error.response?.status === 404) {
      }

      set({ error: errorMessage, isLoading: false });
    }
  },
  updateTask: async (taskId: string, newStatus: TaskStatus) => {
    try {
        const updateTaskFromServer = await updateTaskStatus(taskId, newStatus);
        set((state) => ({
            tasks: state.tasks.map((task) => task.id === taskId ? updateTaskFromServer : task)
        }))
        return updateTaskFromServer;
    } catch (error) {
        console.error("Fallo actualizar la tarea. La UI optimista se revertira:", error);
        throw error;
    }
  },
}));
