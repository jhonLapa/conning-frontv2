import { Afectacion } from "./afectacione.interface"
import { GrupoConcepto } from "./grupo-concepto"

export interface Concepto {
    idConcepto: number,
    idGrupo: number,
    codigo: string
    descripcion:string
    ctaDebe: string
    ctaHaber: string
    principalDH: string
    state: boolean
    activo: boolean,
    calculoAutomatico: boolean,
    generaArchivoPLAME: boolean,
    estado: number,
    fechaCreacion: string,
    grupo: GrupoConcepto
}

export interface ConceptoRequest {
    idGrupo: number,
    codigo: string,
    descripcion: string,
    activo: boolean,
    ctaDebe: string,
    ctaHaber: string,
    principalDH: string,
    calculoAutomatico: boolean,
    generaArchivoPLAME: boolean
}

export interface ConceptoAfectacion {
  idConceptoAfectacion: number,
  idConcepto: number,
  idAfectacion: number,
  estado: number,
  idUsuarioCreacion: number,
  fechaCreacion: string,
  afectacion: Afectacion
}

export interface ConceptoAfectacionInput {
  idAfectacion: number
  idValid?: number
  nombre: string
  estado: boolean
}

export interface ConceptoAfectacionRequest {
  idAfectacion: number
  idConcepto: number
  estado: number
}


