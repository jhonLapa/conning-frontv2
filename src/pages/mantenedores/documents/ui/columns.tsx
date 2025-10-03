import { FilterConfig } from "@/components/datatable";
import { SortedIcon } from "@/components/sorted-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import ActionsDocumento from "./action-documento";
import { Document } from "@/interfaces/document.interface";
import { formatDateTime } from "@/utils";

export const columnNames: Record<string, string> = {
  codigo: "Codigo",
  nombre: "Nombre.",
  fechaCreacion: "Fecha Creacion",
  estado: "Estado",
  actions: "Acciones",
};

export const columnFilter: FilterConfig[] = [
  {
    id: "codigo",
    label: "Codigo",
  },
  {
    id: "nombre",
    label: "Nombre",
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
): ColumnDef<Document>[] => [
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
    id: "nombre",
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
    id: "estado",
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
      <ActionsDocumento document={row.original} onRefresh={refreshDataTable} />
    ),
  },
];
