export interface GrupoConcepto {
    idGrupo: number,
    codigo: string,
    nombre: string,
    estado: number,
    idUsuarioCreacion: number,
    fechaCreacion: string,
}

export interface GrupoConceptoSelect {
    idGrupo: number
    codigo: string,
    nombre: string,
}

export interface GrupoConceptoRequest {
    codigo: string,
    nombre: string,
}