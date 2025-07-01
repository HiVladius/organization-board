import { useTaskStore } from "@/store/task.store";
import { useState } from "react";

interface AddTaskProps {
    projectId: string;
    status: string;
}

export const AddTaskForm = ({ projectId, status }: AddTaskProps) => {
    const [title, setTitle] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const { createTask } = useTaskStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title.trim()) {
            return alert("El título de la tarea no puede estar vacío");
        }

        try {
            await createTask(projectId, title, status);
            setTitle("");
            setIsAdding(false);
        } catch (error) {
            console.error("Error al crear la tarea:", error);
        }
    };

    if (!isAdding) {
        return (
            <button
                className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                onClick={() => setIsAdding(true)}
            >
                Añadir Tarea
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-2">
            <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título de la tarea"
                className="w-full p-2 rounded-md border border-slate-700 bg-slate-800 text-white shadow-sm"
                rows={3}
                autoFocus
            />
            <div className="mt-2 flex items-center gap-2">
                <button
                    type="submit"
                    className="rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-cyan-500"
                >
                    Añadir Tarea
                </button>
                <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-slate-700"
                >
                </button>
            </div>
        </form>
    );
};
