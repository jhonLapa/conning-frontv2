export interface TipoDocumento {
  idTipoDocumento: number;
  nombre: string;
  codigo: string;
  estado: number;
  fechaCreacion: string;
}

export interface TipoDocumentoRequest {
  nombre: string;
  codigo: string;
}
