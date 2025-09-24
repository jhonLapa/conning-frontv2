export interface Afectacion {
    idAfectacion: number
    nombre: string
    codigo: string
    estado: number
    fechaCreacion: string
    idUsuarioCreacion: number
    FechaModificacion: string
    idUsuarioModificacion: number
}

export interface AfectacionMap{
    id: string
    label: string
    code: string
}

export interface AfectacionRequest {
    nombre: string,
    codigo: string
}


export interface AfectacionConfiguracion {
    idEmpresa: number
    idAfectacion: number
    porcentaje: number
    activo: boolean
}