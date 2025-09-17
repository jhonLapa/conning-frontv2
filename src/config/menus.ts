import { MenuItemProps } from "@/interfaces/menu-Interface";
import {
  BarChart,
  BarChart3,
  Briefcase,
  ClipboardCheck,
  FileSpreadsheet,
  FileText,
  LayoutDashboardIcon,
  LayoutGrid,
  Navigation,
  Package,
  PieChart,
  Settings2Icon,
  ShoppingCart,
  Truck,
  User,
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
          title: "Gestión Trabajadores",
          icon: Briefcase,
          rol: "Todos",
          child:[
              {
                title: "Trabajadores",
                icon: User,
                href: "/cliente",
                rol: "Todos",
              },
              {
                title: "Proveedores",
                icon: Truck,
                href: "/proveedor",
                rol: "Todos",
              },
              {
                title: "Cotizaciones",
                icon: FileText,
                href: "/cotizaciones",
                rol: "Todos",
              },
              {
                title: "Orden de compra",
                icon: ShoppingCart,
                href: "/orden-compra",
                rol: "Todos",
              },
              {
                title: "Nota de ingreso",
                icon: ClipboardCheck,
                href: "/nota-ingreso",
                rol: "Todos",
              }
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
        {
          title: "Reportes",
          icon: BarChart,
          rol: "Todos",
          child:[
            {
              title: "Reporte valorizado",
              icon: BarChart3,
              href: "/reporte-valorizado",
              rol: "Todos",
            },
            
            {
              title: "Reportes",
              icon: PieChart,
              href: "/reportes",
              rol: "Todos",
            },
          ]
        },
        
       ]
    }
  }

  return menus
};

