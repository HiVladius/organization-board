import { createBrowserRouter } from "react-router-dom";
import { LoginPages } from "../pages/LoginPages";
import { ProtectedRoute } from "./ProtectedRoute";
import { ProjectPage } from "../pages/ProjectsPage";
import { ProjectBoardPage } from "../pages/ProjectBoardPage";
// import { ProjectSettingsPage } from "@/pages/ProjectSettingsPage"; // Ya no es necesario como página separada
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
      // Ya no necesitamos esta ruta porque ahora es un sidebar
      // {
      //   path: "/project/:projectId/settings",
      //   element: <ProjectSettingsPage />,
      // }
    ],
  },
]);
