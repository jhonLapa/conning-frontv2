import { FilterConfig } from "@/components/datatable";
import { SortedIcon } from "@/components/sorted-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import ActionsBank from "./action-banco";
import { Bank } from "@/interfaces/bank.interface";
import { formatDateTime } from "@/utils";

export const columnNames: Record<string, string> = {
  name: "Nombre.",
  nameShort: "Nombre Corto",
  createAt: "Fecha Creacion",
  actions: "Acciones",
};

export const columnFilter: FilterConfig[] = [
  {
    id: "name",
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

export const getColumns = (refreshDataTable: () => void): ColumnDef<Bank>[] => [
  {
    id: "name",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Nombre Completo
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => <span className="ml-4">{row.original.nombre}</span>,
  },
  {
    id: "nameShort ",
    header: "Nombre Corto",
    cell: ({ row }) => <span>{row.original.nombreCorto}</span>,
  },
  {
    header: "Fecha Creacion",
    id: "createAt",
    cell: ({ row }) => <span>{formatDateTime(row.original.fechaCreacion)}</span>,
  },
  {
    accessorKey: "Estado",
    id: "status",
    header: "Estado",
    cell: ({ row }) => {
      const state: boolean = row.original.estado === 1 ;
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
      <ActionsBank bank={row.original} onRefresh={refreshDataTable} />
    ),
  },
];
