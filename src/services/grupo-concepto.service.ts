import { ApiResponse } from "@/interfaces";
import { GrupoConcepto, GrupoConceptoRequest, GrupoConceptoSelect } from "@/interfaces/grupo-concepto";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getGrupoConceptoFecth = async (): Promise<GrupoConcepto[]> =>{
    const response : AxiosResponse<GrupoConcepto[]> = await api.get(`/grupoConcepto`);
    return response.data
} 

export const getFechtGrupoConceptoById = async (id: number): Promise<GrupoConcepto> => {
    const response : AxiosResponse<GrupoConcepto> = await api.get(`/GrupoConcepto/${id}`)
    return response.data
}

export const postGrupoConcepto = async (paylod: GrupoConceptoRequest): Promise<ApiResponse<GrupoConcepto>> => {
    const response : AxiosResponse<ApiResponse<GrupoConcepto>> = await api.post(`/grupoConcepto`, paylod)
    return response.data
}

export const putGrupoConcepto = async (id: number, paylod: GrupoConceptoRequest): Promise<ApiResponse<GrupoConcepto>> => {
    const response : AxiosResponse<ApiResponse<GrupoConcepto>> = await api.put(`/grupoConcepto/${id}`, paylod)
    return response.data
}

export const activeOrdesactiveGrupoConcepto = async (id: number): Promise<ApiResponse<GrupoConcepto>> => {
    const response : AxiosResponse<ApiResponse<GrupoConcepto>> = await api.delete(`/grupoConcepto/${id}`)
    return response.data
}


export const getGrupoConceptoSelect = async (): Promise<GrupoConceptoSelect[]> =>{
    const response : AxiosResponse<GrupoConceptoSelect[]> = await api.get(`/grupoConcepto/select`);
    return response.data
}
