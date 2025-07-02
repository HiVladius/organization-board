import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

import { TaskColum } from "@/components/tasks/TaskColum";
import { TaskCardDragPreview } from "@/components/tasks/TaskCardDragPreview";
import { useTaskStore } from "@/store/task.store";
import { TaskStatus } from "@/types/index.types";
import type { Task } from "@/types/index.types";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Modal } from "@/components/ui/Modal";
import { TaskDetails } from "@/components/tasks/TaskDetails";
import { EditTaskForm } from "@/components/tasks/EditTaskForm";
import { Sidebar } from "@/components/ui/Sidebar";
import { ProjectSettings } from "@/components/ProjectSettings";

export const ProjectBoardPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    updateTask,
    fetchTaskById,
    clearSelectedTask,
  } = useTaskStore();
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isSettingsSidebarOpen, setSettingsSidebarOpen] = useState(false);
  const [isEditTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Configurar sensores con restricciones de activación
  const mouseSensor = useSensor(MouseSensor, {
    // Requiere mover el mouse 10px antes de activar el drag
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    // Delay de 250ms en touch, con tolerancia de 5px de movimiento
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  // Conección WebSocket
  useWebSocket();

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    } else {
      console.error("No se pudo obtener el projectId desde los parámetros de la URL.");
    }
  }, [projectId, fetchTasks]);

  const columns = useMemo(() => {
    const result = {
      ToDo: tasks.filter((task) => task.status === TaskStatus.ToDo),
      InProgress: tasks.filter((task) => task.status === TaskStatus.InProgress),
      Done: tasks.filter((task) => task.status === TaskStatus.Done),
      Cancelled: tasks.filter((task) => task.status === TaskStatus.Cancelled),
    };

    return result;
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;
    const task = tasks.find((t) => t.id === taskId);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null); // Limpiar el activeTask

    if (!over) {
      return;
    }

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    const oldStatus = active.data.current?.sortable.containerId as TaskStatus;

    // Validar que tenemos IDs válidos
    if (!taskId || typeof taskId !== "string") {
      return;
    }

    // Validar que el newStatus sea un TaskStatus válido
    if (!Object.values(TaskStatus).includes(newStatus)) {
      return;
    }

    if (newStatus === oldStatus) {
      return;
    }

    try {
      await updateTask(taskId, newStatus);
    } catch (error: any) {
      let errorMessage = "No se pudo actualizar la tarea. Inténtalo de nuevo.";

      if (error.response?.status === 422) {
        errorMessage =
          "Formato de datos inválido. Verifica el estado de la tarea.";
      } else if (error.response?.status === 404) {
        errorMessage = "La tarea no fue encontrada.";
      } else if (error.response?.status === 401) {
        errorMessage = "No tienes permisos para actualizar esta tarea.";
      }

      alert(errorMessage);
    }
  };

  const handleOpenTaskDetails = async (taskId: string) => {
    try {
      await fetchTaskById(taskId);
      setDetailsModalOpen(true);
    } catch (error) {
      alert("No se pudieron cargar los detalles de la tarea.");
    }
  };

  const handleCloseTaskDetails = () => {
    setDetailsModalOpen(false);
    clearSelectedTask();
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setEditTaskModalOpen(true);
  };

  const handleCloseEditTask = () => {
    setEditTaskModalOpen(false);
    setTaskToEdit(null);
  };

  if (isLoading) return <p className="text-white">Cargando tablero...</p>;
  if (error) return <p className="text-red-400">Error: {error}</p>;

  return (
    <>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={rectIntersection}
      >
        <div className="flex h-full flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Tablero Kanban</h1>
            <button
              onClick={() => setSettingsSidebarOpen(true)}
              className="flex items-center gap-2 rounded-md bg-slate-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-600 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                />
              </svg>
              Ajustes del Proyecto
            </button>
          </div>

          <div className="flex flex-1 gap-6 overflow-x-auto">
            <TaskColum
              title="Por Hacer"
              tasks={columns.ToDo}
              id={TaskStatus.ToDo}
              projectId={projectId!}
              onTaskClick={handleOpenTaskDetails}
              onEditTask={handleEditTask}
            />
            <TaskColum
              title="En Progreso"
              tasks={columns.InProgress}
              id={TaskStatus.InProgress}
              projectId={projectId!}
              onTaskClick={handleOpenTaskDetails}
              onEditTask={handleEditTask}
            />
            <TaskColum
              title="Completadas"
              tasks={columns.Done}
              id={TaskStatus.Done}
              projectId={projectId!}
              onTaskClick={handleOpenTaskDetails}
              onEditTask={handleEditTask}
            />
            <TaskColum
              title="Canceladas"
              tasks={columns.Cancelled}
              id={TaskStatus.Cancelled}
              projectId={projectId!}
              onTaskClick={handleOpenTaskDetails}
              onEditTask={handleEditTask}
            />
          </div>
        </div>

        {/* DragOverlay - Muestra una preview mejorada durante el drag */}
        <DragOverlay>
          {activeTask ? <TaskCardDragPreview task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseTaskDetails}
        title="Detalles de la Tarea"
      >
        <TaskDetails />
      </Modal>

      {/* Modal de Edición de Tarea */}
      {taskToEdit && (
        <EditTaskForm
          task={taskToEdit}
          isOpen={isEditTaskModalOpen}
          onClose={handleCloseEditTask}
        />
      )}

      <Sidebar
        isOpen={isSettingsSidebarOpen}
        onClose={() => setSettingsSidebarOpen(false)}
        title="Configuración del Proyecto"
        position="right"
      >
        <ProjectSettings
          projectId={projectId!}
          onClose={() => setSettingsSidebarOpen(false)}
        />
      </Sidebar>
    </>
  );
};
