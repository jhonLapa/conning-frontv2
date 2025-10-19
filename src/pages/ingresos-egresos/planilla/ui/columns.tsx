import { FilterConfig } from "@/components/datatable";
import { SortedIcon } from "@/components/sorted-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
//import { formatDateTime } from "@/utils";
import { Planilla } from "@/interfaces/planilla";
import ActionsPlanilla from "./action-planillas";

export const columnNames: Record<string, string> = {
  proyecto: "Proyecto",
  periodoInicio: "Periodo inicio",
  frecuenciaPago: "Frecuencia pago",
  estado: "Estado",
  actions: "Acciones",
};

export const columnFilter: FilterConfig[] = [
  {
    id: "proyecto",
    label: "Proyecto",
  },
  {
    id: "periodoPago",
    label: "Periodo",
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
    id: "periodoInicio",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Periodo
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="ml-4">{row.original.periodoInicio}</span>
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
  // {
  //   id: "cuentaBancaria",
  //   header: ({ column }) => {
  //     const isSorted = column.getIsSorted();
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(isSorted === "asc")}
  //       >
  //         Cta.Bancaria
  //         <SortedIcon isSorted={isSorted} />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => (
  //     <span className="ml-4">{row.original.cuentaBancaria}</span>
  //   ),
  // },
  // {
  //   id: "observacion",
  //   header: ({ column }) => {
  //     const isSorted = column.getIsSorted();
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(isSorted === "asc")}
  //       >
  //         Observacion
  //         <SortedIcon isSorted={isSorted} />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => <span className="ml-4">{row.original.observacion}</span>,
  // },
  // {
  //   header: "Fecha operacion",
  //   id: "fecha",
  //   cell: ({ row }) => (
  //     <span>{new Date(row.original.fecha).toLocaleDateString("es-PE")}</span>
  //   ),
  // },
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
      <ActionsPlanilla planilla={row.original} onRefresh={refreshDataTable} />
    ),
  },
];
