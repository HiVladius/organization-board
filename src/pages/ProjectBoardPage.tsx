import { useEffect, useMemo, useOptimistic, startTransition } from "react";
import { useParams } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import { TaskColum } from "../components/tasks/TaskColum";
import { useTaskStore } from "../store/task.store";
import { type Task, TaskStatus } from "../types/index.types";
import { useWebSocket } from "../hooks/useWebSocket";


export const ProjectBoardPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { tasks, isLoading, fetchTasks, updateTask } = useTaskStore();


  useWebSocket(); // Inicializa el WebSocket para recibir actualizaciones en tiempo real

  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    tasks, // El estado "real"
    (
      currentTasks: Task[],
      { taskId, newStatus }: { taskId: string; newStatus: TaskStatus },
    ) => {
      return currentTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
    },
  );

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  const colums = useMemo(() => {
    const filteredTasks = {
      ToDo: optimisticTasks.filter((task) => task.status === TaskStatus.ToDo),
      InProgress: optimisticTasks.filter((task) => task.status === TaskStatus.InProgress),
      Done: optimisticTasks.filter((task) => task.status === TaskStatus.Done),
    };
    return filteredTasks;
  }, [optimisticTasks]);
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    const oldStatus = active.data.current?.sortable.containerId as TaskStatus;

    if (newStatus === oldStatus) return;

    startTransition(() => {
      setOptimisticTasks({ taskId, newStatus });
    });

    await updateTask(taskId, newStatus);
  };

  //* Si isLoading es true, muestra un mensaje de carga
  if (isLoading) return <p className="text-white">Cargando tablero...</p>;


  return (
    <DndContext
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
