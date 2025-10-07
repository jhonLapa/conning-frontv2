import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getComprobantesActivos = async (): Promise<
  { idTipoComprobante: number; nombre: string }[]
> => {
  const response: AxiosResponse<
    { idTipoComprobante: number; nombre: string }[]
  > = await api.get("/tipocomprobante/selectactivos");
  return response.data;
};
