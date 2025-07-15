import { useState } from "react";
import { useTaskStore } from "@/store/task.store";
import type { Task } from "@/types/index.types";
import { TaskPriority } from "@/types/index.types";
import { Modal } from "@/components/ui/Modal";
import { DateField } from "@/components/ui/DateField";

interface EditTaskFormProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export const EditTaskForm = ({ task, isOpen, onClose }: EditTaskFormProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority);
  const [startDate, setStartDate] = useState<Date | undefined>(
    task.start_date ? new Date(task.start_date) : undefined,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    task.end_date ? new Date(task.end_date) : undefined,
  );
  const [isLoading, setIsLoading] = useState(false);
  const { updateTaskDetails } = useTaskStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("El título de la tarea no puede estar vacío");
      return;
    }

    setIsLoading(true);
    try {
      // Por ahora solo enviamos los campos que el backend espera
      await updateTaskDetails(task.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        // TODO: Agregar start_date y end_date cuando el backend esté listo
        // start_date: startDate ? startDate.toISOString() : undefined,
        // end_date: endDate ? endDate.toISOString() : undefined,
      });

      // Confirmar que las fechas se están guardando correctamente en el estado local
      console.log("✅ Fechas guardadas en el estado local:", {
        start_date: startDate ? startDate.toISOString() : null,
        end_date: endDate ? endDate.toISOString() : null,
      });

      onClose();
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
      alert("Error al actualizar la tarea");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Resetear valores al cerrar
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority);
    setStartDate(task.start_date ? new Date(task.start_date) : undefined);
    setEndDate(task.end_date ? new Date(task.end_date) : undefined);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Editar Tarea">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="task-title"
            className="block text-sm font-medium text-gray-200 mb-1"
          >
            Título *
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-md border border-slate-600 bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Título de la tarea"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="task-description"
            className="block text-sm font-medium text-gray-200 mb-1"
          >
            Descripción
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-md border border-slate-600 bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Descripción de la tarea (opcional)"
            rows={4}
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="task-priority"
            className="block text-sm font-medium text-gray-200 mb-1"
          >
            Prioridad
          </label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-3 rounded-md border border-slate-600 bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value={TaskPriority.Low}>Baja</option>
            <option value={TaskPriority.Medium}>Media</option>
            <option value={TaskPriority.High}>Alta</option>
            <option value={TaskPriority.Urgent}>Urgente</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Fechas
          </label>
          <DateField
            startDate={startDate}
            endDate={endDate}
            onDateChange={(newStartDate, newEndDate) => {
              setStartDate(newStartDate);
              setEndDate(newEndDate || undefined);
            }}
            placeholder="Seleccionar fechas"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-md text-gray-300 bg-slate-600 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
