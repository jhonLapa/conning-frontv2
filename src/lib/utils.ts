import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AxiosError } from "axios";
import { ApiResponse } from "@/interfaces/api.response";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isLocationMatch = (
  targetLocation: string,
  locationName: string
): boolean => {
  if (!targetLocation || !locationName) return false;

  return (
    locationName === targetLocation ||
    locationName.startsWith(`${targetLocation}/`)
  );
};


export function handleApiError<T>(error: unknown): ApiResponse<T | null> {
  const err = error as AxiosError<ApiResponse<T | null>>;

  if (err.response?.data) {
    const { success, data, message } = err.response.data;

    if (success && data === null) {
      return {
        success: false,
        data: null,
        message: "No se encontró información relacionada",
      };
    }

    return {
      success: success ?? false,
      data: data ?? null,
      message: message ?? "Error desconocido",
    };
  }

  // Evitar mensaje genérico feo si es error 400 sin cuerpo
  if (err.response?.status === 400) {
    return {
      success: false,
      data: null,
      message: "Solicitud incorrecta. Verifica el ID o los parámetros.",
    };
  }

  return {
    success: false,
    data: null,
    message: err.message || "Error desconocido",
  };
}
