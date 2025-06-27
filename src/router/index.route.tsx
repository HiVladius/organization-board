import { createBrowserRouter } from "react-router-dom";
import { LoginPages } from "../pages/LoginPages";
import { ProtectedRoute } from "./ProtectedRoute";
import { ProjectPage } from "../pages/ProjectsPage";
import { ProjectBoardPage } from "../pages/ProjectBoardPage";
// import { Testpage } from "../pages/test.page";

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
                element: <ProjectPage />,
            },
            {
                path: "/project/:projectId",
                element: <ProjectBoardPage />,
            },
            // {
            //     path: "/test",
            //     element: <Testpage />,
            // },
        ],
    },
]);
