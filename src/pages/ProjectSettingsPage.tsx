import { addMemberSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { type TAddMemberSchema } from "../lib/validators";
import { useProjectStore } from "@/store/project.store";
import { useAuthStore } from "@/store/auth_store";

export const ProjectSettingsPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const {user: currentUser} = useAuthStore();
    const {selectedProject, members, addMembers, fetchProjectById, fetchMembers, removeMember, isLoading, error} = useProjectStore();
    const {register, handleSubmit, reset, formState: {isSubmitting}} = useForm<TAddMemberSchema>({resolver: zodResolver(addMemberSchema)});

    useEffect(() => {
      if(projectId){
        fetchProjectById(projectId);
        fetchMembers(projectId);
      }   
      
    }, [projectId, fetchProjectById, fetchMembers]);


    const onAddMember = async (data: TAddMemberSchema) => {
        if(!projectId) return; 

        try {
            await addMembers(projectId, data.email);
            reset(); // Limpia el formulario después de enviar
        } catch (error) {
            alert("Error al agregar el miembro al proyecto. Puede que el usuario no exista o ya sea miembro del proyecto.");
        }
    }
    
    const onRemoveMember = async (memberId: string ) => {
        if(!projectId || !window.confirm("¿Estás seguro de que quieres eliminar este miembro del proyecto?")) return;

        try {
            await removeMember(projectId, memberId);
        } catch (error) {
            alert("Error al eliminar al miembro")
        }
    }

    const isOwner = currentUser?.id === selectedProject?.owner_id;

    if (isLoading) return <p className="text-white">Cargando...</p>;
    
    if (error) return <p className="text-red-400">Error: {error}</p>;
    
    if (!selectedProject) return <p className="text-white">Proyecto no encontrado</p>;


    return (
    <div>
      <h1 className="text-3xl font-bold text-white">Ajustes de: {selectedProject.name}</h1>
      
      {isOwner && (
        <div className="mt-8 max-w-xl">
          <h2 className="text-xl font-semibold text-white">Añadir Nuevo Miembro</h2>
          <form onSubmit={handleSubmit(onAddMember)} className="mt-4 flex gap-2">
            <input
              {...register('email')}
              type="email"
              placeholder="correo@ejemplo.com"
              className="flex-grow rounded-md border-0 bg-white/5 p-2 text-white ring-1 ring-inset ring-white/10"
            />
            <button type="submit" disabled={isSubmitting} className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold hover:bg-cyan-500 disabled:opacity-50">
              {isSubmitting ? 'Añadiendo...' : 'Añadir'}
            </button>
          </form>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white">Miembros del Proyecto</h2>
        <ul className="mt-4 max-w-xl divide-y divide-slate-700">
          {members.map(member => (
            <li key={member.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-white">{member.username}</p>
                <p className="text-sm text-slate-400">{member.email}</p>
              </div>
              {isOwner && member.id !== currentUser?.id && (
                <button onClick={() => onRemoveMember(member.id)} className="text-sm font-semibold text-red-500 hover:text-red-400">
                  Eliminar
                </button>
              )}
              {member.id === selectedProject.owner_id && (
                <span className="rounded-full bg-slate-700 px-2 py-1 text-xs font-medium text-slate-300">Dueño</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
);
};
