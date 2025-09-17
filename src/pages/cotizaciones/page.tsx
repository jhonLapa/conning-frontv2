import { DataTable } from "@/components/datatable";
import HeaderPage from "@/components/header-page";
import { useRef } from "react";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";
import { Button } from "@/components/ui/button";
import { FileTextIcon } from "lucide-react";

export default function CotizacionesPage() {
  
  const refreshDataTable = useRef<() => void>(null);

  return (
    <>
      <HeaderPage
        title="Cotizaciones"
        descripcion="Listado de todos los Cotizaciones."
        linkConfig={{
          title: "Nuevo Proveedor",
          url: "/cotizaciones/nuevo",
        }}
      >
        <Button className="bg-red-500 hover:bg-red-500/80 text-white rounded-md px-4 py-1.5 flex gap-2 items-center justify-center w-full lg:w-auto cursor-pointer">
          <FileTextIcon />
          Exportar PDF
        </Button>
      </HeaderPage>

      <DataTable
        columns={getColumns(() => refreshDataTable.current?.())}
        columnNames={columnNames}
        url="cotizaciones/busquedapaginado"
        typeFilter={columnFilter}
        stateFilter={stateFilter}
        onRefresh={(callback) => {
          refreshDataTable.current = callback;
        }}
      />
    </>
  );
}
