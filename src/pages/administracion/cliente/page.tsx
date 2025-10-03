import { DataTable } from "@/components/datatable";
import HeaderPage from "@/components/header-page";
import { useRef } from "react";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";

export default function ClientePage() {
  const refreshDataTable = useRef<() => void>(null);

  return (
    <>
      <HeaderPage
        title="Cliente"
        descripcion="Listado de todos los clientes."
        linkConfig={{
          title: "Nuevo Cliente",
          url: "/cliente/nuevo",
        }}
      />

      <DataTable
        columns={getColumns(() => refreshDataTable.current?.())}
        columnNames={columnNames}
        url="cliente/busquedapaginado"
        typeFilter={columnFilter}
        stateFilter={stateFilter}
        onRefresh={(callback) => {
          refreshDataTable.current = callback;
        }}
      />
    </>
  );
}
