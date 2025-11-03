import { Cliente } from "./cliente.interface";
import { Proyecto } from "./proyecto.interface";
import { TipoComprobante } from "./tipo-comprobante.interface";

export interface Venta {
  idVenta: number;
  idTipoComprobante: number;
  serie: string;
  numero: string;
  fechaEmision: string;
  idCliente: number;
  formaPago: string;
  tipoMoneda: string;
  observacion: string;
  subTotal: number;
  anticipos: number;
  descuentos: number;
  valorPago: number;
  isc: number;
  igv: number;
  icbper: number;
  otrosCargos: number;
  otrosTributos: number;
  montoRedondeo: number;
  importeTotal: number;
  detraccionAplica: boolean;
  detraccionPorcentaje: number;
  detraccionMonto: number;
  cuentaDetraccion: string | null;
  estado: number;
  fechaCreacion: string;
  usuarioCreacion: string | null;
  idProyecto: number;

  cliente: Cliente;
  tipoComprobante: TipoComprobante;
  proyecto: Proyecto;
  detalles: DetalleVenta[];
  pagosCredito: PagoCredito[];
  depositosVenta: DepositosVentaRequest[];
}

export interface DetalleVenta {
  idDetalleVenta: number;
  idVenta: number;
  cantidad: number;
  unidadMedida: string;
  descripcion: string;
  valorUnitario: number;
  icbper: number | null;
  valorTotal: number;
}

export interface PagoCredito {
  fechaVencimiento?: string;
  montoCuota?: number;
}

export interface VentaRequest {
  idVenta?: number;
  idTipoComprobante: number;
  serie: string;
  numero: string;
  fechaEmision: string;
  idCliente: number;
  formaPago: string;
  tipoMoneda: string;
  observacion?: string;
  subTotal: number;
  descuentos: number;
  valorPago: number;
  igv: number;
  importeTotal: number;
  idProyecto: number;
  estado: number;

  detalles: DetalleRequest[];
  pagosCredito: PagoCreditoRequest[];
  depositosVenta: DepositosVentaRequest[];
    calcularFondoGarantia?: "SI" | "NO";

}

export interface DetalleRequest {
  cantidad: number;
  unidadMedida: string;
  descripcion: string;
  valorUnitario: number;
  valorTotal: number;
}

export interface PagoCreditoRequest {
  fechaVencimiento: string;
  montoCuota: number;
}

export interface DepositosVentaRequest {
  fechaDeposito: string;
  monto: number;
}
