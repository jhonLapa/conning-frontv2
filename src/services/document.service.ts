import { ApiResponse } from "@/interfaces";
import { Document, DocumentRequest } from "@/interfaces/document.interface";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getDocumentFetch = async (): Promise<Document[]> => {
  const response: AxiosResponse<Document[]> = await api.get(`/tipodocumento`);
  return response.data;
};

export const getFetchDocumentById = async (id: number): Promise<Document> => {
  const response: AxiosResponse<Document> = await api.get(
    `/tipodocumento/${id}`
  );
  return response.data;
};

export const postDocument = async (
  paylod: DocumentRequest
): Promise<ApiResponse<Document>> => {
  const response: AxiosResponse<ApiResponse<Document>> = await api.post(
    `/tipodocumento`,
    paylod
  );
  return response.data;
};

export const putDocument = async (
  id: number,
  paylod: DocumentRequest
): Promise<ApiResponse<Document>> => {
  const response: AxiosResponse<ApiResponse<Document>> = await api.put(
    `/tipodocumento/${id}`,
    paylod
  );
  return response.data;
};

export const activeOrdesactiveDocument = async (
  id: number
): Promise<ApiResponse<Document>> => {
  const response: AxiosResponse<ApiResponse<Document>> = await api.delete(
    `/tipodocumento/${id}`
  );
  return response.data;
};
