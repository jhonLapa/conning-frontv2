import { ApiResponse } from "@/interfaces";
import { Proyecto, ProyectoRequest } from "@/interfaces/proyecto.interface";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getProyectoFetch = async (): Promise<Proyecto[]> => {
  const response: AxiosResponse<Proyecto[]> = await api.get(`/proyecto`);
  return response.data;
};

export const getFechtProyectoById = async (id: number): Promise<Proyecto> => {
  const response: AxiosResponse<Proyecto> = await api.get(`/proyecto/${id}`);
  return response.data;
};

export const postProyecto = async (
  paylod: ProyectoRequest
): Promise<ApiResponse<Proyecto>> => {
  const response: AxiosResponse<ApiResponse<Proyecto>> = await api.post(
    `/proyecto`,
    paylod
  );
  return response.data;
};

export const putProyecto = async (
  id: number,
  paylod: ProyectoRequest
): Promise<ApiResponse<Proyecto>> => {
  const response: AxiosResponse<ApiResponse<Proyecto>> = await api.put(
    `/proyecto/${id}`,
    paylod
  );
  return response.data;
};

export const activeOrdesactiveProyecto = async (
  id: number
): Promise<ApiResponse<Proyecto>> => {
  const response: AxiosResponse<ApiResponse<Proyecto>> = await api.delete(
    `/proyecto/${id}`
  );
  return response.data;
};

export const getProyectosActivos = async (): Promise<
  { idProyecto: number; nombreCompleto: string }[]
> => {
  const response: AxiosResponse<
    { idProyecto: number; nombreCompleto: string }[]
  > = await api.get("/proyecto/selectactivos");
  return response.data;
};
