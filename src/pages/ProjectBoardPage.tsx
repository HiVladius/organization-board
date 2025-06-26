import { useEffect, useMemo, useState } from "react";
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
  const [localTasks, setLocalTasks] = useState(tasks);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  useWebSocket(); // Inicializa el WebSocket para recibir actualizaciones en tiempo real

  // Sincronizar localTasks con tasks del store solo en la carga inicial
  useEffect(() => {
    if (tasks.length > 0 && localTasks.length === 0) {
      setLocalTasks(tasks);
    }
  }, [tasks, localTasks.length]);

  // Sincronizar con WebSocket updates si no hay cambios locales recientes
  useEffect(() => {
    const now = Date.now();
    if (tasks.length > 0 && now - lastUpdateTime > 2000) { // 2 segundos de gracia
      setLocalTasks(tasks);
    }
  }, [tasks, lastUpdateTime]);

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  const colums = useMemo(() => {
    const filteredTasks = {
      ToDo: localTasks.filter((task) => task.status === TaskStatus.ToDo),
      InProgress: localTasks.filter((task) => task.status === TaskStatus.InProgress),
      Done: localTasks.filter((task) => task.status === TaskStatus.Done),
    };
    return filteredTasks;
  }, [localTasks]);


  const handleDragStart = (event: DragStartEvent) => {
    // Opcional: puedes agregar lógica aquí si necesitas
  };

  //! Maneja el evento de finalización del arrastre
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    const oldStatus = active.data.current?.sortable.containerId as TaskStatus;

    if (newStatus === oldStatus) return;

    // Marcar el tiempo del último cambio local
    setLastUpdateTime(Date.now());

    // Actualizar inmediatamente el estado local para mantener la UI
    setLocalTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    try {
      await updateTask(taskId, newStatus);
    } catch (error) {
      // Si falla, revertir el cambio local
      setLocalTasks(currentTasks =>
        currentTasks.map(task =>
          task.id === taskId ? { ...task, status: oldStatus } : task
        )
      );
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
        <h1 className="mb-4 text-2xl font-bold text-white">Tablero Kanba</h1>
        {" "}
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
