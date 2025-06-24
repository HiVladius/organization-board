import { create } from "zustand";

import { getTaskByProjectId } from "../api/tasks";
import type { Task, TaskStatus } from '../types/index.types';
import { updateTaskStatus as updateTaskStatusAPI } from "../api/updateTaskStatus";



interface TaskStore {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    fetchTasks: (projectId: string) => Promise<void>;
    updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<Task>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
    tasks: [],
    isLoading: false,
    error: null,
    
    fetchTasks: async(projectId) => {
        set({isLoading: true, error: null});
        try {
            console.log('Fetching tasks for project:', projectId);
            const rawTasks = await getTaskByProjectId(projectId);
            console.log('Raw tasks from API:', rawTasks);
            
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
                if (!taskId || taskId === 'undefined' || taskId === 'null') {
                    taskId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    console.warn('Generated temporary ID for task:', taskId, 'Original task:', task);
                }
                
                const mappedTask = {
                    ...task,
                    id: taskId,
                };
                
                console.log('Task ID mapping:', {
                    original: task.id,
                    _id: task._id,
                    mapped: mappedTask.id,
                    title: task.title
                });
                
                return mappedTask;
            });
            
            // Verificar que no haya IDs duplicados
            const ids = tasksWithValidIds.map(t => t.id);
            const uniqueIds = new Set(ids);
            if (uniqueIds.size !== ids.length) {
                console.error('Duplicate IDs found after mapping:', {
                    totalTasks: ids.length,
                    uniqueIds: uniqueIds.size,
                    ids: ids
                });
            }
            
            console.log('Tasks with valid IDs:', tasksWithValidIds);
            set({ tasks: tasksWithValidIds, isLoading: false });
        } catch (error: any) {
            console.error("Error fetching tasks:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            console.error("Request URL:", error.config?.url);
            
            let errorMessage = 'No se pudieron cargar las tareas';
            if (error.response?.status === 400) {
                errorMessage = 'Solicitud inválida - verifica el ID del proyecto';
            } else if (error.response?.status === 401) {
                errorMessage = 'No autorizado - verifica tu sesión';
            } else if (error.response?.status === 404) {
                errorMessage = 'Proyecto no encontrado';
            }
            
            set({error: errorMessage, isLoading: false})
        }
    },    updateTaskStatus: async (taskId, newStatus) => {
        const { tasks } = get();
        
        console.log(`🎯 Store updateTaskStatus called:`, {
            taskId,
            newStatus,
            currentTasksCount: tasks.length
        });
        
        // Encontrar la tarea original
        const originalTask = tasks.find(task => task.id === taskId);
        
        if (!originalTask) {
            console.error('❌ Task not found in store:', { taskId, availableTaskIds: tasks.map(t => t.id) });
            throw new Error('Tarea no encontrada');
        }

        

        // Actualización optimista simple: cambiar el estado local inmediatamente
        const updatedTask = { ...originalTask, status: newStatus };
        const updatedTasks = tasks.map((task) =>
            task.id === taskId ? updatedTask : task
        );
        
        
        set({ tasks: updatedTasks });

        try {
            // Llamar a la API para persistir el cambio
            
            const apiResult = await updateTaskStatusAPI(taskId, newStatus);
            
            return updatedTask;
        } catch (error) {
            console.error('❌ Store: API call failed, reverting optimistic update');
            
            // Revertir el cambio en caso de error
            const revertedTasks = tasks.map((task) =>
                task.id === taskId ? originalTask : task
            );
            set({ tasks: revertedTasks, error: 'No se pudo actualizar la tarea.' });
            throw error;
        }
    },

    

    
    

}))