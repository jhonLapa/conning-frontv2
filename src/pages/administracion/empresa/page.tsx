import { DataTable } from "@/components/datatable";
import { useRef } from "react";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";

export default function EmpresaPage() {
  
  const refreshDataTable = useRef<() => void>(null);

  return (
    <>

      <DataTable
        columns={getColumns(() => refreshDataTable.current?.())}
        columnNames={columnNames}
        url="empresa/busquedapaginado"
        typeFilter={columnFilter}
        stateFilter={stateFilter}
        onRefresh={(callback) => {
          refreshDataTable.current = callback;
        }}
      />
    </>
  );
}
