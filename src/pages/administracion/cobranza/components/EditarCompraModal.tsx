import React, { useState, useEffect } from 'react';
import {
  getProveedoresActivos,
  getTiposComprobanteActivos,
  registrarCompraCompleta,
  type Compra,
  type Proveedor,
  type TipoComprobante,
  type CompraRequest
} from '../services/api';

interface EditarCompraModalProps {
  compra: Compra | null;
  onClose: () => void;
  onSaved: () => void;
}

interface Producto {
  id: number;
  cantidad: string;
  unidadMedida: string;
  descripcion: string;
  valorUnitario: string;
}

interface PagoCuota {
  id: number;
  fechaVencimiento: string;
  montoCuota: string;
}

const EditarCompraModal: React.FC<EditarCompraModalProps> = ({ compra, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    idCompra: 0,
    idTipoComprobante: 0,
    serie: '',
    numero: '',
    fechaEmision: new Date().toISOString().split('T')[0],
    idProveedor: 0,
    formaPago: 'Contado',
    tipoMoneda: 'SOLES',
    observacion: '',
    descuentos: 0
  });

  const [productos, setProductos] = useState<Producto[]>([
    { id: 1, cantidad: '', unidadMedida: 'UNIDAD', descripcion: '', valorUnitario: '' }
  ]);

  const [pagosCuotas, setPagosCuotas] = useState<PagoCuota[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [tiposComprobante, setTiposComprobante] = useState<TipoComprobante[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchProveedor, setSearchProveedor] = useState<string>('');
  const [showProveedorDropdown, setShowProveedorDropdown] = useState(false);
  const [filteredProveedores, setFilteredProveedores] = useState<Proveedor[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataProveedores, dataTiposComprobante] = await Promise.all([
          getProveedoresActivos(),
          getTiposComprobanteActivos()
        ]);
        setProveedores(dataProveedores);
        setTiposComprobante(dataTiposComprobante);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, []);

  // Filtrar proveedores en tiempo real
  useEffect(() => {
    if (searchProveedor.trim()) {
      const filtered = proveedores.filter(proveedor =>
        proveedor.nombreCompleto.toLowerCase().includes(searchProveedor.toLowerCase()) ||
        (proveedor.numeroDocumento && proveedor.numeroDocumento.includes(searchProveedor))
      );
      setFilteredProveedores(filtered);
      setShowProveedorDropdown(true);
    } else {
      setFilteredProveedores([]);
      setShowProveedorDropdown(false);
    }
  }, [searchProveedor, proveedores]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.proveedor-search-container')) {
        setShowProveedorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cargar datos de la compra cuando se pasa como prop
  useEffect(() => {
    if (compra) {
      setFormData({
        idCompra: compra.idCompra,
        idTipoComprobante: compra.idTipoComprobante,
        serie: compra.serie,
        numero: compra.numero,
        fechaEmision: compra.fechaEmision.split('T')[0],
        idProveedor: compra.idProveedor,
        formaPago: compra.formaPago,
        tipoMoneda: compra.tipoMoneda,
        observacion: compra.observacion || '',
        descuentos: compra.descuentos
      });

      // Cargar productos
      if (compra.detalles && compra.detalles.length > 0) {
        setProductos(compra.detalles.map((detalle, index) => ({
          id: index + 1,
          cantidad: detalle.cantidad.toString(),
          unidadMedida: detalle.unidadMedida,
          descripcion: detalle.descripcion,
          valorUnitario: detalle.valorUnitario.toString()
        })));
      }

      // Cargar cuotas de pago
      if (compra.pagosCredito && compra.pagosCredito.length > 0) {
        setPagosCuotas(compra.pagosCredito.map((pago, index) => ({
          id: index + 1,
          fechaVencimiento: pago.fechaVencimiento.split('T')[0],
          montoCuota: pago.montoCuota.toString()
        })));
      } else {
        setPagosCuotas([]);
      }
    }
  }, [compra]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'descuentos' ? parseFloat(value) || 0 :
              name === 'idTipoComprobante' || name === 'idProveedor' ? parseInt(value) || 0 : value
    }));
  };

  const handleProductChange = (id: number, field: keyof Producto, value: string) => {
    setProductos(prev => prev.map(prod =>
      prod.id === id ? { ...prod, [field]: value } : prod
    ));
  };

  const agregarProducto = () => {
    const nuevoId = Math.max(...productos.map(p => p.id)) + 1;
    setProductos(prev => [...prev, {
      id: nuevoId,
      cantidad: '',
      unidadMedida: 'UNIDAD',
      descripcion: '',
      valorUnitario: ''
    }]);
  };

  const eliminarProducto = (id: number) => {
    if (productos.length > 1) {
      setProductos(prev => prev.filter(prod => prod.id !== id));
    }
  };

  const handlePagoCuotaChange = (id: number, field: keyof PagoCuota, value: string) => {
    setPagosCuotas(prev => prev.map(pago =>
      pago.id === id ? { ...pago, [field]: value } : pago
    ));
  };

  const agregarPagoCuota = () => {
    const nuevoId = Math.max(...pagosCuotas.map(p => p.id), 0) + 1;
    const ultimaFecha = pagosCuotas.length > 0
      ? new Date(pagosCuotas[pagosCuotas.length - 1].fechaVencimiento)
      : new Date();

    ultimaFecha.setMonth(ultimaFecha.getMonth() + 1);

    setPagosCuotas(prev => [...prev, {
      id: nuevoId,
      fechaVencimiento: ultimaFecha.toISOString().split('T')[0],
      montoCuota: ''
    }]);
  };

  const eliminarPagoCuota = (id: number) => {
    if (pagosCuotas.length > 1) {
      setPagosCuotas(prev => prev.filter(pago => pago.id !== id));
    }
  };

  const calcularTotales = () => {
    const subTotal = productos.reduce((sum, prod) => {
      const cantidad = parseFloat(prod.cantidad) || 0;
      const valorUnitario = parseFloat(prod.valorUnitario) || 0;
      return sum + (cantidad * valorUnitario);
    }, 0);

    const descuentos = formData.descuentos || 0;
    const valorCompra = subTotal - descuentos;
    const igv = valorCompra * 0.18;
    const importeTotal = valorCompra + igv;

    return {
      subTotal: subTotal.toFixed(2),
      descuentos: descuentos.toFixed(2),
      valorCompra: valorCompra.toFixed(2),
      igv: igv.toFixed(2),
      importeTotal: importeTotal.toFixed(2)
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    setLoading(true);

    // Validaciones
    if (!formData.idTipoComprobante) {
      setErrorMessage('Debe seleccionar un tipo de comprobante');
      setLoading(false);
      return;
    }

    if (!formData.idProveedor) {
      setErrorMessage('Debe seleccionar un proveedor');
      setLoading(false);
      return;
    }

    if (productos.some(p => !p.cantidad || !p.valorUnitario || !p.descripcion)) {
      setErrorMessage('Complete todos los datos de los productos');
      setLoading(false);
      return;
    }

    if (formData.formaPago === 'Credito' && pagosCuotas.some(p => !p.fechaVencimiento || !p.montoCuota)) {
      setErrorMessage('Complete todos los datos de las cuotas');
      setLoading(false);
      return;
    }

    try {
      const totalesCalculados = calcularTotales();

      const compraData: CompraRequest = {
        idCompra: formData.idCompra,
        idTipoComprobante: formData.idTipoComprobante,
        serie: formData.serie,
        numero: formData.numero,
        fechaEmision: formData.fechaEmision,
        idProveedor: formData.idProveedor,
        formaPago: formData.formaPago,
        tipoMoneda: formData.tipoMoneda,
        observacion: formData.observacion,
        subTotal: parseFloat(totalesCalculados.subTotal),
        descuentos: parseFloat(totalesCalculados.descuentos),
        valorCompra: parseFloat(totalesCalculados.valorCompra),
        igv: parseFloat(totalesCalculados.igv),
        importeTotal: parseFloat(totalesCalculados.importeTotal),
        usuarioModificacion: 'admin',
        detalles: productos.map(prod => ({
          cantidad: parseFloat(prod.cantidad),
          unidadMedida: prod.unidadMedida,
          descripcion: prod.descripcion,
          valorUnitario: parseFloat(prod.valorUnitario),
          valorTotal: parseFloat(prod.cantidad) * parseFloat(prod.valorUnitario)
        })),
        pagosCredito: formData.formaPago === 'Credito'
          ? pagosCuotas.map(pago => ({
              fechaVencimiento: pago.fechaVencimiento,
              montoCuota: parseFloat(pago.montoCuota)
            }))
          : []
      };

      await registrarCompraCompleta(compraData);
      setSuccessMessage('¡Compra actualizada exitosamente!');

      setTimeout(() => {
        onSaved();
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error al actualizar compra:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al actualizar la compra');
    } finally {
      setLoading(false);
    }
  };

  const totales = calcularTotales();

  if (!compra) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header del Modal */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-800">Editar Compra</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="p-6">
          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos del Documento */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Datos del Documento</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Comprobante *</label>
                  <select
                    name="idTipoComprobante"
                    value={formData.idTipoComprobante}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    required
                  >
                    <option value={0}>-- Seleccione --</option>
                    {tiposComprobante.map((tipo) => (
                      <option key={tipo.idTipoComprobante} value={tipo.idTipoComprobante}>
                        {tipo.nombre} ({tipo.codigo})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serie *</label>
                  <input
                    type="text"
                    name="serie"
                    value={formData.serie}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Emisión *</label>
                  <input
                    type="date"
                    name="fechaEmision"
                    value={formData.fechaEmision}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pago *</label>
                  <select
                    name="formaPago"
                    value={formData.formaPago}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    <option value="Contado">Contado</option>
                    <option value="Credito">Crédito</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Moneda *</label>
                  <select
                    name="tipoMoneda"
                    value={formData.tipoMoneda}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    <option value="SOLES">SOLES</option>
                    <option value="DOLARES">DÓLARES</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descuentos</label>
                  <input
                    type="number"
                    name="descuentos"
                    value={formData.descuentos}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Proveedor */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Proveedor</h3>

              <div className="relative proveedor-search-container">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar Proveedor *
                </label>

                {/* Input de búsqueda con autocompletado */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchProveedor}
                    onChange={(e) => {
                      setSearchProveedor(e.target.value);
                      if (!e.target.value) {
                        setFormData(prev => ({ ...prev, idProveedor: 0 }));
                      }
                    }}
                    onFocus={() => {
                      if (searchProveedor.trim()) {
                        setShowProveedorDropdown(true);
                      }
                    }}
                    placeholder="Escriba el nombre del proveedor para buscar..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none pr-10"
                    autoComplete="off"
                  />
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Lista de resultados filtrados */}
                {showProveedorDropdown && filteredProveedores.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {filteredProveedores.map((proveedor) => (
                      <div
                        key={proveedor.idProveedor}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, idProveedor: proveedor.idProveedor }));
                          setSearchProveedor(proveedor.nombreCompleto);
                          setShowProveedorDropdown(false);
                        }}
                        className={`px-4 py-3 cursor-pointer hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                          formData.idProveedor === proveedor.idProveedor ? 'bg-orange-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{proveedor.nombreCompleto}</p>
                            {proveedor.numeroDocumento && (
                              <p className="text-sm text-gray-500 mt-0.5">RUC/DNI: {proveedor.numeroDocumento}</p>
                            )}
                            {proveedor.email && (
                              <p className="text-xs text-gray-400 mt-0.5">{proveedor.email}</p>
                            )}
                          </div>
                          {formData.idProveedor === proveedor.idProveedor && (
                            <svg className="h-5 w-5 text-orange-600 flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Mensaje cuando no hay resultados */}
                {showProveedorDropdown && searchProveedor && filteredProveedores.length === 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="px-4 py-8 text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="font-medium">No se encontraron proveedores</p>
                      <p className="text-sm mt-1">Intente con otro término de búsqueda</p>
                    </div>
                  </div>
                )}

                {/* Badge del proveedor seleccionado */}
                {formData.idProveedor && formData.idProveedor !== 0 && !showProveedorDropdown && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">Proveedor seleccionado</p>
                        <p className="text-sm text-green-700 mt-0.5">
                          {proveedores.find(p => p.idProveedor === formData.idProveedor)?.nombreCompleto}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, idProveedor: 0 }));
                        setSearchProveedor('');
                      }}
                      className="text-green-600 hover:text-green-800 transition-colors flex-shrink-0 ml-2"
                      title="Cambiar proveedor"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Productos */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Productos</h3>
                <button
                  type="button"
                  onClick={agregarProducto}
                  className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
                >
                  + Agregar
                </button>
              </div>

              {productos.map((producto, index) => (
                <div key={producto.id} className="mb-3 p-3 border border-gray-200 rounded-lg bg-white">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">Producto #{index + 1}</span>
                    {productos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => eliminarProducto(producto.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Cantidad *</label>
                      <input
                        type="number"
                        value={producto.cantidad}
                        onChange={(e) => handleProductChange(producto.id, 'cantidad', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Unidad *</label>
                      <select
                        value={producto.unidadMedida}
                        onChange={(e) => handleProductChange(producto.id, 'unidadMedida', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
                      >
                        <option value="UNIDAD">UNIDAD</option>
                        <option value="BOLSA">BOLSA</option>
                        <option value="METRO">METRO</option>
                        <option value="KILO">KILO</option>
                        <option value="SERVICIO">SERVICIO</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Valor Unitario *</label>
                      <input
                        type="number"
                        value={producto.valorUnitario}
                        onChange={(e) => handleProductChange(producto.id, 'valorUnitario', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Descripción *</label>
                      <textarea
                        value={producto.descripcion}
                        onChange={(e) => handleProductChange(producto.id, 'descripcion', e.target.value)}
                        rows={2}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cuotas de Crédito */}
            {formData.formaPago === 'Credito' && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Cuotas de Pago</h3>
                  <button
                    type="button"
                    onClick={agregarPagoCuota}
                    className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
                  >
                    + Agregar Cuota
                  </button>
                </div>

                {pagosCuotas.map((pago, index) => (
                  <div key={pago.id} className="mb-3 p-3 border border-gray-200 rounded-lg bg-white">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold">Cuota #{index + 1}</span>
                      {pagosCuotas.length > 1 && (
                        <button
                          type="button"
                          onClick={() => eliminarPagoCuota(pago.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Vencimiento *</label>
                        <input
                          type="date"
                          value={pago.fechaVencimiento}
                          onChange={(e) => handlePagoCuotaChange(pago.id, 'fechaVencimiento', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Monto *</label>
                        <input
                          type="number"
                          value={pago.montoCuota}
                          onChange={(e) => handlePagoCuotaChange(pago.id, 'montoCuota', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Observaciones */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Observaciones</h3>
              <textarea
                name="observacion"
                value={formData.observacion}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
              />
            </div>

            {/* Totales */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Totales</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-white rounded p-3 text-center">
                  <p className="text-xs text-gray-600">Sub Total</p>
                  <p className="text-lg font-bold">S/ {totales.subTotal}</p>
                </div>
                <div className="bg-white rounded p-3 text-center">
                  <p className="text-xs text-gray-600">Descuentos</p>
                  <p className="text-lg font-bold">S/ {totales.descuentos}</p>
                </div>
                <div className="bg-white rounded p-3 text-center">
                  <p className="text-xs text-gray-600">Valor Compra</p>
                  <p className="text-lg font-bold">S/ {totales.valorCompra}</p>
                </div>
                <div className="bg-white rounded p-3 text-center">
                  <p className="text-xs text-gray-600">IGV (18%)</p>
                  <p className="text-lg font-bold">S/ {totales.igv}</p>
                </div>
                <div className="bg-white rounded p-3 text-center">
                  <p className="text-xs text-gray-600">Total</p>
                  <p className="text-xl font-bold text-orange-600">S/ {totales.importeTotal}</p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Actualizar Compra'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarCompraModal;
