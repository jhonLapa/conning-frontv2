import { DataTable } from "@/components/datatable";
import HeaderPage from "@/components/header-page";
import { useRef } from "react";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns"; 

export default function TrabajadoresPage() {
  const refreshDataTable = useRef<() => void>(null);

  return (
    <>
      <HeaderPage
        title="Trabajadores"
        descripcion="Listado y gestión de los trabajadores de la empresa."
        linkConfig={{
          title: "Nuevo Trabajador",
          url: "/trabajador/nuevo", 
        }}
      />

      <DataTable
        columns={getColumns(() => refreshDataTable.current?.())}
        columnNames={columnNames}
        url="trabajador/busquedapaginado" 
        typeFilter={columnFilter}
        stateFilter={stateFilter}
        onRefresh={(callback) => {
          refreshDataTable.current = callback;
        }}
      />
    </>
  );
}