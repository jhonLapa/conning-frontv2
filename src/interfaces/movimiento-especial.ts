export interface MovimientoEspecial {
  idMovimientoEspecial: number;
  fecha: string;
  descripcion: string;
  monto: number;
  tipoMovimiento: string;
  cuentaBancaria: string;
  estado: number;
  observacion: string;
  fechaCreacion: string;
  usuarioCreacion: string | null;
}
export interface MovimientoEspecialRequest {
  fecha: string;
  descripcion: string;
  monto: number;
  tipoMovimiento: string;
  cuentaBancaria: string;
  observacion: string;
}
