import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Compra } from '@/interfaces/compra.interface';

// Función para convertir número a texto (para el monto en letras)
function numeroALetras(numero: number): string {
  const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  if (numero === 0) return 'CERO';
  if (numero === 100) return 'CIEN';

  let resultado = '';

  // Miles
  const miles = Math.floor(numero / 1000);
  if (miles > 0) {
    if (miles === 1) {
      resultado += 'MIL ';
    } else {
      resultado += numeroALetras(miles) + ' MIL ';
    }
  }

  // Centenas
  const cent = Math.floor((numero % 1000) / 100);
  if (cent > 0) {
    resultado += centenas[cent] + ' ';
  }

  // Decenas y unidades
  const dec = Math.floor((numero % 100) / 10);
  const uni = numero % 10;

  if (dec === 1) {
    resultado += especiales[uni] + ' ';
  } else {
    if (dec > 0) resultado += decenas[dec] + ' ';
    if (uni > 0) {
      if (dec === 2) resultado = resultado.slice(0, -1) + 'I';
      resultado += unidades[uni] + ' ';
    }
  }

  return resultado.trim();
}

export function generarPDFFactura(compra: Compra, abrirEnNuevaPestaña: boolean = true) {
  const doc = new jsPDF();

  // Configuración de fuentes y colores (Paleta naranja/orange)
  const orangeColor: [number, number, number] = [249, 115, 22]; // orange-500

  let yPosition = 15;

  // ===== ENCABEZADO =====
  // Lado izquierdo - Información de la empresa
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2]);
  doc.text('BELT S.A.C.', 15, yPosition);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('BEGONIAS FND. OQUENDO MZA. B LOTE. 13', 15, yPosition + 5);
  doc.text('CALLAO - PROV. CONST. DEL CALLAO - PROV. CONST. DEL CALLAO', 15, yPosition + 10);

  // Lado derecho - Información del comprobante con fondo naranja
  doc.setFillColor(orangeColor[0], orangeColor[1], orangeColor[2]);
  doc.rect(145, yPosition - 5, 50, 25, 'F');
  doc.setDrawColor(orangeColor[0], orangeColor[1], orangeColor[2]);
  doc.rect(145, yPosition - 5, 50, 25);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255); // Texto blanco
  doc.text('FACTURA ELECTRONICA', 170, yPosition, { align: 'center' });
  doc.setFontSize(8);
  doc.text('RUC: 20606459590', 170, yPosition + 5, { align: 'center' });
  doc.setFontSize(11);
  doc.text(`${compra.serie}-${compra.numero}`, 170, yPosition + 12, { align: 'center' });

  // Resetear color de texto
  doc.setTextColor(0, 0, 0);

  yPosition += 30;

  // ===== INFORMACIÓN DEL CLIENTE =====
  doc.setDrawColor(orangeColor[0], orangeColor[1], orangeColor[2]);
  doc.setLineWidth(0.5);
  doc.rect(15, yPosition, 180, 35);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2]);
  doc.text('Fecha de Emisión', 20, yPosition + 6);
  doc.text('Señor(es)', 20, yPosition + 12);
  doc.text('RUC', 20, yPosition + 18);
  doc.text('Dirección del Cliente', 20, yPosition + 24);
  doc.text('Tipo de Moneda', 20, yPosition + 30);

  doc.setTextColor(0, 0, 0);

  doc.setFont('helvetica', 'normal');
  const fechaEmision = new Date(compra.fechaEmision).toLocaleDateString('es-PE');
  doc.text(`: ${fechaEmision}`, 60, yPosition + 6);
  doc.text(`: ${compra.proveedor?.nombreCompleto || 'N/A'}`, 60, yPosition + 12);
  doc.text(`: ${compra.proveedor?.numeroDocumento || 'N/A'}`, 60, yPosition + 18);

  const direccion = compra.proveedor?.direccion || 'N/A';
  const direccionLines = doc.splitTextToSize(direccion, 110);
  doc.text(`:`, 60, yPosition + 24);
  doc.text(direccionLines, 63, yPosition + 24);

  doc.text(`: ${compra.tipoMoneda}`, 60, yPosition + 30);

  // Forma de pago (lado derecho)
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2]);
  doc.text('Forma de pago :', 135, yPosition + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(compra.formaPago, 165, yPosition + 6);

  yPosition += 40;

  // ===== OBSERVACIÓN =====
  if (compra.observacion) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2]);
    doc.text('Observación :', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const obsLines = doc.splitTextToSize(compra.observacion, 150);
    doc.text(obsLines, 50, yPosition);
    yPosition += (obsLines.length * 5) + 5;
  }

  // ===== TABLA DE PRODUCTOS =====
  const productosData = (compra.detalles || []).map(detalle => [
    detalle.cantidad.toFixed(2),
    detalle.unidadMedida,
    detalle.descripcion,
    detalle.valorUnitario.toFixed(2),
    '0.00'
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['Cantidad', 'Unidad Medida', 'Descripción', 'Valor Unitario', 'ICBPER']],
    body: productosData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [249, 115, 22], // orange-500
      textColor: [255, 255, 255], // texto blanco
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 20 },
      1: { halign: 'center', cellWidth: 25 },
      2: { halign: 'left', cellWidth: 85 },
      3: { halign: 'right', cellWidth: 25 },
      4: { halign: 'right', cellWidth: 25 }
    }
  });

  // Obtener posición Y después de la tabla
  const finalY = (doc as any).lastAutoTable.finalY || yPosition + 20;
  yPosition = finalY + 5;

  // ===== TOTALES =====
  // Lado izquierdo - Valor de Venta de Operaciones Gratuitas
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('Valor de Venta de', 20, yPosition);
  doc.text('Operaciones Gratuitas : S/ 0.00', 20, yPosition + 5);

  // Lado derecho - Totales en una tabla
  const totalesData = [
    ['Sub Total Ventas :', `S/ ${compra.subTotal.toFixed(2)}`],
    ['Anticipos :', 'S/ 0.00'],
    ['Descuentos :', `S/ ${compra.descuentos.toFixed(2)}`],
    ['Valor Venta :', `S/ ${compra.valorCompra.toFixed(2)}`],
    ['ISC :', 'S/ 0.00'],
    ['IGV :', `S/ ${compra.igv.toFixed(2)}`],
    ['ICBPER :', 'S/ 0.00'],
    ['Otros Cargos :', 'S/ 0.00'],
    ['Otros Tributos :', 'S/ 0.00'],
    ['Monto de redondeo :', 'S/ 0.00'],
    ['Importe Total :', `S/ ${compra.importeTotal.toFixed(2)}`]
  ];

  autoTable(doc, {
    startY: yPosition - 5,
    body: totalesData,
    margin: { left: 105 },
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    columnStyles: {
      0: {
        halign: 'left',
        cellWidth: 45,
        fontStyle: 'bold',
        textColor: [249, 115, 22] // orange-500 para etiquetas
      },
      1: { halign: 'right', cellWidth: 45 }
    },
    // Destacar la fila del Importe Total
    didParseCell: function(data) {
      if (data.row.index === 10) { // Última fila (Importe Total)
        data.cell.styles.fillColor = [255, 237, 213]; // orange-100
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = [249, 115, 22]; // orange-500
      }
    }
  });

  const finalYTotales = (doc as any).lastAutoTable.finalY || yPosition + 50;
  yPosition = finalYTotales + 10;

  // ===== MONTO EN LETRAS =====
  const parteEntera = Math.floor(compra.importeTotal);
  const parteDecimal = Math.round((compra.importeTotal - parteEntera) * 100);
  const montoEnLetras = `${numeroALetras(parteEntera)} Y ${parteDecimal.toString().padStart(2, '0')}/100 SOLES`;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2]);
  doc.text(`SON: ${montoEnLetras}`, 20, yPosition);

  yPosition += 10;

  // ===== PIE DE PÁGINA =====
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100); // gris
  const pieTexto = 'Esta es una representación impresa de la factura electrónica, generada en el Sistema de SUNAT. Puede verificarla utilizando su clave SOL.';
  const pieLines = doc.splitTextToSize(pieTexto, 175);
  doc.text(pieLines, 105, yPosition, { align: 'center' });

  // Abrir en nueva pestaña o descargar
  const nombreArchivo = `Factura_${compra.serie}-${compra.numero}.pdf`;

  if (abrirEnNuevaPestaña) {
    // Crear blob y abrir en nueva pestaña
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');

    // Limpiar la URL después de un tiempo
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
  } else {
    // Descargar el PDF
    doc.save(nombreArchivo);
  }

  return nombreArchivo;
}

