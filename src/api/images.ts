import apiClient from "./index.api";
import type { Images } from "@/types/index.types";

// Funciones utilitarias para validaciones
const validateId = (id: string, fieldName: string): void => {
  if (!id || id === "undefined" || id === "null" || id.trim() === "") {
    throw new Error(`${fieldName} is required and must be a valid string`);
  }
};

const validateFile = (file: File): void => {
  if (!file) {
    throw new Error("File is required");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  const maxSize = 10 * 1024 * 1024; // 10 MB
  if (file.size > maxSize) {
    throw new Error("File size must be less than 10 MB");
  }
};

// Función para construir URL con query parameters
const buildUrlWithParams = (
  baseUrl: string,
  params: Record<string, string | undefined>
): string => {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) urlParams.append(key, value);
  });

  return urlParams.toString() ? `${baseUrl}?${urlParams.toString()}` : baseUrl;
};

// Funciones principales de la API
export const uploadImage = async (
  file: File,
  projectId?: string,
  taskId?: string
): Promise<Images> => {
  validateFile(file);

  const formData = new FormData();
  formData.append("file", file);

  const url = buildUrlWithParams("/images", {
    project_id: projectId,
    task_id: taskId,
  });

  const response = await apiClient.post<Images>(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getImageById = async (imageId: string): Promise<Images> => {
  validateId(imageId, "Image ID");

  const response = await apiClient.get<Images>(`/images/${imageId}`);
  return response.data;
};

export const downloadImage = async (imageId: string): Promise<Blob> => {
  validateId(imageId, "Image ID");

  const response = await apiClient.get(`/images/${imageId}/download`, {
    responseType: "blob",
  });
  return response.data;
};

export const updateImageMetadata = async (
  imageId: string,
  update: {
    filename?: string;
    project_id?: string;
    task_id?: string;
  }
): Promise<Images> => {
  validateId(imageId, "Image ID");

  const response = await apiClient.patch<Images>(`/images/${imageId}`, update);
  return response.data;
};

export const deleteImage = async (imageId: string): Promise<void> => {
  validateId(imageId, "Image ID");

  await apiClient.delete(`/images/${imageId}`);
};

export const getProjectImages = async (projectId: string): Promise<Images[]> => {
  validateId(projectId, "Project ID");

  const response = await apiClient.get<Images[]>(`/projects/${projectId}/images`);
  return response.data;
};

export const getTaskImages = async (taskId: string): Promise<Images[]> => {
  validateId(taskId, "Task ID");

  const response = await apiClient.get<Images[]>(`/tasks/${taskId}/images`);
  return response.data;
};

export const getUserImages = async (): Promise<Images[]> => {
  const response = await apiClient.get<Images[]>("/images");
  return response.data;
};

// Función de validación mejorada y más completa
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  if (!file) {
    return { isValid: false, error: "No file provided" };
  }

  if (!file.type.startsWith("image/")) {
    return { isValid: false, error: "Only image files are allowed" };
  }

  const maxSize = 10 * 1024 * 1024; // 10 MB
  if (file.size > maxSize) {
    return { isValid: false, error: "File size must be less than 10 MB" };
  }

  const supportedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (!supportedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Unsupported image type. Supported types are: ${supportedTypes.join(", ")}`,
    };
  }

  return { isValid: true };
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};