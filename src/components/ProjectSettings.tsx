import { addMemberSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { type TAddMemberSchema } from "../lib/validators";
import { useProjectStore } from "@/store/project.store";
import { useAuthStore } from "@/store/auth_store";
import { EditProjectForm } from "./EditProjectForm";

interface ProjectSettingsProps {
  projectId: string;
  onClose?: () => void;
}

export const ProjectSettings = (
  { projectId, onClose }: ProjectSettingsProps,
) => {
  const { user: currentUser } = useAuthStore();
  const {
    selectedProject,
    members,
    addMembers,
    fetchProjectById,
    fetchMembers,
    removeMember,
    isLoading,
    error,
  } = useProjectStore();
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } =
    useForm<TAddMemberSchema>({ resolver: zodResolver(addMemberSchema) });

  const [addMemberError, setAddMemberError] = useState<string>("");
  const [addMemberSuccess, setAddMemberSuccess] = useState<string>("");
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId);
      fetchMembers(projectId);
    }
  }, [projectId, fetchProjectById, fetchMembers]);

  const onAddMember = async (data: TAddMemberSchema) => {
    if (!projectId) return;

    // Limpiar estados previos
    setAddMemberError("");
    setAddMemberSuccess("");

    try {
      await addMembers(projectId, data.email);
      reset(); // Limpia el formulario después de enviar
      setAddMemberSuccess("¡Miembro agregado exitosamente!");
      // Limpiar el mensaje de éxito después de 3 segundos
      setTimeout(() => setAddMemberSuccess(""), 3000);
    } catch (error) {
      setAddMemberError(
        "Error al agregar el miembro al proyecto. Puede que el usuario no exista o ya sea miembro del proyecto.",
      );
    }
  };

  const onRemoveMember = async (memberId: string) => {
    if (
      !projectId ||
      !window.confirm(
        "¿Estás seguro de que quieres eliminar este miembro del proyecto?",
      )
    ) return;

    try {
      await removeMember(projectId, memberId);
    } catch (error) {
      alert("Error al eliminar al miembro");
    }
  };

  const isOwner = currentUser?.id === selectedProject?.owner_id;

    

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full">
        </div>
        <span className="ml-3 text-white">Cargando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-md">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-md">
        <p className="text-yellow-400">Proyecto no encontrado</p>
      </div>
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Configuración del Proyecto
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 text-slate-400 hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <p className="text-slate-400">
          <span className="font-semibold text-white">
            {selectedProject.name}
          </span>{" "}
          - Gestiona los miembros y configuraciones
        </p>
        
        {/* DEBUG TEMPORAL - Eliminar después
        <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-md text-yellow-200 text-sm">
          <strong>DEBUG INFO (SIDEBAR):</strong><br/>
          Current User ID: {currentUser?.id || 'null'}<br/>
          Project Owner ID: {selectedProject?.owner_id || 'null'}<br/>
          Is Owner: {isOwner ? 'true' : 'false'}<br/>
          Current User: {currentUser?.username || 'N/A'}
        </div> */}
      </div>

      {/* Información del Proyecto */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Información del Proyecto
          </h3>
          {/* {isOwner && (
            <button
              onClick={() => setIsEditProjectModalOpen(true)}
              className="px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors"
            >
              Editar Proyecto
            </button>
          )} */}
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Nombre del Proyecto
              </label>
              <p className="text-white font-medium">{selectedProject.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Clave del Proyecto
              </label>
              <p className="text-white font-medium">{selectedProject.project_key}</p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Descripción
              </label>
              <p className="text-slate-300">
                {selectedProject.description || "Sin descripción"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Añadir Nuevo Miembro
          </h3>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
            <form onSubmit={handleSubmit(onAddMember)} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Correo electrónico del miembro
                </label>
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  placeholder="correo@ejemplo.com"
                  className="w-full rounded-md border-0 bg-white/5 p-3 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:ring-inset transition-all duration-200"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-md bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {isSubmitting
                    ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Añadiendo...
                      </span>
                    )
                    : (
                      "Añadir Miembro"
                    )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setAddMemberError("");
                    setAddMemberSuccess("");
                  }}
                  className="px-4 py-3 text-sm font-medium text-slate-300 hover:text-white border border-slate-600 rounded-md hover:bg-slate-700 transition-colors duration-200"
                >
                  Limpiar
                </button>
              </div>
            </form>

            {/* Mensajes de error y éxito */}
            {addMemberError && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-md">
                <p className="text-red-400 text-sm">{addMemberError}</p>
              </div>
            )}

            {addMemberSuccess && (
              <div className="mt-4 p-3 bg-green-900/30 border border-green-500/50 rounded-md">
                <p className="text-green-400 text-sm">{addMemberSuccess}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Miembros del Proyecto
        </h3>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 overflow-hidden">
          {members.length === 0
            ? (
              <div className="p-6 text-center">
                <p className="text-slate-400">
                  No hay miembros en este proyecto aún.
                </p>
              </div>
            )
            : (
              <ul className="divide-y divide-slate-700">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="p-4 hover:bg-slate-700/30 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {member.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {member.username}
                          </p>
                          <p className="text-sm text-slate-400">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {member.id === selectedProject.owner_id && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Dueño
                          </span>
                        )}

                        {isOwner && member.id !== currentUser?.id && (
                          <button
                            onClick={() => onRemoveMember(member.id)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md border border-red-500/30 hover:border-red-400/50 transition-all duration-200"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
        </div>
      </div>
      
      {/* Modal de Edición de Proyecto */}
      {selectedProject && (
        <EditProjectForm
          project={selectedProject}
          isOpen={isEditProjectModalOpen}
          onClose={() => setIsEditProjectModalOpen(false)}
        />
      )}
    </div>
  );
};
