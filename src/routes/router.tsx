import { createBrowserRouter, Navigate } from "react-router";
import App from "../App";
import Login from "../features/auth/pages/Login";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import E404 from "@/features/E404";
import Students from "@/features/students/pages/Students";
import UploadPage from "@/features/upload/pages/UploadPage";
import Sidebar from "@/components/layout/Sidebar";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Navigate to="/login" replace />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                element: <Sidebar />,
                children: [
                    {
                        path: "dashboard",
                        element: <Dashboard />
                    },
                    {
                        path: "students",
                        element: <Students />
                    },
                    {
                        path: "upload",
                        element: <UploadPage />
                    },
                    {
                        path: "grades",
                        element: <Navigate to="/upload" replace />
                    },
                    {
                        path: "dashboard/activity",
                        element: <Navigate to="/upload" replace />
                    },
                    {
                        path: "dashboard/projects",
                        element: <Navigate to="/upload?tab=upload" replace />
                    }
                ]
            },
            {
                path: "*",
                element: <E404 />
            }
        ]
    }
]);