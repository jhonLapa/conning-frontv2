import { ApiResponse } from "@/interfaces";
import { Venta, VentaRequest } from "@/interfaces/venta.interface";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getVentaFetch = async (): Promise<Venta[]> => {
  const response: AxiosResponse<Venta[]> = await api.get(`/venta`);
  return response.data;
};

export const getFetchVentaByIdData = async (id: number): Promise<Venta> => {
  const response: AxiosResponse<{ data: Venta }> = await api.get(
    `/venta/${id}`
  );
  return response.data.data;
};

export const postVenta = async (
  paylod: VentaRequest
): Promise<ApiResponse<Venta>> => {
  const response: AxiosResponse<ApiResponse<Venta>> = await api.post(
    `/venta/registrarcompleto`,
    paylod
  );
  return response.data;
};

export const putVenta = async (
  id: number,
  paylod: VentaRequest
): Promise<ApiResponse<Venta>> => {
  const response: AxiosResponse<ApiResponse<Venta>> = await api.put(
    `/venta/${id}`,
    paylod
  );
  return response.data;
};

export const activeOrdesactiveVenta = async (
  id: number
): Promise<ApiResponse<Venta>> => {
  const response: AxiosResponse<ApiResponse<Venta>> = await api.delete(
    `/venta/${id}`
  );
  return response.data;
};
