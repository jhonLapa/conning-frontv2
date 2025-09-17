import { type ApiResponse, Menu, MenuDto , MenuItemProps } from "@/interfaces";
import api from "@/lib/api";
import { AxiosResponse } from "axios";
import { PiIcon } from "lucide-react";

export const fetchMenuById = async (id: string): Promise<Menu> => {

    const response : AxiosResponse<Menu> = await api.get(`menu/${id}`);

    const menu : Menu = {
        id: response.data.id,
        title: response.data.title ,
        href: response.data.href,
        activate: response.data.activate,
        icon: response.data.icon,
        idRol: response.data.idRol,
        rol: response.data.rol,
        createAt: response.data.createAt,
        child: response.data.child
    }

    return menu
   
}

export const createMenu = async (payload: MenuDto) => {
  try {
    const response = await api.post(`/menu`, payload);
    return response.data as ApiResponse<Menu>;
  } catch (e) {
    console.log(e);
  }
};

export const updateMenu = async (id: number, payload: MenuDto) => {
  try {
    const response = await api.put(`/menu/${id}`, payload);
    return response.data as ApiResponse<Menu>;
  } catch (e) {
    console.log(e);
  }
};

export async function activeOrinactiveMenu(id: number) {
  try {
    const response = await api.delete(`menu/${id}`);
    return response.data as ApiResponse<Menu>;
  } catch (e) {
    console.log(e);
  }
}

export const fetchMenuComboRouter = async (): Promise<MenuItemProps[]> => {
    
    const response : AxiosResponse<Menu[]> = await api.get(`menu`);

    const menu : MenuItemProps[] = response.data.map( item => {
        // const icon: LucideIcon = getIcon(item.icon)
            return {
                title: item.title ,
                href: item.href,
                activate: item.activate,
                icon: PiIcon ,
                rol: "",
                child: item?.child ?? [],   
            }
        })

    return menu
}


export const fetchMenuCombo = async (): Promise<Menu[]> => {
    
    const response : AxiosResponse<Menu[]> = await api.get(`menu`);

    const menu : Menu[] = response.data.map( item => {
            return {
                id:item.id,
                title:item.title ,
                href:item.href,
                activate:item.activate,
                icon:item.icon,
                idRol:item.idRol,
                rol:item.rol,
                createAt:item.createAt,
                child: item.child
            }
        })

    return menu
}


