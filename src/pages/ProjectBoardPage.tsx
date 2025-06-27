import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

import { TaskColum } from "../components/tasks/TaskColum";
import { useTaskStore } from "../store/task.store";
import { TaskStatus } from "../types/index.types";
import { useWebSocket } from "../hooks/useWebSocket";


export const ProjectBoardPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { tasks, isLoading, fetchTasks, updateTask } = useTaskStore();

  const { isConnected, reconnectAttempts } = useWebSocket(); // Inicializa el WebSocket para recibir actualizaciones en tiempo real

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  // Usar directamente las tareas del store - NO optimistic updates
  const colums = useMemo(() => {
    console.log("🔄 Calculando columnas con tareas del store:", {
      totalTasks: tasks.length,
      taskIds: tasks.map(t => t.id),
      byStatus: {
        ToDo: tasks.filter(t => t.status === TaskStatus.ToDo).length,
        InProgress: tasks.filter(t => t.status === TaskStatus.InProgress).length,
        Done: tasks.filter(t => t.status === TaskStatus.Done).length
      }
    });
    
    return {
      ToDo: tasks.filter((task) => task.status === TaskStatus.ToDo),
      InProgress: tasks.filter((task) => task.status === TaskStatus.InProgress),
      Done: tasks.filter((task) => task.status === TaskStatus.Done),
    };
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    console.log("🔄 Arrastre iniciado:", event.active.id);
  };

  //! Maneja el evento de finalización del arrastre - ULTRA SIMPLE
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    
    // Obtener el estado actual de la tarea
    const currentTask = tasks.find(t => t.id === taskId);
    if (!currentTask) {
      console.error("❌ Tarea no encontrada:", taskId);
      return;
    }
    
    const oldStatus = currentTask.status;

    if (newStatus === oldStatus) return;

    try {
      console.log("📤 Enviando actualización al servidor:", { 
        taskId, 
        oldStatus, 
        newStatus,
        taskTitle: currentTask.title 
      });
      
      await updateTask(taskId, newStatus);
      console.log("✅ Actualización completada - WebSocket sincronizará automáticamente");
    } catch (error) {
      console.error("❌ Error al actualizar tarea:", error);
      alert("No se pudo actualizar la tarea en el servidor.");
    }
  };

  //* Si isLoading es true, muestra un mensaje de carga
  if (isLoading) return <p className="text-white">Cargando tablero...</p>;


  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Tablero Kanban</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div 
                className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                title={isConnected ? 'WebSocket conectado' : `WebSocket desconectado${reconnectAttempts > 0 ? ` (${reconnectAttempts} intentos)` : ''}`}
              />
              <span className="text-xs text-gray-400">
                {isConnected ? 'En vivo' : 'Desconectado'}
              </span>
            </div>
            <button
              onClick={() => {
                if (projectId) {
                  console.log("🔄 Recargando tareas manualmente...");
                  fetchTasks(projectId);
                }
              }}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Recargar
            </button>
            <button
              onClick={() => {
                console.log("🐛 Estado actual:", {
                  storeTasks: tasks.length,
                  totalTasks: tasks.length,
                  wsConnected: isConnected,
                  reconnectAttempts
                });
                console.log("📊 Tareas por estado:", {
                  store: {
                    ToDo: tasks.filter(t => t.status === TaskStatus.ToDo).length,
                    InProgress: tasks.filter(t => t.status === TaskStatus.InProgress).length,
                    Done: tasks.filter(t => t.status === TaskStatus.Done).length
                  }
                });
                console.log("📋 Todas las tareas:", tasks.map(t => ({ id: t.id, title: t.title, status: t.status })));
              }}
              className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Debug
            </button>
          </div>
        </div>
        <div className="flex flex-1 gap-6 overflow-x-auto">
          <TaskColum title="ToDo" tasks={colums.ToDo} id={TaskStatus.ToDo} />
          <TaskColum
            title="InProgress"
            tasks={colums.InProgress}
            id={TaskStatus.InProgress}
          />
          <TaskColum title="Done" tasks={colums.Done} id={TaskStatus.Done} />
          {/* Temporarily removed Cancelled column until further notice */}
          {
            /* <TaskColum
            title="Cancelled"
            tasks={colums.Canceled}
            id={TaskStatus.Canceled}
          /> */
          }
        </div>
      </div>
    </DndContext>
  );
};
