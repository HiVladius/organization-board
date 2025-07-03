import { useTaskStore } from "@/store/task.store";
import { useEffect, useRef, useState } from "react";

interface AddTaskProps {
  projectId: string;
  status: string;
}

export const AddTaskForm = ({ projectId, status }: AddTaskProps) => {
  const [title, setTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { createTask } = useTaskStore();
  const formRef = useRef<HTMLFormElement>(null);

  // Manejar click fuera del componente - solo cierra si está vacío
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isAdding && formRef.current &&
        !formRef.current.contains(event.target as Node)
      ) {
        // Verificar el valor actual del título directamente del DOM
        const currentTitle = (formRef.current.querySelector(
          "textarea",
        ) as HTMLTextAreaElement)?.value || "";
        // Solo cerrar si NO hay contenido escrito (está vacío)
        if (!currentTitle.trim()) {
          setIsAdding(false);
        }
      }
    };

    if (isAdding) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAdding]); // Removemos title de las dependencias

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
      throw error;
    }
  };

  if (!isAdding) {
    return (
      <button
        className="w-full rounded-md text-white bg-cyan-500 hover:bg-cyan-600 px-4 py-2"
        onClick={() => setIsAdding(true)}
      >
        Añadir Tarea
      </button>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-2">
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </form>
  );
};
