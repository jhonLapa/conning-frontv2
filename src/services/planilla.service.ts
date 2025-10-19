import { ApiResponse } from "@/interfaces";
import { Planilla, PlanillaRequest } from "@/interfaces/planilla";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getPlanillaFetch = async (): Promise<Planilla[]> => {
  const response: AxiosResponse<Planilla[]> = await api.get(`/planilla`);
  return response.data;
};

export const getFetchPlanillaById = async (id: number): Promise<Planilla> => {
  const response: AxiosResponse<Planilla> = await api.get(`/planilla/${id}`);
  return response.data;
};

export const postPlanilla = async (
  paylod: PlanillaRequest
): Promise<ApiResponse<Planilla>> => {
  const response: AxiosResponse<ApiResponse<Planilla>> = await api.post(
    `/planilla`,
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
