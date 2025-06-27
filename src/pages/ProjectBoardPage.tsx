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
  const { tasks, isLoading, error, fetchTasks, updateTask } = useTaskStore();
  
  // Conección WebSocket
  useWebSocket();
  
  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  const columns = useMemo(() => {
    return {
      ToDo: tasks.filter((task) => task.status === TaskStatus.ToDo),
      InProgress: tasks.filter((task) => task.status === TaskStatus.InProgress),
      Done: tasks.filter((task) => task.status === TaskStatus.Done),
    };
  }, [tasks]);

  const handleDragStart = (_event: DragStartEvent) => {
    // Opcional: lógica para cuando inicia el arrastre
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    const oldStatus = active.data.current?.sortable.containerId as TaskStatus;

    if (newStatus === oldStatus) return;

    try {
      await updateTask(taskId, newStatus);
    } catch (error) {
      console.error("Error actualizando tarea:", error);
      alert("No se pudo actualizar la tarea. Inténtalo de nuevo.");
    }
  };

  // const handleReload = () => {
    // if (projectId) {
      // fetchTasks(projectId);
    // }
  // };

  if (isLoading) return <p className="text-white">Cargando tablero...</p>;
  if (error) return <p className="text-red-400">Error: {error}</p>;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Tablero Kanban</h1>
          
        </div>
        
        <div className="flex flex-1 gap-6 overflow-x-auto">
          <TaskColum title="Por Hacer" tasks={columns.ToDo} id={TaskStatus.ToDo} />
          <TaskColum
            title="En Progreso"
            tasks={columns.InProgress}
            id={TaskStatus.InProgress}
          />
          <TaskColum title="Completadas" tasks={columns.Done} id={TaskStatus.Done} />
        </div>
      </div>
    </DndContext>
  );
};
