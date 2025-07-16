import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPages } from "../pages/LoginPages";
import { AuthGuard } from "./AuthGuard";
import { AppLayout } from "../components/layout/AppLayout";
import { ProjectPage } from "../pages/ProjectsPage";
import { ProjectBoardPage } from "../pages/ProjectBoardPage";
import { UserProfilePage } from "../pages/UserProfilePage";
// import { ProjectSettingsPage } from "@/pages/ProjectSettingsPage"; // Ya no es necesario como página separada
// import { Testpage } from "../pages/test.page";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AuthGuard requireAuth={false}>
        <LoginPages />
      </AuthGuard>
    ),
  },
  {
    path: "/",
    element: (
      <AuthGuard requireAuth={true}>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/board" replace />,
      },
      {
        path: "/board",
        element: <ProjectPage />,
      },
      {
        path: "/project/:projectId",
        element: <ProjectBoardPage />,
      },
      {
        path: "/profile",
        element: <UserProfilePage />,
      },
    ],
  },
]);
