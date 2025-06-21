import { createBrowserRouter } from "react-router-dom";
import { LoginPages } from "../pages/LoginPages";
import { ProtectedRoute } from "./ProtectedRoute";
import { ProjectPage } from "../pages/ProjectsPage";


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
                index: true,
                element: <ProjectPage />
            }
        ]
    }
])