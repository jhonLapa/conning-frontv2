import { ApiResponse } from "@/interfaces";
import { Proveedor, ProveedorRequest } from "@/interfaces/proveedor.interface";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getProveedorFetch = async (): Promise<Proveedor[]> => {
  const response: AxiosResponse<Proveedor[]> = await api.get(`/proveedor`);
  return response.data;
};

export const getFetchProveedorById = async (id: number): Promise<Proveedor> => {
  const response: AxiosResponse<Proveedor> = await api.get(`/proveedor/${id}`);
  return response.data;
};

export const postProveedor = async (
  paylod: ProveedorRequest
): Promise<ApiResponse<Proveedor>> => {
  const response: AxiosResponse<ApiResponse<Proveedor>> = await api.post(
    `/proveedor`,
    paylod
  );
  return response.data;
};

export const putProveedor = async (
  id: number,
  paylod: ProveedorRequest
): Promise<ApiResponse<Proveedor>> => {
  const response: AxiosResponse<ApiResponse<Proveedor>> = await api.put(
    `/proveedor/${id}`,
    paylod
  );
  return response.data;
};

export const activeOrdesactiveProveedor = async (
  id: number
): Promise<ApiResponse<Proveedor>> => {
  const response: AxiosResponse<ApiResponse<Proveedor>> = await api.delete(
    `/proveedor/${id}`
  );
  return response.data;
};

export const getProveedorsActivos = async (): Promise<
  { idProveedor: number; nombreCompleto: string }[]
> => {
  const response: AxiosResponse<
    { idProveedor: number; nombreCompleto: string }[]
  > = await api.get("/proveedor/selectactivos");
  return response.data;
};
