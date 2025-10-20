import { Dashboard } from "@/interfaces/dashboard.interface";
import api from "@/lib/api"; // 👈 usa tu configuración de Axios existente
import { AxiosResponse } from "axios";

export const getDashboard = async (): Promise<Dashboard> => {
  const response: AxiosResponse<Dashboard> = await api.get("/dashboard");
  return response.data;
};
