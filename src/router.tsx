import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/dashboard/page"
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/auth/login/page";
import ClientePage from "./pages/clients/page";
import ClienteIdPage from "./pages/clients/[id]/page";
import ProveedorePage from "./pages/proveedores/page";
import ProveedorIdPage from "./pages/proveedores/[id]/page";
import CotizacionesPage from "./pages/cotizaciones/page";
import CotizacionesIdPage from "./pages/cotizaciones/[id]/page";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      
    ],
  },
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path:"/fondo-pension" ,
        element: <ClientePage />,
      },
      {
        path:"/fondo-pension/:id" ,
        element: <ClienteIdPage />,
      },
      {
        path:"/proveedor" ,
        element: <ProveedorePage />,
      },
      {
        path:"/proveedor/:id" ,
        element: <ProveedorIdPage />,
      },
      {
        path:"/cotizaciones" ,
        element: <CotizacionesPage />,
      },
      {
        path:"/cotizaciones/:id" ,
        element: <CotizacionesIdPage />,
      }
    ],
  },
]);
