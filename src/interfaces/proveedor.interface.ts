import { TipoDocumento } from "./document.interface";

export interface Proveedor {
  idProveedor: number;
  nombreCompleto: string;
  tipoDocumentoId: number;
  numeroDocumento: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  estado: number;
  fechaCreacion: string;
  tipoDocumento: TipoDocumento;
}

export interface ProveedorRequest{
    nombreCompleto: string;
    tipoDocumentoId: number;
    numeroDocumento: string;
    direccion: string;
    telefono: string;
    email: string;
}
