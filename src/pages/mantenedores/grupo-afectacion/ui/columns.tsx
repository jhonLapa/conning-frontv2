import { FilterConfig } from "@/components/datatable";
import { SortedIcon } from "@/components/sorted-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { GrupoConcepto } from "@/interfaces/grupo-concepto";
import ActionsGrupoConcepto from "./action-concepto";

export const columnNames: Record<string, string> = {
  code: "Codigo",
  name: "Nombre.",
  createAt: "Fecha Creacion",
  actions: "Acciones",
};

export const columnFilter: FilterConfig[] = [
  {
    id: "code",
    label: "Codigo",
  },
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

export const getColumns = (refreshDataTable: () => void): ColumnDef<GrupoConcepto>[] => [
  {
    id: "code",
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
          Nombre Completo
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => <span className="ml-4">{row.original.nombre}</span>,
  },
  {
    header: "Fecha Creacion",
    id: "createAt",
    cell: ({ row }) => <span>{row.original.fechaCreacion}</span>,
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
      <ActionsGrupoConcepto grupoConcepto={row.original} onRefresh={refreshDataTable} />
    ),
  },
];
