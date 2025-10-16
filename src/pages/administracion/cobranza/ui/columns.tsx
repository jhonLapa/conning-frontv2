import { FilterConfig } from "@/components/datatable";
import { SortedIcon } from "@/components/sorted-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Compra } from "@/interfaces/compra.interface";
import { formatDateTime } from "@/utils";
import ActionsCompra from "./action-compra";

export const columnNames: Record<string, string> = {
  comprobante: "Comprobante",
  serieNumero: "Serie-Número",
  fechaEmision: "Fecha Emisión",
  proveedor: "Proveedor",
  formaPago: "Forma Pago",
  tipoMoneda: "Moneda",
  importeTotal: "Total",
  estado: "Estado",
  actions: "Acciones",
};

export const columnFilter: FilterConfig[] = [
  {
    id: "serie",
    label: "Serie",
  },
  {
    id: "numero",
    label: "Número",
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const getColumns = (
  refreshDataTable: () => void
): ColumnDef<Compra>[] => [
  {
    id: "comprobante",
    header: "Comprobante",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">
          {row.original.tipoComprobante?.nombre || 'N/A'}
        </span>
        <span className="text-xs text-gray-500">
          {row.original.tipoComprobante?.codigo || ''}
        </span>
      </div>
    ),
  },
  {
    id: "serieNumero",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Serie-Número
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="ml-4 font-medium text-gray-900">
        {row.original.serie}-{row.original.numero}
      </span>
    ),
  },
  {
    id: "fechaEmision",
    header: "Fecha Emisión",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {formatDate(row.original.fechaEmision)}
      </span>
    ),
  },
  {
    id: "proveedor",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Proveedor
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-4 flex flex-col">
        <span className="font-medium text-gray-900">
          {row.original.proveedor?.nombreCompleto || 'N/A'}
        </span>
        {row.original.proveedor?.numeroDocumento && (
          <span className="text-xs text-gray-500">
            Doc: {row.original.proveedor.numeroDocumento}
          </span>
        )}
      </div>
    ),
  },
  {
    id: "formaPago",
    header: "Forma Pago",
    cell: ({ row }) => (
      <Badge variant={row.original.formaPago === 'Contado' ? 'success' : 'default'}>
        {row.original.formaPago}
      </Badge>
    ),
  },
  {
    id: "tipoMoneda",
    header: "Moneda",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{row.original.tipoMoneda}</span>
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
      <div className="ml-4 flex flex-col text-right">
        <span className="font-semibold text-green-600">
          {formatCurrency(row.original.improteTotal || 0)}
        </span>
        <span className="text-xs text-gray-500">
          IGV: {formatCurrency(row.original.igv || 0)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "estado",
    id: "estado",
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
      <ActionsCompra compra={row.original} onRefresh={refreshDataTable} />
    ),
  },
];
