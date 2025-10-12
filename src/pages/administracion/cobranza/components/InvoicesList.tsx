import React, { useState, useEffect } from 'react';
import { getComprasPaginadas, getCompraById, eliminarCompra, type Compra, type PaginatedResponse } from '../services/api';
import { generarPDFFactura } from '../utils/pdfGenerator';
import EditarCompraModal from './EditarCompraModal';

const InvoicesList: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Estado para el modal de edición
  const [compraSeleccionada, setCompraSeleccionada] = useState<Compra | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    fetchCompras();
  }, [currentPage]);

  const fetchCompras = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: PaginatedResponse<Compra> = await getComprasPaginadas({
        page: currentPage,
        take: pageSize
      });

      setCompras(response.data);
      setTotalPages(response.meta.totalPages);
      setTotalCount(response.meta.totalCount);
    } catch (err) {
      setError((err as Error).message || 'Error al cargar compras');
      console.error('Error al cargar compras:', err);
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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleVerPDF = async (idCompra: number) => {
    try {
      const compraCompleta = await getCompraById(idCompra);
      generarPDFFactura(compraCompleta.data, true);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta nuevamente.');
    }
  };

  const handleEditar = (compra: Compra) => {
    setCompraSeleccionada(compra);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setCompraSeleccionada(null);
  };

  const handleCompraGuardada = () => {
    // Recargar la lista después de guardar cambios
    fetchCompras();
  };

  const handleEliminar = async (idCompra: number, serie: string, numero: string) => {
    const confirmar = window.confirm(
      `¿Está seguro que desea eliminar la compra ${serie}-${numero}?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmar) {
      try {
        await eliminarCompra(idCompra);
        alert('Compra eliminada exitosamente');
        // Recargar la lista
        fetchCompras();
      } catch (error) {
        console.error('Error al eliminar compra:', error);
        alert('Error al eliminar la compra. Por favor, intenta nuevamente.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando compras...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error al cargar compras</h3>
        <p className="text-red-600">{error}</p>
        <p className="text-sm text-red-500 mt-2">Asegúrate de que el servidor esté disponible</p>
        <button
          onClick={fetchCompras}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Compras Registradas</h1>
        <p className="text-gray-600 mt-2">Listado de todas las compras realizadas ({totalCount} registros)</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Compras</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalCount}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monto Total (Página Actual)</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(compras.reduce((sum, compra) => sum + (compra.improteTotal || (compra as any).importeTotal || 0), 0))}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Página Actual</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {currentPage} de {totalPages}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de compras */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {compras.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-gray-600 text-lg">No hay compras registradas</p>
            <p className="text-gray-400 text-sm mt-1">Crea tu primera compra desde el formulario</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comprobante</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serie-Número</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Forma Pago</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Moneda</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {compras.map((compra) => (
                    <tr key={compra.idCompra} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {compra.tipoComprobante?.nombre || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {compra.tipoComprobante?.codigo || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">
                          {compra.serie}-{compra.numero}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(compra.fechaEmision)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {compra.proveedor?.nombreCompleto || 'N/A'}
                        </div>
                        {compra.proveedor?.numeroDocumento && (
                          <div className="text-xs text-gray-500">
                            Doc: {compra.proveedor.numeroDocumento}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          compra.formaPago === 'Contado'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {compra.formaPago}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                        {compra.tipoMoneda}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-semibold text-green-600">
                          {formatCurrency(compra.improteTotal || (compra as any).importeTotal || 0)}
                        </div>
                        <div className="text-xs text-gray-500">
                          IGV: {formatCurrency(compra.igv || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          compra.estado === 1
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {compra.estado === 1 ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Botón Ver PDF */}
                          <button
                            onClick={() => handleVerPDF(compra.idCompra)}
                            className="inline-flex items-center justify-center p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            title="Ver PDF"
                          >
                            <svg
                              className="w-5 h-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>

                          {/* Botón Editar */}
                          <button
                            onClick={() => handleEditar(compra)}
                            className="inline-flex items-center justify-center p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                            title="Editar"
                          >
                            <svg
                              className="w-5 h-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>

                          {/* Botón Eliminar */}
                          <button
                            onClick={() => handleEliminar(compra.idCompra, compra.serie, compra.numero)}
                            className="inline-flex items-center justify-center p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            title="Eliminar"
                          >
                            <svg
                              className="w-5 h-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Mostrando página {currentPage} de {totalPages} ({totalCount} registros en total)
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      Anterior
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de edición */}
      {modalAbierto && compraSeleccionada && (
        <EditarCompraModal
          compra={compraSeleccionada}
          onClose={handleCerrarModal}
          onSaved={handleCompraGuardada}
        />
      )}
    </div>
  );
};

export default InvoicesList;
