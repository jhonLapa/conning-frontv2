import api from "@/lib/api";
import { Compra, CompraRequest, Proveedor, TipoComprobante } from "@/interfaces/compra.interface";

export const compraService = {
  /**
   * Obtiene los tipos de comprobante activos
   */
  getTiposComprobanteActivos: async (): Promise<TipoComprobante[]> => {
    const response = await api.get('/tipocomprobante/selectactivos');
    return response.data;
  },

  /**
   * Obtiene la lista de proveedores activos
   */
  getProveedoresActivos: async (): Promise<Proveedor[]> => {
    const response = await api.get('/proveedor/selectactivos');
    return response.data;
  },

  /**
   * Obtiene compra por ID
   */
  getById: async (id: number): Promise<Compra> => {
    const response = await api.get(`/compra/${id}`);
    return response.data.data;
  },

  /**
   * Registra o actualiza una compra completa
   */
  save: async (compraData: CompraRequest): Promise<any> => {
    console.log('Datos enviados al backend:', JSON.stringify(compraData, null, 2));
    console.log('URL completa:', api.defaults.baseURL + 'compra/registrarcompleto');

    try {
      const response = await api.post('/compra/registrarcompleto', compraData);
      return response.data;
    } catch (error: any) {
      console.error('Error detallado:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      throw error;
    }
  },

  /**
   * Elimina una compra por su ID
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/compra/${id}`);
  },
};
