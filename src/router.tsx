import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/dashboard/page"
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/auth/login/page";
import EmpresaPage from "./pages/administracion/empresa/page";
import EmpresaIdPage from "./pages/administracion/empresa/[id]/page";
import UsuarioPage from "./pages/administracion/usuario/page";
import UsuarioIdPage from "./pages/administracion/usuario/[id]/page";
import ConceptoPage from "./pages/administracion/conceptos/page";
import ConceptosIdPage from "./pages/administracion/conceptos/[id]/page";

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
        path:"/empresa" ,
        element: <EmpresaPage />,
      },
      {
        path:"/empresa/:id" ,
        element: <EmpresaIdPage />,
      },
      {
        path:"/usuario" ,
        element: <UsuarioPage />,
      },
      {
        path:"/usuario/:id" ,
        element: <UsuarioIdPage />,
      },
      {
        path:"/concepto" ,
        element: <ConceptoPage />,
      },
      {
        path:"/concepto/:id" ,
        element: <ConceptosIdPage />,
      },
      
    ],
  },
]);
