import { useState } from "react";

interface UseLoadingStateOptions {
  initialState?: boolean;
}

export const useLoadingState = (options: UseLoadingStateOptions = {}) => {
  const { initialState = false } = options;
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState<string | null>(null);

  const startLoading = () => {
    setIsLoading(true);
    setError(null);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const setErrorState = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  const executeWithLoading = async <T>(
    asyncFunction: () => Promise<T>,
    onError?: (error: any) => string
  ): Promise<T | null> => {
    try {
      startLoading();
      const result = await asyncFunction();
      stopLoading();
      return result;
    } catch (error) {
      const errorMessage = onError ? onError(error) : "Ocurrió un error";
      setErrorState(errorMessage);
      return null;
    }
  };

  // Auto clear error after timeout
  const clearError = () => setError(null);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setErrorState,
    executeWithLoading,
    clearError,
  };
};
