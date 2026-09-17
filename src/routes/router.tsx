import { createBrowserRouter } from "react-router";
import App from "../App";
import Login from "../features/auth/pages/Login";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import E404 from "@/features/E404";
import Students from "@/features/students/pages/Students";
import Sidebar from "@/components/layout/Sidebar";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "login",
                element: <Login />,
                index: true
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