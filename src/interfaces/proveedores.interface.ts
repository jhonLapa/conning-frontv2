export interface Proveedores {
    id:number
    codigo: string,
    nombre: string,
    tipoDoc: string,
    direccion:string,
    numeroDoc:string,
    telefono:string,
    email:string,
    status: boolean
}

export interface SaveProveedores {
    codigo: string,
    tipoDoc: string,
    razonSocial: string,
    direccion:string,
    numeroDoc:string,
    email:string,
    telefono:string,
    status: boolean
}