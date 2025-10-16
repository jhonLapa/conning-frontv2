import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { compraService } from "@/services/compra.service";
import { Proveedor, TipoComprobante, CompraRequest } from "@/interfaces/compra.interface";
import Select from "react-select";
import { defaultSelectStyles } from "@/utils";
import { OptionSelect } from "@/interfaces";

interface FormData {
  idTipoComprobante: number;
  serie: string;
  numero: string;
  fechaEmision: string;
  idProveedor: number;
  formaPago: string;
  tipoMoneda: string;
  observacion: string;
  descuentos: number;
  activo: boolean;
  generarPDFAuto: boolean;
}

interface Producto {
  id: number;
  cantidad: string;
  unidadMedida: string;
  descripcion: string;
  valorUnitario: string;
  valorTotal: number;
}

interface PagoCuota {
  id: number;
  fechaVencimiento: string;
  montoCuota: string;
}

export default function CobranzaIdPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const title = id === "nuevo" ? "Nueva Compra" : "Editar Compra";

  const [tiposComprobante, setTiposComprobante] = useState<TipoComprobante[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const { register, handleSubmit, control, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      idTipoComprobante: 1,
      serie: "",
      numero: "",
      fechaEmision: new Date().toISOString().split('T')[0],
      idProveedor: 0,
      formaPago: "Contado",
      tipoMoneda: "SOLES",
      observacion: "",
      descuentos: 0,
      activo: true,
      generarPDFAuto: true
    }
  });

  const [productos, setProductos] = useState<Producto[]>([
    {
      id: 1,
      cantidad: "",
      unidadMedida: "UNIDAD",
      descripcion: "",
      valorUnitario: "",
      valorTotal: 0
    }
  ]);

  const [pagosCuotas, setPagosCuotas] = useState<PagoCuota[]>([]);

  const formaPago = watch("formaPago");
  const idProveedor = watch("idProveedor");

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);

        // Cargar tipos de comprobante y proveedores
        const [tipos, provs] = await Promise.all([
          compraService.getTiposComprobanteActivos(),
          compraService.getProveedoresActivos()
        ]);

        setTiposComprobante(tipos);
        setProveedores(provs);

        // Si es edición, cargar datos de la compra
        if (id && id !== "nuevo") {
          const compra = await compraService.getById(Number(id));

          setValue("idTipoComprobante", compra.idTipoComprobante);
          setValue("serie", compra.serie);
          setValue("numero", compra.numero);
          setValue("fechaEmision", compra.fechaEmision.split('T')[0]);
          setValue("idProveedor", compra.idProveedor);
          setValue("formaPago", compra.formaPago);
          setValue("tipoMoneda", compra.tipoMoneda);
          setValue("observacion", compra.observacion);
          setValue("descuentos", compra.descuentos);
          setValue("activo", compra.estado === 1);

          // Cargar productos
          if (compra.detalles && compra.detalles.length > 0) {
            setProductos(compra.detalles.map((det, index) => ({
              id: index + 1,
              cantidad: det.cantidad.toString(),
              unidadMedida: det.unidadMedida,
              descripcion: det.descripcion,
              valorUnitario: det.valorUnitario.toString(),
              valorTotal: det.valorTotal
            })));
          }

          // Cargar cuotas si es crédito
          if (compra.pagosCredito && compra.pagosCredito.length > 0) {
            setPagosCuotas(compra.pagosCredito.map((pago, index) => ({
              id: index + 1,
              fechaVencimiento: pago.fechaVencimiento.split('T')[0],
              montoCuota: pago.montoCuota.toString()
            })));
          }

          // Establecer proveedor seleccionado
          const prov = provs.find(p => p.idProveedor === compra.idProveedor);
          if (prov) setProveedorSeleccionado(prov);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Error al cargar los datos", { position: "top-right" });
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [id]);

  // Actualizar cuotas cuando cambia forma de pago
  useEffect(() => {
    if (formaPago === 'Contado') {
      setPagosCuotas([]);
    } else if (formaPago === 'Credito' && pagosCuotas.length === 0) {
      setPagosCuotas([{
        id: 1,
        fechaVencimiento: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        montoCuota: ''
      }]);
    }
  }, [formaPago]);

  // Actualizar proveedor seleccionado cuando cambia el id
  useEffect(() => {
    const prov = proveedores.find(p => p.idProveedor === idProveedor);
    setProveedorSeleccionado(prov || null);
  }, [idProveedor, proveedores]);

  const handleProductChange = (id: number, field: keyof Producto, value: string) => {
    setProductos(prev => prev.map(prod => {
      if (prod.id === id) {
        const updated = { ...prod, [field]: value };
        if (field === 'cantidad' || field === 'valorUnitario') {
          const cantidad = parseFloat(field === 'cantidad' ? value : prod.cantidad) || 0;
          const valorUnit = parseFloat(field === 'valorUnitario' ? value : prod.valorUnitario) || 0;
          updated.valorTotal = cantidad * valorUnit;
        }
        return updated;
      }
      return prod;
    }));
  };

  const agregarProducto = () => {
    const nuevoId = Math.max(...productos.map(p => p.id)) + 1;
    setProductos(prev => [...prev, {
      id: nuevoId,
      cantidad: "",
      unidadMedida: "UNIDAD",
      descripcion: "",
      valorUnitario: "",
      valorTotal: 0
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
    const subTotal = productos.reduce((sum, prod) => sum + prod.valorTotal, 0);
    const descuentos = watch("descuentos") || 0;
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

  const generarPDF = (data: FormData) => {
    const doc = new jsPDF();
    const totales = calcularTotales();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const tipoNombre = tiposComprobante.find(t => t.idTipoComprobante === data.idTipoComprobante)?.nombre || 'Factura';
    const simboloMoneda = data.tipoMoneda === 'SOLES' ? 'S/' : '$';

    // ========== ENCABEZADO ==========
    // Rectángulo superior naranja
    doc.setFillColor(239, 161, 89);
    doc.rect(0, 0, pageWidth, 35, 'F');

    // Título principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    const titulo = tipoNombre.toUpperCase();
    const tituloWidth = doc.getTextWidth(titulo);
    doc.text(titulo, (pageWidth - tituloWidth) / 2, 15);

    // Serie y número
    doc.setFontSize(16);
    const serieNumero = `${data.serie}-${data.numero}`;
    const serieWidth = doc.getTextWidth(serieNumero);
    doc.text(serieNumero, (pageWidth - serieWidth) / 2, 26);

    // ========== INFORMACIÓN DE LA EMPRESA (izquierda) ==========
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('EMPRESA:', margin, 45);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Conning S.A.C.', margin, 51);
    doc.text('RUC: 20XXXXXXXXX', margin, 56);
    doc.text('Dirección: Av. Principal 123', margin, 61);
    doc.text('Teléfono: (01) 123-4567', margin, 66);

    // ========== INFORMACIÓN DEL DOCUMENTO (derecha) ==========
    const rightX = pageWidth - margin - 60;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('FECHA EMISIÓN:', rightX, 45);
    doc.text('FORMA DE PAGO:', rightX, 51);
    doc.text('MONEDA:', rightX, 57);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    // Formatear fecha
    const fechaParts = data.fechaEmision.split('-');
    const fechaFormateada = `${fechaParts[2]}/${fechaParts[1]}/${fechaParts[0]}`;
    doc.text(fechaFormateada, rightX + 35, 45);
    doc.text(data.formaPago, rightX + 35, 51);
    doc.text(data.tipoMoneda, rightX + 35, 57);

    // Línea separadora
    doc.setDrawColor(239, 161, 89);
    doc.setLineWidth(0.5);
    doc.line(margin, 72, pageWidth - margin, 72);

    // ========== INFORMACIÓN DEL PROVEEDOR ==========
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, 77, pageWidth - 2 * margin, 22, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('PROVEEDOR:', margin + 3, 84);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(proveedorSeleccionado?.nombreCompleto || 'N/A', margin + 3, 90);
    doc.text(`RUC/DNI: ${proveedorSeleccionado?.numeroDocumento || 'N/A'}`, margin + 3, 95);

    if (proveedorSeleccionado?.direccion) {
      doc.text(`Dirección: ${proveedorSeleccionado.direccion}`, margin + 80, 90);
    }
    if (proveedorSeleccionado?.telefono) {
      doc.text(`Teléfono: ${proveedorSeleccionado.telefono}`, margin + 80, 95);
    }

    // ========== TABLA DE PRODUCTOS ==========
    const productosData = productos.map((prod, index) => [
      index + 1,
      prod.cantidad,
      prod.unidadMedida,
      prod.descripcion,
      `${simboloMoneda} ${parseFloat(prod.valorUnitario || '0').toFixed(2)}`,
      `${simboloMoneda} ${prod.valorTotal.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 105,
      head: [['#', 'Cant.', 'Unidad', 'Descripción', 'P. Unitario', 'Total']],
      body: productosData,
      theme: 'grid',
      headStyles: {
        fillColor: [239, 161, 89],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'center', cellWidth: 15 },
        2: { halign: 'center', cellWidth: 20 },
        3: { halign: 'left', cellWidth: 75 },
        4: { halign: 'right', cellWidth: 30 },
        5: { halign: 'right', cellWidth: 30 }
      },
      margin: { left: margin, right: margin }
    });

    // ========== RESUMEN DE TOTALES ==========
    const finalY = (doc as any).lastAutoTable?.finalY || 150;
    const boxY = finalY + 10;
    const boxX = pageWidth - margin - 65;
    const boxWidth = 65;
    const boxHeight = 42;

    // Rectángulo para totales
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(boxX, boxY, boxWidth, boxHeight);

    // Líneas internas
    doc.line(boxX, boxY + 8, boxX + boxWidth, boxY + 8);
    doc.line(boxX, boxY + 16, boxX + boxWidth, boxY + 16);
    doc.line(boxX, boxY + 24, boxX + boxWidth, boxY + 24);
    doc.line(boxX, boxY + 32, boxX + boxWidth, boxY + 32);

    // Etiquetas (izquierda)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Sub Total:', boxX + 2, boxY + 6);
    doc.text('Descuentos:', boxX + 2, boxY + 14);
    doc.text('Base Imponible:', boxX + 2, boxY + 22);
    doc.text('IGV (18%):', boxX + 2, boxY + 30);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('TOTAL:', boxX + 2, boxY + 39);

    // Valores (derecha alineados)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`${simboloMoneda} ${totales.subTotal}`, boxX + boxWidth - 2, boxY + 6, { align: 'right' });
    doc.text(`${simboloMoneda} ${totales.descuentos}`, boxX + boxWidth - 2, boxY + 14, { align: 'right' });
    doc.text(`${simboloMoneda} ${totales.valorCompra}`, boxX + boxWidth - 2, boxY + 22, { align: 'right' });
    doc.text(`${simboloMoneda} ${totales.igv}`, boxX + boxWidth - 2, boxY + 30, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(239, 161, 89);
    doc.text(`${simboloMoneda} ${totales.importeTotal}`, boxX + boxWidth - 2, boxY + 39, { align: 'right' });
    doc.setTextColor(0, 0, 0);

    // ========== OBSERVACIONES ==========
    if (data.observacion) {
      const obsY = boxY + boxHeight + 8;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('OBSERVACIONES:', margin, obsY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const splitObs = doc.splitTextToSize(data.observacion, pageWidth - 2 * margin);
      doc.text(splitObs, margin, obsY + 5);
    }

    // ========== PIE DE PÁGINA ==========
    const footerY = pageHeight - 15;
    doc.setDrawColor(239, 161, 89);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const footerText = 'Gracias por su compra';
    const footerWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidth - footerWidth) / 2, footerY);

    // Fecha de generación
    const fechaGen = new Date().toLocaleString('es-PE');
    doc.text(`Generado: ${fechaGen}`, margin, footerY);

    // ========== GUARDAR PDF ==========
    const nombrePDF = `Factura_${data.serie}_${data.numero}_${new Date().getTime()}.pdf`;
    doc.save(nombrePDF);

    return nombrePDF;
  };

  const onSubmit = async (data: FormData) => {
    // Validaciones
    if (productos.some(p => !p.cantidad || !p.valorUnitario || !p.descripcion)) {
      toast.warning('Complete todos los datos de los productos', { position: "top-right" });
      return;
    }

    if (data.formaPago === 'Credito') {
      if (pagosCuotas.length === 0) {
        toast.warning('Debe agregar al menos una cuota para pago a crédito', { position: "top-right" });
        return;
      }
      if (pagosCuotas.some(p => !p.fechaVencimiento || !p.montoCuota)) {
        toast.warning('Complete todos los datos de las cuotas', { position: "top-right" });
        return;
      }
    }

    try {
      const totales = calcularTotales();

      const compraData: CompraRequest = {
        idCompra: id && id !== "nuevo" ? Number(id) : 0,
        idTipoComprobante: data.idTipoComprobante,
        serie: data.serie,
        numero: data.numero,
        fechaEmision: data.fechaEmision,
        idProveedor: data.idProveedor,
        formaPago: data.formaPago,
        tipoMoneda: data.tipoMoneda,
        observacion: data.observacion,
        subTotal: parseFloat(totales.subTotal),
        descuentos: parseFloat(totales.descuentos),
        valorCompra: parseFloat(totales.valorCompra),
        igv: parseFloat(totales.igv),
        importeTotal: parseFloat(totales.importeTotal),
        usuarioCreacion: 'admin',
        detalles: productos.map(prod => ({
          cantidad: parseFloat(prod.cantidad),
          unidadMedida: prod.unidadMedida,
          descripcion: prod.descripcion,
          valorUnitario: parseFloat(prod.valorUnitario),
          valorTotal: prod.valorTotal
        })),
        pagosCredito: data.formaPago === 'Credito'
          ? pagosCuotas.map(pago => ({
              fechaVencimiento: pago.fechaVencimiento,
              montoCuota: parseFloat(pago.montoCuota)
            }))
          : []
      };

      // Guardar en el backend
      const resultado = await compraService.save(compraData);

      // Generar PDF si está activado
      if (data.generarPDFAuto) {
        const nombrePDF = generarPDF(data);
        toast.success(`Compra registrada exitosamente. PDF generado: ${nombrePDF}`, {
          position: "top-right",
          duration: 5000
        });
      } else {
        toast.success('Compra registrada exitosamente', { position: "top-right" });
      }

      // Regresar a la lista
      setTimeout(() => navigate("/cobranza"), 1500);
    } catch (error) {
      console.error("Error al guardar compra:", error);
      toast.error('Error al procesar la compra', { position: "top-right" });
    }
  };

  const totales = calcularTotales();

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeaderPage title={title} descripcion="Información detallada de la compra" />

      <form className="flex flex-col gap-5 mt-4" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500">
              Datos del Documento
            </CardTitle>
            <hr />
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="idTipoComprobante">
                  Tipo de Comprobante
                  <span className="font-semibold text-red-600">*</span>
                </Label>
                <select
                  {...register("idTipoComprobante", { required: "El tipo de comprobante es requerido" })}
                  className="border rounded p-2"
                >
                  <option value="">-- Seleccione --</option>
                  {tiposComprobante.map((tipo) => (
                    <option key={tipo.idTipoComprobante} value={tipo.idTipoComprobante}>
                      {tipo.nombre} ({tipo.codigo})
                    </option>
                  ))}
                </select>
                {errors.idTipoComprobante && (
                  <p className="msg-error">{errors.idTipoComprobante.message}</p>
                )}
              </div>

              <div className="flex flex-row items-center gap-4">
                <Controller
                  name="activo"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-row items-center gap-4">
                      <Checkbox
                        id="activo"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor="activo">Activo</Label>
                    </div>
                  )}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="serie">
                  Serie
                  <span className="font-semibold text-red-600">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="B001"
                  {...register("serie", { required: "La serie es requerida" })}
                />
                {errors.serie && (
                  <p className="msg-error">{errors.serie.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="numero">
                  Número
                  <span className="font-semibold text-red-600">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="000001"
                  {...register("numero", { required: "El número es requerido" })}
                />
                {errors.numero && (
                  <p className="msg-error">{errors.numero.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="fechaEmision">
                  Fecha de Emisión
                  <span className="font-semibold text-red-600">*</span>
                </Label>
                <Input
                  type="date"
                  {...register("fechaEmision", { required: "La fecha es requerida" })}
                />
                {errors.fechaEmision && (
                  <p className="msg-error">{errors.fechaEmision.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="formaPago">
                  Forma de Pago
                  <span className="font-semibold text-red-600">*</span>
                </Label>
                <select
                  {...register("formaPago")}
                  className="border rounded p-2"
                >
                  <option value="Contado">Contado</option>
                  <option value="Credito">Crédito</option>
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="tipoMoneda">
                  Moneda
                  <span className="font-semibold text-red-600">*</span>
                </Label>
                <select
                  {...register("tipoMoneda")}
                  className="border rounded p-2"
                >
                  <option value="SOLES">SOLES</option>
                  <option value="DOLARES">DÓLARES</option>
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="descuentos">Descuentos</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("descuentos")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500">
              Datos del Proveedor
            </CardTitle>
            <hr />
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="idProveedor">
                  Seleccionar Proveedor
                  <span className="font-semibold text-red-600">*</span>
                </Label>
                <select
                  {...register("idProveedor", {
                    required: "El proveedor es requerido",
                    validate: (value) => value > 0 || "Debe seleccionar un proveedor"
                  })}
                  className="border rounded p-2"
                >
                  <option value="0">-- Seleccione un proveedor --</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                      {proveedor.nombreCompleto} {proveedor.numeroDocumento && `- ${proveedor.numeroDocumento}`}
                    </option>
                  ))}
                </select>
                {errors.idProveedor && (
                  <p className="msg-error">{errors.idProveedor.message}</p>
                )}
              </div>

              {proveedorSeleccionado && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Información del Proveedor:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="font-medium">Nombre:</span> {proveedorSeleccionado.nombreCompleto}</div>
                    <div><span className="font-medium">RUC:</span> {proveedorSeleccionado.numeroDocumento}</div>
                    <div><span className="font-medium">Teléfono:</span> {proveedorSeleccionado.telefono}</div>
                    <div><span className="font-medium">Email:</span> {proveedorSeleccionado.email}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-light text-gray-500">
                Detalles de Compra
              </CardTitle>
              <Button
                type="button"
                onClick={agregarProducto}
                variant="sidebar"
                size="sm"
              >
                + Agregar Producto
              </Button>
            </div>
            <hr />
          </CardHeader>

          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nro</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>V. Unitario</TableHead>
                    <TableHead>V. Total</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productos.map((producto, index) => (
                    <TableRow key={producto.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={producto.cantidad}
                          onChange={(e) => handleProductChange(producto.id, 'cantidad', e.target.value)}
                          placeholder="0.00"
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <select
                          value={producto.unidadMedida}
                          onChange={(e) => handleProductChange(producto.id, 'unidadMedida', e.target.value)}
                          className="border rounded p-1 text-sm"
                        >
                          <option value="UNIDAD">UNIDAD</option>
                          <option value="BOLSA">BOLSA</option>
                          <option value="METRO">METRO</option>
                          <option value="KILO">KILO</option>
                          <option value="SERVICIO">SERVICIO</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={producto.descripcion}
                          onChange={(e) => handleProductChange(producto.id, 'descripcion', e.target.value)}
                          placeholder="Descripción"
                          className="w-48"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={producto.valorUnitario}
                          onChange={(e) => handleProductChange(producto.id, 'valorUnitario', e.target.value)}
                          placeholder="0.00"
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          S/ {producto.valorTotal.toFixed(2)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {productos.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => eliminarProducto(producto.id)}
                            variant="destructive"
                            size="sm"
                          >
                            Eliminar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Cuotas de Pago a Crédito */}
        {formaPago === 'Credito' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-light text-gray-500">
                  Cuotas de Pago
                </CardTitle>
                <Button
                  type="button"
                  onClick={agregarPagoCuota}
                  variant="sidebar"
                  size="sm"
                >
                  + Agregar Cuota
                </Button>
              </div>
              <hr />
            </CardHeader>

            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nro</TableHead>
                      <TableHead>Fecha Vencimiento</TableHead>
                      <TableHead>Monto Cuota</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagosCuotas.map((pago, index) => (
                      <TableRow key={pago.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={pago.fechaVencimiento}
                            onChange={(e) => handlePagoCuotaChange(pago.id, 'fechaVencimiento', e.target.value)}
                            className="w-40"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={pago.montoCuota}
                            onChange={(e) => handlePagoCuotaChange(pago.id, 'montoCuota', e.target.value)}
                            placeholder="0.00"
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          {pagosCuotas.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => eliminarPagoCuota(pago.id)}
                              variant="destructive"
                              size="sm"
                            >
                              Eliminar
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-orange-50">
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500">
              Resumen de Totales
            </CardTitle>
            <hr />
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Sub Total</p>
                <p className="text-xl font-bold">S/ {totales.subTotal}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Descuentos</p>
                <p className="text-xl font-bold">S/ {totales.descuentos}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Valor Compra</p>
                <p className="text-xl font-bold">S/ {totales.valorCompra}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">IGV (18%)</p>
                <p className="text-xl font-bold">S/ {totales.igv}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Importe Total</p>
                <p className="text-2xl font-bold text-orange-600">S/ {totales.importeTotal}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500">
              Configuración Adicional
            </CardTitle>
            <hr />
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="observacion">Observaciones (Opcional)</Label>
                <textarea
                  {...register("observacion")}
                  rows={3}
                  className="w-full border rounded p-2"
                  placeholder="Notas adicionales..."
                />
              </div>

              <div className="flex flex-row items-center gap-4">
                <Controller
                  name="generarPDFAuto"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-row items-center gap-4">
                      <Checkbox
                        id="generarPDFAuto"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor="generarPDFAuto">Generar PDF Automáticamente</Label>
                    </div>
                  )}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-5">
            <Button variant="sidebar" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Compra"}
            </Button>
            <Button
              variant="default"
              type="button"
              onClick={() => navigate("/cobranza")}
            >
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
