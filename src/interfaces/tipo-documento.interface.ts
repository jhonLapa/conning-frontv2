export interface TipoDocumento {
  idTipoDocumento: number;
  codigo: string;
  nombre: string;
  estado: number;
  fechaCreacion: string;
  usuarioCreacion: string | null;
  fechaModificacion: string;
  usuarioModificacion: string | null;
}
export interface TipoDocumentoRequest {
  codigo: string;
  nombre: string;
}
