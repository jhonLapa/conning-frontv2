import { FilterConfig } from "@/components/datatable";
import { SortedIcon } from "@/components/sorted-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import ActionsUsuario from "./action-usuario";
import { Usuario } from "@/interfaces/usuario.interface";

export const columnNames: Record<string, string> = {
  firstName: "Nombres", 
  lastName: "Apellidos", 
  email: "Correo", 
  password: "Contraseña", 
  actions: "Acciones",
};

export const columnFilter: FilterConfig[] = [
  {
    id: "firstName",
    label: "Nombre",
  },
  {
    id: "lastName",
    label: "Apellido", 
  },
  {
    id: "email",
    label: "Correo",
  },
];

export const stateFilter: FilterConfig[] = [
  {
    id: "all",
    label: "Todos",
  },
  {
    id: "true", 
    label: "Activos",
  },
  {
    id: "false", 
    label: "Inactivos",
  },
];

export const getColumns = (
  refreshDataTable: () => void
): ColumnDef<Usuario>[] => [
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Nombres
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => <span className="ml-4">{row.original.firstName}</span>,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Apellidos
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => <span>{row.original.lastName}</span>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Correo
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => <span>{row.original.email}</span>,
  },
  {
    accessorKey: "state",
    id: "state",
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
      <ActionsUsuario usuario={row.original} onRefresh={refreshDataTable} />
    ),
  },
];