import { TipoDocumento } from '@/interfaces/document.interface';
import axios from 'axios';

const API_BASE = 'http://cotos02-002-site3.qtempurl.com/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interface para Tipo de Comprobante
 */
export interface TipoComprobante {
  idTipoComprobante: number;
  codigo: string;
  nombre: string;
  estado?: number;
  fechaCreacion?: string;
  usuarioCreacion?: string | null;
}

/**
 * Interface para Proveedor
 */
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
  tipoDocumento?: TipoDocumento;
}

/**
 * Interface para Detalle de Compra
 */
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

/**
 * Interface para Pago a Crédito
 */
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

/**
 * Interface para Compra completa (respuesta del servidor)
 */
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

/**
 * Interface para registrar/actualizar compra
 */
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

/**
 * Interface para respuesta paginada
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}

/**
 * Obtiene los tipos de comprobante activos
 */
export const getTiposComprobanteActivos = async (): Promise<TipoComprobante[]> => {
  try {
    const response = await api.get('/tipocomprobante/selectactivos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener tipos de comprobante:', error);
    throw error;
  }
};

/**
 * Obtiene la lista de proveedores activos
 */
export const getProveedoresActivos = async (): Promise<Proveedor[]> => {
  try {
    const response = await api.get('/proveedor/selectactivos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    throw error;
  }
};

/**
 * Obtiene compras con paginación
 */
export const getComprasPaginadas = async (params: {
  page: number;
  take: number;
}): Promise<PaginatedResponse<Compra>> => {
  try {
    const { page, take } = params;
    const response = await api.get(`/compra/busquedapaginado?Page=${page}&Take=${take}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener compras:', error);
    throw error;
  }
};

/**
 * Obtiene compra por ID
 */
export const getCompraById = async (id: number): Promise<{ data: Compra }> => {
  try {
    const response = await api.get(`/compra/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener compra:', error);
    throw error;
  }
};

/**
 * Registra o actualiza una compra completa
 * Si idCompra es 0, crea una nueva compra
 * Si idCompra es diferente de 0, actualiza la compra existente
 */
export const registrarCompraCompleta = async (compraData: CompraRequest): Promise<any> => {
  try {
    const response = await api.post('/compra/registrarcompleto', compraData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar/actualizar compra:', error);
    throw error;
  }
};

export const eliminarCompra = async (id: number): Promise<void> => {
  try {
    const response = await api.delete(`/compra/${id}`);
    console.log('Compra eliminada correctamente:', response.data);
  } catch (error) {
    console.error('Error al eliminar compra:', error);
    throw error;
  }
};


export default api;
