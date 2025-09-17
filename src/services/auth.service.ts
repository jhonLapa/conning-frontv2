import {
  ApiResponse,
  LoginDto,
  LoginResponse,
  User,
  ValidateCodeDto,
} from "@/interfaces";
import api from "@/lib/api";
import { handleApiError } from "@/lib/utils";

export const callLogin = async (payload: LoginDto): Promise<ApiResponse<LoginResponse | null>> => {
  try {
    const response = await api.post("/auth/login", payload);
    return response.data as ApiResponse<LoginResponse>;
  } catch (error) {
    return handleApiError<LoginResponse>(error);
  }
};

export const verficarCode = async (payload: ValidateCodeDto) => {
  try {
    const response = await api.post("/auth/validate", payload);
    return response.data as ApiResponse<User>;
  } catch (e) {
    console.log(e);
  }
};
