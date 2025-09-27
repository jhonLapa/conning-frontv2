import { DataTable } from "@/components/datatable";
import HeaderPage from "@/components/header-page";
import { useRef } from "react";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";

export default function MantenimientoConceptoPage() {
  
  const refreshDataTable = useRef<() => void>(null);

  return (
    <>
      <HeaderPage
        title="Mantenimiento de Conceptos"
        descripcion="Listado de todos los conceptos"
        linkConfig={{
          title: "Nuevo mantenimiento",
          url: "/mantenimiento/nuevo",
        }}
      />

      <DataTable
        columns={getColumns(() => refreshDataTable.current?.())}
        columnNames={columnNames}
        url="mantenimiento/busquedapaginado"
        typeFilter={columnFilter}
        stateFilter={stateFilter}
        onRefresh={(callback) => {
          refreshDataTable.current = callback;
        }}
      />
    </>
  );
}
