export interface TipoComprobante {
  idTipoComprobante: number;
  codigo: string;
  nombre: string;
  estado?: number;
  fechaCreacion?: string;
  usuarioCreacion?: string | null;
}

export interface Proveedor {
  idProveedor: number;
  nombreCompleto: string;
  tipoDocumentoId?: number;
  numeroDocumento?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  estado?: number;
  fechaCreacion?: string;
  fechaModificacion?: string;
  usuarioCreacion?: string | null;
  usuarioModificacion?: string | null;
  tipoDocumento?: any;
}

export interface DetalleCompra {
  idDetalleCompra?: number;
  idCompra?: number;
  cantidad: number;
  unidadMedida: string;
  descripcion: string;
  valorUnitario: number;
  icbper?: number | null;
  valorTotal: number;
}

export interface PagoCredito {
  idPagoCompraCredito?: number;
  idCompra?: number;
  fechaVencimiento: string;
  montoCuota: number;
  fechaPago?: string | null;
  montoPagado?: number;
  estadoPago?: string;
  observacion?: string | null;
  fechaCreacion?: string;
  usuarioCreacion?: string | null;
}

export interface Compra {
  idCompra: number;
  idTipoComprobante: number;
  serie: string;
  numero: string;
  fechaEmision: string;
  idProveedor: number;
  formaPago: string;
  tipoMoneda: string;
  observacion: string;
  subTotal: number;
  anticipios?: number;
  descuentos: number;
  valorCompra: number;
  isc?: number;
  igv: number;
  icbper?: number;
  otrosCargos?: number;
  otrosTributos?: number;
  montoRedondeo?: number;
  improteTotal: number;
  estado?: number;
  fechaCreacion?: string;
  usuarioCreacion?: string | null;
  fechaModificacion?: string | null;
  usuarioModificacion?: string | null;
  proveedor?: Proveedor;
  tipoComprobante?: TipoComprobante;
  detalles?: DetalleCompra[];
  pagosCredito?: PagoCredito[];
}

export interface CompraRequest {
  idCompra: number;
  idTipoComprobante: number;
  serie: string;
  numero: string;
  fechaEmision: string;
  idProveedor: number;
  formaPago: string;
  tipoMoneda: string;
  observacion: string;
  subTotal: number;
  descuentos: number;
  valorCompra: number;
  igv: number;
  importeTotal: number;
  usuarioCreacion?: string;
  usuarioModificacion?: string;
  detalles: Array<{
    cantidad: number;
    unidadMedida: string;
    descripcion: string;
    valorUnitario: number;
    valorTotal: number;
  }>;
  pagosCredito: Array<{
    fechaVencimiento: string;
    montoCuota: number;
  }>;
}
