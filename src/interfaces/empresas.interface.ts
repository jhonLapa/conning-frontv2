export interface Empresa {
  idEmpresa: number
  codigo: string
  ruc: string
  razonSocial: string
  direccion: string
  ciudad: string
  regimenId: number | null
  planContableId: number | null
  web: string | null
  email: string | null
  telefono: string | null
  giro: string | null
  rutaBd: string | null
  rutaArchivos: string | null
  rutaImagenes: string | null
  logo: string | null
  estado: boolean
  idUsuarioCreacion: number | null
  idUsuarioModificacion: number | null
  fechaCreacion: string
  fechaModificacion: string | null
}

export interface EmpresaList {
  idEmpresa: number
  codigo: string
  ruc: string
  razonSocial: string
  fechaCreacion?: string
  estado: boolean
}

export interface EmpresaRequest {
  codigo: string
  ruc: string
  razonSocial: string
  direccion: string
  ciudad: string
  regimenId: number | null
  planContableId: number | null
  web: string | null
  email: string | null
  telefono: string | null
  giro: string | null
  rutaBd: string | null
  rutaArchivos: string | null
  rutaImagenes: string | null
  logo: string | null
  idUsuarioCreacion: number
  idUsuarioModificacion: number | null
}
