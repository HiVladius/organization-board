import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../api/index";
import type { TLoginSchema } from "../lib/validators";

interface User {
  id: string;
  username: string;
  email: string;
}
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: TLoginSchema) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null, token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  // `persist` es un middleware de Zustand que guarda el estado en localStorage
  // para que la sesión del usuario no se pierda al recargar la página.
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Acción para establecer el usuario y el token
      setUser: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: !!user && !!token,
        });
      },

      // Acción de Login
      login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        const { user, token } = response.data;
        
        // Guardamos el token en localStorage para el interceptor de Axios
        localStorage.setItem('authToken', token);
        
        // Actualizamos el estado de la aplicación
        set({ user, token, isAuthenticated: true });
      },

      // Acción de Logout
      logout: () => {
        localStorage.removeItem('authToken');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // Nombre de la clave en localStorage
    }
  )
);