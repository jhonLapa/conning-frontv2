import { ApiResponse } from "@/interfaces";
import {
  CuentaBancariaTrabajador,
  CuentaBancariaTrabajadorSaveRequest,
} from "@/interfaces/cuenta-bancaria-trabajador.interface";
import api from "@/lib/api"; // Asumiendo que tu archivo api está en @/lib/api
import { type AxiosResponse } from "axios";

const endpoint = "/cuentabancaria";

// Obtener todas las cuentas de un trabajador (por idTrabajador)
export const getCuentasByTrabajador = async (
  idTrabajador: number
): Promise<CuentaBancariaTrabajador[]> => {
  // Nota: La ruta asume un endpoint del backend para obtener cuentas por trabajador ID
  const response: AxiosResponse<CuentaBancariaTrabajador[]> = await api.get(
    `${endpoint}/trabajador/${idTrabajador}`
  );
  return response.data;
};

// Obtener una cuenta bancaria por su ID
export const getFechtCuentaById = async (
  id: number
): Promise<CuentaBancariaTrabajador> => {
  const response: AxiosResponse<CuentaBancariaTrabajador> = await api.get(
    `${endpoint}/${id}`
  );
  return response.data;
};

// Crear una nueva cuenta bancaria
export const postCuentaBancaria = async (
  payload: CuentaBancariaTrabajadorSaveRequest
): Promise<ApiResponse<CuentaBancariaTrabajador>> => {
  const response: AxiosResponse<ApiResponse<CuentaBancariaTrabajador>> =
    await api.post(`${endpoint}`, payload);
  return response.data;
};

// Actualizar una cuenta bancaria existente
export const putCuentaBancaria = async (
  id: number,
  payload: CuentaBancariaTrabajadorSaveRequest
): Promise<ApiResponse<CuentaBancariaTrabajador>> => {
  const response: AxiosResponse<ApiResponse<CuentaBancariaTrabajador>> =
    await api.put(`${endpoint}/${id}`, payload);
  return response.data;
};

// Activar o desactivar (eliminar lógico) una cuenta bancaria
// Usamos el método DELETE siguiendo tu patrón, asumiendo que el backend maneja el cambio de estado (Estado=0)
export const activeOrdesactiveCuentaBancaria = async (
  id: number
): Promise<ApiResponse<CuentaBancariaTrabajador>> => {
  const response: AxiosResponse<ApiResponse<CuentaBancariaTrabajador>> =
    await api.delete(`${endpoint}/${id}`);
  return response.data;
};