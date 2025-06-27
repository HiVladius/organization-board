import { create } from "zustand";
import {
  getProjects,
  createProject,
  type CreateProjectPayload,
} from "../api/projects";
import type { Project } from "../types/index.types";

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createNewProject: (data: CreateProjectPayload) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,
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
