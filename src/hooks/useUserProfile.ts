import { useCallback, useState } from "react";
import { useAuthStore } from "../store/auth_store";
import {
  deleteUserAvatar,
  updateUserAvatar,
  updateUserProfile,
} from "../api/user";
import type { UpdateUserProfileRequest } from "../api/user";

export const useUserProfile = () => {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(async (data: UpdateUserProfileRequest) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await updateUserProfile(data);
      setUser(updatedUser, localStorage.getItem("token"));
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : "Error al actualizar el perfil";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, setUser]);

  const updateAvatar = useCallback(async (avatar: string) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await updateUserAvatar({ avatar });
      setUser(updatedUser, localStorage.getItem("token"));
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : "Error al actualizar el avatar";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, setUser]);

  const removeAvatar = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await deleteUserAvatar();
      setUser(updatedUser, localStorage.getItem("token"));
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : "Error al eliminar el avatar";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, setUser]);



  const validateImageFile = useCallback(
    (file: File): { isValid: boolean; error?: string } => {
      // Validar tipo de archivo
      const allowedTypes = [
        "image/png",
        "image/gif",
        "image/jpeg",
        "image/jpg",
      ];
      if (!allowedTypes.includes(file.type)) {
        return {
          isValid: false,
          error: "Por favor, selecciona un archivo PNG, JPG, JPEG o GIF",
        };
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return {
          isValid: false,
          error: "El archivo es demasiado grande. Máximo 5MB",
        };
      }

      return { isValid: true };
    },
    [],
  );

  const processImageFile = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        reject(new Error(validation.error));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.onerror = () => {
        reject(new Error("Error al procesar el archivo"));
      };
      reader.readAsDataURL(file);
    });
  }, [validateImageFile]);

  return {
    user,
    isLoading,
    error,
    updateProfile,
    updateAvatar,
    removeAvatar,
    validateImageFile,
    processImageFile,
    clearError: () => setError(null),
  };
};
