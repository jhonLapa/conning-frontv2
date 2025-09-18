import { BaseCore } from "./core.interface"

export interface Usuario extends BaseCore {
    userId: number
    firstName: string
    lastName: string
    email: string
    password: string
    state: boolean
}

export interface UsuarioRequest {
    firstName: string
    lastName: string
    email: string
    password: string
    state: boolean
}
