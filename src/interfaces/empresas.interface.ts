export interface Empresa {
    id: number
    code: string
    ruc: string
    razonSocial: string
    direccion:string
    ciudad: string
    regimenId: number
    planContableId:number
    web:string,
    email:string
    telefono:string
    giro:string,
    rutaBd:string
    rutaArchivos:string
    rutaImagenes:string
    logo:string
    estado:boolean
    idUsuarioCreado:number
    fechaCreacion:string
    idUsuarioModificado:number
    fechaModificacion:string
}

export interface EmpresaList {
    id: number
    code: string
    ruc: string
    razonSocial: string
    fechaCreacion?:string
    estado:boolean
}

export interface EmpresaRequest {
    code: string
    ruc: string
    razonSocial: string
    direccion:string
    ciudad: string
    regimenId: number
    planContableId:number
    web:string,
    email:string
    telefono:string
    giro:string,
    rutaBd:string
    rutaArchivos:string
    rutaImagenes:string
    logo:string
    idUsuarioCreado:number
    idUsuarioModificado:number
}

