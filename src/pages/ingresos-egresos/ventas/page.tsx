import { useState, useRef } from "react";
import { DataTable } from "@/components/datatable";
import HeaderPage from "@/components/header-page";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import api from "@/lib/api";

export default function VentasPage() {
  const refreshDataTable = useRef<() => void>(null);

  // 🔹 Guarda lo que el usuario escribe en el buscador
  const [searchValue, setSearchValue] = useState("");
  const [searchField, setSearchField] = useState("numerocomprobante");

  // ============================================================
  // 🔹 DESCARGAR EXCEL con el filtro actual
  // ============================================================
  const handleDownload = async () => {
    try {
      const params = new URLSearchParams();

      // Si el usuario escribió algo, se manda como filtro
      if (searchValue.trim()) {
        params.append("filters", `${searchField}:${searchValue}`);
      }

      const response = await api.get(`/venta/descargar?${params.toString()}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ventas.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar ventas:", error);
    }
  };

  // ============================================================
  // 🔹 RENDER PRINCIPAL
  // ============================================================
  return (
    <>
      <HeaderPage
        title="Ventas"
        descripcion="Listado de todas las ventas."
        linkConfig={{
          title: "Nueva venta",
          url: "/venta/nuevo",
        }}
      />

      {/* 🔹 Botón Descargar Excel */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Descargar Excel
        </Button>
      </div>

      {/* 🔹 Tabla principal */}
      <DataTable
        columns={getColumns(() => refreshDataTable.current?.())}
        columnNames={columnNames}
        url="venta/busquedapaginado"
        typeFilter={columnFilter}
        stateFilter={stateFilter}
        onRefresh={(callback) => {
          refreshDataTable.current = callback;
        }}
        onSearchChange={(value, field) => {
          setSearchValue(value);
          setSearchField(field);
        }}
      />
    </>
  );
}
