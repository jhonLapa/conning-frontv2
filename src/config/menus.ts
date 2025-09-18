import { MenuItemProps } from "@/interfaces/menu-Interface";
import {
  Banknote,
  BarChart,
  BuildingIcon,
  ChartLineIcon,
  ClipboardListIcon,
  ClipboardPen,
  FileSpreadsheet,
  HandCoinsIcon,
  HandshakeIcon,
  IdCard,
  LandmarkIcon,
  LayoutDashboardIcon,
  LayoutGrid,
  Navigation,
  Package,
  ReceiptTextIcon,
  Settings2Icon,
  TreePalmIcon,
  User2Icon,
  UserCogIcon,
} from "lucide-react";


export interface MenuConfigProps {
  mainNav: MenuItemProps[];
  sidebarNav: {
    modern: MenuItemProps[];
  };
}

export const menusConfig = (): MenuConfigProps =>  {

  const menus: MenuConfigProps = {
    mainNav: [
      {
        title: "Dashboard",
        icon: LayoutDashboardIcon,
        href: "/",
      },
    ],
    sidebarNav: {
      modern:
       [
        {
          title: "Inicio",
          icon: LayoutGrid,
          href: "/",
          rol: "Todos",
        },
        {
          title: "Administración",
          icon: UserCogIcon,
          rol: "Todos",
          child:[
            {
              title: "Empresas",
              icon: BuildingIcon,
              href: "/empresa",
              rol: "Todos",
            },
            {
              title: "Usuarios",
              icon: User2Icon,
              href: "/usuario",
              rol: "Todos",
            },
            {
              title: "Conceptos",
              icon: ClipboardPen,
              href: "/concepto",
              rol: "Todos",
            },
          ]
        },
        {
          title: "Trabajadores",
          icon: HandshakeIcon,
          rol: "Todos",
          child:[
            {
              title: "Trabajadores",
              icon: IdCard,
              href: "/trabajador",
              rol: "Todos",
            },
            {
              title: "Sueldo",
              icon: Banknote,
              href: "/sueldo",
              rol: "Todos",
            },
            {
              title: "Vacaciones",
              icon: TreePalmIcon,
              href: "/vacaciones",
              rol: "Todos",
            },
            {
              title: "Gratificaciones",
              icon: HandCoinsIcon,
              href: "/gratificacion",
              rol: "Todos",
            },
            {
              title: "C.T.S.",
              icon: LandmarkIcon,
              href: "/cts",
              rol: "Todos",
            },
          ]
        },
        {
          title: "Procesos de Planillas",
          icon: BarChart,
          rol: "Todos",
          child:[
            {
              title: "Planilla",
              icon: ClipboardListIcon,
              href: "/planilla",
              rol: "Todos",
            },
            {
              title: "Boleta de Pago",
              icon: ReceiptTextIcon,
              href: "/boleta",
              rol: "Todos",
            },
            {
              title: "Reporte",
              icon: ChartLineIcon,
              href: "/boleta",
              rol: "Todos",
            },
          ]
        },
        {
          title: "Configuracion",
          icon: Settings2Icon,
          rol: "Todos",
          child:[
            {
              title: "Fondos de Pensiones",
              icon: FileSpreadsheet,
              href: "/fondo-pension",
              rol: "Todos",
            },
            {
              title: "Categoria",
              icon: Package,
              href: "/opcion-despacho",
              rol: "Todos",
            },
            {
              title: "Bancos",
              icon: Navigation,
              href: "/guiado",
              rol: "Todos",
            }
          ]
        },
        
       ]
    }
  }

  return menus
};

