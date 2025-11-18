import { DataTable } from "@/components/datatable";
import HeaderPage from "@/components/header-page";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { generarPDFBoleta } from "../utils/pdfGenerator";
import { useSearchParams } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { FilterConfig } from "@/components/datatable";
import { PlanillaInforme, DetallePlanilla } from "@/interfaces";

export default function PlanillasPage() {
  const refreshDataTable = useRef<() => void>(null);
  const [params] = useSearchParams();
  const idTrabajador = Number(params.get("idTrabajador"));
  const idProyecto = Number(params.get("idProyecto"));
  const fechaInicio = params.get("fechaInicio") || "";
  const fechaFin = params.get("fechaFin") || "";

  const columns: ColumnDef<PlanillaInforme>[] = [
    {
      accessorKey: "periodoTexto",
      header: "Periodo",
      cell: ({ row }) => (
        <span className="text-gray-700">{row.original.mes}</span>
      ),
    },
    {
      accessorKey: "totalDescuentos",
      header: "Total Descuentos (S/.)",
      cell: ({ row }) => {
        const detalles: Partial<DetallePlanilla>[] =
          row.original.detalles ?? [];
        const totalDescuentos = detalles.reduce(
          (sum, d) => sum + (d.totalDescuentos ?? 0),
          0
        );
        return (
          <span className="font-semibold text-red-600">
            S/ {totalDescuentos.toFixed(2)}
          </span>
        );
      },
    },
    {
      accessorKey: "totalMonto",
      header: "Total Pagado (S/.)",
      cell: ({ row }) => {
        const detalles: Partial<DetallePlanilla>[] =
          row.original.detalles ?? [];
        const totalMonto = detalles.reduce(
          (sum, d) => sum + (d.totalMonto ?? 0),
          0
        );
        return (
          <span className="font-semibold text-green-600">
            S/ {totalMonto.toFixed(2)}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <Button
          size="icon"
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => {
            const idPlanilla =
              row.original.idPlanilla ?? row.original.idPlanilla;

            console.log("✅ Enviando a PDF:", { idPlanilla, idTrabajador });

            generarPDFBoleta(idPlanilla, idTrabajador);
          }}
        >
          <FileText size={16} />
        </Button>
      ),
    },
  ];

  const columnFilter: FilterConfig[] = [
    { id: "periodoTexto", label: "Periodo" },
  ];

  const stateFilter: FilterConfig[] = [{ id: "all", label: "Todos" }];

  return (
    <>
      <HeaderPage
        title={`Planillas del Proyecto`}
        descripcion="Detalle de pagos, horas y descuentos por trabajador."
      />
      <DataTable
        columns={columns}
        columnNames={{
          periodoTexto: "Periodo",
          totalDescuentos: "Total Descuentos (S/.)",
          totalMonto: "Total Pagado (S/.)",
          actions: "Acciones",
        }}
        url={`planilla/BusquedaPaginadoProyectoTrabajador?idTrabajador=${idTrabajador}&idProyecto=${idProyecto}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&`}
        typeFilter={columnFilter}
        stateFilter={stateFilter}
        onRefresh={(callback) => {
          refreshDataTable.current = callback;
        }}
      />
    </>
  );
}
