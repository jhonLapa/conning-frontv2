import { FilterConfig } from "@/components/datatable";
import { SortedIcon } from "@/components/sorted-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Planilla } from "@/interfaces/planilla.interface";
import ActionsPlanilla from "./action-planillas";

export const columnNames: Record<string, string> = {
  proyecto: "Proyecto",
  mes: "Periodo Texto",
  frecuenciaPago: "Frecuencia pago",
  totalGeneral: "Total General",
  estado: "Estado",
  actions: "Acciones",
};


export const columnFilter: FilterConfig[] = [
  {
    id: "proyecto",
    label: "Proyecto",
  },
  {
    id: "status",
    label: "Estado",
  },
];


export const stateFilter: FilterConfig[] = [
  {
    id: "all",
    label: "Todos",
  },
  {
    id: "activo",
    label: "Activos",
  },
  {
    id: "inactivo",
    label: "Inactivos",
  },
];

export const getColumns = (
    refreshDataTable: () => void
): ColumnDef<Planilla>[] => [
  {
    id: "proyecto",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Proyecto
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="ml-4">{row.original.proyecto?.nombre ?? "_"}</span>
    ),
  },
  {
    id: "mes",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Periodos
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="ml-4">{row.original.mes}</span>
    ),
  },
    {
    id: "fechaPago",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Fecha pago
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="ml-4">{row.original.fechaPago}</span>
    ),
  },
  {
    id: "frecuenciaPago",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Frecuencia
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="ml-4">{row.original.frecuenciaPago}</span>
    ),
  },
 
  {
    id: "totalGeneral",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Total General
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="ml-4">{row.original.totalGeneral}</span>
    ),
  },

  {
    accessorKey: "estado",
    id: "status",
    header: "Estado",
    cell: ({ row }) => {
      const state: boolean = row.original.estado === 1;
      return (
        <Badge variant={state ? "success" : "destructive"}>
          {state ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
          <ActionsPlanilla
            planilla={row.original}
            onRefresh={refreshDataTable}
          />
        ),

  },
];
