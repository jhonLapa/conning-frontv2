import { ApiResponse } from "@/interfaces";
import {
  MovimientoEspecial,
  MovimientoEspecialRequest,
} from "@/interfaces/movimiento-especial";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getMovimientoEspecialFetch = async (): Promise<
  MovimientoEspecial[]
> => {
  const response: AxiosResponse<MovimientoEspecial[]> = await api.get(
    `/movimientoespecial`
  );
  return response.data;
};

export const getFetchMovimientoEspecialById = async (
  id: number
): Promise<MovimientoEspecial> => {
  const response: AxiosResponse<MovimientoEspecial> = await api.get(
    `/movimientoespecial/${id}`
  );
  return response.data;
};

export const postMovimientoEspecial = async (
  paylod: MovimientoEspecialRequest
): Promise<ApiResponse<MovimientoEspecial>> => {
  const response: AxiosResponse<ApiResponse<MovimientoEspecial>> =
    await api.post(`/movimientoespecial`, paylod);
  return response.data;
};

export const putMovimientoEspecial = async (
  id: number,
  paylod: MovimientoEspecialRequest
): Promise<ApiResponse<MovimientoEspecial>> => {
  const response: AxiosResponse<ApiResponse<MovimientoEspecial>> =
    await api.put(`/movimientoespecial/${id}`, paylod);
  return response.data;
};

export const activeOrdesactiveMovimientoEspecial = async (
  id: number
): Promise<ApiResponse<MovimientoEspecial>> => {
  const response: AxiosResponse<ApiResponse<MovimientoEspecial>> =
    await api.delete(`/movimientoespecial/${id}`);
  return response.data;
};
