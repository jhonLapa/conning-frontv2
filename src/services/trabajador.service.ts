import { AxiosResponse } from "axios";
import api from "@/lib/api";
import { ApiResponse } from "@/interfaces";
import {
  Trabajador,
  TrabajadorRequest,
  CuentaBancariaRequest,
} from "@/interfaces/trabajador.interface";

interface TrabajadorWithAccountsRequest {
  trabajador: TrabajadorRequest;
  cuentas: CuentaBancariaRequest[];
}

const endpoint = "/trabajador";

/* ============================================================
   CRUD PRINCIPAL
   ============================================================ */
export const getFetchTrabajadores = async (): Promise<Trabajador[]> => {
  const response: AxiosResponse<Trabajador[]> = await api.get(endpoint);
  return response.data;
};

export const getFetchTrabajadorById = async (
  id: number
): Promise<Trabajador | null> => {
  try {
    const response: AxiosResponse<Trabajador> = await api.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
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

/* ============================================================
   CRUD CON CUENTAS
   ============================================================ */
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

/* ============================================================
   SELECT ACTIVO
   ============================================================ */
export const getTrabajadoresActivos = async (): Promise<
  { idTrabajador: number; apellidosNombres: string }[]
> => {
  const response: AxiosResponse<
    { idTrabajador: number; apellidosNombres: string }[]
  > = await api.get(`${endpoint}/selectactivos`);
  return response.data;
};

/* ============================================================
   🔹 NUEVO: DETALLE DE PLANILLA
   ============================================================ */
/**
 * Obtiene los datos del trabajador con sus conceptos, categoría y régimen
 * Endpoint: GET /api/trabajador/{id}/detalle-planilla
 */
export const getDetallePlanillaTrabajador = async (
  idTrabajador: number
): Promise<
  ApiResponse<{
    idTrabajador: number;
    idTrabajadorProyecto?:number;
    apellidosNombres: string;
    categoria: { idCategoria: number; nombre: string } | null;
    regimen: {
      idRegimen: number;
      nombre: string;
      tipo: string;
      comision?: number | null;
      prima?: number | null;
      aporte: number;
      total: number;
      tope?: number | null;
    } | null;
    conceptos: {
      idConcepto: number;
      nombreConcepto: string;
      valor: number;
      tipoConcepto: "INGRESO" | "DESCUENTO";
    }[];
  }>
> => {
  try {
    const response: AxiosResponse<
      ApiResponse<{
        idTrabajador: number;
        apellidosNombres: string;
        categoria: { idCategoria: number; nombre: string } | null;
        regimen: {
          idRegimen: number;
          nombre: string;
          tipo: string;
          comision?: number | null;
          prima?: number | null;
          aporte: number;
          total: number;
          tope?: number | null;
        } | null;
        conceptos: {
          idConcepto: number;
          nombreConcepto: string;
          valor: number;
          tipoConcepto: "INGRESO" | "DESCUENTO";
        }[];
      }>
    > = await api.get(`${endpoint}/${idTrabajador}/detalle-planilla`);

    return response.data;
  } catch (error) {
    console.error("Error al obtener detalle de planilla del trabajador:", error);
    throw error;
  }
};
