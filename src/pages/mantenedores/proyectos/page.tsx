import { DataTable } from "@/components/datatable";
import HeaderPage from "@/components/header-page";
import { useRef } from "react";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns"; 
export default function ProyectosPage() {
  const refreshDataTable = useRef<(() => void) | null>(null);

  return (
    <>
      <HeaderPage
        title="Proyectos" 
        descripcion="Listado de todos los proyectos." 
        linkConfig={{
          title: "Nuevo Proyecto", 
          url: "/proyecto/nuevo", 
        }}
      />

      <DataTable
        columns={getColumns(() => refreshDataTable.current?.())}
        columnNames={columnNames}
        url="proyecto/busquedapaginado" 
        typeFilter={columnFilter}
        stateFilter={stateFilter}
        onRefresh={(callback) => {
          refreshDataTable.current = callback;
        }}
      />
    </>
  );
}