import apiClient from "./index.api";
import type { User } from "../types/index.types";

//! Funcion para obtener los miembros de un proyecto
export const getProjectsMembers = async (
  projectId: string,
): Promise<User[]> => {
  const response = await apiClient.get<User[]>(
    `/projects/${projectId}/members`,
  );
  return response.data;
};

//! Funcion para agregar un miembro a un proyecto
export const addProjectMember = async (
  projectId: string,
  email: string,
): Promise<void> => {
  if (!projectId || projectId === "undefined" || projectId === "null") {
    throw new Error("Project ID is required and must be a valid string");
  }
  if (!email || email.trim() === "") {
    throw new Error("Email is required and must be a valid string");
  }

  await apiClient.post(`/projects/${projectId}/members`, { email });
};

//! Funcion para eliminar un miembro de un proyecto
export const removeProjectMember = async (
  projectId: string,
  memberId: string,
): Promise<void> => {
  if (!projectId || projectId === "undefined" || projectId === "null") {
    throw new Error("Project ID is required and must be a valid string");
  }
  if (!memberId || memberId === "undefined" || memberId === "null") {
    throw new Error("Member ID is required and must be a valid string");
  }

  await apiClient.delete(`/projects/${projectId}/members/${memberId}`);
};
