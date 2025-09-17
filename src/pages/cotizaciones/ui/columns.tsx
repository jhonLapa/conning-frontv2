import { FilterConfig } from "@/components/datatable";
import { SortedIcon } from "@/components/sorted-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import ActionsRol from "./action-proveedor";
import { Proveedores } from "@/interfaces/proveedores.interface";

export const columnNames: Record<string, string> = {
  code: "Codigo",
  tipoDoc: "Tipo Doc.",
  direccion: "Direccion",
  numeroDoc: "Numero Doc.",
  telefono: "Telefono",
  email: "Email",
  actions: "Acciones",
};

export const columnFilter: FilterConfig[] = [
  {
    id: "name",
    label: "Nombre",
  },
  {
    id: "tipoDoc",
    label: "Tipo",
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

export const getColumns = (refreshDataTable: () => void): ColumnDef<Proveedores>[] => [
  {
    id: "code",
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
    cell: ({ row }) => <span className="ml-4">{row.original.codigo}</span>,
  },
  {
    header: "Tipo Doc.",
    id: "tipoDoc",
    cell: ({ row }) => <span>{row.original.tipoDoc}</span>,
  },
  {
    header: "Direccion",
    id: "direccion",
    cell: ({ row }) => <span>{row.original.direccion}</span>,
  },
  {
    header: "Numero Doc.",
    id: "numeroDoc",
    cell: ({ row }) => <span>{row.original.numeroDoc}</span>,
  },
  {
    header: "Telefono",
    id: "telefono",
    cell: ({ row }) => <span>{row.original.telefono}</span>,
  },
  {
    header: "Email",
    id: "email",
    cell: ({ row }) => <span>{row.original.email}</span>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const state: boolean = row.original.status;
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
      <ActionsRol proveedor={row.original} onRefresh={refreshDataTable} />
    ),
  },
];
