import { DataTable } from "@/components/datatable";
import HeaderPage from "@/components/header-page";
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
      <HeaderPage
        title="Empresas"
        descripcion="Listado de todas las empresa."
        linkConfig={{
          title: "Nueva empresa",
          url: "/empresa/nuevo",
        }}
      />

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
