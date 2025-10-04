import { ApiResponse } from "@/interfaces";
import {
  TipoDocumento,
  TipoDocumentoRequest,
} from "@/interfaces/document.interface";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getDocumentFetch = async (): Promise<TipoDocumento[]> => {
  const response: AxiosResponse<TipoDocumento[]> = await api.get(
    `/tipodocumento`
  );
  return response.data;
};

export const getFetchDocumentById = async (
  id: number
): Promise<TipoDocumento> => {
  const response: AxiosResponse<TipoDocumento> = await api.get(
    `/tipodocumento/${id}`
  );
  return response.data;
};

export const postDocument = async (
  paylod: TipoDocumentoRequest
): Promise<ApiResponse<TipoDocumento>> => {
  const response: AxiosResponse<ApiResponse<TipoDocumento>> = await api.post(
    `/tipodocumento`,
    paylod
  );
  return response.data;
};

export const putDocument = async (
  id: number,
  paylod: TipoDocumentoRequest
): Promise<ApiResponse<TipoDocumento>> => {
  const response: AxiosResponse<ApiResponse<TipoDocumento>> = await api.put(
    `/tipodocumento/${id}`,
    paylod
  );
  return response.data;
};

export const activeOrdesactiveDocument = async (
  id: number
): Promise<ApiResponse<TipoDocumento>> => {
  const response: AxiosResponse<ApiResponse<TipoDocumento>> = await api.delete(
    `/tipodocumento/${id}`
  );
  return response.data;
};

export const fetchTiposDocumento = async (): Promise<
  { idTipoDocumento: number; nombre: string }[]
> => {
  const documentos = await getDocumentFetch();
  return documentos
    .filter((doc) => doc.estado === 1)
    .map((doc) => ({
      idTipoDocumento: doc.idTipoDocumento,
      nombre: doc.nombre,
    }));
};
