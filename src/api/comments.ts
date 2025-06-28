import apiClient from "./index.api";
import type { Comment } from "../types/index.types";

export const createComment = async (taskId: string,content: string): Promise<Comment> => {
  const response = await apiClient.post<Comment>(`/tasks/${taskId}/comments`, {content});
  return response.data;
};
