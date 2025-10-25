import { User } from "@/stores/auth.store"
import { Rol } from "./rol.interface"

export interface LoginDto {
    email: string
    password:string
}
export interface LoginResponse {
    accessToken: string,
    refreshToken: string,
    user: User
    rol: Rol
}
