import { ApiResponse } from "@/interfaces";
import {
  ConceptoCategoria,
  ConceptoCategoriaRequest,
} from "@/interfaces/concepto-categoria.interface";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getConceptoCategoriaFecth = async (): Promise<
  ConceptoCategoria[]
> => {
  const response: AxiosResponse<ConceptoCategoria[]> = await api.get(
    `/conceptoscategoria`
  );
  return response.data;
};

export const getFechtConceptoCategoriaById = async (
  id: number
): Promise<ConceptoCategoria> => {
  const response: AxiosResponse<ConceptoCategoria> = await api.get(
    `/conceptoscategoria/${id}`
  );
  return response.data;
};

export const postConceptoCategoria = async (
  paylod: ConceptoCategoriaRequest
): Promise<ApiResponse<ConceptoCategoria>> => {
  const response: AxiosResponse<ApiResponse<ConceptoCategoria>> =
    await api.post(`/conceptoscategoria`, paylod);
  return response.data;
};

export const putConceptoCategoria = async (
  id: number,
  paylod: ConceptoCategoriaRequest
): Promise<ApiResponse<ConceptoCategoria>> => {
  const response: AxiosResponse<ApiResponse<ConceptoCategoria>> = await api.put(
    `/conceptoscategoria/${id}`,
    paylod
  );
  return response.data;
};

export const activeOrdesactiveConceptoCategoria = async (
  id: number
): Promise<ApiResponse<ConceptoCategoria>> => {
  const response: AxiosResponse<ApiResponse<ConceptoCategoria>> =
    await api.delete(`/conceptoscategoria/${id}`);
  return response.data;
};
