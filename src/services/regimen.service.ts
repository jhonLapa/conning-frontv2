import { ApiResponse } from "@/interfaces";
import { Regimen, RegimenRequest } from "@/interfaces/regimen.interface";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";


export const getRegimenesFetch = async (): Promise<Regimen[]> => {
    const response: AxiosResponse<Regimen[]> = await api.get(
        `/regimenprevisional`
    );
    return response.data;
};

export const getRegimenesActivos = async (): Promise<
    { idRegimen: number; nombre: string }[]
> => {
    const response: AxiosResponse<
        { idRegimen: number; nombre: string }[]
    > = await api.get("/regimenprevisional/selectactivos");
    return response.data;
};

export const getFetchRegimenById = async (
    id: number
): Promise<Regimen> => {
    const response: AxiosResponse<Regimen> = await api.get(
        `/regimenprevisional/${id}`
    );
    return response.data;
};

export const postRegimen = async (
    paylod: RegimenRequest
): Promise<ApiResponse<Regimen>> => {
    const response: AxiosResponse<ApiResponse<Regimen>> = await api.post(
        `/regimenprevisional`,
        paylod
    );
    return response.data;
};

export const putRegimen = async (
    id: number,
    paylod: RegimenRequest
): Promise<ApiResponse<Regimen>> => {
    const response: AxiosResponse<ApiResponse<Regimen>> = await api.put(
        `/regimenprevisional/${id}`,
        paylod
    );
    return response.data;
};

export const activeOrDesactiveRegimen = async (
    id: number
): Promise<ApiResponse<Regimen>> => {
    const response: AxiosResponse<ApiResponse<Regimen>> =
        await api.delete(`/regimenprevisional/${id}`);
    return response.data;
};