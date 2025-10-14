import { ApiResponse } from "@/interfaces";
import {
  Menu,
  MenuRequest,
  MenuActivo,
} from "@/interfaces/menus.interface";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getMenuFetch = async (): Promise<Menu[]> => {
  const response: AxiosResponse<Menu[]> = await api.get(
    `/menu`
  );
  return response.data;
};

export const getFetchMenuById = async (
  id: number
): Promise<Menu> => {
  const response: AxiosResponse<Menu> = await api.get(
    `/menu/${id}`
  );
  return response.data;
};

export const postMenu = async (
  paylod: MenuRequest
): Promise<ApiResponse<Menu>> => {
  const response: AxiosResponse<ApiResponse<Menu>> = await api.post(
    `/menu`,
    paylod
  );
  return response.data;
};

export const putMenu = async (
  id: number,
  paylod: MenuRequest
): Promise<ApiResponse<Menu>> => {
  const response: AxiosResponse<ApiResponse<Menu>> = await api.put(
    `/menu/${id}`,
    paylod
  );
  return response.data;
};

export const activeOrdesactiveMenu = async (
  id: number
): Promise<ApiResponse<Menu>> => {
  const response: AxiosResponse<ApiResponse<Menu>> =
    await api.delete(`/menu/${id}`);
  return response.data;
};

// export const getMenuesActivos = async (): Promise<
//   { menueId: number; nombre: string }[]
// > => {
//   const response: AxiosResponse<
//     { menueId: number; nombre: string }[]
//   > = await api.get("/menu/selectactivos");
//   return response.data;
// };

export const getMenuesActivos = async (): Promise<MenuActivo[]> => {
  const response = await api.get<MenuActivo[]>("/menu/selectactivos");
  return response.data;
};

