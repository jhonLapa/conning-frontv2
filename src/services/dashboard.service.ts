import { AxiosResponse } from "axios";
import api from "@/lib/api";
import { Dashboard } from "@/interfaces/dashboard.interface";

// ✅ Ahora acepta parámetros opcionales
export const getDashboard = async (
  fechaInicio?: string,
  fechaFin?: string
): Promise<Dashboard> => {
  // Si se pasan fechas, agregarlas como query params
  const params = new URLSearchParams();
  if (fechaInicio) params.append("fechaInicio", fechaInicio);
  if (fechaFin) params.append("fechaFin", fechaFin);

  const url = params.toString() ? `/dashboard?${params.toString()}` : "/dashboard";

  const response: AxiosResponse<Dashboard> = await api.get(url);
  return response.data;
};
