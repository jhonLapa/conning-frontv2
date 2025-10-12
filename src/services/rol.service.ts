import { ApiResponse } from "@/interfaces";
import {
  Rol,
  RolRequest,
} from "@/interfaces/rol.interface";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getRolFetch = async (): Promise<Rol[]> => {
  const response: AxiosResponse<Rol[]> = await api.get(
    `/rol`
  );
  return response.data;
};

export const getFetchRolById = async (
  id: number
): Promise<Rol> => {
  const response: AxiosResponse<Rol> = await api.get(
    `/rol/${id}`
  );
  return response.data;
};

export const postRol = async (
  paylod: RolRequest
): Promise<ApiResponse<Rol>> => {
  const response: AxiosResponse<ApiResponse<Rol>> = await api.post(
    `/rol`,
    paylod
  );
  return response.data;
};

export const putRol = async (
  id: number,
  paylod: RolRequest
): Promise<ApiResponse<Rol>> => {
  const response: AxiosResponse<ApiResponse<Rol>> = await api.put(
    `/rol/${id}`,
    paylod
  );
  return response.data;
};

export const activeOrdesactiveRol = async (
  id: number
): Promise<ApiResponse<Rol>> => {
  const response: AxiosResponse<ApiResponse<Rol>> =
    await api.delete(`/rol/${id}`);
  return response.data;
};

export const getRolesActivos = async (): Promise<
  { roleId: number; nombre: string }[]
> => {
  const response: AxiosResponse<
    { roleId: number; nombre: string }[]
  > = await api.get("/rol/selectactivos");
  return response.data;
};