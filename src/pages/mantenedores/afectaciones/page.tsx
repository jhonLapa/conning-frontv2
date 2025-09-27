import { DataTable } from "@/components/datatable";
import HeaderPage from "@/components/header-page";
import { useRef } from "react";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";

export default function AfectacionesPage() {
  
  const refreshDataTable = useRef<() => void>(null);

  return (
    <>
      <HeaderPage
        title="Afectaciones"
        descripcion="Listado de todas las afectaciones."
        linkConfig={{
          title: "Nueva Afectacion",
          url: "/afectacion/nuevo",
        }}
      />

      <DataTable
        columns={getColumns(() => refreshDataTable.current?.())}
        columnNames={columnNames}
        url="afectacion/busquedapaginado"
        typeFilter={columnFilter}
        stateFilter={stateFilter}
        onRefresh={(callback) => {
          refreshDataTable.current = callback;
        }}
      />
    </>
  );
}
