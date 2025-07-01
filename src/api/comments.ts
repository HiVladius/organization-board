import apiClient from "./index.api";
import type { Comment } from "../types/index.types";

export const createComment = async (
  taskId: string,
  content: string,
): Promise<Comment> => {
  if (!taskId || taskId === "undefined" || taskId === "null") {
    throw new Error("Task ID is required and must be a valid string");
  }

  const response = await apiClient.post<Comment>(`/tasks/${taskId}/comments`, {
    content,
  });
  return response.data;
};
