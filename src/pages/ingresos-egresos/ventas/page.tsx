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
  const [fechaIni, setFechaIni] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [errorFecha, setErrorFecha] = useState("");

  // ============================================================
  // 🔹 Validación de fechas (reutilizable)
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
  // 🔹 Aplicar filtro (usa validación)
  // ============================================================
  const handleApplyFilter = () => {
    const { ok, message } = validarRangoFechas(fechaIni, fechaFin);
    if (!ok) {
      setErrorFecha(message);
      //alert(message);
      return;
    }
    setErrorFecha("");
    refreshDataTable.current?.();
  };

  // ============================================================
  // 🔹 Descargar Excel con el filtro actual (usa validación)
  // ============================================================
  const handleDownload = async () => {
    const { ok, message } = validarRangoFechas(fechaIni, fechaFin);
    if (!ok) {
      setErrorFecha(message);
      alert(message);
      return;
    }
    setErrorFecha("");

    try {
      const params = new URLSearchParams();

      if (searchValue.trim()) {
        params.append("filters", `${searchField}:${searchValue}`);
      }

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

      <br />

      {/* 🔹 Filtros arriba de la tabla */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Filtrar por{" "}
              <span className="font-semibold text-gray-800">
                Fecha de emisión
              </span>
            </label>

            <div className="flex gap-2 flex-wrap items-center">
              <input
                type="date"
                value={fechaIni}
                onChange={(e) => {
                  setFechaIni(e.target.value);
                  if (errorFecha) setErrorFecha("");
                }}
                max={fechaFin || undefined}
                className="border rounded px-2 py-1"
              />
              <span className="text-gray-500">hasta</span>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => {
                  setFechaFin(e.target.value);
                  if (errorFecha) setErrorFecha("");
                }}
                min={fechaIni || undefined}
                className="border rounded px-2 py-1"
              />
              <Button
                onClick={handleApplyFilter}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!!errorFecha}
              >
                Aplicar filtro
              </Button>
            </div>
          </div>

          <Button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Descargar Excel
          </Button>
        </div>

        {/* Mensaje de validación visible */}
        {errorFecha && (
          <p className="text-red-600 text-sm font-medium">{errorFecha}</p>
        )}
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
