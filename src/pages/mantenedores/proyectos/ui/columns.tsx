import { FilterConfig } from "@/components/datatable";
import { SortedIcon } from "@/components/sorted-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import ActionsProyecto from "./action-proyecto";
import { Proyecto } from "@/interfaces/proyecto.interface";
import { formatDateTime } from "@/utils"; 
import { formatDateForInput } from "@/utils/formatDate";


export const columnNames: Record<string, string> = {
  nombre: "Nombre",
  cliente: "Cliente",
  descripcion: "Descripción",
  fechaInicio: "Inicio",
  fechaFin: "Fin",
  frecuenciaPago: "Frecuencia de Pago",
  estado: "Estado",
  fechaCreacion: "Creación",
  actions: "Acciones",
};

export const columnFilter: FilterConfig[] = [
  {
    id: "nombre",
    label: "Nombre del Proyecto",
  },
  {
    id: "cliente",
    label: "Nombre del Cliente",
  },
  {
    id: "descripcion",
    label: "Descripción",
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

// ---

/**
 * Genera la definición de columnas para la tabla de proyectos.
 * @param refreshDataTable Función para recargar los datos de la tabla después de una acción.
 * @returns Un arreglo de `ColumnDef<Proyecto>[]`.
 */
export const getColumns = (refreshDataTable: () => void): ColumnDef<Proyecto>[] => [
  {
    accessorKey: "nombre",
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
    cell: ({ row }) => <span className="ml-4 font-medium">{row.original.nombre}</span>,
  },
  {
    id: "cliente", 
    cell: ({ row }) => <span>{row.original.cliente.nombreCompleto}</span>, 
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => <span className="text-sm text-gray-500 line-clamp-1 max-w-xs">{row.original.descripcion}</span>,
  },
  {
    accessorKey: "fechaInicio",
    header: "Inicio",
    cell: ({ row }) => <span>{row.original.fechaInicio ? formatDateForInput(row.original.fechaInicio) : 'N/A'}</span>,
  },
  {
    accessorKey: "frecuenciaPago",
    header: "Pago",
  },
  {
    accessorKey: "fechaCreacion",
    header: "Creación",
    cell: ({ row }) => <span>{formatDateTime(row.original.fechaCreacion)}</span>,
  },
  {
    accessorKey: "estado",
    id: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado: boolean = row.original.estado === 1;
      return (
        <Badge variant={estado ? "default" : "secondary"} className={estado ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"}>
          {estado ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <ActionsProyecto proyecto={row.original} onRefresh={refreshDataTable} />
    ),
  },
];