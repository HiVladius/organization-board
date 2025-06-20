import { createBrowserRouter } from "react-router-dom";
import { LoginPages } from "../pages/LoginPages";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardPage } from "../pages/DashboardPage";


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPages />,
    },
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                index: false,
                element: <DashboardPage />
            }
        ]
    }
])