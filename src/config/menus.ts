import { MenuItemProps } from "@/interfaces/menu-Interface";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCog,
  FileSpreadsheet,
  ClipboardList,
  BarChart3,
  Handshake,
  UserCircle2,
  CreditCard,
  Receipt,
  Briefcase,
  Landmark,
  Settings,
  ArrowLeftRight,
  TreePalm,
  HandCoins,
  Banknote,
  FolderKanban,
  IdCard,
  UserCogIcon,
  ClipboardListIcon,
} from "lucide-react";

export interface MenuConfigProps {
  mainNav: MenuItemProps[];
  sidebarNav: {
    modern: MenuItemProps[];
  };
}

export const menusConfig = (): MenuConfigProps => {
  const menus: MenuConfigProps = {
    mainNav: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
      },
    ],
    sidebarNav: {
      modern: [
        {
          title: "Inicio",
          icon: LayoutDashboard,
          href: "/",
          rol: "Todos",
        },

        {
          title: "Administración",
          icon: UserCog,
          rol: "Todos",
          child: [
            {
              title: "Empresas",
              icon: Building2,
              href: "/empresa",
              rol: "Todos",
            },
            {
              title: "Usuarios",
              icon: UserCircle2,
              href: "/usuario",
              rol: "Todos",
            },
            {
              title: "Clientes",
              icon: Users,
              href: "/cliente",
              rol: "Todos",
            },
            {
              title: "Roles",
              icon: Briefcase,
              href: "/rol",
              rol: "Todos",
            },
            {
              title: "Proyectos",
              icon: FolderKanban,
              href: "/proyecto",
              rol: "Todos",
            },
            {
              title: "Proveedor",
              icon: UserCogIcon,
              href: "/proveedor",
              rol: "Todos",
            },
            // {
            //   title: "Conceptos",
            //   icon: ClipboardPen,
            //   href: "/concepto",
            //   rol: "Todos",
            // },
            // {
            //   title: "Mantenimiento",
            //   icon: Keyboard,
            //   href: "/mantenimiento",
            //   rol: "Todos",
            // },
          ],
        },

        {
          title: "Trabajadores",
          icon: Handshake,
          rol: "Todos",
          child: [
            {
              title: "Listado",
              icon: IdCard,
              href: "/trabajador",
              rol: "Todos",
            },
            {
              title: "Sueldos",
              icon: Banknote,
              href: "/sueldo",
              rol: "Todos",
            },
            {
              title: "Vacaciones",
              icon: TreePalm,
              href: "/vacaciones",
              rol: "Todos",
            },
            {
              title: "Gratificaciones",
              icon: HandCoins,
              href: "/gratificacion",
              rol: "Todos",
            },
            {
              title: "C.T.S.",
              icon: Landmark,
              href: "/cts",
              rol: "Todos",
            },
          ],
        },

        {
          title: "Ingresos y Egresos",
          icon: BarChart3,
          rol: "Todos",
          child: [
            {
              title: "Planillas",
              icon: ClipboardList,
              href: "/planilla",
              rol: "Todos",
            },
            {
              title: "Ventas",
              icon: Receipt,
              href: "/venta",
              rol: "Todos",
            },
            {
              title: "Cobranzas",
              icon: CreditCard,
              href: "/cobranza",
              rol: "Todos",
            },
            {
              title: "Movimientos Especiales",
              icon: ArrowLeftRight,
              href: "/movimientoespecial",
              rol: "Todos",
            },
          ],
        },

        {
          title: "Configuración",
          icon: Settings,
          rol: "Todos",
          child: [
            {
              title: "Bancos",
              icon: Landmark,
              href: "/banco",
              rol: "Todos",
            },
            {
              title: "Tipos de Documentos",
              icon: FileSpreadsheet,
              href: "/tipodocumento",
              rol: "Todos",
            },
            {
              title: "Tipos de Comprobantes",
              icon: Receipt,
              href: "/tipocomprobante",
              rol: "Todos",
            },
            {
              title: "Categorías",
              icon: FolderKanban,
              href: "/categoria",
            },
            {
              title: "Menus",
              icon: ClipboardListIcon,
              href: "/menu",
              rol: "Todos",
            },
          ],
        },
      ],
    },
  };

  return menus;
};
