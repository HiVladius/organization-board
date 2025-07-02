import { useTaskStore } from "@/store/task.store";
import type { Task } from "../../types/index.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

  const { deleteTask } = useTaskStore();

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
      className={`relative rounded-md border border-slate-700 bg-slate-800 p-3 shadow-sm hover:bg-slate-700/50 transition-all duration-200 cursor-pointer group ${
        isDragging
          ? "opacity-50 scale-95 bg-slate-700/30 border-dashed border-slate-500"
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
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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

        <h4 className="text-sm font-medium text-slate-200 transition-colors duration-200 group-hover:text-white">
          {task.title}
        </h4>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-slate-400 transition-colors duration-200 group-hover:text-slate-300">
            {task.priority}
          </span>
          {/* placeholder para el avatar del asignado */}
          <div className="h-6 w-6 rounded-full bg-slate-600 transition-all duration-200 group-hover:bg-slate-500 group-hover:scale-105">
          </div>
        </div>
      </div>
    </div>
  );
};
