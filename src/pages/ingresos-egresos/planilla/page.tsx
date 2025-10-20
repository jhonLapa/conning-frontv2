import { DataTable } from "@/components/datatable";
import HeaderPage from "@/components/header-page";
import { useRef } from "react";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";

export default function PlanillaPage() {
  const refreshDataTable = useRef<() => void>(null);

  return (
    <>
      <HeaderPage
        title="Planillas"
        descripcion="Listado de todas las planillas."
        linkConfig={{
          title: "Nueva planilla",
          url: "/planilla/nuevo",
        }}
      />

      <DataTable
        columns={getColumns()}
        columnNames={columnNames}
        url="planilla/busquedapaginado"
        typeFilter={columnFilter}
        stateFilter={stateFilter}
        onRefresh={(callback) => {
          refreshDataTable.current = callback;
        }}
      />
    </>
  );
}
