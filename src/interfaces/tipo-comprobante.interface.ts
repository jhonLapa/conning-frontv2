export interface TipoComprobante {
  idTipoComprobante: number;
  codigo: string;
  nombre: string;
  estado: number;
  fechaCreacion: string;
  usuarioCreacion: string | null;
}
export interface TipoComprobanteRequest {
  codigo: string;
  nombre: string;
}
export interface TipoComprobanteForm {
  nombre: string;
}