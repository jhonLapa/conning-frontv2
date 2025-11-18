import { useState, useRef } from "react";
import { DataTable } from "@/components/datatable";
import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import api from "@/lib/api";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";

export default function PlanillaPage() {
  const refreshDataTable = useRef<() => void>(null);

  // ============================================================
  // 🔹 Estados
  // ============================================================
  const [searchValue, setSearchValue] = useState("");
  const [searchField, setSearchField] = useState("numerocomprobante");
  const [fechaIni, setFechaIni] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [errorFecha, setErrorFecha] = useState("");

  // ============================================================
  // 🔹 Validación de rango de fechas
  // ============================================================
  const validarRangoFechas = (ini?: string, fin?: string) => {
    if ((ini && !fin) || (!ini && fin)) {
      return {
        ok: false,
        message: "Debes seleccionar ambas fechas (inicio y fin).",
      };
    }
    if (ini && fin && ini > fin) {
      return {
        ok: false,
        message: "La fecha inicial no puede ser mayor que la fecha final.",
      };
    }
    return { ok: true, message: "" };
  };

  // ============================================================
  // 🔹 Aplicar filtro
  // ============================================================
  const handleApplyFilter = () => {
    const { ok, message } = validarRangoFechas(fechaIni, fechaFin);
    if (!ok) {
      setErrorFecha(message);
      return;
    }
    setErrorFecha("");
    refreshDataTable.current?.();
  };

  // ============================================================
  // 🔹 Descargar Excel
  // ============================================================
  const handleDownload = async () => {
    const { ok, message } = validarRangoFechas(fechaIni, fechaFin);
    if (!ok) {
      setErrorFecha(message);
      alert(message);
      return;
    }

    try {
      const params = new URLSearchParams();

      if (searchValue.trim())
        params.append("filters", `${searchField}:${searchValue}`);
      if (fechaIni) params.append("fechaIni", fechaIni);
      if (fechaFin) params.append("fechaFin", fechaFin);

      const response = await api.get(
        `/planilla/descargar?${params.toString()}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "planillas.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar planillas:", error);
      alert("Ocurrió un error al descargar el archivo.");
    }
  };

  // ============================================================
  // 🔹 Render
  // ============================================================
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
      <br />
      {/* 🔹 Filtros y acciones responsive */}
      <div className="flex flex-col w-full mb-4 gap-3">
        {/* 🔸 Etiqueta del filtro */}
        <label className="text-sm font-medium text-gray-700">
          Filtrar por{" "}
          <span className="font-semibold text-gray-800">Fecha de Pago</span>
        </label>

        <div className="flex flex-col lg:flex-row w-full gap-3 justify-between items-start lg:items-center">
          {/* 🔸 Filtros de fecha + botón aplicar */}
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <input
              type="date"
              value={fechaIni}
              onChange={(e) => {
                setFechaIni(e.target.value);
                if (errorFecha) setErrorFecha("");
              }}
              max={fechaFin || undefined}
              className="border rounded px-2 py-1 w-full sm:w-auto flex-1 min-w-[140px]"
            />
            <span className="text-gray-500 flex items-center justify-center">
              hasta
            </span>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => {
                setFechaFin(e.target.value);
                if (errorFecha) setErrorFecha("");
              }}
              min={fechaIni || undefined}
              className="border rounded px-2 py-1 w-full sm:w-auto flex-1 min-w-[140px]"
            />
            <Button
              onClick={handleApplyFilter}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              disabled={!!errorFecha}
            >
              Aplicar filtro
            </Button>
          </div>

          {/* 🔸 Botón Excel */}
          <div className="flex w-full lg:w-auto justify-end">
            <Button
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Descargar Excel
            </Button>
          </div>
        </div>

        {/* 🔸 Mensaje de validación */}
        {errorFecha && (
          <p className="text-red-600 text-sm font-medium">{errorFecha}</p>
        )}
      </div>
      {/* 🔹 Tabla principal */}
      <DataTable
        columns={getColumns(() => refreshDataTable.current?.())}
        columnNames={columnNames}
        url={`planilla/busquedapaginado${
          fechaIni || fechaFin
            ? `?fechaIni=${fechaIni}&fechaFin=${fechaFin}`
            : ""
        }`}
        typeFilter={columnFilter}
        stateFilter={stateFilter}
        onRefresh={(callback) => (refreshDataTable.current = callback)}
        onSearchChange={(value, field) => {
          setSearchValue(value);
          setSearchField(field);
        }}
      />
    </>
  );
}
