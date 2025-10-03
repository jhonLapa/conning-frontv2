import { TipoDocumento } from "./document.interface";

export interface Cliente {
  idCliente: number;
  nombreCompleto: string;
  tipoDocumentoId: number;
  numeroDocumento: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: number;
  fechaCreacion: string;
  tipoDocumento: TipoDocumento;
}

export interface ClienteRequest {
  nombreCompleto: string;
  tipoDocumentoId: number;
  numeroDocumento: string;
  direccion: string;
  telefono: string;
  email: string;
}
