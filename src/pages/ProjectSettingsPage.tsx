import { addMemberSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { type TAddMemberSchema } from "../lib/validators";
import { useProjectStore } from "@/store/project.store";
import { useAuthStore } from "@/store/auth_store";
import { SkeletonSpinner } from "@/components/ui/Skeleton";

export const ProjectSettingsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
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
  const [showAddMemberForm, setShowAddMemberForm] = useState<boolean>(false);

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

  // Debug: Vamos a imprimir los valores para ver qué está pasando
  console.log("DEBUG - Current User:", currentUser);
  console.log("DEBUG - Selected Project:", selectedProject);
  console.log("DEBUG - Current User ID:", currentUser?.id);
  console.log("DEBUG - Project Owner ID:", selectedProject?.owner_id);
  console.log("DEBUG - Is Owner?:", isOwner);
  console.log("DEBUG - Type of Current User ID:", typeof currentUser?.id);
  console.log("DEBUG - Type of Project Owner ID:", typeof selectedProject?.owner_id);

  if (isLoading) return <SkeletonSpinner text="Cargando configuración del proyecto..." />;

  if (error) return <p className="text-red-400">Error: {error}</p>;

  if (!selectedProject) {
    return <p className="text-white">Proyecto no encontrado</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Configuración del Proyecto: {selectedProject.name}
          </h1>
          <p className="text-slate-400 mt-2">
            Gestion de miembros y configuraciones de proyecto
          </p>
          
          {/* DEBUG TEMPORAL - Eliminar después */}
          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-md text-yellow-200 text-sm">
            <strong>DEBUG INFO:</strong><br/>
            Current User ID: {currentUser?.id || 'null'}<br/>
            Project Owner ID: {selectedProject?.owner_id || 'null'}<br/>
            Is Owner: {isOwner ? 'true' : 'false'}<br/>
            Current User: {currentUser?.username || 'N/A'}
          </div>
        </div>

        {isOwner && (
          <div className="mt-8 max-w-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Gestión de Miembros
              </h2>
              <button
                onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showAddMemberForm ? "rotate-45" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                {showAddMemberForm ? "Cancelar" : "Añadir Miembro"}
              </button>
            </div>
          </div>
        )}

        {/* Formulario para añadir miembro */}

        {showAddMemberForm && (
          <div
            id="add-member-form"
            className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700 mt-4 animate-in slide-in-from-top-2 fade-in duration-300"
          >
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
        )}

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Miembros del Proyecto
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {members.length} {members.length === 1 ? "miembro" : "miembros"}
                {" "}
                en total
              </p>
            </div>

            {isOwner && (
              <button
                onClick={() => setShowAddMemberForm(true)}
                className="inline-flex items-center gap-2 rounded-md bg-slate-700 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-600 border border-slate-600 hover:border-slate-500 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Añadir Miembro
              </button>
            )}
          </div>

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
      </div>
    </div>
  );
};
