import { MenuItemProps } from "@/interfaces/menu-Interface";
import {
  ArrowLeftRightIcon,
  Banknote,
  BarChart,
  BuildingIcon,
  CircleDollarSignIcon,
  ClipboardListIcon,
  FilesIcon,
  HandCoinsIcon,
  HandshakeIcon,
  IdCard,
  Landmark,
  LandmarkIcon,
  LayoutDashboardIcon,
  LayoutGrid,
  ReceiptIcon,
  Settings2Icon,
  ShoppingCart,
  TreePalmIcon,
  User2Icon,
  UserCogIcon,
  UsersRoundIcon,
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
        icon: LayoutDashboardIcon,
        href: "/",
      },
    ],
    sidebarNav: {
      modern: [
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
          child: [
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
              title: "Clientes",
              icon: UsersRoundIcon,
              href: "/cliente",
              rol: "Todos",
            },
            {
              title: "Rol",
              icon: UserCogIcon,
              href: "/rol",
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
          icon: HandshakeIcon,
          rol: "Todos",
          child: [
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
          ],
        },
        {
          title: "Ingresos y Egresos",
          icon: BarChart,
          rol: "Todos",
          child: [
            {
              title: "Planilla",
              icon: ClipboardListIcon,
              href: "/planilla",
              rol: "Todos",
            },

            {
              title: "Ventas",
              icon: CircleDollarSignIcon,
              href: "/venta",
              rol: "Todos",
            },
            {
              title: "Cobranza",
              icon: ShoppingCart,
              href: "/cobranza",
              rol: "Todos",
            },
            {
              title: "Movimiento Especial",
              icon: ArrowLeftRightIcon,
              href: "/movimientoespecial",
              rol: "Todos",
            },
          ],
        },
        {
          title: "Configuracion",
          icon: Settings2Icon,
          rol: "Todos",
          child: [
            {
              title: "Bancos",
              icon: Landmark,
              href: "/banco",
              rol: "Todos",
            },
            {
              title: "Tipo de Documentos",
              icon: FilesIcon,
              href: "/tipodocumento",
              rol: "Todos",
            },
            {
              title: "Tipo de Comprobantes",
              icon: ReceiptIcon,
              href: "/tipocomprobante",
              rol: "Todos",
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
