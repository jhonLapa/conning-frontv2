import { FilterConfig } from "@/components/datatable";
import { SortedIcon } from "@/components/sorted-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { EmpresaList } from "@/interfaces/empresas.interface";
import ActionsEmpresa from "./action-empresa";

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

export const getColumns = (refreshDataTable: () => void): ColumnDef<EmpresaList>[] => [
  {
    header: "Codigo",
    id: "code",
    cell: ({ row }) => <span>{row.original.code}</span>,
  },
  {
    header: "RUC.",
    id: "ruc",
    cell: ({ row }) => <span>{row.original.ruc}</span>,
  },
  {
    id: "razonSocial",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Razon Social
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => <span className="ml-4">{row.original.razonSocial}</span>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const state: boolean = row.original.estado;
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
      <ActionsEmpresa empresa={row.original} onRefresh={refreshDataTable} />
    ),
  },
];
