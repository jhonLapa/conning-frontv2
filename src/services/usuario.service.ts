import { ApiResponse } from "@/interfaces";
import { Usuario, UsuarioRequest } from "@/interfaces/usuario.interface";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getUsuarioFecth = async (): Promise<Usuario[]> => {
  const response: AxiosResponse<Usuario[]> = await api.get(`/usuario`);
  return response.data;
};

export const getFechtUsuarioById = async (id: number): Promise<Usuario> => {
  const response: AxiosResponse<Usuario> = await api.get(`/usuario/${id}`);
  return response.data;
};

export const postUsuario = async (
  paylod: UsuarioRequest
): Promise<ApiResponse<Usuario>> => {
  const response: AxiosResponse<ApiResponse<Usuario>> = await api.post(
    `/usuario`,
    paylod
  );
  return response.data;
};

export const putUsuario = async (
  id: number,
  paylod: UsuarioRequest
): Promise<ApiResponse<Usuario>> => {
  const response: AxiosResponse<ApiResponse<Usuario>> = await api.put(
    `/usuario/${id}`,
    paylod
  );
  return response.data;
};

export const activeOrdesactiveUsuario = async (
  id: number
): Promise<ApiResponse<Usuario>> => {
  const response: AxiosResponse<ApiResponse<Usuario>> = await api.delete(
    `/usuario/${id}`
  );
  return response.data;
};
