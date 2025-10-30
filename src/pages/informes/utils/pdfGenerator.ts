import { getObtenerBoleta } from "@/services/planilla.service";
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";

// Datos fijos
const EMPRESA = "CONING CONTRATISTAS GENERALES S.A.C";
const RUC = "20608147625";
const DIRECCION = "MZ I LT 37 URB EL PINAR COMAS";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}

// 📄 Función principal
export async function generarPDFBoleta(
  idPlanilla: number,
  idTrabajador: number
) {
  console.log("🧾 Generar PDF Boleta");
  console.log("➡️ idPlanilla:", idPlanilla);
  console.log("➡️ idTrabajador:", idTrabajador);

  // ==========================
  // 🔹 Obtener datos de API
  // ==========================
  const res = await getObtenerBoleta(idPlanilla, idTrabajador);
  if (!res) throw new Error("No se encontró la boleta");
  const data = res;

  const {
    proyecto,
    periodo,
    apellidosNombres,
    dni,
    categoria,
    regimen,
    diasTrabajados,
    horas60,
    horas100,
    indemnizacion,
    totalIngresos,
    totalDescuentos,
    totalAportes,
    netoPagar,
    conceptos,
  } = data;

  // Mapeo tabla
  const tablaConceptos: RowInput[] = conceptos.map((c) => [
    c.codigo,
    c.nombreMostrar,
    c.tipo === "INGRESO" ? c.valor.toFixed(2) : "",
    c.tipo === "DESCUENTO" ? c.valor.toFixed(2) : "",
    c.tipo === "APORTE" ? c.valor.toFixed(2) : "",
  ]);

  // ==========================
  // 🧾 Configuración PDF
  // ==========================
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  doc.setFont("times", "normal");

  const WIDTH = 140;
  const LEFT = 10;
  const RIGHT = LEFT + WIDTH + 5;

  const estilos = {
    theme: "grid" as const,
    styles: {
      fontSize: 7,
      cellPadding: 0.6,
      lineWidth: 0.2,
      textColor: [0, 0, 0] as [number, number, number], // ✅ tupla
      valign: "middle" as const,
      halign: "center" as const,
    },
    headStyles: {
      fillColor: [230, 230, 230] as [number, number, number], // ✅ tupla
      textColor: [0, 0, 0] as [number, number, number], // ✅ tupla
      fontStyle: "bold" as const,
    },
    columnStyles: {
      0: { halign: "center" as const, cellWidth: 18 },
      1: { halign: "left" as const, cellWidth: 55 },
      2: { halign: "right" as const, cellWidth: 20 },
      3: { halign: "right" as const, cellWidth: 20 },
      4: { halign: "right" as const, cellWidth: 20 },
    },
    margin: { left: 0 },
    tableWidth: WIDTH - 2,
  };

  // ==========================
  // ✍️ Función de dibujo boleta
  // ==========================
  function dibujarBoleta(x: number) {
    let y = 14;

    // ======== ENCABEZADO ========
    doc.setFont("times", "bold").setFontSize(13.5);
    doc.text("BOLETA DE PAGO", x + WIDTH / 2, y, { align: "center" });

    const logoUrl = "/logo_coning.png";
    // 🔹 Aumentamos ancho (de 27 → 34) y bajamos un poco el alto (de 13 → 11) para alargarlo visualmente
    doc.addImage(logoUrl, "PNG", x + WIDTH - 38, y - 8, 34, 11);
    y += 10;
    doc.setFont("times", "bold").setFontSize(9);
    doc.text(`RAZÓN SOCIAL: ${EMPRESA}`, x, y);
    doc.text(`RUC N°: ${RUC}`, x, y + 4);
    doc.text(DIRECCION, x, y + 8);
    y += 13;

    // ======== DATOS PERSONALES ========
    autoTable(doc, {
      ...estilos,
      startY: y,
      margin: { left: x },
      head: [["DNI", "Apellidos y Nombres", "Proyecto"]],
      body: [[dni, apellidosNombres, proyecto]],
    });
    y = doc.lastAutoTable.finalY;

    // ======== CATEGORÍA / RÉGIMEN / PERIODO ========
    autoTable(doc, {
      ...estilos,
      startY: y,
      margin: { left: x },
      head: [["Categoría", "Régimen", "Periodo"]],
      body: [[categoria, regimen, periodo]],
    });
    y = doc.lastAutoTable.finalY;

    // ======== HORAS / INGRESOS ========
    autoTable(doc, {
      ...estilos,
      startY: y,
      margin: { left: x },
      head: [
        [
          "Días Laborados",
          "H.E. 60%",
          "H.E. 100%",
          "Indemnización",
          "Total Ingresos",
        ],
      ],
      body: [[diasTrabajados, horas60, horas100, indemnizacion, totalIngresos]],
    });
    y = doc.lastAutoTable.finalY + 1.5;

    // ======== CONCEPTOS ========
    autoTable(doc, {
      ...estilos,
      startY: y,
      margin: { left: x },
      head: [["CODIFICACIÓN", "CONCEPTO", "INGRESOS", "DESCUENTO", "APORTE"]],
      body: tablaConceptos,
    });
    y = doc.lastAutoTable.finalY + 3;

    // ======== BLOQUE TOTALES ========
    doc.setFont("times", "bold").setFontSize(9);

    const margenMonto = x + WIDTH - 30; // margen derecho donde terminan los montos
    y += 5;

    // 🔹 Línea 1: TOTAL INGRESOS
    doc.text("TOTAL INGRESOS:", x, y, { align: "left" });
    doc.text(`S/ ${totalIngresos.toFixed(2)}`, margenMonto, y, {
      align: "right",
    });
    y += 5;

    // 🔹 Línea 2: TOTAL DESCUENTOS
    doc.text("TOTAL DESCUENTOS:", x, y, { align: "left" });
    doc.text(`S/ ${totalDescuentos.toFixed(2)}`, margenMonto, y, {
      align: "right",
    });
    y += 5;

    // 🔹 Línea 3: TOTAL APORTES
    doc.text("TOTAL APORTES:", x, y, { align: "left" });
    doc.text(`S/ ${totalAportes.toFixed(2)}`, margenMonto, y, {
      align: "right",
    });
    y += 8;

    // 🔹 Línea 4: NETO A PAGAR
    doc.setFontSize(10);
    doc.text("NETO A PAGAR:", x, y, { align: "left" });
    doc.text(`S/ ${netoPagar.toFixed(2)}`, margenMonto, y, { align: "right" });
    y += 10;

    // Línea divisoria
    doc.setDrawColor(0);
    doc.setLineWidth(0.25);
    doc.line(x, y, x + WIDTH - 5, y);
    y += 10;

    // ======== FIRMAS ========
    doc.setFontSize(8).setFont("times", "normal");
    const centro = x + WIDTH / 2;

    doc.text("__________________", x + 25, y);
    doc.text("EMPLEADOR", x + 33, y + 4);
    doc.text("__________________", centro + 25, y);
    doc.text("TRABAJADOR", centro + 33, y + 4);
  }

  // Dibuja dos boletas
  dibujarBoleta(LEFT);
  dibujarBoleta(RIGHT);

  // ==========================
  // 🖥️ Mostrar PDF (con botones de imprimir/descargar)
  // ==========================
  const pdfUrl = doc.output("bloburl");
  window.open(pdfUrl, "_blank");
}
