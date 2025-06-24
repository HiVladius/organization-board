import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { TaskColum } from "../components/tasks/TaskColum";
import { useTaskStore } from "../store/task.store";
import { TaskStatus } from "../types/index.types";

export const ProjectBoardPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { tasks, isLoading, fetchTasks, updateTaskStatus } = useTaskStore();

  // Simple debouncing para drag and drop
  const updateTimeouts = useRef<Map<string, number>>(new Map());

  // Configuración de sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  useEffect(() => {
    if (projectId && projectId !== "undefined") {
      fetchTasks(projectId);
    }

    // Cleanup timeouts on unmount
    return () => {
      updateTimeouts.current.forEach((timeoutId) => clearTimeout(timeoutId));
      updateTimeouts.current.clear();
    };
  }, [projectId, fetchTasks]);
  const colums = useMemo(() => {
    const filteredTasks = {
      ToDo: tasks.filter((task) => task.status === TaskStatus.ToDo),
      InProgress: tasks.filter((task) => task.status === TaskStatus.InProgress),
      Done: tasks.filter((task) => task.status === TaskStatus.Done),
      // Temporarily removed Canceled column until further notice
      // Canceled: tasks.filter((task) => task.status === TaskStatus.Canceled),
    };
    return filteredTasks;
  }, [tasks]);
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    const oldStatus = active.data.current?.sortable.cointainerId as TaskStatus;

    console.log("🎯 Drag end event:", {
      taskId,
      taskIdType: typeof taskId,
      taskIdLength: taskId?.length,
      newStatus,
      oldStatus,
      statusChanged: newStatus !== oldStatus,
    });

    if (newStatus === oldStatus) {
      return;
    }

    // Validar taskId
    if (!taskId || taskId === "undefined" || taskId === "null") {
      return;
    }

    // Clear any existing timeout for this task
    const existingTimeout = updateTimeouts.current.get(taskId);
    if (existingTimeout) {
      console.log("🧹 Clearing existing timeout for task:", taskId);
      clearTimeout(existingTimeout);
    }

    // Set a debounced update
    const timeoutId = setTimeout(async () => {
      try {
        await updateTaskStatus(taskId, newStatus);

        updateTimeouts.current.delete(taskId);
      } catch (error) {
        updateTimeouts.current.delete(taskId);
      }
    }, 250); // 250ms debounce

    updateTimeouts.current.set(taskId, timeoutId);
  };

  if (isLoading) return <p className="text-white">Cargando tablero...</p>;
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
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
