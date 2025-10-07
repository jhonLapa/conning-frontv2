export interface TipoComprobante {
  idTipoComprobante: number;
  codigo: string;
  nombre: string;
  estado: number;
  fechaCreacion: string;
  usuarioCreacion: string | null;
}
