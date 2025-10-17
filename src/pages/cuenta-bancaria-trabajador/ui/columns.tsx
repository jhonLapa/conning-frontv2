import { FilterConfig } from "@/components/datatable";
import { SortedIcon } from "@/components/sorted-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { formatDateTime } from "@/utils"; 
import { CuentaBancariaTrabajador } from "@/interfaces/cuenta-bancaria-trabajador.interface";
import ActionsCuentaBancaria from "./action-cuenta-bancaria-trabajador"; 

export const columnNames: Record<string, string> = {
  numeroCuenta: "Nro. Cuenta",
  banco: "Banco",
  tipoCuenta: "Tipo Cuenta",
  moneda: "Moneda",
  principal: "Principal",
  fechaCreacion: "Fec. Creación",
  estado: "Estado",
  actions: "Acciones",
};

// --- Configuración de Filtros (Si los vas a usar para buscar en la tabla) ---
export const columnFilter: FilterConfig[] = [
  {
    id: "numeroCuenta",
    label: "Número de Cuenta",
  },
  {
    id: "tipoCuenta",
    label: "Tipo de Cuenta",
  },
];

// --- Configuración del Filtro de Estado ---
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

// --- Definición de las Columnas de React Table ---
export const getColumns = (
  refreshDataTable: () => void // Función para refrescar la tabla
): ColumnDef<CuentaBancariaTrabajador>[] => [
  {
    // Columna: Número de Cuenta
    id: "numeroCuenta",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Nro. Cuenta
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    // Nota: El accesorio se usa para acceder al valor.
    cell: ({ row }) => <span className="ml-4">{row.original.numeroCuenta}</span>,
  },
  {
    // Columna: Banco
    id: "banco",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Banco
          <SortedIcon isSorted={isSorted} />
        </Button>
      );
    },
    // Asumo que el backend devuelve la propiedad 'nombre' dentro del objeto 'banco'
    cell: ({ row }) => <span className="ml-4">{row.original.banco?.nombre || 'N/A'}</span>, 
  },
  {
    // Columna: Tipo de Cuenta
    id: "tipoCuenta",
    header: "Tipo Cuenta",
    cell: ({ row }) => <span>{row.original.tipoCuenta}</span>,
  },
  {
    // Columna: Moneda
    id: "moneda",
    header: "Moneda",
    cell: ({ row }) => <span>{row.original.moneda}</span>,
  },
  {
    // Columna: Principal
    id: "principal",
    header: "Principal",
    cell: ({ row }) => {
      const isPrincipal = row.original.principal === 1;
      return (
        <Badge variant={isPrincipal ? "success" : "default"}>
          {isPrincipal ? "SÍ" : "NO"}
        </Badge>
      );
    },
  },
  {
    // Columna: Fecha Creación
    header: "Fec. Creación",
    id: "fechaCreacion",
    cell: ({ row }) => (
      <span>{formatDateTime(row.original.fechaCreacion)}</span>
    ),
  },
  {
    // Columna: Estado
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
    // Columna: Acciones
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      // 🚨 Usar el componente de acciones para Cuentas Bancarias
      <ActionsCuentaBancaria
        cuenta={row.original}
        onRefresh={refreshDataTable}
      />
    ),
  },
];