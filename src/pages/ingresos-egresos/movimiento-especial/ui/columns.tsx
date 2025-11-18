import { FilterConfig } from "@/components/datatable";
import { SortedIcon } from "@/components/sorted-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
//import { formatDateTime } from "@/utils";
import { MovimientoEspecial } from "@/interfaces/movimiento-especial";
import ActionsMovimiento from "./action-movimiento";

export const columnNames: Record<string, string> = {
  descripcion: "Descripcion",
  monto: "Monto",
  tipoMovimiento: "Tipo movimiento",
  cuentaBancaria: "Cuenta bancaria",
  observacion: "Observacion",
  fechaCreacion: "Fecha Creacion",
  estado: "Estado",
  actions: "Acciones",
};

export const columnFilter: FilterConfig[] = [
  {
    id: "descripcion",
    label: "Descripcion",
  },
  {
    id: "tipoMovimiento",
    label: "Movimiento",
  },
  {
    id: "observacion",
    label: "Proyecto",
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
): ColumnDef<MovimientoEspecial>[] => [
  {
    id: "descripcion",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Descripcion
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => <span className="ml-4">{row.original.descripcion}</span>,
  },
  {
    id: "monto",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Monto
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => <span className="ml-4">{row.original.monto}</span>,
  },
  {
    id: "tipoMovimiento",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Tipo de Movimiento
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="ml-4">{row.original.tipoMovimiento}</span>
    ),
  },
  {
    id: "cuentaBancaria",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Cta.Bancaria
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="ml-4">{row.original.cuentaBancaria}</span>
    ),
  },
  {
    id: "observacion",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Observacion
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => <span className="ml-4">{row.original.observacion}</span>,
  },
  {
    header: "Fecha operacion",
    id: "fecha",
    cell: ({ row }) => (
      <span>{new Date(row.original.fecha).toLocaleDateString("es-PE")}</span>
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
      <ActionsMovimiento
        movimiento={row.original}
        onRefresh={refreshDataTable}
      />
    ),
  },
];
