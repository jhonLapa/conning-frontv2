import { User } from "@/stores/auth.store"

export interface LoginDto {
    email: string
    password:string
}
export interface LoginResponse {
    accessToken: string,
    refreshToken: string,
    user: User
}
