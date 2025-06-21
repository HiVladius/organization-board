import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth_store";
import { AppLayout } from "../components/layout/AppLayout";

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (      
            
        <AppLayout />
    );
};
