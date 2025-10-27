import { ColumnDef } from "@tanstack/react-table";
import ActionsInforme from "./action-informe";
import { InformeRow } from "@/interfaces/informes.interface";

// Encabezados para DataTable
export const columnNames: Record<string, string> = {
  trabajador: "Trabajador",
  proyecto: "Proyecto",
  total: "Total Pagado (S/.)",
  actions: "Acciones",
};

export const columnFilter = [
  { id: "trabajador", label: "Trabajador" },
  { id: "proyecto", label: "Proyecto" },
];

export const stateFilter = [];

// Columnas reales
export const getColumns = (
  fechaIni: string,
  fechaFin: string
): ColumnDef<InformeRow>[] => [
  {
    accessorKey: "trabajador",
    header: "Trabajador",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">
          {row.original.trabajador}
        </span>
        <span className="text-xs text-muted-foreground">
          ID: {row.original.idTrabajador}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "proyecto",
    header: "Proyecto",
    cell: ({ row }) => <span>{row.original.proyecto}</span>,
  },
  {
    accessorKey: "total",
    header: "Total Pago (S/.)",
    cell: ({ row }) => (
      <span className="font-semibold text-green-600">
        S/ {row.original.total.toFixed(2)}
      </span>
    ),
  },

  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <ActionsInforme
        row={row.original}
        fechaIni={fechaIni}
        fechaFin={fechaFin}
      />
    ),
  },
];
