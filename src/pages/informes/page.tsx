import { DataTable } from "@/components/datatable";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";
import { useNavigate } from "react-router-dom";

export default function InformesPage() {
  const refreshDataTable = useRef<() => void>(null);
  const navigate = useNavigate();

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [url, setUrl] = useState("trabajador/BusquedaPaginadoConPlanilla");

  const handleFiltrar = () => {
    const params = new URLSearchParams();
    if (fechaInicio) params.append("fechaInicio", fechaInicio);
    if (fechaFin) params.append("fechaFin", fechaFin);

    const urlFinal = `trabajador/BusquedaPaginadoConPlanilla?${params.toString()}`;
    setUrl(urlFinal);

    // ✅ Actualiza la URL visible en el navegador
    navigate(`/informes?${params.toString()}`);

    // ✅ Refresca la tabla
    refreshDataTable.current?.();
  };

  return (
    <>
      {/* 🔹 Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end justify-between mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div>
            <label className="block text-sm text-gray-700">Fecha inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              max={fechaFin || undefined}
              className="border rounded px-2 py-1 w-full sm:w-auto"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Fecha fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              min={fechaInicio || undefined}
              className="border rounded px-2 py-1 w-full sm:w-auto"
            />
          </div>
        </div>
        <Button onClick={handleFiltrar}>Aplicar filtro</Button>
      </div>

      {/* 🔹 Tabla */}
      <DataTable
        columns={getColumns(() => refreshDataTable.current?.())}
        columnNames={columnNames}
        url={url}
        typeFilter={columnFilter}
        stateFilter={stateFilter}
        onRefresh={(callback) => {
          refreshDataTable.current = callback;
        }}
      />
    </>
  );
}
