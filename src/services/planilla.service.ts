import { ApiResponse } from "@/interfaces";
import { BoletaDto, Planilla, PlanillaRequest } from "@/interfaces/planilla.interface";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getPlanillaFetch = async (): Promise<Planilla[]> => {
  const response: AxiosResponse<Planilla[]> = await api.get(`/planilla`);
  return response.data;
};

export const getFetchPlanillaById = async (id: number): Promise<Planilla> => {
  const response = await api.get<{ data: Planilla }>(`/planilla/${id}`);
  return response.data.data; // ✅ TypeScript ahora lo entiende perfectamente
};

export const postPlanilla = async (
  paylod: PlanillaRequest
): Promise<ApiResponse<Planilla>> => {
  const response: AxiosResponse<ApiResponse<Planilla>> = await api.post(
    `planilla/registrocompleto`,
    paylod
  );
  return response.data;
};

export const putPlanilla = async (
  id: number,
  paylod: PlanillaRequest
): Promise<ApiResponse<Planilla>> => {
  const response: AxiosResponse<ApiResponse<Planilla>> = await api.put(
    `/planilla/${id}`,
    paylod
  );
  return response.data;
};

export const activeOrdesactivePlanilla = async (
  id: number
): Promise<ApiResponse<Planilla>> => {
  const response: AxiosResponse<ApiResponse<Planilla>> = await api.delete(
    `/planilla/${id}`
  );
  return response.data;
};

// Obtener planillas filtradas por trabajador, proyecto y fecha
// Obtener boleta por idPlanilla e idTrabajador
export const getObtenerBoleta = async (
  idPlanilla: number,
  idTrabajador: number
): Promise<BoletaDto> => {
  const response = await api.get(`/planilla/obtenerboletaasync/${idPlanilla}/${idTrabajador}`);
  return response.data.data; // ✅ esto devuelve directamente la boleta
};