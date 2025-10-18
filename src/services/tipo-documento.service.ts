import { ApiResponse } from "@/interfaces";
import {
  TipoDocumento,
  TipoDocumentoRequest,
} from "@/interfaces/tipo-documento.interface";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getDocumentoFetch = async (): Promise<TipoDocumento[]> => {
  const response: AxiosResponse<TipoDocumento[]> = await api.get(
    `/tipodocumento`
  );
  return response.data;
};

export const getFetchDocumentoById = async (
  id: number
): Promise<TipoDocumento> => {
  const response: AxiosResponse<TipoDocumento> = await api.get(
    `/tipodocumento/${id}`
  );
  return response.data;
};

export const postDocumento = async (
  paylod: TipoDocumentoRequest
): Promise<ApiResponse<TipoDocumento>> => {
  const response: AxiosResponse<ApiResponse<TipoDocumento>> = await api.post(
    `/tipodocumento`,
    paylod
  );
  return response.data;
};

export const putDocumento = async (
  id: number,
  paylod: TipoDocumentoRequest
): Promise<ApiResponse<TipoDocumento>> => {
  const response: AxiosResponse<ApiResponse<TipoDocumento>> = await api.put(
    `/tipodocumento/${id}`,
    paylod
  );
  return response.data;
};

export const activeOrdesactiveDocumento = async (
  id: number
): Promise<ApiResponse<TipoDocumento>> => {
  const response: AxiosResponse<ApiResponse<TipoDocumento>> =
    await api.delete(`/tipodocumento/${id}`);
  return response.data;
};
export const getDocumentosActivos = async (): Promise<
  { idTipoDocumento: number; nombre: string }[]
> => {
  const response: AxiosResponse<
    { idTipoDocumento: number; nombre: string }[]
  > = await api.get("/tipodocumento/selectactivos");
  return response.data;
};
