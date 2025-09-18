import { FilterConfig } from "@/components/datatable";
import { SortedIcon } from "@/components/sorted-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import ActionsConcepto from "./action-concepto";
import { Concepto } from "@/interfaces/concepto.interface";

export const columnNames: Record<string, string> = {
  code: "Codigo",
  ruc: "RUT.",
  razonSocial: "Razon Social",
  direccion: "Direccion",
  fechaCreacion: "Fecha Creacion",
  actions: "Acciones",
};

export const columnFilter: FilterConfig[] = [
  {
    id: "code",
    label: "Codigo",
  },
  {
    id: "razonSocial",
    label: "Razon Social",
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

export const getColumns = (refreshDataTable: () => void): ColumnDef<Concepto>[] => [
  {
    header: "Codigo",
    id: "code",
    cell: ({ row }) => <span>{row.original.code}</span>,
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
    cell: ({ row }) => <span className="ml-4">{row.original.grupo}</span>,
  },
  {
    header: "Descripcion",
    id: "descripcion",
    cell: ({ row }) => <span>{row.original.descripcion}</span>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const state: boolean = row.original.state;
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
      <ActionsConcepto concepto={row.original} onRefresh={refreshDataTable} />
    ),
  },
];
