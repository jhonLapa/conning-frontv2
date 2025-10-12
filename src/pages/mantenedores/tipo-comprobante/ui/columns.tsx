import { FilterConfig } from "@/components/datatable";
import { SortedIcon } from "@/components/sorted-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { formatDateTime } from "@/utils";
import { TipoComprobante } from "@/interfaces/tipo-comprobante.interface";
import ActionsComprobante from "./action-comprobante";

export const columnNames: Record<string, string> = {
  codigo: "Codigo",
  nombre: "Nombre.",
  fechaCreacion: "Fecha Creacion",
  estado: "Estado",
  actions: "Acciones",
};

export const columnFilter: FilterConfig[] = [
  {
    id: "name",
    label: "Nombre",
  },
  {
    id: "codigo",
    label: "Codigo",
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
): ColumnDef<TipoComprobante>[] => [
  {
    id: "codigo",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Codigo
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => <span className="ml-4">{row.original.codigo}</span>,
  },
  {
    id: "name",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Nombre
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => <span className="ml-4">{row.original.nombre}</span>,
  },
  {
    header: "Fecha Creacion",
    id: "fechaCreacion",
    cell: ({ row }) => (
      <span>{formatDateTime(row.original.fechaCreacion)}</span>
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
      <ActionsComprobante
        comprobante={row.original}
        onRefresh={refreshDataTable}
      />
    ),
  },
];
