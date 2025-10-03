import { ApiResponse } from "@/interfaces";
import { Cliente, ClienteRequest } from "@/interfaces/cliente.interface";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getClienteFetch = async (): Promise<Cliente[]> => {
  const response: AxiosResponse<Cliente[]> = await api.get(`/cliente`);
  return response.data;
};

export const getFetchClienteById = async (id: number): Promise<Cliente> => {
  const response: AxiosResponse<Cliente> = await api.get(`/cliente/${id}`);
  return response.data;
};

export const postCliente = async (
  paylod: ClienteRequest
): Promise<ApiResponse<Cliente>> => {
  const response: AxiosResponse<ApiResponse<Cliente>> = await api.post(
    `/cliente`,
    paylod
  );
  return response.data;
};

export const putCliente = async (
  id: number,
  paylod: ClienteRequest
): Promise<ApiResponse<Cliente>> => {
  const response: AxiosResponse<ApiResponse<Cliente>> = await api.put(
    `/cliente/${id}`,
    paylod
  );
  return response.data;
};

export const activeOrdesactiveCliente = async (
  id: number
): Promise<ApiResponse<Cliente>> => {
  const response: AxiosResponse<ApiResponse<Cliente>> = await api.delete(
    `/cliente/${id}`
  );
  return response.data;
};
