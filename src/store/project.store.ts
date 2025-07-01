import { create } from "zustand";
import {
  createProject,
  type CreateProjectPayload,
  getProjects,
} from "@/api/projects";

import type { Project, User } from "@/types/index.types";
import {
  getProjectsMembers,
  addProjectMember,
  removeProjectMember,
} from "@/api/members";
import { normalizeId } from "@/helpers/normalizedId";
interface ProjectState {
  projects: Project[];
  selectedProject: Project | null; // Agregar estado para el proyecto seleccionado
  members: User[]; // Agregar estado para los miembros del proyecto
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createNewProject: (data: CreateProjectPayload) => Promise<void>;
  fetchProjectById: (projectId: string) => Promise<void>;
  fetchMembers: (projectId: string) => Promise<void>;
  addMembers: (projectId: string, email: string) => Promise<void>;
  removeMember: (projectId: string, memberId: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProject: null, // Agregar estado para el proyecto seleccionado
  members: [], // Agregar estado para los miembros del proyecto
  isLoading: false,
  error: null,

  fetchProjectById: async (projectId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Primero intentar encontrar el proyecto en el estado local
      let project = get().projects.find((p) => p.id === projectId);
      
      // Si no se encuentra localmente, cargar todos los proyectos
      if (!project) {
        const rawProjects = await getProjects();
        console.log("Raw projects from API:", rawProjects);

        // Mapear _id a id para compatibilidad con MongoDB
        const projectsWithId = rawProjects.map((p: any) => {
          let normalizedProjectId = p.id;

          // Manejar diferentes formatos de ID de MongoDB
          if (p._id) {
            if (typeof p._id === "object") {
              if (p._id.$oid) {
                normalizedProjectId = p._id.$oid;
              } else if (p._id.toString) {
                normalizedProjectId = p._id.toString();
              } else {
                normalizedProjectId = String(p._id);
              }
            } else if (typeof p._id === "string") {
              normalizedProjectId = p._id;
            } else {
              normalizedProjectId = String(p._id);
            }
          }

          // Asegurar que siempre sea un string
          normalizedProjectId = String(normalizedProjectId);

          return {
            ...p,
            id: normalizedProjectId,
          };
        });

        // Actualizar el estado con todos los proyectos
        set({ projects: projectsWithId });
        
        // Buscar el proyecto específico en la lista actualizada
        project = projectsWithId.find((p) => p.id === projectId);
      }
      
      set({ selectedProject: project || null, isLoading: false });
    } catch (error) {
      console.error("Fallo al obtener el proyecto:", error);
      set({
        error: "No se puede cargar el proyecto",
        selectedProject: null,
        isLoading: false,
      });
    }
  },

  fetchMembers: async (projectId) => {
    set({ isLoading: true, error: null });

    try {
      const rawMembers = await getProjectsMembers(projectId);
      const membersWithId = rawMembers.map((members) => ({
        ...members,
        id: normalizeId(members), // Normalizar el ID de MongoDB
      }));

      set({ members: membersWithId, isLoading: false });
    } catch (error) {
      console.error("Fallo al obtener los miembros del proyecto:", error);
      set({
        error: "No se pueden cargar los miembros del proyecto",
        isLoading: false,
      });
    }
  },

  addMembers: async (projectId, email) => {
    try {
      await addProjectMember(projectId, email);
      await get().fetchMembers(projectId); // Refrescar la lista de miembros
    } catch (error) {
      console.error("Fallo al agregar el miembro al proyecto:", error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  },

  removeMember: async (projectId, email) => {
    try {
      await removeProjectMember(projectId, email);
      set((state) => ({
        members: state.members.filter((member) => member.id !== email), // Filtrar el miembro eliminado
      }));
    } catch (error) {
      console.error("Fallo al eliminar el miembro del proyecto:", error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  },

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const project = await getProjects();
      console.log("Raw projects from API:", project);

      // Mapear _id a id para compatibilidad con MongoDB
      const projectsWithId = project.map((p: any) => {
        let projectId = p.id;

        // Manejar diferentes formatos de ID de MongoDB
        if (p._id) {
          if (typeof p._id === "object") {
            // Si es un objeto de MongoDB ObjectId
            if (p._id.$oid) {
              projectId = p._id.$oid;
            } else if (p._id.toString) {
              projectId = p._id.toString();
            } else {
              projectId = String(p._id);
            }
          } else if (typeof p._id === "string") {
            projectId = p._id;
          } else {
            projectId = String(p._id);
          }
        }

        // Asegurar que siempre sea un string
        projectId = String(projectId);

        const mappedProject = {
          ...p,
          id: projectId,
        };

        console.log(
          "Original _id:",
          p._id,
          "Mapped ID:",
          mappedProject.id,
          "Type:",
          typeof mappedProject.id
        );
        return mappedProject;
      });

      set({ projects: projectsWithId, isLoading: false });
    } catch (error) {
      console.error("Fallo al obtener los proyectos:", error);
      set({ error: "No se pueden cargar los proyectos", isLoading: false });
    }
  },
  createNewProject: async (data) => {
    try {
      const newProject = await createProject(data);
      console.log("New project from API:", newProject);

      // Mapear _id a id para compatibilidad con MongoDB
      let projectId = newProject.id;

      if ((newProject as any)._id) {
        const _id = (newProject as any)._id;
        if (typeof _id === "object") {
          if (_id.$oid) {
            projectId = _id.$oid;
          } else if (_id.toString) {
            projectId = _id.toString();
          } else {
            projectId = String(_id);
          }
        } else {
          projectId = String(_id);
        }
      }

      const projectWithId = {
        ...newProject,
        id: projectId,
      };

      console.log("Mapped new project ID:", projectWithId.id);
      set({ projects: [...get().projects, projectWithId] });
    } catch (error) {
      console.error("Fallo al crear el proyecto:", error);
      throw error;
    }
  },
}));
