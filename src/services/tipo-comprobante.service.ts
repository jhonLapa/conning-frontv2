import { ApiResponse } from "@/interfaces";
import {
  TipoComprobante,
  TipoComprobanteForm,
} from "@/interfaces/tipo-comprobante.interface";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getComprobanteFetch = async (): Promise<TipoComprobante[]> => {
  const response: AxiosResponse<TipoComprobante[]> = await api.get(
    `/tipocomprobante`
  );
  return response.data;
};

export const getFetchComprobanteById = async (
  id: number
): Promise<TipoComprobante> => {
  const response: AxiosResponse<TipoComprobante> = await api.get(
    `/tipocomprobante/${id}`
  );
  return response.data;
};

export const postComprobante = async (
  paylod: TipoComprobanteForm

): Promise<ApiResponse<TipoComprobante>> => {
  const response: AxiosResponse<ApiResponse<TipoComprobante>> = await api.post(
    `/tipocomprobante`,
    paylod
  );
  return response.data;
};

export const putComprobante = async (
  id: number,
  paylod: TipoComprobanteForm
): Promise<ApiResponse<TipoComprobante>> => {
  const response: AxiosResponse<ApiResponse<TipoComprobante>> = await api.put(
    `/tipocomprobante/${id}`,
    paylod
  );
  return response.data;
};

export const activeOrdesactiveComprobante = async (
  id: number
): Promise<ApiResponse<TipoComprobante>> => {
  const response: AxiosResponse<ApiResponse<TipoComprobante>> =
    await api.delete(`/tipocomprobante/${id}`);
  return response.data;
};
export const getComprobantesActivos = async (): Promise<
  { idTipoComprobante: number; nombre: string }[]
> => {
  const response: AxiosResponse<
    { idTipoComprobante: number; nombre: string }[]
  > = await api.get("/tipocomprobante/selectactivos");
  return response.data;
};
