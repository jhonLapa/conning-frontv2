import { ApiResponse } from "@/interfaces";
import { Paginado, PlanillaBusqueda } from "@/interfaces/informes.interface";
import { Planilla, PlanillaRequest } from "@/interfaces/planilla";
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
export const getPlanillasPorProyectoTrabajador = async (
  params: {
    idTrabajador?: number;
    idProyecto?: number;
    fechaIni?: string;
    fechaFin?: string;
    page?: number;
    take?: number;
  } = {}
): Promise<Paginado<PlanillaBusqueda>> => {
  const response: AxiosResponse<Paginado<PlanillaBusqueda>> = await api.get(
    "/planilla/busquedapaginadoproyectotrabajador",
    {
      params: {
        Page: params.page ?? 1,
        Take: params.take ?? 10,
        idTrabajador: params.idTrabajador,
        idProyecto: params.idProyecto,
        fechaIni: params.fechaIni,
        fechaFin: params.fechaFin,
      },
    }
  );

  return response.data;
};
