import { FilterConfig } from "@/components/datatable";
import { SortedIcon } from "@/components/sorted-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Venta } from "@/interfaces/venta.interface";
import ActionsVenta from "./action-ventas";

export const columnNames: Record<string, string> = {
  serie: "Serie",
  numero: "Numero",
  idCliente: "Cliente",
  idTipoComprobante: "Tipo de comprobante",
  idProyecto: "Proyecto",

  importeTotal: "Importe total",
  estado: "Estado",
  actions: "Acciones",
};

export const columnFilter: FilterConfig[] = [
  {
    id: "numerocomprobante",
    label: "N° Comprobante",
  },
  {
    id: "cliente",
    label: "Cliente",
  },
  {
    id: "proyecto",
    label: "Proyecto",
  },
  {
    id: "tipocomprobante",
    label: "Tipo Comprobante",
  },
  {
    id: "status",
    label: "Estado",
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
): ColumnDef<Venta>[] => [
  {
    id: "numerocomprobante",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Serie - Número / Tipo
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-4 flex flex-col">
        <span>
          {row.original.serie}-{row.original.numero}
        </span>
        <span className="text-sm text-muted-foreground">
          {row.original.tipoComprobante?.nombre ?? "—"}
        </span>
      </div>
    ),
  },
  {
    id: "cliente",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Cliente
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="ml-4">{row.original.cliente.nombreCompleto}</span>
    ),
  },
  {
    id: "proyecto",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Proyecto
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="ml-4">{row.original.proyecto.nombre}</span>
    ),
  },
  {
    id: "fechaEmision",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Fecha emision
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="ml-4">{row.original.fechaEmision}</span>
    ),
  },

  {
    id: "importeTotal",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Total
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="ml-4">
        {Number(row.original.importeTotal).toFixed(2)}
      </span>
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
      <ActionsVenta venta={row.original} onRefresh={refreshDataTable} />
    ),
  },
];
