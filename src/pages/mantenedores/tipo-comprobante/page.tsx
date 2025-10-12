import { DataTable } from "@/components/datatable";
import HeaderPage from "@/components/header-page";
import { useRef } from "react";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";

export default function ComprobantePage() {
  const refreshDataTable = useRef<() => void>(null);

  return (
    <>
      <HeaderPage
        title="Comprobantes"
        descripcion="Listado de todos los comprobantes."
        linkConfig={{
          title: "Nuevo Comprobante",
          url: "/tipocomprobante/nuevo",
        }}
      />

      <DataTable
        columns={getColumns(() => refreshDataTable.current?.())}
        columnNames={columnNames}
        url="tipocomprobante/busquedapaginado"
        typeFilter={columnFilter}
        stateFilter={stateFilter}
        onRefresh={(callback) => {
          refreshDataTable.current = callback;
        }}
      />
    </>
  );
}
