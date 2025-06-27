import type { Task } from "../../types/index.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
    task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="cursor-grab rounded-md border border-slate-700 bg-slate-800 p-3 shadow-sm"
        >
            <h4 className="text-sm font-medium text-slate-200">{task.title}</h4>
            <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">{task.priority}</span>
                {/* placeholder para el avatar del asignado */}
                <div className="h-6 w-6 rounded-full bg-slate-600"></div>
            </div>
        </div>
    );
};
