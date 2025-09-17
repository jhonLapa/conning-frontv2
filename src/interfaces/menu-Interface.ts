import { LucideIcon } from "lucide-react";

export interface MenuItemProps {
  title: string;
  icon: LucideIcon;
  href?: string;
  child?: MenuItemProps[];
  megaMenu?: MenuItemProps[];
  multi_menu?: MenuItemProps[];
  nested?: MenuItemProps[];
  onClick?: () => void;
  badge?: string
  rol?: string
  createAt?: string
  activate?: boolean
}

export interface MenuDto {
  title: string;
  icon?: string;
  href?: string | null;
  activate:boolean;
  idRol: number;
}


export interface Menu {
  id: number;
  title: string;
  icon: string;
  href?: string;
  activate:boolean;
  idRol: number;
  rol: null
  createAt: string
  child: MenuItemProps[] | null; 
}