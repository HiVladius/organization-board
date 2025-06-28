import apiClient from "./index.api";
import type { Project } from "../types/index.types";

export type CreateProjectPayload = {
  name: string;
  key: string;
  description?: string;
};

export const getProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get("/projects");
  return response.data;
};

export const createProject = async (
  data: CreateProjectPayload,
): Promise<Project> => {
  const response = await apiClient.post("/projects", data);
  return response.data;
};
