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

  const [searchValue, setSearchValue] = useState("");
  const [searchField, setSearchField] = useState("numerocomprobante");

  // 🔹 NUEVO: Filtros de fecha
  const [fechaIni, setFechaIni] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // ============================================================
  // 🔹 DESCARGAR EXCEL con el filtro actual
  // ============================================================
  const handleDownload = async () => {
    try {
      const params = new URLSearchParams();

      if (searchValue.trim()) {
        params.append("filters", `${searchField}:${searchValue}`);
      }

      // Enviar las fechas si existen
      if (fechaIni) params.append("fechaIni", fechaIni);
      if (fechaFin) params.append("fechaFin", fechaFin);

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

  return (
    <>
      <HeaderPage
        title="Ventas"
        descripcion="Listado de todas las ventas."
        linkConfig={{ title: "Nueva venta", url: "/venta/nuevo" }}
      />

      {/* 🔹 Filtros arriba de la tabla */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex gap-2">
          <input
            type="date"
            value={fechaIni}
            onChange={(e) => setFechaIni(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <Button
            onClick={() => refreshDataTable.current?.()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Aplicar filtro
          </Button>
        </div>

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
url={`venta/busquedapaginado${
  fechaIni || fechaFin
    ? `?fechaIni=${fechaIni}&fechaFin=${fechaFin}`
    : ""
}`}
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
