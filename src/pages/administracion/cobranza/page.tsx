import { DataTable } from "@/components/datatable";
import HeaderPage from "@/components/header-page";
import { useRef } from "react";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";

export default function CobranzaPage() {
  const refreshDataTable = useRef<() => void>(null);

  return (
    <>
      <HeaderPage
        title="Gestión de Compras"
        descripcion="Listado de todas las compras y facturas registradas."
        linkConfig={{
          title: "Nueva Compra",
          url: "/cobranza/nuevo",
        }}
      />

      <DataTable
        columns={getColumns(() => refreshDataTable.current?.())}
        columnNames={columnNames}
        url="compra/busquedapaginado"
        typeFilter={columnFilter}
        stateFilter={stateFilter}
        onRefresh={(callback) => {
          refreshDataTable.current = callback;
        }}
      />
    </>
  );
}
