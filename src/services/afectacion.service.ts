import { ApiResponse } from "@/interfaces";
import { Afectacion, AfectacionConfiguracion, AfectacionRequest } from "@/interfaces/afectacione.interface";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getAfectacionFecth = async (): Promise<Afectacion[]> =>{
    const response : AxiosResponse<Afectacion[]> = await api.get(`/afectacion`);
    return response.data
} 

export const getFechtAfectacionById = async (id: number): Promise<Afectacion> => {
    const response : AxiosResponse<Afectacion> = await api.get(`/afectacion/${id}`)
    return response.data
}

export const postAfectacion = async (paylod: AfectacionRequest): Promise<ApiResponse<Afectacion>> => {
    const response : AxiosResponse<ApiResponse<Afectacion>> = await api.post(`/afectacion`, paylod)
    return response.data
}

export const putAfectacion = async (id: number, paylod: AfectacionRequest): Promise<ApiResponse<Afectacion>> => {
    const response : AxiosResponse<ApiResponse<Afectacion>> = await api.put(`/afectacion/${id}`, paylod)
    return response.data
}

export const activeOrdesactiveAfectacion = async (id: number): Promise<ApiResponse<Afectacion>> => {
    const response : AxiosResponse<ApiResponse<Afectacion>> = await api.delete(`/afectacion/${id}`)
    return response.data
}



export const postConfigAfectacion = async (paylod:AfectacionConfiguracion[]): Promise<ApiResponse<AfectacionConfiguracion[]>> =>{
    const response : AxiosResponse<ApiResponse<AfectacionConfiguracion[]>> = await api.post(`/configafectacion/save-array`,paylod);
    return response.data
}