import { FilterConfig } from "@/components/datatable";
import { SortedIcon } from "@/components/sorted-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Trabajador } from "@/interfaces/trabajador.interface"; // Usamos la interfaz Trabajador
// Importamos el componente de acciones que acabamos de crear
import ActionsTrabajador from "./action-trabajador"; 

// ---------------------------------------------
// CONFIGURACIÓN DE NOMBRES Y FILTROS
// ---------------------------------------------

export const columnNames: Record<string, string> = {
  nroDocumento: "Nro. Documento",
  apellidosNombres: "Nombre Completo",
  tipoDocumento: "Tipo Documento",
  categoria: "Categoría",
  regimen: "Régimen",
  estado: "Estado",
  actions: "Acciones",
};

export const columnFilter: FilterConfig[] = [
  {
    id: "numeroDocumento",
    label: "Nro. Documento",
  },
  {
    id: "apellidosNombres",
    label: "Nombre Completo",
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
    id: "activo",
    label: "Activos",
  },
  {
    id: "inactivo",
    label: "Inactivos",
  },
];

// ---------------------------------------------
// DEFINICIÓN DE COLUMNAS
// ---------------------------------------------

export const getColumns = (
  refreshDataTable: () => void
): ColumnDef<Trabajador>[] => [
  {
    accessorKey: "apellidosNombres",
    id: "apellidosNombres",
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
    cell: ({ row }) => <span className="ml-4">{row.original.apellidosNombres}</span>,
  },
  {
    id: "numeroDocumento",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Documento
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="ml-4">
        {row.original.tipoDocumento?.nombre || 'N/A'} - {row.original.numeroDocumento}
      </span>
    ),
  },
  {
    id: "categoria",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Categoría
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="ml-4">{row.original.categoria?.nombre || 'N/A'}</span>
    ),
  },
  {
    id: "regimen",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Régimen
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="ml-4">{row.original.regimen?.nombre || 'N/A'}</span>
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
    header: "Acciones",
    cell: ({ row }) => (
      <ActionsTrabajador trabajador={row.original} onRefresh={refreshDataTable} />
    ),
  },
];