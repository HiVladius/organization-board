import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../api/index.api";
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
  isInitialized: boolean; // Nueva propiedad para saber si el estado inicial ya se cargó
  login: (credentials: TLoginSchema) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null, token: string | null) => void;
  initialize: () => void; // Nueva función para inicializar el estado
}

export const useAuthStore = create<AuthState>()(
  // `persist` es un middleware de Zustand que guarda el estado en localStorage
  // para que la sesión del usuario no se pierda al recargar la página.
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,

      // Acción para inicializar el estado (útil para verificar tokens al cargar la app)
      initialize: () => {
        set({ isInitialized: true });
      },

      // Acción para establecer el usuario y el token
      setUser: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: !!user && !!token,
          isInitialized: true,
        });
      },

      // Acción de Login
      login: async (credentials) => {
        const response = await apiClient.post("/auth/login", credentials);
        const { user, token } = response.data;

        // Normalizar el ID del usuario para compatibilidad con MongoDB
        let normalizedUserId = user.id;
        if (user._id) {
          if (typeof user._id === "object") {
            if (user._id.$oid) {
              normalizedUserId = user._id.$oid;
            } else if (user._id.toString) {
              normalizedUserId = user._id.toString();
            } else {
              normalizedUserId = String(user._id);
            }
          } else if (typeof user._id === "string") {
            normalizedUserId = user._id;
          } else {
            normalizedUserId = String(user._id);
          }
        }

        // Asegurar que siempre sea un string
        normalizedUserId = String(normalizedUserId);

        const normalizedUser = {
          ...user,
          id: normalizedUserId,
        };

        console.log("DEBUG Login - Original user:", user);
        console.log("DEBUG Login - Normalized user:", normalizedUser);

        // Guardamos el token en localStorage para el interceptor de Axios
        localStorage.setItem("authToken", token);

        // Actualizamos el estado de la aplicación
        set({ user: normalizedUser, token, isAuthenticated: true, isInitialized: true });
      },

      // Acción de Logout
      logout: () => {
        localStorage.removeItem("authToken");
        set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
      },
    }),
    {
      name: "auth-storage", // Nombre de la clave en localStorage
    },
  ),
);
