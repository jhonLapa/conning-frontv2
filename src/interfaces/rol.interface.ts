export interface Rol{
    roleId: number;
    name: string;
    descripcion: string;
    state: boolean;
}

export  interface RolRequest{
    name: string;
    descripcion: string;
}