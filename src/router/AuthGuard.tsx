import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth_store";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true para rutas protegidas, false para rutas públicas (como login)
}

export const AuthGuard = ({ children, requireAuth = false }: AuthGuardProps) => {
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Inicializar el estado de auth si aún no se ha hecho
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  // Mientras se inicializa el estado de autenticación
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  // Para rutas que requieren autenticación (como /board, /project/:id)
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Para rutas públicas (como /login) cuando el usuario ya está autenticado
  if (!requireAuth && isAuthenticated) {
    // Si viene de una ruta específica, volver ahí, sino ir a /board
    const from = location.state?.from?.pathname || "/board";
    return <Navigate to={from} replace />;
  }

  // En todos los demás casos, mostrar el contenido
  return <>{children}</>;
};
