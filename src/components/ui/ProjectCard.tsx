import { useState } from "react";
import { Link } from "react-router-dom";
import type { Project, User } from "@/types/index.types";
import { EditProjectForm } from "../EditProjectForm";
import { useProjectStore } from "@/store/project.store";

interface ProjectCardProps {
  project: Project;
  user: User; // Añadido para mostrar el nombre del usuario
}

export const ProjectCard = ({ project, user }: ProjectCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteProject } = useProjectStore();

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir navegación
    e.stopPropagation(); // Detener propagación del evento
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir navegación
    e.stopPropagation(); // Detener propagación del evento

    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar el proyecto "${project.name}"?`,
      )
    ) {
      try {
        setIsDeleting(true);
        await deleteProject(project.id);
      } catch (error) {
        console.error("Error al eliminar el proyecto:", error);
        alert("Error al eliminar el proyecto. Por favor, inténtalo de nuevo.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <Link
        to={`/project/${project.id}`}
        className="flex flex-col gap-4 rounded-lg border border-slate-700 bg-slate-800 p-4 transition-colors hover:bg-slate-700/50 relative group"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-700 text-lg font-bold">
            {project.project_key}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white">
              {project.name}
            </h3>
            <p className="text-sm text-slate-400">{user?.username}</p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button
              onClick={handleEditClick}
              className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-500 text-white"
            >
              Editar
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>

        {project.description && (
          <p className="mt-4 text-sm text-slate-400 line-clamp-2">
            {project.description}
          </p>
        )}
      </Link>

      <EditProjectForm
        project={project}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
};

