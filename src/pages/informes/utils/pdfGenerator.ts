import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import { getPlanillasPorProyectoTrabajador } from "@/services/planilla.service";
import { getDetallePlanillaTrabajador } from "@/services/trabajador.service";
import { CONCEPTOS_BOLETA } from "../mocks/data";

const EMPRESA = "CONING CONTRATISTAS GENERALES S.A.C";
const RUC = "20608147625";
const DIRECCION = "MZ I LT 37 URB EL PINAR COMAS";

function formatearPeriodo(periodo: string | undefined): string {
  if (!periodo) return "";
  const [anio, mes] = periodo.split("-");
  const meses = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SETIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
  ];
  return `${meses[parseInt(mes) - 1]} ${anio}`;
}

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}

export async function generarPDFBoleta({
  idTrabajador,
  idProyecto,
  fechaIni,
  fechaFin,
}: {
  idTrabajador: number;
  idProyecto: number;
  fechaIni?: string;
  fechaFin?: string;
}) {
  // Planilla base
  const res = await getPlanillasPorProyectoTrabajador({
    idTrabajador,
    idProyecto,
    fechaIni,
    fechaFin,
  });
  const data = res.data?.[0];
  if (!data) throw new Error("No hay datos");

  const detalle = data.detalles?.[0];
  const trabajadorNode = data.proyecto.trabajadores[0].trabajador;

  const detalleTrab = (await getDetallePlanillaTrabajador(idTrabajador))?.data;
  if (!detalleTrab)
    throw new Error("No se pudo obtener detalle del trabajador");

  // Datos superiores
  const dni = trabajadorNode.numeroDocumento;
  const trabajador = trabajadorNode.apellidosNombres;
  const fechaIngreso = data.proyecto.trabajadores[0].fechaInicio.substring(
    0,
    10
  );
  const fechaCese =
    data.proyecto.trabajadores[0].fechaFin?.substring(0, 10) ?? "";
  const fechaNacimiento = trabajadorNode.fechaNacimiento?.startsWith("0001")
    ? ""
    : trabajadorNode.fechaNacimiento?.substring(0, 10) ?? "";
  const hijos = trabajadorNode.hijos ?? 0;
  const categoria = detalleTrab.categoria?.nombre ?? "";
  const sisPension = detalleTrab.regimen?.nombre ?? "";
  const prima = detalleTrab.regimen?.total ?? 0;
  const periodo = formatearPeriodo(data.mes);

  // Métricas
  const he60 = detalle?.horas60 ?? 0;
  const he100 = detalle?.horas100 ?? 0;
  const diasLaborados = detalle?.diasTrabajados ?? 0;
  const salarioBasico =
    detalleTrab.conceptos.find(
      (c) =>
        c.nombreConcepto.replace(/\s+/g, "").toLowerCase() === "salariobasico"
    )?.valor ?? 0;
  const jornalBasico = salarioBasico.toFixed(2);
  const faltas = 0;
  const feriados = 0;
  const tardanza = 0;

  // Tabla conceptos
  const tablaConceptos: RowInput[] = CONCEPTOS_BOLETA.map((item) => {
    const c = detalleTrab.conceptos.find(
      (x) =>
        x.nombreConcepto.toLowerCase().replace(/\s+/g, "") ===
        item.nombre.toLowerCase().replace(/\s+/g, "")
    );
    const monto = c?.valor ?? 0;
    return [
      item.codigo,
      item.nombre,
      !item.esDescuento && !item.esAporte ? monto.toFixed(2) : "",
      item.esDescuento ? monto.toFixed(2) : "",
      item.esAporte ? monto.toFixed(2) : "",
    ];
  });

  const netoPagar = Number(data.totalGeneral ?? 0);

  // PDF
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  doc.setTextColor(0, 0, 0);

  // Layout de 2 boletas lado a lado
  const WIDTH = 140; // ancho útil de cada boleta
  const LEFT = 10; // x de la boleta izquierda
  const RIGHT = LEFT + WIDTH + 5; // x de la boleta derecha

  // Estilos compactos (sin fondos, texto negro)
  const headColor = [0, 0, 0] as [number, number, number];
  const lineColor = [0, 0, 0] as [number, number, number];
  const white = [255, 255, 255] as [number, number, number];

  // Estilo para tablas superiores (datos del trabajador)
  const topTableStyle = {
    theme: "grid" as const,
    tableWidth: WIDTH - 1,
    styles: {
      fontSize: 7,
      cellPadding: 0.6,
      lineWidth: 0.2,
      lineColor,
      textColor: headColor,
      halign: "left" as const,
      valign: "middle" as const,
    },
    headStyles: {
      fillColor: white,
      textColor: headColor,
      fontStyle: "bold" as const,
      lineColor,
      lineWidth: 0.2,
    },
    bodyStyles: {
      fillColor: white,
      textColor: headColor,
    },
    pageBreak: "avoid" as const,
    margin: { left: 0 },
  };

  // Estilo para la tabla de conceptos (más compacta)
  const conceptosTableStyle = {
    ...topTableStyle,
    styles: {
      ...topTableStyle.styles,
      fontSize: 6.5,
      cellPadding: 0.45,
    },
    tableWidth: WIDTH - 2,
  };

  function dibujarBoleta(x: number) {
    let y = 14;

    // Encabezado
    doc.setFont("times", "bold").setFontSize(13.5);
    doc.text("BOLETA DE PAGO", x + WIDTH / 2, y, { align: "center" });
    doc.rect(x + WIDTH - 35, y - 9, 30, 14); // espacio de logo
    y += 10.5;

    doc.setFont("times", "bold").setFontSize(9);
    doc.text(`RAZÓN SOCIAL: ${EMPRESA}`, x, y);
    doc.text(`RUC N°: ${RUC}`, x, y + 4.5);
    doc.text(DIRECCION, x, y + 9);
    y += 15;

    // Fila 1
    autoTable(doc, {
      ...topTableStyle,
      startY: y,
      margin: { left: x },
      head: [["DNI", "Apellidos y Nombres", "Boleta Nº"]],
      body: [[dni, trabajador, data.idPlanilla]],
    });
    y = doc.lastAutoTable.finalY;

    // Fila 2
    autoTable(doc, {
      ...topTableStyle,
      startY: y,
      margin: { left: x },
      head: [
        [
          "Fecha Ingreso",
          "Fecha Cese",
          "Fecha Nac.",
          "N° Hijos",
          "Categoría",
          "Periodo",
        ],
      ],
      body: [
        [fechaIngreso, fechaCese, fechaNacimiento, hijos, categoria, periodo],
      ],
    });
    y = doc.lastAutoTable.finalY;

    // Fila 3
    autoTable(doc, {
      ...topTableStyle,
      startY: y,
      margin: { left: x },
      head: [["Tardanza", "Del", "Al", "Sis.Pensión", "Prima"]],
      body: [[tardanza, fechaIngreso, fechaCese, sisPension, prima.toFixed(2)]],
    });
    y = doc.lastAutoTable.finalY;

    // Fila 4
    autoTable(doc, {
      ...topTableStyle,
      startY: y,
      margin: { left: x },
      head: [
        [
          "Días Laborados",
          "Jornal Básico",
          "N° Faltas",
          "Feriados",
          "H.E. 60%",
          "H.E. 100%",
        ],
      ],
      body: [[diasLaborados, jornalBasico, faltas, feriados, he60, he100]],
    });
    y = doc.lastAutoTable.finalY + 1.5;

    // Conceptos (compacto)
    autoTable(doc, {
      ...conceptosTableStyle,
      startY: y,
      margin: { left: x },
      head: [["CODIFICACIÓN", "CONCEPTO", "INGRESOS", "DESCUENTO", "APORTES"]],
      body: tablaConceptos,
      pageBreak: "avoid",
    });

    y = doc.lastAutoTable.finalY + 2;
    doc.setFont("times", "bold").setFontSize(9.5);
    doc.text(`NETO A PAGAR: S/ ${netoPagar.toFixed(2)}`, x, y);
  }

  // 2 boletas lado a lado
  dibujarBoleta(LEFT);
  dibujarBoleta(RIGHT);

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
