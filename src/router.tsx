import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/dashboard/page";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/auth/login/page";
import EmpresaPage from "./pages/administracion/empresa/page";
import EmpresaIdPage from "./pages/administracion/empresa/[id]/page";
import UsuarioPage from "./pages/administracion/usuario/page";
import UsuarioIdPage from "./pages/administracion/usuario/[id]/page";
import ConceptoPage from "./pages/administracion/conceptos/page";
import ConceptosIdPage from "./pages/administracion/conceptos/[id]/page";
import AfectacionesPage from "./pages/mantenedores/afectaciones/page";
import AfectactioneIdPage from "./pages/mantenedores/afectaciones/[id]/page";
import BanksPage from "./pages/mantenedores/banks/page";
import BankIdPage from "./pages/mantenedores/banks/[id]/page";
import MantenimientoConceptoIdPage from "./pages/administracion/mantenimientos/[id]/page";
import MantenimientoConceptoPage from "./pages/administracion/mantenimientos/page";
import GrupoConceptoPage from "./pages/mantenedores/grupo-afectacion/page";
import GrupoConceptoIdPage from "./pages/mantenedores/grupo-afectacion/[id]/page";
import DocumentoPage from "./pages/mantenedores/documents/page";
import DocumentosIdPage from "./pages/mantenedores/documents/[id]/page";
import ClientePage from "./pages/administracion/cliente/page";
import ClientesIdPage from "./pages/administracion/cliente/[id]/page";
import VentasPage from "./pages/ingresos-egresos/page";
import VentasIdPage from "./pages/ingresos-egresos/ventas/[id]/page";
import CategoriaPage from "./pages/mantenedores/categorias/page";
import CategoriasIdPage from "./pages/mantenedores/categorias/[id]/page";
import ProyectoPage from "./pages/mantenedores/proyectos/page";
import ProyectosIdPage from "./pages/mantenedores/proyectos/[id]/page";

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
        path: "/empresa",
        element: <EmpresaPage />,
      },
      {
        path: "/empresa/:id",
        element: <EmpresaIdPage />,
      },
      {
        path: "/usuario",
        element: <UsuarioPage />,
      },
      {
        path: "/usuario/:id",
        element: <UsuarioIdPage />,
      },
      {
        path: "/concepto",
        element: <ConceptoPage />,
      },
      {
        path: "/concepto/:id",
        element: <ConceptosIdPage />,
      },
      {
        path: "/afectacion",
        element: <AfectacionesPage />,
      },
      {
        path: "/afectacion/:id",
        element: <AfectactioneIdPage />,
      },
      {
        path: "/banco",
        element: <BanksPage />,
      },
      {
        path: "/banco/:id",
        element: <BankIdPage />,
      },
      {
        path: "/mantenimiento",
        element: <MantenimientoConceptoPage />,
      },
      {
        path: "/mantenimiento/:id",
        element: <MantenimientoConceptoIdPage />,
      },
      {
        path: "/grupo-concepto",
        element: <GrupoConceptoPage />,
      },
      {
        path: "/grupo-concepto/:id",
        element: <GrupoConceptoIdPage />,
      },
      {
        path: "/tipodocumento",
        element: <DocumentoPage />,
      },
      {
        path: "/tipodocumento/:id",
        element: <DocumentosIdPage />,
      },
      {
        path: "/cliente",
        element: <ClientePage />,
      },
      {
        path: "/cliente/:id",
        element: <ClientesIdPage />,
      },
      {
        path: "/venta",
        element: <VentasPage />,
      },
      {
        path: "/venta/:id",
        element: <VentasIdPage />,
      },
      {
        path: "/categoria",
        element: <CategoriaPage />,
      },
      {
        path: "/categoria/:id",
        element: <CategoriasIdPage />,
      },
      {
        path: "/proyecto",
        element: <ProyectoPage />,
      },
      {
        path: "/proyecto/:id",
        element: <ProyectosIdPage />,
      },
    ],
  },
]);
