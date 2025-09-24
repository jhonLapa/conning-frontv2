import { ApiResponse } from "@/interfaces";
import { Afectacion, AfectacionConfiguracion } from "@/interfaces/afectacione.interface";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getAfectacionFecth = async (): Promise<Afectacion[]> =>{
    const response : AxiosResponse<Afectacion[]> = await api.get(`/afectacion`);
    return response.data
} 

export const postConfigAfectacion = async (paylod:AfectacionConfiguracion[]): Promise<ApiResponse<AfectacionConfiguracion[]>> =>{
    const response : AxiosResponse<ApiResponse<AfectacionConfiguracion[]>> = await api.post(`/configafectacion/save-array`,paylod);
    return response.data
}