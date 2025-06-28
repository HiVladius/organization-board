import type { Task } from "../../types/index.types";

interface TaskCardDragPreviewProps {
    task: Task;
}

export const TaskCardDragPreview = ({ task }: TaskCardDragPreviewProps) => {
    return (
        <div className="relative rounded-md border-2 border-cyan-500 bg-slate-800 p-3 shadow-2xl transform rotate-3 scale-105 backdrop-blur-sm">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-md bg-cyan-500/20 blur-sm"></div>
            
            {/* Card content */}
            <div className="relative z-10">
                <div className="select-none">
                    <h4 className="text-sm font-medium text-white">{task.title}</h4>
                    <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-cyan-300 font-medium">{task.priority}</span>
                        {/* Avatar placeholder with glow */}
                        <div className="h-6 w-6 rounded-full bg-slate-600 ring-2 ring-cyan-500/50"></div>
                    </div>
                </div>
            </div>
            
            {/* Floating indicator */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
        </div>
    );
};
