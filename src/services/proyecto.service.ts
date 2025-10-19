import { ApiResponse } from "@/interfaces";
import { Proyecto, ProyectoFormData } from "@/interfaces/proyecto.interface";
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

export const activeOrdesactiveProyecto = async (
  id: number
): Promise<ApiResponse<Proyecto>> => {
  const response: AxiosResponse<ApiResponse<Proyecto>> = await api.delete(
    `/proyecto/${id}`
  );
  return response.data;
};

export const getProyectosActivos = async (): Promise<
  { idProyecto: number; nombre: string }[]
> => {
  const response: AxiosResponse<
    { idProyecto: number; nombre: string }[]
  > = await api.get("/proyecto/selectactivos");
  return response.data;
};
 
// 🔹 Crear proyecto completo con trabajadores, sindicato y encargado
export const postProyectoCompleto = async (
  payload: ProyectoFormData
): Promise<ApiResponse<Proyecto>> => {
  const response: AxiosResponse<ApiResponse<Proyecto>> = await api.post(
    "/proyecto/registrarcompleto",
    payload
  );
  return response.data;
};

