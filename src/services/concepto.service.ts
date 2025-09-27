import { ApiResponse } from "@/interfaces";
import { Concepto, ConceptoAfectacion, ConceptoAfectacionRequest, ConceptoRequest } from "@/interfaces/concepto.interface";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getConceptoFecth = async (): Promise<Concepto[]> =>{
    const response : AxiosResponse<Concepto[]> = await api.get(`/concepto`);
    return response.data
} 

export const getFechtConceptoById = async (id: number): Promise<Concepto> => {
    const response : AxiosResponse<Concepto> = await api.get(`/concepto/${id}`)
    return response.data
}

export const postConcepto = async (paylod: ConceptoRequest): Promise<ApiResponse<Concepto>> => {
    const response : AxiosResponse<ApiResponse<Concepto>> = await api.post(`/concepto`, paylod)
    return response.data
}

export const putConcepto = async (id: number, paylod: ConceptoRequest): Promise<ApiResponse<Concepto>> => {
    const response : AxiosResponse<ApiResponse<Concepto>> = await api.put(`/concepto/${id}`, paylod)
    return response.data
}

export const activeOrdesactiveConcepto = async (id: number): Promise<ApiResponse<Concepto>> => {
    const response : AxiosResponse<ApiResponse<Concepto>> = await api.delete(`/concepto/${id}`)
    return response.data
}


export const getConceptoByIdGrupo = async (id: number): Promise<Concepto[]> =>{
    const response : AxiosResponse<Concepto[]> = await api.get(`/concepto/masivo/${id}`);
    return response.data
}

export const postConceptoAfectacion = async (paylod:ConceptoAfectacionRequest[]): Promise<ApiResponse<Concepto[]>> =>{
    const response : AxiosResponse<ApiResponse<Concepto[]>> = await api.post(`/conceptoafectacion/save-array`,paylod);
    return response.data
}


export const getFecthAfectacionConceto = async (id: number) : Promise<ConceptoAfectacion[]> => {
    const response: AxiosResponse<ConceptoAfectacion[]> = await api.get(`/conceptoafectacion/afectacion/${id}`)
    return response.data
}