import { DataTable } from "@/components/datatable";
import HeaderPage from "@/components/header-page";
import { useRef } from "react";
// 🚨 Importar las configuraciones de columnas y filtros de la Cuenta Bancaria
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns"; // Asegúrate de que la ruta sea correcta

export default function CuentaBancariaTrabajadorPage() {
  const refreshDataTable = useRef<() => void>(null);

  // NOTA: Si esta página lista TODAS las cuentas de TODOS los trabajadores,
  // la lógica es correcta. Si solo lista las cuentas de UN trabajador,
  // necesitarás obtener el ID del trabajador (ej: de `useParams()`)
  // y pasarlo al componente `DataTable` o usar un servicio diferente.

  return (
    <>
      <HeaderPage
        title="Cuentas Bancarias"
        descripcion="Listado de todas las cuentas bancarias de los trabajadores."
        linkConfig={{
          title: "Nueva Cuenta",
          // 🚨 Ajustar la URL a la ruta de creación de cuentas bancarias
          // Usualmente necesitas un ID de Trabajador aquí, ej: /cuentabancaria/trabajador/1/nuevo
          url: "/cuentabancaria/nuevo",
        }}
      />

      <DataTable
        // 🚨 Usar la función de columnas de la Cuenta Bancaria
        columns={getColumns(() => refreshDataTable.current?.())}
        columnNames={columnNames}
        // 🚨 Ajustar la URL del endpoint para la búsqueda paginada de Cuentas Bancarias
        url="cuentabancaria/busquedapaginado" 
        typeFilter={columnFilter}
        stateFilter={stateFilter}
        onRefresh={(callback) => {
          refreshDataTable.current = callback;
        }}
      />
    </>
  );
}