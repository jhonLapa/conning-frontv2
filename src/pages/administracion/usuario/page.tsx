import { DataTable } from "@/components/datatable";
import HeaderPage from "@/components/header-page";
import { useRef } from "react";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";

export default function UsuarioPage() {
  
  const refreshDataTable = useRef<() => void>(null);

  return (
    <>
      <HeaderPage
        title="Usuarios"
        descripcion="Listado de todas las usuarios."
        linkConfig={{
          title: "Nuevo Usuario",
          url: "/usuario/nuevo",
        }}
      />

      <DataTable
        columns={getColumns(() => refreshDataTable.current?.())}
        columnNames={columnNames}
        url="usuario/busquedapaginado"
        typeFilter={columnFilter}
        stateFilter={stateFilter}
        onRefresh={(callback) => {
          refreshDataTable.current = callback;
        }}
      />
    </>
  );
}
