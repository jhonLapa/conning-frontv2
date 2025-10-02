import { DataTable } from "@/components/datatable";
import HeaderPage from "@/components/header-page";
import { useRef } from "react";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";

export default function BanksPage() {
  const refreshDataTable = useRef<() => void>(null);

  return (
    <>
      <HeaderPage
        title="Banco"
        descripcion="Listado de todos los bancos."
        linkConfig={{
          title: "Nuevo Banco",
          url: "/banco/nuevo",
        }}
      />

      <DataTable
        columns={getColumns(() => refreshDataTable.current?.())}
        columnNames={columnNames}
        url="banco/busquedapaginado"
        typeFilter={columnFilter}
        stateFilter={stateFilter}
        onRefresh={(callback) => {
          refreshDataTable.current = callback;
        }}
      />
    </>
  );
}
