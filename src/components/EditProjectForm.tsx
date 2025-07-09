import { useState } from "react";
import { useProjectStore } from "@/store/project.store";
import type { Project } from "@/types/index.types";
import { Modal } from "@/components/ui/Modal";

interface EditProjectFormProps {
  project: Project;
  isOpen: boolean;
  // onClose: () => void;
}

export const EditProjectForm = (
  { project, isOpen, /*onClose*/ }: EditProjectFormProps,
) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [projectKey, setProjectKey] = useState(project.project_key);
  const [isLoading, setIsLoading] = useState(false);
  const { updateProject } = useProjectStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("El nombre del proyecto no puede estar vacío");
      return;
    }
    if (!projectKey.trim()) {
      alert("La clave del proyecto no puede estar vacía");
      return;
    }

    setIsLoading(true);
    try {
      await updateProject(project.id, {
        name: name.trim(),
        description: description.trim(),
        key: projectKey.trim().toUpperCase(), // Cambiar de project_key a key
      });

      // onClose();
    } catch (error) {
      console.error("Error al actualizar el proyecto:", error);
      alert("Error al actualizar el proyecto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Resetear valores al cerrar
    setName(project.name);
    setDescription(project.description || "");
    setProjectKey(project.project_key);
    // onClose();
  };

  const handleKeyChange = (value: string) => {
    // Solo permitir letras, números y guiones, convertir a mayúsculas
    const cleanValue = value.replace(/[^A-Za-z0-9-]/g, "").toUpperCase();
    setProjectKey(cleanValue);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Editar Proyecto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="project-name"
            className="block text-sm font-medium text-gray-200 mb-1"
          >
            Nombre del Proyecto *
          </label>
          <input
            id="project-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-md border border-slate-600 bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Nombre del proyecto"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="project-key"
            className="block text-sm font-medium text-gray-200 mb-1"
          >
            Clave del Proyecto *
          </label>
          <input
            id="project-key"
            type="text"
            value={projectKey}
            onChange={(e) => handleKeyChange(e.target.value)}
            className="w-full p-3 rounded-md border border-slate-600 bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="CLAVE-PROYECTO"
            maxLength={10}
            disabled={isLoading}
          />
          <p className="text-xs text-gray-400 mt-1">
            Solo letras, números y guiones. Máximo 10 caracteres.
          </p>
        </div>

        <div>
          <label
            htmlFor="project-description"
            className="block text-sm font-medium text-gray-200 mb-1"
          >
            Descripción
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-md border border-slate-600 bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Descripción del proyecto (opcional)"
            rows={4}
            disabled={isLoading}
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
