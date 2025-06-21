import { create } from "zustand";
import { getProjects, createProject, type CreateProjectPayload } from "../api/projects";
import type { Project } from '../types/index.types';


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
            set({ projects: project, isLoading: false });
        } catch (error) {
            console.error("Fallo al obtener los proyectos:", error);
            set({error: 'No se pueden cargar los proyectos', isLoading: false});
            
        }
    },

    createNewProject: async (data) => {
        try {
            const newProject = await createProject(data);

            set({projects: [...get().projects, newProject]} )
        } catch (error) {
            console.error("Fallo al crear el proyecto:", error);
            throw error;
        }
    }


}))