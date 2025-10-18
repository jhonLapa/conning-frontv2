import api from "@/lib/api";
import { Compra, CompraRequest, Proveedor, TipoComprobante } from "@/interfaces/compra.interface";
import { ApiResponse } from "@/interfaces";
import { AxiosResponse } from "axios";

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
save: async (compraData: CompraRequest): Promise<ApiResponse<Compra>> => {
  console.log('Datos enviados al backend:', JSON.stringify(compraData, null, 2));
  console.log('URL completa:', api.defaults.baseURL + 'compra/registrarcompleto');

  const response = await api.post('/compra/registrarcompleto', compraData);
  return response.data; // ahora es ApiResponse<Compra>
},


 
 delete : async (
  id: number
): Promise<ApiResponse<Compra>> => {
  const response: AxiosResponse<ApiResponse<Compra>> = await api.delete(
    `/compra/${id}`
  );
  return response.data;
},

 
};
