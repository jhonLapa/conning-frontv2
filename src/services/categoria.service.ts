import { ApiResponse } from "@/interfaces";
import { Categoria, CategoriaRequest } from "@/interfaces/categoria.interface";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getCategoriaFecth = async (): Promise<Categoria[]> => {
  const response: AxiosResponse<Categoria[]> = await api.get(`/categoria`);
  return response.data;
};

export const getFechtCategoriaById = async (id: number): Promise<Categoria> => {
  const response: AxiosResponse<Categoria> = await api.get(`/categoria/${id}`);
  return response.data;
};

export const postCategoria = async (
  paylod: CategoriaRequest
): Promise<ApiResponse<Categoria>> => {
  const response: AxiosResponse<ApiResponse<Categoria>> = await api.post(
    `/categoria`,
    paylod
  );
  return response.data;
};

export const putCategoria = async (
  id: number,
  paylod: CategoriaRequest
): Promise<ApiResponse<Categoria>> => {
  const response: AxiosResponse<ApiResponse<Categoria>> = await api.put(
    `/categoria/${id}`,
    paylod
  );
  return response.data;
};

export const activeOrdesactiveCategoria = async (
  id: number
): Promise<ApiResponse<Categoria>> => {
  const response: AxiosResponse<ApiResponse<Categoria>> = await api.delete(
    `/categoria/${id}`
  );
  return response.data;
};
