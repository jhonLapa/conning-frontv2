import { DataTable } from "@/components/datatable";
import HeaderPage from "@/components/header-page";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";
import { FilterConfig } from "@/components/datatable";
import { ProyectoInformePlanilla } from "@/interfaces";

export default function ProyectosPage() {
  const refreshDataTable = useRef<() => void>(null);
  const [params] = useSearchParams();
  const idTrabajador = Number(params.get("idTrabajador"));
  const fechaInicio = params.get("fechaInicio") || "";
  const fechaFin = params.get("fechaFin") || "";

  const columns: ColumnDef<ProyectoInformePlanilla>[] = [
    {
      accessorKey: "nombre",
      header: "Proyecto",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">
            {row.original.nombre}
          </span>
          <span className="text-xs text-gray-500">
            {row.original.descripcion}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "fechaCreacion",
      header: "Creado el",
      cell: ({ row }) => (
        <span>
          {new Date(row.original.fechaCreacion).toLocaleDateString("es-PE")}
        </span>
      ),
    },
    {
      accessorKey: "totalPlanillas",
      header: "Total Planillas (S/.)",
      cell: ({ row }) => (
        <span className="font-semibold text-green-600">
          S/ {row.original.totalPlanillas.toFixed(2)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <Button
          size="sm"
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={() =>
            window.location.assign(
              `/informes/planillasInformeBoleta?idTrabajador=${idTrabajador}&idProyecto=${row.original.idProyecto}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
            )
          }
        >
          Ver planillas
        </Button>
      ),
    },
  ];

  const columnFilter: FilterConfig[] = [
    { id: "nombre", label: "Proyecto" },
    { id: "descripcion", label: "Descripción" },
  ];

  const stateFilter: FilterConfig[] = [{ id: "all", label: "Todos" }];

  return (
    <>
      <HeaderPage
        title="Proyectos del Trabajador"
        descripcion="Listado de proyectos asociados al trabajador."
      />

      <DataTable
        columns={columns}
        columnNames={{
          nombre: "Proyecto",
          fechaCreacion: "Fecha creación",
          totalPlanillas: "Total Planillas (S/.)",
          actions: "Acciones",
        }}
        url={`proyecto/busquedapaginadotrabajador?idTrabajador=${idTrabajador}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&`}
        typeFilter={columnFilter}
        stateFilter={stateFilter}
        onRefresh={(callback) => {
          refreshDataTable.current = callback;
        }}
      />
    </>
  );
}
