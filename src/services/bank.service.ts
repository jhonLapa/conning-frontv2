import { ApiResponse } from "@/interfaces";
import { Bank, BankRequest } from "@/interfaces/bank.interface";
import api from "@/lib/api";
import { type AxiosResponse } from "axios";

export const getBankFecth = async (): Promise<Bank[]> => {
  const response: AxiosResponse<Bank[]> = await api.get(`/banco`);
  return response.data;
};

export const getFechtBankById = async (id: number): Promise<Bank> => {
  const response: AxiosResponse<Bank> = await api.get(`/banco/${id}`);
  return response.data;
};

export const postBank = async (
  paylod: BankRequest
): Promise<ApiResponse<Bank>> => {
  const response: AxiosResponse<ApiResponse<Bank>> = await api.post(
    `/banco`,
    paylod
  );
  return response.data;
};

export const putBank = async (
  id: number,
  paylod: BankRequest
): Promise<ApiResponse<Bank>> => {
  const response: AxiosResponse<ApiResponse<Bank>> = await api.put(
    `/banco/${id}`,
    paylod
  );
  return response.data;
};

export const activeOrdesactiveBank = async (
  id: number
): Promise<ApiResponse<Bank>> => {
  const response: AxiosResponse<ApiResponse<Bank>> = await api.delete(
    `/banco/${id}`
  );
  return response.data;
};
