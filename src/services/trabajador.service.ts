import { AxiosResponse } from "axios";
import api from "@/lib/api"; 
import { ApiResponse } from "@/interfaces"; 
import { 
    Trabajador, 
    TrabajadorRequest, 
    CuentaBancariaRequest 
} from "@/interfaces/trabajador.interface"; 

interface TrabajadorWithAccountsRequest {
    trabajador: TrabajadorRequest;
    cuentas: CuentaBancariaRequest[];
}

const endpoint = "/trabajador";

export const getFetchTrabajadores = async (): Promise<Trabajador[]> => {
    const response: AxiosResponse<Trabajador[]> = await api.get(endpoint);
    return response.data;
};

export const getFetchTrabajadorById = async (id: number): Promise<Trabajador | null> => {
    try {
        const response: AxiosResponse<Trabajador> = await api.get(
            `${endpoint}/${id}`,
        );
        return response.data; // <--- Debe devolver el objeto JSON
    } catch (error) {
        // Si hay un error de red (como 404/500), retorna null para que el componente lo capture.
        console.error("Error fetching trabajador by ID:", error);
        return null; 
    }
};

export const postTrabajador = async (
    payload: TrabajadorRequest
): Promise<ApiResponse<Trabajador>> => {
    const response: AxiosResponse<ApiResponse<Trabajador>> = await api.post(
        `${endpoint}/with-accounts`,
        payload
    );
    return response.data;
};

export const putTrabajador = async (
    id: number, 
    payload: TrabajadorRequest
): Promise<ApiResponse<Trabajador>> => {
    const response: AxiosResponse<ApiResponse<Trabajador>> = await api.put(
        `${endpoint}/${id}`, 
        payload
    );
    return response.data;
};

export const activeOrDesactiveTrabajador = async (
    id: number
): Promise<ApiResponse<Trabajador>> => {
    const response: AxiosResponse<ApiResponse<Trabajador>> = await api.delete(
        `${endpoint}/${id}`
    );
    return response.data;
};


export const postTrabajadorWithAccounts = async (
    payload: TrabajadorWithAccountsRequest
): Promise<ApiResponse<Trabajador>> => {
    const response: AxiosResponse<ApiResponse<Trabajador>> = await api.post(
        `${endpoint}/with-accounts`,
        payload
    );
    return response.data;
};


export const putTrabajadorWithAccounts = async (
    id: number, 
    payload: TrabajadorWithAccountsRequest
): Promise<ApiResponse<Trabajador>> => {
    const response: AxiosResponse<ApiResponse<Trabajador>> = await api.put(
        `${endpoint}/${id}/with-accounts`, 
        payload
    );
    return response.data;
};