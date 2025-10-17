import React, { useState, useEffect } from 'react';
import {
  getProveedoresActivos,
  getTiposComprobanteActivos,
  registrarCompraCompleta,
  getCompraById,
  type Proveedor,
  type TipoComprobante,
  type CompraRequest
} from '../services/api';
import { generarPDFFactura } from '../utils/pdfGenerator';

interface FormData {
  idCompra: number;
  idTipoComprobante: number | string;
  serie: string;
  numero: string;
  fechaEmision: string;
  idProveedor: number | string;
  formaPago: string;
  tipoMoneda: string;
  observacion: string;
  descuentos: number;
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

// Formulario de Nueva Compra con input autocompletado
const InvoiceForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    idCompra: 0,
    idTipoComprobante: '',
    serie: '',
    numero: '',
    fechaEmision: new Date().toISOString().split('T')[0],
    idProveedor: '',
    formaPago: 'Contado',
    tipoMoneda: 'SOLES',
    observacion: '',
    descuentos: 0
  });

  const [productos, setProductos] = useState<Producto[]>([
    {
      id: 1,
      cantidad: '',
      unidadMedida: 'UNIDAD',
      descripcion: '',
      valorUnitario: ''
    }
  ]);

  const [pagosCuotas, setPagosCuotas] = useState<PagoCuota[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [tiposComprobante, setTiposComprobante] = useState<TipoComprobante[]>([]);
  const [loadingProveedores, setLoadingProveedores] = useState(false);
  const [loadingTiposComprobante, setLoadingTiposComprobante] = useState(false);
  const [errorProveedores, setErrorProveedores] = useState<string | null>(null);
  const [errorTiposComprobante, setErrorTiposComprobante] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchProveedor, setSearchProveedor] = useState<string>('');
  const [showProveedorDropdown, setShowProveedorDropdown] = useState(false);
  const [filteredProveedores, setFilteredProveedores] = useState<Proveedor[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Cargar proveedores
      setLoadingProveedores(true);
      setErrorProveedores(null);
      try {
        const dataProveedores = await getProveedoresActivos();
        setProveedores(dataProveedores);
      } catch (error) {
        setErrorProveedores('Error al cargar proveedores. Verifica que la API esté disponible.');
        console.error('Error:', error);
      } finally {
        setLoadingProveedores(false);
      }

      // Cargar tipos de comprobante
      setLoadingTiposComprobante(true);
      setErrorTiposComprobante(null);
      try {
        const dataTiposComprobante = await getTiposComprobanteActivos();
        setTiposComprobante(dataTiposComprobante);
      } catch (error) {
        setErrorTiposComprobante('Error al cargar tipos de comprobante. Verifica que la API esté disponible.');
        console.error('Error:', error);
      } finally {
        setLoadingTiposComprobante(false);
      }
    };

    fetchData();
  }, []);

  // Actualizar cuotas cuando cambia la forma de pago
  useEffect(() => {
    if (formData.formaPago === 'Contado') {
      setPagosCuotas([]);
    } else if (formData.formaPago === 'Credito' && pagosCuotas.length === 0) {
      setPagosCuotas([{
        id: 1,
        fechaVencimiento: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        montoCuota: ''
      }]);
    }
  }, [formData.formaPago]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'descuentos' ? parseFloat(value) || 0 : value
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

    // Validaciones
    if (!formData.idTipoComprobante) {
      setErrorMessage('Debe seleccionar un tipo de comprobante');
      return;
    }

    if (!formData.idProveedor) {
      setErrorMessage('Debe seleccionar un proveedor');
      return;
    }

    if (productos.some(p => !p.cantidad || !p.valorUnitario || !p.descripcion)) {
      setErrorMessage('Complete todos los datos de los productos');
      return;
    }

    if (formData.formaPago === 'Credito') {
      if (pagosCuotas.length === 0) {
        setErrorMessage('Debe agregar al menos una cuota para pago a crédito');
        return;
      }
      if (pagosCuotas.some(p => !p.fechaVencimiento || !p.montoCuota)) {
        setErrorMessage('Complete todos los datos de las cuotas');
        return;
      }
    }

    try {
      const totalesCalculados = calcularTotales();

      const compraData: CompraRequest = {
        idCompra: formData.idCompra,
        idTipoComprobante: Number(formData.idTipoComprobante),
        serie: formData.serie,
        numero: formData.numero,
        fechaEmision: formData.fechaEmision,
        idProveedor: Number(formData.idProveedor),
        formaPago: formData.formaPago,
        tipoMoneda: formData.tipoMoneda,
        observacion: formData.observacion,
        subTotal: parseFloat(totalesCalculados.subTotal),
        descuentos: parseFloat(totalesCalculados.descuentos),
        valorCompra: parseFloat(totalesCalculados.valorCompra),
        igv: parseFloat(totalesCalculados.igv),
        importeTotal: parseFloat(totalesCalculados.importeTotal),
        usuarioCreacion: 'admin',
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

      console.log('Guardando compra:', compraData);
      const resultado = await registrarCompraCompleta(compraData);
      console.log('Compra guardada:', resultado);

      // Generar PDF de la factura
      if (resultado && resultado.data && resultado.data.idCompra) {
        try {
          // Obtener los datos completos de la compra recién creada
          const compraCompleta = await getCompraById(resultado.data.idCompra);

          // Generar y abrir PDF en nueva pestaña (unificado con el botón de iconos)
          const nombrePDF = generarPDFFactura(compraCompleta.data, true);
          setSuccessMessage(`¡Compra procesada exitosamente! PDF generado: ${nombrePDF}`);
        } catch (pdfError) {
          console.error('Error al generar PDF:', pdfError);
          setSuccessMessage('¡Compra procesada exitosamente! (Error al generar PDF)');
        }
      } else {
        setSuccessMessage('¡Compra procesada exitosamente!');
      }

      resetForm();

      // Ocultar mensaje después de 5 segundos
      setTimeout(() => setSuccessMessage(null), 5000);

    } catch (error) {
      console.error('Error al procesar compra:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al procesar la compra. Verifica tu conexión.');
    }
  };

  const resetForm = () => {
    setFormData({
      idCompra: 0,
      idTipoComprobante: '',
      serie: '',
      numero: '',
      fechaEmision: new Date().toISOString().split('T')[0],
      idProveedor: '',
      formaPago: 'Contado',
      tipoMoneda: 'SOLES',
      observacion: '',
      descuentos: 0
    });
    setProductos([{
      id: 1,
      cantidad: '',
      unidadMedida: 'UNIDAD',
      descripcion: '',
      valorUnitario: ''
    }]);
    setPagosCuotas([]);
  };

  const totales = calcularTotales();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Registrar Compra</h2>
        <p className="text-gray-600 mt-2">Complete los datos para registrar una nueva compra</p>
      </div>

      {/* Mensajes de éxito/error */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-green-800 font-medium">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-800 font-medium">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos del Documento */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Datos del Documento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Comprobante *
                {loadingTiposComprobante && <span className="text-orange-600 ml-2">(Cargando...)</span>}
              </label>
              <select
                name="idTipoComprobante"
                value={formData.idTipoComprobante}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                required
                disabled={loadingTiposComprobante}
              >
                <option value="">-- Seleccione --</option>
                {tiposComprobante.map((tipo) => (
                  <option key={tipo.idTipoComprobante} value={tipo.idTipoComprobante}>
                    {tipo.nombre} ({tipo.codigo})
                  </option>
                ))}
              </select>
              {errorTiposComprobante && (
                <p className="text-red-600 text-sm mt-1">{errorTiposComprobante}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serie *</label>
              <input
                type="text"
                name="serie"
                value={formData.serie}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                placeholder="B001"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                placeholder="000001"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Datos del Proveedor */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Datos del Proveedor
          </h3>

          <div className="relative proveedor-search-container">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar Proveedor *
              {loadingProveedores && <span className="text-orange-600 ml-2">(Cargando...)</span>}
            </label>

            {/* Input de búsqueda con autocompletado */}
            <div className="relative">
              <input
                type="text"
                value={searchProveedor}
                onChange={(e) => {
                  setSearchProveedor(e.target.value);
                  // Si se borra el texto, limpiar la selección
                  if (!e.target.value) {
                    setFormData(prev => ({ ...prev, idProveedor: '' }));
                  }
                }}
                onFocus={() => {
                  if (searchProveedor.trim()) {
                    setShowProveedorDropdown(true);
                  }
                }}
                placeholder="Escriba el nombre del proveedor para buscar..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition pr-10"
                disabled={loadingProveedores}
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
            {formData.idProveedor && !showProveedorDropdown && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start justify-between">
                <div className="flex items-start gap-2 flex-1">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">Proveedor seleccionado</p>
                    <p className="text-sm text-green-700 mt-0.5">
                      {proveedores.find(p => p.idProveedor === Number(formData.idProveedor))?.nombreCompleto}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, idProveedor: '' }));
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

            {errorProveedores && (
              <p className="text-red-600 text-sm mt-1">{errorProveedores}</p>
            )}
          </div>
        </div>

        {/* Productos/Servicios */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Detalles de Compra
            </h3>
            <button
              type="button"
              onClick={agregarProducto}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Agregar Producto
            </button>
          </div>

          {productos.map((producto, index) => (
            <div key={producto.id} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">Producto #{index + 1}</span>
                {productos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarProducto(producto.id)}
                    className="text-red-600 hover:text-red-700 transition"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
                  <input
                    type="number"
                    value={producto.cantidad}
                    onChange={(e) => handleProductChange(producto.id, 'cantidad', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    placeholder="25.00"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidad de Medida *</label>
                  <select
                    value={producto.unidadMedida}
                    onChange={(e) => handleProductChange(producto.id, 'unidadMedida', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  >
                    <option value="UNIDAD">UNIDAD</option>
                    <option value="BOLSA">BOLSA</option>
                    <option value="METRO">METRO</option>
                    <option value="KILO">KILO</option>
                    <option value="SERVICIO">SERVICIO</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor Unitario (Sin IGV) *</label>
                  <input
                    type="number"
                    value={producto.valorUnitario}
                    onChange={(e) => handleProductChange(producto.id, 'valorUnitario', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    placeholder="100.00"
                    step="0.01"
                    required
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                  <textarea
                    value={producto.descripcion}
                    onChange={(e) => handleProductChange(producto.id, 'descripcion', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                    placeholder="Descripción del producto o servicio"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagos a Crédito */}
        {formData.formaPago === 'Credito' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Cuotas de Pago
              </h3>
              <button
                type="button"
                onClick={agregarPagoCuota}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Agregar Cuota
              </button>
            </div>

            {pagosCuotas.map((pago, index) => (
              <div key={pago.id} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">Cuota #{index + 1}</span>
                  {pagosCuotas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarPagoCuota(pago.id)}
                      className="text-red-600 hover:text-red-700 transition"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento *</label>
                    <input
                      type="date"
                      value={pago.fechaVencimiento}
                      onChange={(e) => handlePagoCuotaChange(pago.id, 'fechaVencimiento', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monto de Cuota *</label>
                    <input
                      type="number"
                      value={pago.montoCuota}
                      onChange={(e) => handlePagoCuotaChange(pago.id, 'montoCuota', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                      placeholder="0.00"
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
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Observaciones (Opcional)</h3>
          <textarea
            name="observacion"
            value={formData.observacion}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
            placeholder="Notas adicionales..."
          />
        </div>

        {/* Resumen de Totales */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-sm p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Totales</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <p className="text-sm text-gray-600 mb-1">Sub Total</p>
              <p className="text-xl font-bold text-gray-800">S/ {totales.subTotal}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <p className="text-sm text-gray-600 mb-1">Descuentos</p>
              <p className="text-xl font-bold text-gray-800">S/ {totales.descuentos}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <p className="text-sm text-gray-600 mb-1">Valor Compra</p>
              <p className="text-xl font-bold text-gray-800">S/ {totales.valorCompra}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <p className="text-sm text-gray-600 mb-1">IGV (18%)</p>
              <p className="text-xl font-bold text-gray-800">S/ {totales.igv}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <p className="text-sm text-gray-600 mb-1">Importe Total</p>
              <p className="text-2xl font-bold text-orange-600">S/ {totales.importeTotal}</p>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Limpiar Formulario
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-medium shadow-lg shadow-orange-500/30 flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 21v-8H7v8M7 3v5h8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Guardar Compra
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
