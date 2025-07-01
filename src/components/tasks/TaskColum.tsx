import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

import type { Task, TaskStatus } from "@/types/index.types";
import { TaskCard } from "./TaskCard";
import { AddTaskForm } from "./AddTaskForm";

interface TaskColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  projectId: string;
  onTaskClick?: (taskId: string) => void;
}

export const TaskColum = (
  { title, tasks, id, projectId, onTaskClick }: TaskColumnProps,
) => {
  // Filtrar tareas con IDs válidos
  const validTasks = tasks.filter((task) =>
    task.id &&
    task.id !== "undefined" &&
    task.id !== "null" &&
    typeof task.id === "string"
  );

  // Crear array de IDs en el mismo orden que las tareas se renderizan
  const tasksIds = validTasks.map((task) => task.id);

  // Hacer que la columna sea droppable
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-72 flex-shrink-0 rounded-lg bg-slate-800 p-3 transition-all duration-200 min-h-[400px] ${
        isOver ? "ring-2 ring-cyan-500 bg-slate-700/50 scale-[1.02]" : ""
      }`}
    >
      <h3 className="px-1 text-sm font-semibold text-slate-300">{title}</h3>
      <div
        className={`mt-3 flex flex-col gap-3 transition-all duration-200 min-h-[350px] ${
          isOver ? "transform scale-[0.98]" : ""
        }`}
      >
        {validTasks.length > 0
          ? (
            <SortableContext
              items={tasksIds}
              strategy={verticalListSortingStrategy}
            >
              {validTasks.map((task) => (
                <TaskCard key={task.id} task={task} onTaskClick={onTaskClick} />
              ))}
            </SortableContext>
          )
          : null}

        {/* Área de drop expandida - siempre visible para mejorar la detección */}
        <div
          className={`flex-1 min-h-[200px] border-2 border-dashed border-slate-600 rounded-lg transition-all duration-200 flex items-center justify-center ${
            isOver
              ? "border-cyan-500 text-cyan-300 bg-cyan-500/10"
              : "text-slate-500 hover:border-slate-500"
          } ${validTasks.length === 0 ? "min-h-[300px]" : ""}`}
        >
          {isOver
            ? (
              <div className="text-center">
                <div className="text-2xl mb-2">⬇️</div>
                <div className="font-medium">Suelta la tarea aquí</div>
              </div>
            )
            : validTasks.length === 0
            ? (
              <div className="text-center">
                <div className="text-4xl mb-2 opacity-30">📋</div>
                <div>No hay tareas</div>
                <div className="text-xs mt-1 opacity-70">
                  Arrastra tareas aquí
                </div>
              </div>
            )
            : (
              <div className="text-center py-4">
                <div className="text-xs opacity-50">Área de drop</div>
              </div>
            )}
        </div>
      </div>
      <AddTaskForm projectId={projectId} status={id} />
    </div>
  );
};
