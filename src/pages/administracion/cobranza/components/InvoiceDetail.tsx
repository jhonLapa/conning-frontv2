import React, { useState } from 'react';
import { getCompraById, type Compra } from '../services/api';

const InvoiceDetail: React.FC = () => {
  const [idCompra, setIdCompra] = useState<string>('');
  const [compra, setCompra] = useState<Compra | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!idCompra || parseInt(idCompra) <= 0) {
      setError('Por favor ingrese un ID válido');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getCompraById(parseInt(idCompra));
      setCompra(response.data);
    } catch (err) {
      setError('No se encontró la compra o ocurrió un error');
      setCompra(null);
      console.error('Error al buscar compra:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Ver Detalle de Compra</h1>
        <p className="text-gray-600 mt-2">Buscar y visualizar información detallada de una compra</p>
      </div>

      {/* Búsqueda */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 mb-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">ID de Compra</label>
            <input
              type="number"
              value={idCompra}
              onChange={(e) => setIdCompra(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              placeholder="Ingrese el ID de la compra"
              min="1"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Buscando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m21 21-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Buscar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {/* Detalle de Compra */}
      {compra && (
        <div className="space-y-6">
          {/* Información General */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Información General
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">ID Compra</p>
                <p className="text-base font-semibold text-gray-800">{compra.idCompra}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo Comprobante</p>
                <p className="text-base font-semibold text-gray-800">{compra.tipoComprobante?.nombre || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Serie - Número</p>
                <p className="text-base font-semibold text-gray-800">{compra.serie} - {compra.numero}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha Emisión</p>
                <p className="text-base font-semibold text-gray-800">{formatDate(compra.fechaEmision)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Forma de Pago</p>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  compra.formaPago === 'Contado'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {compra.formaPago}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo Moneda</p>
                <p className="text-base font-semibold text-gray-800">{compra.tipoMoneda}</p>
              </div>
            </div>

            {compra.observacion && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Observación</p>
                <p className="text-base text-gray-800">{compra.observacion}</p>
              </div>
            )}
          </div>

          {/* Información del Proveedor */}
          {compra.proveedor && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Información del Proveedor
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre Completo</p>
                  <p className="text-base font-semibold text-gray-800">{compra.proveedor.nombreCompleto}</p>
                </div>
                {compra.proveedor.numeroDocumento && (
                  <div>
                    <p className="text-sm text-gray-600">Documento</p>
                    <p className="text-base font-semibold text-gray-800">{compra.proveedor.numeroDocumento}</p>
                  </div>
                )}
                {compra.proveedor.telefono && (
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="text-base font-semibold text-gray-800">{compra.proveedor.telefono}</p>
                  </div>
                )}
                {compra.proveedor.email && (
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-base font-semibold text-gray-800">{compra.proveedor.email}</p>
                  </div>
                )}
                {compra.proveedor.direccion && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Dirección</p>
                    <p className="text-base font-semibold text-gray-800">{compra.proveedor.direccion}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Importes */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-sm p-6 border border-orange-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Importes</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-gray-600 mb-1">Sub Total</p>
                <p className="text-lg font-bold text-gray-800">{formatCurrency(compra.subTotal)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-gray-600 mb-1">Descuentos</p>
                <p className="text-lg font-bold text-gray-800">{formatCurrency(compra.descuentos)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-gray-600 mb-1">Valor Compra</p>
                <p className="text-lg font-bold text-gray-800">{formatCurrency(compra.valorCompra)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-gray-600 mb-1">IGV</p>
                <p className="text-lg font-bold text-gray-800">{formatCurrency(compra.igv)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-xl font-bold text-orange-600">{formatCurrency(compra.improteTotal)}</p>
              </div>
            </div>
          </div>

          {/* Detalles de Compra */}
          {compra.detalles && compra.detalles.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Detalles de la Compra
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">U.M.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor Unit.</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {compra.detalles.map((detalle, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{detalle.cantidad}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{detalle.unidadMedida}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{detalle.descripcion}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(detalle.valorUnitario)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-green-600">{formatCurrency(detalle.valorTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagos a Crédito */}
          {compra.pagosCredito && compra.pagosCredito.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Pagos a Crédito
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Vencimiento</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto Cuota</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto Pagado</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {compra.pagosCredito.map((pago, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(pago.fechaVencimiento)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">{formatCurrency(pago.montoCuota)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            pago.estadoPago === 'PENDIENTE'
                              ? 'bg-yellow-100 text-yellow-800'
                              : pago.estadoPago === 'PAGADO'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {pago.estadoPago || 'PENDIENTE'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">{formatCurrency(pago.montoPagado || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Información de Auditoría */}
          <div className="bg-gray-50 rounded-2xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Información de Auditoría</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Fecha Creación</p>
                <p className="text-gray-800 font-medium">{compra.fechaCreacion ? formatDate(compra.fechaCreacion) : 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Usuario Creación</p>
                <p className="text-gray-800 font-medium">{compra.usuarioCreacion || 'N/A'}</p>
              </div>
              {compra.fechaModificacion && (
                <>
                  <div>
                    <p className="text-gray-600">Fecha Modificación</p>
                    <p className="text-gray-800 font-medium">{formatDate(compra.fechaModificacion)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Usuario Modificación</p>
                    <p className="text-gray-800 font-medium">{compra.usuarioModificacion || 'N/A'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetail;
