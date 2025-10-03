export interface Document {
  idTipoDocumento: number;
  nombre: string;
  codigo: string;
  estado: number;
  fechaCreacion: string;
}

export interface DocumentRequest {
  nombre: string;
  codigo: string;
}
