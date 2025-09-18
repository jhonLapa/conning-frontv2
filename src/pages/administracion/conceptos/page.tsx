import { DataTable } from "@/components/datatable";
import HeaderPage from "@/components/header-page";
import { useRef } from "react";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";

export default function ConceptoPage() {
  
  const refreshDataTable = useRef<() => void>(null);

  return (
    <>
      <HeaderPage
        title="Concepto"
        descripcion="Listado de todos los concepto."
        linkConfig={{
          title: "Nuevo Concepto",
          url: "/concepto/nuevo",
        }}
      />

      <DataTable
        columns={getColumns(() => refreshDataTable.current?.())}
        columnNames={columnNames}
        url="concepto/busquedapaginado"
        typeFilter={columnFilter}
        stateFilter={stateFilter}
        onRefresh={(callback) => {
          refreshDataTable.current = callback;
        }}
      />
    </>
  );
}
