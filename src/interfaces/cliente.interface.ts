export interface Cliente {
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

export interface SaveCliente {
    codigo: string,
    tipoDoc: string,
    razonSocial: string,
    direccion:string,
    numeroDoc:string,
    email:string,
    telefono:string,
    vendedorId:number,
    departamentoId: number,
    documentoId: number,
    provinciaId: number,
    distritoId: number,
    lineaCredito: string,
    ampliacionLineaCredito: string,
    status: boolean
}