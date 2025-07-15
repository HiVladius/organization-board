import { useTaskStore } from "@/store/task.store";
import type { Task } from "../../types/index.types";
import { TaskPriority } from "../../types/index.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskUpdatingIndicator } from "@/components/ui/Skeleton";
import { getPriorityColors, getPriorityLabel } from "@/utils/getPriorityColors";

interface TaskCardProps {
  task: Task;
  onTaskClick?: (taskId: string) => void;
  onEditTask?: (task: Task) => void;
}

export const TaskCard = ({ task, onTaskClick, onEditTask }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const { deleteTask, updatingTasks } = useTaskStore();
  const isUpdating = updatingTasks.has(task.id);
  const priorityColors = getPriorityColors(task.priority as TaskPriority);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease-in-out",
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto",
  };

  const handleCardClick = () => {
    if (onTaskClick) {
      onTaskClick(task.id);
    }
  };

  const handleDeleteTask = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que el click se propague al contenedor del card
    if (window.confirm("¿Estas seguro de eliminar la tarea?")) {
      deleteTask(task.id);
    }
  };

  const handleEditTask = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que el click se propague al contenedor del card
    if (onEditTask) {
      onEditTask(task);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-md border p-3 shadow-sm transition-all duration-200 cursor-pointer group ${priorityColors.bg} ${priorityColors.border} ${priorityColors.hover} ${
        isDragging
          ? "opacity-50 scale-95 border-dashed"
          : "hover:shadow-lg hover:shadow-slate-900/20"
      }`}
      onClick={handleCardClick}
    >
      <div
        {...listeners}
        {...attributes}
        className="absolute top-2 left-2 w-5 h-5 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-60 hover:opacity-100 transition-all duration-300 ease-in-out bg-slate-600 hover:bg-slate-500 rounded flex items-center justify-center text-white text-xs z-10 hover:scale-110 hover:shadow-lg"
        title="Arrastrar tarea"
        style={{ touchAction: "none" }} // Recomendación de @dnd-kit para touch devices
      >
        <div className="flex flex-col gap-0.5 transform transition-transform duration-200 hover:scale-110">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-0.5 bg-white rounded-full transition-all duration-200 hover:bg-cyan-300">
            </div>
            <div className="w-0.5 h-0.5 bg-white rounded-full transition-all duration-200 hover:bg-cyan-300">
            </div>
          </div>
          <div className="flex gap-0.5">
            <div className="w-0.5 h-0.5 bg-white rounded-full transition-all duration-200 hover:bg-cyan-300">
            </div>
            <div className="w-0.5 h-0.5 bg-white rounded-full transition-all duration-200 hover:bg-cyan-300">
            </div>
          </div>
        </div>
      </div>

      {/* Contenido de la tarjeta - Clickeable para abrir detalles */}
      <div className="select-none pl-2 transition-all duration-200">
        <div className="absolute right-1 top-1 z-10 hidden gap-1 group-hover:flex">
          <button
            onClick={handleEditTask}
            className="h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-700 hover:text-cyan-400 flex"
            title="Editar tarea"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={handleDeleteTask}
            className="h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-700 hover:text-red-400 flex"
            title="Eliminar tarea"
          >
            &times;
          </button>
        </div>

        <h4
          className={`text-sm font-medium transition-colors duration-200 ${priorityColors.text}`}
        >
          {task.title}
        </h4>

        {/* Mostrar fechas si están disponibles */}
        {(task.start_date || task.end_date) && (
          <div className="mt-2 text-xs text-slate-400 space-y-1">
            {task.start_date && (
              <div className="flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  Inicio:{" "}
                  {new Date(task.start_date).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
            {task.end_date && (
              <div className="flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Fin: {new Date(task.end_date).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium text-white ${priorityColors.badge}`}
            >
              {getPriorityLabel(task.priority as TaskPriority)}
            </span>
          </div>
          {/* placeholder para el avatar del asignado */}
          <div className="h-6 w-6 rounded-full bg-slate-600 transition-all duration-200 group-hover:bg-slate-500 group-hover:scale-105">
          </div>
        </div>
      </div>

      {/* Indicador de actualización */}
      {isUpdating && <TaskUpdatingIndicator />}
    </div>
  );
};
