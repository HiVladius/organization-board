import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

import type { Task, TaskStatus } from "../../types/index.types";
import { TaskCard } from "./TaskCard";

interface TaskColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export const TaskColum = ({ title, tasks, id }: TaskColumnProps) => {
  // Filtrar tareas con IDs válidos
  const validTasks = tasks.filter(task => 
    task.id && 
    task.id !== 'undefined' && 
    task.id !== 'null' && 
    typeof task.id === 'string'
  );
  
  // Crear array de IDs en el mismo orden que las tareas se renderizan
  const tasksIds = validTasks.map((task) => task.id);
  
  // Solo mostrar warning si hay tareas filtradas
  if (tasks.length !== validTasks.length) {
    console.warn(`Columna ${title}: ${tasks.length - validTasks.length} tareas con IDs inválidos fueron filtradas`);
  }
  
  // Hacer que la columna sea droppable
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div 
      ref={setNodeRef}
      className="w-72 flex-shrink-0 rounded-lg bg-slate-800 p-3"
    >
      <h3 className="px-1 text-sm font-semibold text-slate-300">{title}</h3>
      <div className="mt-3 flex flex-col gap-3">
        {validTasks.length > 0 ? (
          <SortableContext items={tasksIds} strategy={verticalListSortingStrategy}>
            {validTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        ) : (
          <div className="text-center text-sm text-slate-500">No hay tareas</div>
        )}
      </div>
    </div>
  );
};
